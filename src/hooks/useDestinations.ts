import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Attraction {
  name: string;
  description: string;
  category: string;
  duration: string;
}

export interface Activity {
  name: string;
  description: string;
  difficulty: string;
  price_range: string;
}

export interface BestArea {
  name: string;
  description: string;
  vibe: string;
}

export interface TravelGuide {
  visa_info?: string;
  getting_around?: string;
  best_areas?: BestArea[];
  packing_essentials?: string[];
  health_safety?: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  avgCost: number;
  tags: string[];
  summary: string;
  bestTime: string;
  highlights?: string[];
  climate?: string;
  currency?: string;
  language?: string;
  timezone?: string;
  gallery?: string[];
  attractions?: Attraction[];
  activities?: Activity[];
  localTips?: string[];
  travelGuide?: TravelGuide;
}

// Transform database row to Destination interface
const transformDestination = (row: any): Destination => ({
  id: row.id,
  name: row.name,
  country: row.country,
  image: row.images?.[0] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
  rating: parseFloat(row.rating) || 0,
  avgCost: parseFloat(row.avg_cost) || 0,
  tags: row.tags || [],
  summary: row.summary || "",
  bestTime: row.best_time || "",
  highlights: row.highlights || [],
  climate: row.climate,
  currency: row.currency,
  language: row.language,
  timezone: row.timezone,
  gallery: row.gallery?.length > 0 ? row.gallery : row.images || [],
  attractions: row.attractions || [],
  activities: row.activities || [],
  localTips: row.local_tips || [],
  travelGuide: row.travel_guide || {},
});

export const useDestinations = (query?: string) => {
  return useQuery({
    queryKey: ["destinations", query],
    queryFn: async () => {
      let queryBuilder = supabase.from("destinations").select("*");
      
      if (query) {
        queryBuilder = queryBuilder.or(
          `name.ilike.%${query}%,country.ilike.%${query}%`
        );
      }
      
      const { data, error } = await queryBuilder.order("rating", { ascending: false });
      
      if (error) throw error;
      return (data || []).map(transformDestination);
    },
  });
};

export const useDestination = (id: string) => {
  return useQuery({
    queryKey: ["destination", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data ? transformDestination(data) : null;
    },
    enabled: !!id,
  });
};

export const useFeaturedDestinations = () => {
  return useQuery({
    queryKey: ["featured-destinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .order("rating", { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return (data || []).map(transformDestination);
    },
  });
};

export const useTrendingDestinations = () => {
  return useQuery({
    queryKey: ["trending-destinations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .order("rating", { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return (data || []).map(transformDestination);
    },
  });
};
