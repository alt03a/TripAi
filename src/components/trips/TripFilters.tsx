import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Filter } from "lucide-react";

interface TripFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const TripFilters = ({ activeFilter, onFilterChange }: TripFiltersProps) => {
  const filters = [
    { id: "all", label: "All Trips", icon: Filter },
    { id: "upcoming", label: "Upcoming", icon: Calendar },
    { id: "ongoing", label: "Ongoing", icon: MapPin },
    { id: "past", label: "Past", icon: Calendar },
    { id: "draft", label: "Drafts", icon: Filter },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => {
        const Icon = filter.icon;
        return (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
};
