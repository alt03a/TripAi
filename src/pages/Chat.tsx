import { FullScreenLayout } from "@/components/layout/FullScreenLayout";

export default function Chat() {
  return (
    <FullScreenLayout>
      <div className="flex flex-col h-screen">
        <header className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-heading font-bold text-foreground">
            AI Travel Assistant
          </h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">
            AI chat interface coming soon
          </p>
        </div>
      </div>
    </FullScreenLayout>
  );
}
