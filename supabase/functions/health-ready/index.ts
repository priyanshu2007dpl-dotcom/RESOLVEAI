// ResolveAI — Readiness probe (GET /api/health/ready)
// Confirms the service is ready to accept traffic (DB reachable)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
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

    return new Response(
      JSON.stringify({
        status: dbOk ? "ok" : "not_ready",
        service: "resolveai-api",
        check: "ready",
        timestamp: new Date().toISOString(),
        checks: { database: dbOk },
      }),
      {
        status: dbOk ? 200 : 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: "not_ready",
        service: "resolveai-api",
        check: "ready",
        timestamp: new Date().toISOString(),
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
