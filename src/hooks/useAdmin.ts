import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface AdminStats {
  users: number;
  trips: number;
  destinations: number;
}

interface UserWithRole {
  id: string;
  user_id: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  role: string;
}

interface Destination {
  id: string;
  name: string;
  country: string;
  summary: string | null;
  best_time: string | null;
  avg_cost: number | null;
  rating: number | null;
  tags: string[] | null;
  images: string[] | null;
  created_at: string;
}

export const useAdmin = () => {
  const { user, session } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<string>("user");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  const getAuthHeaders = useCallback(() => {
    if (!session?.access_token) return {};
    return {
      Authorization: `Bearer ${session.access_token}`,
    };
  }, [session]);

  const checkRole = useCallback(async () => {
    if (!user || !session) {
      setIsAdmin(false);
      setRole("user");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("admin/check-role", {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (error) throw error;

      setIsAdmin(data?.isAdmin || false);
      setRole(data?.role || "user");
    } catch (error) {
      console.error("Error checking role:", error);
      setIsAdmin(false);
      setRole("user");
    } finally {
      setLoading(false);
    }
  }, [user, session, getAuthHeaders]);

  useEffect(() => {
    checkRole();
  }, [checkRole]);

  const fetchStats = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase.functions.invoke("admin/stats", {
        headers: getAuthHeaders(),
      });

      if (error) throw error;
      setStats(data?.stats || null);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [isAdmin, getAuthHeaders]);

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase.functions.invoke("admin/users", {
        headers: getAuthHeaders(),
      });

      if (error) throw error;
      setUsers(data?.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [isAdmin, getAuthHeaders]);

  const fetchDestinations = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase.functions.invoke("admin/destinations", {
        headers: getAuthHeaders(),
      });

      if (error) throw error;
      setDestinations(data?.destinations || []);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  }, [isAdmin, getAuthHeaders]);

  const assignRole = useCallback(
    async (userId: string, newRole: string) => {
      try {
        const { error } = await supabase.functions.invoke("admin/assign-role", {
          headers: getAuthHeaders(),
          body: { userId, role: newRole },
        });

        if (error) throw error;
        await fetchUsers();
        return { error: null };
      } catch (error) {
        console.error("Error assigning role:", error);
        return { error };
      }
    },
    [getAuthHeaders, fetchUsers]
  );

  const addDestination = useCallback(
    async (destination: Partial<Destination>) => {
      try {
        const { data, error } = await supabase.functions.invoke("admin/destinations", {
          method: "POST",
          headers: getAuthHeaders(),
          body: destination,
        });

        if (error) throw error;
        await fetchDestinations();
        return { data: data?.destination, error: null };
      } catch (error) {
        console.error("Error adding destination:", error);
        return { data: null, error };
      }
    },
    [getAuthHeaders, fetchDestinations]
  );

  const updateDestination = useCallback(
    async (id: string, updates: Partial<Destination>) => {
      try {
        const { data, error } = await supabase.functions.invoke("admin/destinations", {
          method: "PUT",
          headers: getAuthHeaders(),
          body: { id, ...updates },
        });

        if (error) throw error;
        await fetchDestinations();
        return { data: data?.destination, error: null };
      } catch (error) {
        console.error("Error updating destination:", error);
        return { data: null, error };
      }
    },
    [getAuthHeaders, fetchDestinations]
  );

  const deleteDestination = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.functions.invoke(`admin/destinations?id=${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        if (error) throw error;
        await fetchDestinations();
        return { error: null };
      } catch (error) {
        console.error("Error deleting destination:", error);
        return { error };
      }
    },
    [getAuthHeaders, fetchDestinations]
  );

  return {
    isAdmin,
    role,
    loading,
    stats,
    users,
    destinations,
    fetchStats,
    fetchUsers,
    fetchDestinations,
    assignRole,
    addDestination,
    updateDestination,
    deleteDestination,
    checkRole,
  };
};