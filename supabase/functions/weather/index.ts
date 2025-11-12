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
    const { lat, lon, location } = await req.url.includes("?") 
      ? Object.fromEntries(new URL(req.url).searchParams)
      : await req.json();

    if (!lat || !lon) {
      return new Response(
        JSON.stringify({ error: "Latitude and longitude are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
    
    if (!OPENWEATHER_API_KEY) {
      console.error("[Weather] API key not configured");
      return new Response(
        JSON.stringify({ 
          error: "Weather service not configured",
          // Fallback mock data
          temp: 20,
          condition: "Partly Cloudy",
          humidity: 65,
          windSpeed: 10,
          location: location || "Unknown"
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[Weather] Fetching weather for ${lat},${lon}`);

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );

    if (!weatherResponse.ok) {
      console.error(`[Weather] API error: ${weatherResponse.status}`);
      throw new Error("Failed to fetch weather data");
    }

    const data = await weatherResponse.json();

    const weatherData = {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      location: data.name || location,
      icon: data.weather[0].icon,
      feelsLike: Math.round(data.main.feels_like),
    };

    console.log(`[Weather] Successfully fetched weather for ${weatherData.location}`);

    return new Response(JSON.stringify(weatherData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Weather] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
