import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client with user's token to get their ID
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid user" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role to check admin status (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { pathname } = new URL(req.url);
    const action = pathname.split("/").pop();

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    const isAdmin = !!roleData && !roleError;

    // Handle different actions
    if (req.method === "GET") {
      // Check role endpoint
      if (action === "check-role") {
        const { data: userRole } = await supabaseAdmin
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        return new Response(
          JSON.stringify({ role: userRole?.role || "user", isAdmin }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get all users (admin only)
      if (action === "users") {
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: profiles, error } = await supabaseAdmin
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Get roles for each user
        const { data: roles } = await supabaseAdmin.from("user_roles").select("*");

        const usersWithRoles = profiles?.map((profile) => ({
          ...profile,
          role: roles?.find((r) => r.user_id === profile.user_id)?.role || "user",
        }));

        return new Response(
          JSON.stringify({ users: usersWithRoles }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get all destinations (admin only)
      if (action === "destinations") {
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data: destinations, error } = await supabaseAdmin
          .from("destinations")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        return new Response(
          JSON.stringify({ destinations }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get dashboard stats (admin only)
      if (action === "stats") {
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const [
          { count: usersCount },
          { count: tripsCount },
          { count: destinationsCount },
        ] = await Promise.all([
          supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
          supabaseAdmin.from("trips").select("*", { count: "exact", head: true }),
          supabaseAdmin.from("destinations").select("*", { count: "exact", head: true }),
        ]);

        return new Response(
          JSON.stringify({
            stats: {
              users: usersCount || 0,
              trips: tripsCount || 0,
              destinations: destinationsCount || 0,
            },
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (req.method === "POST") {
      const body = await req.json();

      // Add destination (admin only)
      if (action === "destinations") {
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data, error } = await supabaseAdmin
          .from("destinations")
          .insert(body)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ destination: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Assign role (admin only)
      if (action === "assign-role") {
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { userId, role } = body;

        // Delete existing role
        await supabaseAdmin.from("user_roles").delete().eq("user_id", userId);

        // Insert new role if not 'user' (default)
        if (role !== "user") {
          const { error } = await supabaseAdmin
            .from("user_roles")
            .insert({ user_id: userId, role });

          if (error) throw error;
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (req.method === "PUT") {
      const body = await req.json();

      // Update destination (admin only)
      if (action === "destinations") {
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { id, ...updateData } = body;

        const { data, error } = await supabaseAdmin
          .from("destinations")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ destination: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (req.method === "DELETE") {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      // Delete destination (admin only)
      if (action === "destinations") {
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error } = await supabaseAdmin
          .from("destinations")
          .delete()
          .eq("id", id);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Delete user trip (admin only)
      if (action === "trips") {
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error } = await supabaseAdmin
          .from("trips")
          .delete()
          .eq("id", id);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Admin function error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});