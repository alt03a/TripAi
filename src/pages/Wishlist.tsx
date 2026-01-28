import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { useWishlistDestinations } from "@/hooks/useWishlist";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Heart, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Wishlist() {
  const navigate = useNavigate();
  const { data: wishlistItems, isLoading } = useWishlistDestinations();

  const transformDestination = (dest: any) => ({
    id: dest.id,
    name: dest.name,
    country: dest.country,
    image: dest.images?.[0] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
    rating: parseFloat(dest.rating) || 0,
    avgCost: parseFloat(dest.avg_cost) || 0,
    tags: dest.tags || [],
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-secondary fill-secondary" />
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              My Wishlist
            </h1>
            <p className="text-muted-foreground">
              Your saved destinations for future adventures
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : wishlistItems && wishlistItems.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {wishlistItems.length} saved destination{wishlistItems.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item: any) => (
                <DestinationCard
                  key={item.id}
                  {...transformDestination(item.destinations)}
                  onClick={() => navigate(`/destinations/${item.destinations.id}`)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 space-y-4">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <h2 className="text-xl font-heading font-semibold text-foreground">
              No saved destinations yet
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start exploring and save destinations you'd love to visit. Click the heart icon on any destination to add it to your wishlist.
            </p>
            <Button onClick={() => navigate("/explore")} className="mt-4">
              <Compass className="h-4 w-4 mr-2" />
              Explore Destinations
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
