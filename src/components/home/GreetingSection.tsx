import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const GreetingSection = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-2">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
        {getGreeting()}{user?.email ? `, ${user.email.split("@")[0]}` : ""}
      </h1>
      <p className="text-muted-foreground">{formatDate()}</p>
    </div>
  );
};
