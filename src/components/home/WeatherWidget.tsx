import { Card } from "@/components/ui/card";
import { Cloud, CloudRain, Sun } from "lucide-react";

export const WeatherWidget = () => {
  // TODO: Integrate with OpenWeather API
  const mockWeather = {
    location: "Current Location",
    temperature: 72,
    condition: "Partly Cloudy",
    icon: Cloud,
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary to-primary-glow text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{mockWeather.location}</p>
          <h3 className="text-4xl font-heading font-bold">{mockWeather.temperature}°F</h3>
          <p className="text-sm opacity-90">{mockWeather.condition}</p>
        </div>
        <mockWeather.icon className="h-16 w-16 opacity-80" />
      </div>
    </Card>
  );
};
