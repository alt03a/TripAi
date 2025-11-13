import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const AppShell = () => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Outlet />
      <BottomNav />
    </div>
  );
};
