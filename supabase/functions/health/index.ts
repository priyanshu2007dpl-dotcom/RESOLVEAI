// ResolveAI — Health endpoint (GET /api/health)
// Full health check: verifies database connectivity

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const VERSION = "0.1.0";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    let dbOk = false;
    try {
      const resp = await fetch(`${supabaseUrl}/rest/v1/profiles?select=count&limit=1`, {
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": "application/json",
        },
      });
      dbOk = resp.ok;
    } catch {
      dbOk = false;
    }

    const status = dbOk ? "ok" : "degraded";

    return new Response(
      JSON.stringify({
        status,
        service: "resolveai-api",
        timestamp: new Date().toISOString(),
        version: VERSION,
        checks: {
          database: dbOk,
        },
      }),
      {
        status: dbOk ? 200 : 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: "down",
        service: "resolveai-api",
        timestamp: new Date().toISOString(),
        version: VERSION,
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
