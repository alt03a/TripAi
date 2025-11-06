import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface MapViewProps {
  locations: Location[];
}

export const MapView = ({ locations }: MapViewProps) => {
  return (
    <Card className="p-6 bg-muted/30">
      <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
        <div className="text-center space-y-2">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">
            Map integration placeholder
          </p>
          <p className="text-sm text-muted-foreground">
            {locations.length} location{locations.length !== 1 ? "s" : ""} to display
          </p>
        </div>
      </div>
    </Card>
  );
};
