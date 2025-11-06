import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRecentTrips } from "@/hooks/useTrips";

interface TripSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export const TripSelector = ({ value, onChange }: TripSelectorProps) => {
  const { data: trips = [] } = useRecentTrips();

  return (
    <div className="p-4 border-b border-border bg-muted/30">
      <label className="text-sm text-muted-foreground mb-2 block">
        Apply suggestions to:
      </label>
      <Select value={value || "new"} onValueChange={(v) => onChange(v === "new" ? null : v)}>
        <SelectTrigger>
          <SelectValue placeholder="Select trip" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">New Trip</SelectItem>
          {trips.map((trip) => (
            <SelectItem key={trip.id} value={trip.id}>
              {trip.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
