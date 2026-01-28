import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";

export interface WishlistItem {
  id: string;
  user_id: string;
  destination_id: string;
  created_at: string;
}

export const useWishlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("wishlists")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data as WishlistItem[];
    },
    enabled: !!user,
  });

  const addToWishlist = useMutation({
    mutationFn: async (destinationId: string) => {
      if (!user) throw new Error("Must be logged in");
      
      const { error } = await supabase
        .from("wishlists")
        .insert({ user_id: user.id, destination_id: destinationId });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({
        title: "Added to wishlist",
        description: "Destination saved to your wishlist",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add to wishlist",
        variant: "destructive",
      });
      console.error("Wishlist error:", error);
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: async (destinationId: string) => {
      if (!user) throw new Error("Must be logged in");
      
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("destination_id", destinationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({
        title: "Removed from wishlist",
        description: "Destination removed from your wishlist",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove from wishlist",
        variant: "destructive",
      });
      console.error("Wishlist error:", error);
    },
  });

  const isInWishlist = (destinationId: string) => {
    return wishlist?.some((item) => item.destination_id === destinationId) ?? false;
  };

  const toggleWishlist = (destinationId: string) => {
    if (isInWishlist(destinationId)) {
      removeFromWishlist.mutate(destinationId);
    } else {
      addToWishlist.mutate(destinationId);
    }
  };

  return {
    wishlist,
    isLoading,
    isInWishlist,
    toggleWishlist,
    addToWishlist: addToWishlist.mutate,
    removeFromWishlist: removeFromWishlist.mutate,
  };
};

export const useWishlistDestinations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["wishlist-destinations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("wishlists")
        .select(`
          id,
          created_at,
          destinations (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};
