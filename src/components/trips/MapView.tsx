import { Card } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [map, setMap] = useState<any>(null);
  const [apiKey, setApiKey] = useState("");
  const [isKeySet, setIsKeySet] = useState(false);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if ((window as any).google && (window as any).google.maps) {
      setIsKeySet(true);
      return;
    }

    // Check for API key in session storage (temporary)
    const storedKey = sessionStorage.getItem("google_maps_api_key");
    if (storedKey) {
      setApiKey(storedKey);
      loadGoogleMaps(storedKey);
    }
  }, []);

  const loadGoogleMaps = (key: string) => {
    if ((window as any).google?.maps) {
      setIsKeySet(true);
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsKeySet(true);
      initMap();
    };
    document.head.appendChild(script);
  };

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      sessionStorage.setItem("google_maps_api_key", apiKey);
      loadGoogleMaps(apiKey);
    }
  };

  const initMap = () => {
    if (!mapRef.current || !(window as any).google) return;

    const google = (window as any).google;
    const defaultCenter = locations.length > 0 
      ? { lat: locations[0].lat, lng: locations[0].lng }
      : { lat: 0, lng: 0 };

    const newMap = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: locations.length > 1 ? 8 : 12,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    setMap(newMap);
  };

  useEffect(() => {
    if (!map || !(window as any).google) return;

    const google = (window as any).google;
    const markers: any[] = [];

    // Add markers for each location
    locations.forEach((location, index) => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        label: (index + 1).toString(),
        animation: google.maps.Animation.DROP,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div class="p-2"><strong>${location.name}</strong></div>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      markers.push(marker);
    });

    // Draw route if multiple locations
    if (locations.length > 1) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#FF6B6B",
          strokeWeight: 3,
        },
      });

      const waypoints = locations.slice(1, -1).map((loc) => ({
        location: { lat: loc.lat, lng: loc.lng },
        stopover: true,
      }));

      directionsService.route(
        {
          origin: { lat: locations[0].lat, lng: locations[0].lng },
          destination: { 
            lat: locations[locations.length - 1].lat, 
            lng: locations[locations.length - 1].lng 
          },
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result: any, status: any) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRenderer.setDirections(result);
          }
        }
      );
    }

    // Fit bounds to show all markers
    if (locations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach((loc) => {
        bounds.extend({ lat: loc.lat, lng: loc.lng });
      });
      map.fitBounds(bounds);
    }
  }, [map, locations]);

  if (!isKeySet) {
    return (
      <Card className="p-6 bg-muted/30">
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg gap-4">
          <MapPin className="h-12 w-12 text-muted-foreground" />
          <div className="text-center space-y-2">
            <p className="text-muted-foreground font-medium">
              Google Maps API Key Required
            </p>
            <p className="text-sm text-muted-foreground max-w-md">
              Enter your Google Maps API key to view location maps and routes.
              Get your key at{" "}
              <a
                href="https://console.cloud.google.com/google/maps-apis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Cloud Console
              </a>
            </p>
          </div>
          <div className="flex gap-2 w-full max-w-md">
            <Input
              type="text"
              placeholder="Enter Google Maps API Key"
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
