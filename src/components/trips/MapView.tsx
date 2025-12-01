import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Locate, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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
  const [isTracking, setIsTracking] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayerRef = useRef<L.GeoJSON | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
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

  // Create user location marker icon
  const createUserIcon = () => {
    return L.divIcon({
      html: `<div style="position: relative;">
        <div style="background: hsl(var(--primary)); width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
        <div style="position: absolute; top: -4px; left: -4px; width: 28px; height: 28px; border: 2px solid hsl(var(--primary)); border-radius: 50%; animation: pulse 2s infinite;"></div>
      </div>`,
      className: "user-location-marker",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  const updateUserLocation = useCallback((position: GeolocationPosition) => {
    if (!map) return;

    const { latitude, longitude, accuracy } = position.coords;

    // Update or create user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([latitude, longitude]);
    } else {
      userMarkerRef.current = L.marker([latitude, longitude], {
        icon: createUserIcon(),
        zIndexOffset: 1000,
      }).addTo(map);
      userMarkerRef.current.bindPopup(`<div style="padding: 8px;"><strong>Your Location</strong></div>`);
    }

    // Update or create accuracy circle
    if (userAccuracyCircleRef.current) {
      userAccuracyCircleRef.current.setLatLng([latitude, longitude]);
      userAccuracyCircleRef.current.setRadius(accuracy);
    } else {
      userAccuracyCircleRef.current = L.circle([latitude, longitude], {
        radius: accuracy,
        color: "hsl(var(--primary))",
        fillColor: "hsl(var(--primary))",
        fillOpacity: 0.15,
        weight: 1,
      }).addTo(map);
    }

    setIsLocating(false);
  }, [map]);

  const handleLocationError = useCallback((error: GeolocationPositionError) => {
    setIsLocating(false);
    setIsTracking(false);
    
    let message = "Unable to get your location";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "Location permission denied. Please enable location access.";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Location information unavailable.";
        break;
      case error.TIMEOUT:
        message = "Location request timed out.";
        break;
    }
    
    toast({
      title: "Location Error",
      description: message,
      variant: "destructive",
    });
  }, [toast]);

  const toggleLocationTracking = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isTracking) {
      // Stop tracking
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      // Remove user marker and circle
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      if (userAccuracyCircleRef.current) {
        userAccuracyCircleRef.current.remove();
        userAccuracyCircleRef.current = null;
      }
      setIsTracking(false);
    } else {
      // Start tracking
      setIsLocating(true);
      setIsTracking(true);
      
      // Get initial position and center map
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateUserLocation(position);
          if (map) {
            map.setView([position.coords.latitude, position.coords.longitude], 14);
          }
        },
        handleLocationError,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      // Watch position for real-time updates
      watchIdRef.current = navigator.geolocation.watchPosition(
        updateUserLocation,
        handleLocationError,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      );
    }
  }, [isTracking, map, updateUserLocation, handleLocationError, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !isKeySet) return;

    const defaultCenter = locations.length > 0 
      ? [locations[0].lat, locations[0].lng] as L.LatLngTuple
      : [0, 0] as L.LatLngTuple;

    const newMap = L.map(mapRef.current).setView(defaultCenter, locations.length > 1 ? 8 : 12);

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

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    if (locations.length === 0) return;

    const createNumberedIcon = (number: number) => {
      return L.divIcon({
        html: `<div style="background: hsl(var(--secondary)); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${number}</div>`,
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
    };

    locations.forEach((location, index) => {
      const marker = L.marker([location.lat, location.lng], {
        icon: createNumberedIcon(index + 1),
      }).addTo(map);

      marker.bindPopup(`<div style="padding: 8px;"><strong>${location.name}</strong></div>`);
      markersRef.current.push(marker);
    });

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
      <style>
        {`
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
          }
          .user-location-marker { background: transparent !important; border: none !important; }
        `}
      </style>
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg"
          role="application"
          aria-label="Interactive map showing trip locations"
        />
        <Button
          variant={isTracking ? "default" : "secondary"}
          size="icon"
          className="absolute top-3 right-3 z-[1000] shadow-lg"
          onClick={toggleLocationTracking}
          aria-label={isTracking ? "Stop location tracking" : "Start location tracking"}
        >
          {isLocating ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Locate className="h-4 w-4" />
          )}
        </Button>
      </div>
      {locations.length > 0 && (
        <div className="p-4 bg-card border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              <span>
                {locations.length} location{locations.length !== 1 ? "s" : ""} • 
                {locations.length > 1 ? " Route displayed" : " Marker placed"}
              </span>
            </div>
            {isTracking && (
              <span className="text-primary font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Tracking
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
