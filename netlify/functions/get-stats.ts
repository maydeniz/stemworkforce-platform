// ===========================================
// Netlify Function: Get Platform Stats
// ===========================================
// Endpoint: /.netlify/functions/get-stats
// ===========================================

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Types
interface PlatformStats {
  jobs: number;
  events: number;
  training: number;
  employers: number;
  states: number;
  timestamp: string;
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // CORS headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers,
      body: "",
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (supabaseUrl && supabaseKey) {
      // Dynamic import to avoid build issues
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Fetch counts from database
      const [jobsResult, eventsResult, trainingResult, statesResult] = await Promise.all([
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "upcoming"),
        supabase.from("training_programs").select("*", { count: "exact", head: true }).eq("active", true),
        supabase.from("state_workforce_data").select("*", { count: "exact", head: true }),
      ]);

      const stats: PlatformStats = {
        jobs: jobsResult.count || 0,
        events: eventsResult.count || 0,
        training: trainingResult.count || 0,
        employers: 8500, // Placeholder - would need employers table
        states: statesResult.count || 0,
        timestamp: new Date().toISOString(),
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(stats),
      };
    }

    // Return mock data if Supabase not configured
    const mockStats: PlatformStats = {
      jobs: 1245000,
      events: 156,
      training: 850,
      employers: 8500,
      states: 18,
      timestamp: new Date().toISOString(),
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockStats),
    };
  } catch (error) {
    console.error("Error fetching stats:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to fetch platform stats",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };
