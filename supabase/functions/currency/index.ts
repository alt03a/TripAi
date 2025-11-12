import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { from, to, amount } = await req.url.includes("?")
      ? Object.fromEntries(new URL(req.url).searchParams)
      : await req.json();

    if (!from || !to) {
      return new Response(
        JSON.stringify({ error: "Source and target currencies are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const EXCHANGERATE_API_KEY = Deno.env.get("EXCHANGERATE_API_KEY");

    if (!EXCHANGERATE_API_KEY) {
      console.error("[Currency] API key not configured");
      // Return mock data as fallback
      return new Response(
        JSON.stringify({
          from: from.toUpperCase(),
          to: to.toUpperCase(),
          rate: 1.0,
          amount: amount ? parseFloat(amount) : 1,
          converted: amount ? parseFloat(amount) : 1,
          timestamp: new Date().toISOString(),
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[Currency] Converting ${from} to ${to}`);

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}/pair/${from.toUpperCase()}/${to.toUpperCase()}${amount ? `/${amount}` : ""}`
    );

    if (!response.ok) {
      console.error(`[Currency] API error: ${response.status}`);
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();

    if (data.result !== "success") {
      throw new Error(data["error-type"] || "Exchange rate conversion failed");
    }

    const result = {
      from: data.base_code,
      to: data.target_code,
      rate: data.conversion_rate,
      amount: amount ? parseFloat(amount) : 1,
      converted: data.conversion_result || (amount ? parseFloat(amount) * data.conversion_rate : data.conversion_rate),
      timestamp: new Date().toISOString(),
    };

    console.log(`[Currency] Successfully converted ${result.from} to ${result.to}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Currency] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
