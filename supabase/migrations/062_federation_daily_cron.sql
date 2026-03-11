-- ============================================================================
-- Migration 062: Daily Federation Sync Cron Job
-- ============================================================================
-- Uses pg_cron + pg_net to trigger the federation-sync edge function
-- once per source per day. Sources are synced individually (batch_size=1)
-- to avoid edge function timeouts.
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Enable required extensions
-- --------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- --------------------------------------------------------------------------
-- 2. Create the sync trigger function
--    Loops through all active sources and fires a net.http_post for each.
--    Uses staggered scheduling (1 source every 30 seconds) to avoid
--    overwhelming the edge function and USAJobs rate limits.
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_federation_sync()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_source_count INTEGER;
  v_offset INTEGER := 0;
  v_function_url TEXT;
  v_service_key TEXT;
BEGIN
  -- Get the project URL and service role key
  v_function_url := 'https://' || current_setting('supabase.project_ref', true) || '.supabase.co/functions/v1/federation-sync';
  v_service_key := current_setting('supabase.service_role_key', true);

  -- Fallback: if settings are not available, try vault
  IF v_service_key IS NULL THEN
    SELECT decrypted_secret INTO v_service_key
    FROM vault.decrypted_secrets
    WHERE name = 'service_role_key'
    LIMIT 1;
  END IF;

  IF v_service_key IS NULL THEN
    RAISE WARNING 'Federation sync: service_role_key not found. Skipping.';
    RETURN;
  END IF;

  -- Count active sources
  SELECT count(*) INTO v_source_count
  FROM federated_sources
  WHERE status = 'active';

  IF v_source_count = 0 THEN
    RAISE NOTICE 'Federation sync: no active sources found.';
    RETURN;
  END IF;

  RAISE NOTICE 'Federation sync: triggering sync for % active sources', v_source_count;

  -- Fire one request per source (batch_size=1) with 30s delay between each
  -- to avoid USAJobs rate limits (25 req/min) and edge function overload
  WHILE v_offset < v_source_count LOOP
    PERFORM net.http_post(
      url := v_function_url,
      body := jsonb_build_object(
        'action', 'sync_all',
        'batch_size', 1,
        'offset', v_offset
      ),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_service_key
      )
    );
    v_offset := v_offset + 1;
    -- Stagger requests: wait 30 seconds between each source
    IF v_offset < v_source_count THEN
      PERFORM pg_sleep(30);
    END IF;
  END LOOP;

  RAISE NOTICE 'Federation sync: fired % requests', v_offset;
END;
$$;

COMMENT ON FUNCTION trigger_federation_sync IS
  'Triggers the federation-sync edge function for all active sources. Called daily by pg_cron.';

-- --------------------------------------------------------------------------
-- 3. Schedule the cron job — daily at 6:00 AM UTC
-- --------------------------------------------------------------------------
SELECT cron.schedule(
  'federation-daily-sync',
  '0 6 * * *',
  'SELECT trigger_federation_sync();'
);

-- --------------------------------------------------------------------------
-- 4. Optional: Add a weekly full re-sync on Sundays at 2:00 AM UTC
--    This re-syncs all sources regardless of last_sync_at, catching any
--    that may have failed during daily runs.
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_federation_full_resync()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Reset all sync timestamps to force a full re-sync
  UPDATE federated_sources
  SET last_sync_at = NULL
  WHERE status = 'active';

  -- Then trigger the normal sync
  PERFORM trigger_federation_sync();
END;
$$;

SELECT cron.schedule(
  'federation-weekly-resync',
  '0 2 * * 0',
  'SELECT trigger_federation_full_resync();'
);
