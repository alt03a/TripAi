import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SearchBar } from "@/components/explore/SearchBar";
import { FilterBar } from "@/components/explore/FilterBar";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { DestinationCarousel } from "@/components/destinations/DestinationCarousel";
import { useDestinations, useTrendingDestinations } from "@/hooks/useDestinations";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export default function Explore() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [budget, setBudget] = useState<number[]>([100]);
  const [season, setSeason] = useState("");
  const [mood, setMood] = useState("");

  const { data: destinations, isLoading } = useDestinations(searchQuery);
  const { data: trendingDestinations, isLoading: loadingTrending } = useTrendingDestinations();

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const filteredDestinations = destinations?.filter((dest) => {
    const matchesBudget = dest.avgCost <= budget[0];
    const matchesActivities =
      selectedActivities.length === 0 ||
      selectedActivities.some((activity) => dest.tags.includes(activity));
    return matchesBudget && matchesActivities;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Explore Destinations
          </h1>
          <p className="text-muted-foreground">
            Discover your next adventure with AI-powered recommendations
          </p>
        </div>

        <SearchBar onSearch={setSearchQuery} />

        {!searchQuery && !loadingTrending && trendingDestinations && (
          <DestinationCarousel title="Trending Now" destinations={trendingDestinations} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterBar
              onBudgetChange={setBudget}
              onSeasonChange={setSeason}
              onMoodChange={setMood}
              selectedActivities={selectedActivities}
              onActivityToggle={handleActivityToggle}
            />
          </div>

          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {searchQuery ? `Results for "${searchQuery}"` : "All Destinations"}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredDestinations?.length || 0} destinations
              </span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-80" />
                ))}
              </div>
            ) : filteredDestinations && filteredDestinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    {...destination}
                    onClick={() => navigate(`/destinations/${destination.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No destinations found. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
