import { Card } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface MapViewProps {
  locations: Location[];
}

export const MapView = ({ locations }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [isKeySet, setIsKeySet] = useState(false);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    // Check for API key in session storage (temporary)
    const storedKey = sessionStorage.getItem("geoapify_api_key");
    if (storedKey) {
      setApiKey(storedKey);
      setIsKeySet(true);
    }
  }, []);

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      sessionStorage.setItem("geoapify_api_key", apiKey);
      setIsKeySet(true);
    }
  };

  useEffect(() => {
    if (!mapRef.current || !isKeySet) return;

    // Initialize map
    const defaultCenter = locations.length > 0 
      ? [locations[0].lat, locations[0].lng] as L.LatLngTuple
      : [0, 0] as L.LatLngTuple;

    const newMap = L.map(mapRef.current).setView(defaultCenter, locations.length > 1 ? 8 : 12);

    // Add Geoapify tile layer
    L.tileLayer(
      `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`,
      {
        attribution: '© <a href="https://www.geoapify.com/">Geoapify</a> | © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 20,
      }
    ).addTo(newMap);

    setMap(newMap);

    return () => {
      newMap.remove();
    };
  }, [isKeySet, apiKey]);

  useEffect(() => {
    if (!map || !isKeySet) return;

    // Clear existing markers and routes
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    if (locations.length === 0) return;

    // Create custom numbered icon
    const createNumberedIcon = (number: number) => {
      return L.divIcon({
        html: `<div style="background: hsl(var(--secondary)); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${number}</div>`,
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
    };

    // Add markers for each location
    locations.forEach((location, index) => {
      const marker = L.marker([location.lat, location.lng], {
        icon: createNumberedIcon(index + 1),
      }).addTo(map);

      marker.bindPopup(`<div style="padding: 8px;"><strong>${location.name}</strong></div>`);
      markersRef.current.push(marker);
    });

    // Draw route if multiple locations
    if (locations.length > 1) {
      const waypoints = locations
        .map((loc) => `${loc.lat},${loc.lng}`)
        .join("|");

      fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=drive&apiKey=${apiKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.features && data.features.length > 0) {
            const routeLayer = L.geoJSON(data, {
              style: {
                color: "hsl(var(--secondary))",
                weight: 4,
                opacity: 0.8,
              },
            }).addTo(map);
            routeLayerRef.current = routeLayer;
          }
        })
        .catch((error) => {
          console.error("Error fetching route:", error);
        });
    }

    // Fit bounds to show all markers
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, locations, apiKey, isKeySet]);

  if (!isKeySet) {
    return (
      <Card className="p-6 bg-muted/30">
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg gap-4">
          <MapPin className="h-12 w-12 text-muted-foreground" />
          <div className="text-center space-y-2">
            <p className="text-muted-foreground font-medium">
              Geoapify API Key Required
            </p>
            <p className="text-sm text-muted-foreground max-w-md">
              Enter your Geoapify API key to view location maps and routes.
              Get your key at{" "}
              <a
                href="https://myprojects.geoapify.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Geoapify Projects
              </a>
            </p>
          </div>
          <div className="flex gap-2 w-full max-w-md">
            <Input
              type="text"
              placeholder="Enter Geoapify API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetApiKey()}
            />
            <Button onClick={handleSetApiKey}>
              <Navigation className="h-4 w-4 mr-2" />
              Set Key
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden bg-muted/30">
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg"
        role="application"
        aria-label="Interactive map showing trip locations"
      />
      {locations.length > 0 && (
        <div className="p-4 bg-card border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Navigation className="h-4 w-4" />
            <span>
              {locations.length} location{locations.length !== 1 ? "s" : ""} • 
              {locations.length > 1 ? " Route displayed" : " Marker placed"}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};
