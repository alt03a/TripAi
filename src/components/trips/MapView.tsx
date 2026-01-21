import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Locate, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  const [isTracking, setIsTracking] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [tileUrl, setTileUrl] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayerRef = useRef<L.GeoJSON | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Fetch tile URL from edge function on mount
  useEffect(() => {
    const fetchTileUrl = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setMapError("Please log in to view the map");
          return;
        }

        const { data, error } = await supabase.functions.invoke("map-proxy", {
          body: { action: "tile-url" },
        });

        if (error) {
          console.error("[MapView] Error fetching tile URL:", error);
          setMapError("Failed to load map configuration");
          return;
        }

        if (data?.tileUrl) {
          setTileUrl(data.tileUrl);
        }
      } catch (error) {
        console.error("[MapView] Error:", error);
        setMapError("Failed to load map");
      }
    };

    fetchTileUrl();
  }, []);

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

  // Initialize map only once when tileUrl is available
  useEffect(() => {
    if (!mapRef.current || map || !tileUrl) return;

    const mapContainer = mapRef.current;
    
    // Create initialization function
    const initMap = () => {
      if (!mapRef.current) return null;
      
      try {
        const newMap = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        }).setView([-8.5, 115.2], 10); // Default to Bali area
        
        L.tileLayer(tileUrl, {
          attribution: '© <a href="https://www.geoapify.com/">Geoapify</a> | © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 20,
        }).addTo(newMap);
        
        return newMap;
      } catch (error) {
        console.error("Error initializing map:", error);
        return null;
      }
    };
    
    // Ensure container is ready
    if (!mapContainer.offsetWidth || !mapContainer.offsetHeight) {
      const timer = setTimeout(() => {
        const newMap = initMap();
        if (newMap) setMap(newMap);
      }, 150);
      return () => clearTimeout(timer);
    }

    const newMap = initMap();
    if (newMap) setMap(newMap);

    return () => {
      if (newMap) {
        try {
          newMap.remove();
        } catch (e) {
          // Map may already be removed
        }
      }
    };
  }, [tileUrl]);

  useEffect(() => {
    if (!map || !mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      try {
        marker.remove();
      } catch (e) {
        // Marker may already be removed
      }
    });
    markersRef.current = [];
    
    if (routeLayerRef.current) {
      try {
        routeLayerRef.current.remove();
      } catch (e) {
        // Layer may already be removed
      }
      routeLayerRef.current = null;
    }

    if (locations.length === 0) return;

    const createNumberedIcon = (number: number) => {
      return L.divIcon({
        html: `<div style="background: hsl(var(--secondary)); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${number}</div>`,
        className: "numbered-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
    };

    // Add markers and routes with a small delay to ensure map is fully ready
    const timer = setTimeout(async () => {
      // Add markers
      locations.forEach((location, index) => {
        try {
          const marker = L.marker([location.lat, location.lng], {
            icon: createNumberedIcon(index + 1),
          }).addTo(map);

          marker.bindPopup(`<div style="padding: 8px;"><strong>${location.name}</strong></div>`);
          markersRef.current.push(marker);
        } catch (e) {
          console.error("Error adding marker:", e);
        }
      });

      // Fetch and display route via edge function
      if (locations.length > 1) {
        const waypoints = locations
          .map((loc) => `${loc.lat},${loc.lng}`)
          .join("|");

        try {
          const { data, error } = await supabase.functions.invoke("map-proxy", {
            body: { action: "route", waypoints },
          });

          if (!error && data?.features && data.features.length > 0) {
            const routeLayer = L.geoJSON(data, {
              style: {
                color: "hsl(var(--secondary))",
                weight: 4,
                opacity: 0.8,
              },
            }).addTo(map);
            routeLayerRef.current = routeLayer;
          }
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      }

      // Fit bounds
      if (locations.length > 0) {
        const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [map, locations]);

  if (mapError) {
    return (
      <Card className="p-6 bg-muted/30">
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg gap-4">
          <MapPin className="h-12 w-12 text-muted-foreground" />
          <div className="text-center space-y-2">
            <p className="text-muted-foreground font-medium">
              {mapError}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!tileUrl) {
    return (
      <Card className="p-6 bg-muted/30">
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg gap-4">
          <LoaderCircle className="h-12 w-12 text-muted-foreground animate-spin" />
          <p className="text-muted-foreground font-medium">Loading map...</p>
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
