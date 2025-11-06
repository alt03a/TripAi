import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TripCard } from "@/components/trips/TripCard";
import { TripFilters } from "@/components/trips/TripFilters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const mockTrips = [
  {
    id: "1",
    title: "Summer in Bali",
    destination: "Bali, Indonesia",
    startDate: "Jun 15",
    endDate: "Jun 25",
    status: "upcoming" as const,
    progress: 100,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Tokyo Adventure",
    destination: "Tokyo, Japan",
    startDate: "Mar 10",
    endDate: "Mar 20",
    status: "draft" as const,
    progress: 45,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "European Tour",
    destination: "Paris, France",
    startDate: "Jan 5",
    endDate: "Jan 15",
    status: "past" as const,
    progress: 100,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "New York City",
    destination: "New York, USA",
    startDate: "Apr 1",
    endDate: "Apr 7",
    status: "upcoming" as const,
    progress: 100,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop",
  },
];

export default function Trips() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: trips, isLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockTrips;
    },
  });

  const filteredTrips = trips?.filter((trip) => {
    if (activeFilter === "all") return true;
    return trip.status === activeFilter;
  });

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          My Trips
        </h1>
        <Button onClick={() => navigate("/plan-trip")} className="gap-2">
          <Plus className="h-4 w-4" />
          Plan New Trip
        </Button>
      </div>

      <div className="mb-6">
        <TripFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : filteredTrips && filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              {...trip}
              onClick={() => navigate(`/trips/${trip.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">
            No {activeFilter !== "all" ? activeFilter : ""} trips found
          </p>
          <Button onClick={() => navigate("/plan-trip")} className="gap-2">
            <Plus className="h-4 w-4" />
            Plan Your First Trip
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
}
