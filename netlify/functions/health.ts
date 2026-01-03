// ===========================================
// Netlify Function: Health Check
// ===========================================
// Endpoint: /.netlify/functions/health
// ===========================================

import type { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  // Basic health check
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.CONTEXT || "unknown",
    region: process.env.AWS_REGION || "unknown",
    supabase: {
      configured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY),
    },
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(health),
  };
};

export { handler };
