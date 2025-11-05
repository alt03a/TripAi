import { ReactNode } from "react";

interface FullScreenLayoutProps {
  children: ReactNode;
}

export const FullScreenLayout = ({ children }: FullScreenLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};
