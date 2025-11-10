import { ReactNode } from "react";
import { SkipLink } from "./SkipLink";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <main 
        id="main-content" 
        className="max-w-screen-xl mx-auto px-4 py-6"
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  );
};
