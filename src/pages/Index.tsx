import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GreetingSection } from "@/components/home/GreetingSection";
import { QuickActions } from "@/components/home/QuickActions";
import { WeatherWidget } from "@/components/home/WeatherWidget";
import { DestinationCarousel } from "@/components/destinations/DestinationCarousel";
import { TripCard } from "@/components/trips/TripCard";
import { useFeaturedDestinations } from "@/hooks/useDestinations";
import { useRecentTrips } from "@/hooks/useTrips";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const { data: featuredDestinations, isLoading: loadingDestinations } = useFeaturedDestinations();
  const { data: recentTrips, isLoading: loadingTrips } = useRecentTrips();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <GreetingSection />
        
        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            {loadingDestinations ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Skeleton className="h-64" />
                  <Skeleton className="h-64" />
                </div>
              </div>
            ) : featuredDestinations && featuredDestinations.length > 0 ? (
              <DestinationCarousel title="Featured Destinations" destinations={featuredDestinations} />
            ) : null}

            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-bold text-foreground">Recent Trips</h2>
              {loadingTrips ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Skeleton className="h-64" />
                  <Skeleton className="h-64" />
                </div>
              ) : recentTrips && recentTrips.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recentTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      {...trip}
                      onClick={() => navigate(`/trips/${trip.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No recent trips. Start planning your next adventure!</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <WeatherWidget />
            
            <div className="bg-card p-6 rounded-lg border border-border space-y-4">
              <h3 className="font-heading font-semibold text-foreground">Travel Inspiration</h3>
              <div className="space-y-3">
                <div className="aspect-video rounded-lg bg-muted overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop"
                    alt="Travel inspiration"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Discover hidden gems and popular destinations around the world
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
