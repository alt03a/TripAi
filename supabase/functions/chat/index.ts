import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("[Chat] No authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized - Please log in to use the chat feature" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.log("[Chat] Invalid user:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Invalid user - Please log in again" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create system prompt based on mode
    const systemPrompts = {
      planning: "You are TripTuner's AI travel planning assistant. Help users create detailed, personalized itineraries. Provide specific recommendations for activities, restaurants, and attractions. Always consider the user's budget, travel dates, and preferences. Keep responses clear, actionable, and enthusiastic about travel.",
      advice: "You are TripTuner's AI travel advisor. Provide helpful travel tips, advice on destinations, packing suggestions, local customs, and general travel guidance. Be practical, friendly, and share insider knowledge. Keep responses concise and useful.",
      local: "You are TripTuner's local guide AI. Provide information about local events, hidden gems, real-time recommendations, and cultural insights for destinations. Act as if you're a friendly local showing someone around. Keep responses conversational and engaging.",
    };

    const systemPrompt = systemPrompts[mode as keyof typeof systemPrompts] || systemPrompts.planning;

    console.log(`[Chat] User ${user.id} - Processing ${mode} mode request with ${messages.length} messages`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("[Chat] Rate limit exceeded for user:", user.id);
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), 
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        console.error("[Chat] Payment required");
        return new Response(
          JSON.stringify({ error: "AI service requires payment. Please contact support." }), 
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const errorText = await response.text();
      console.error(`[Chat] AI gateway error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }), 
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`[Chat] User ${user.id} - Successfully initiated stream`);
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("[Chat] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
