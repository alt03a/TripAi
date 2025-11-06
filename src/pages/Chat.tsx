import { FullScreenLayout } from "@/components/layout/FullScreenLayout";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { SuggestionChips } from "@/components/chat/SuggestionChips";
import { ChatModeSelector } from "@/components/chat/ChatModeSelector";
import { TripSelector } from "@/components/chat/TripSelector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

export default function Chat() {
  const { messages, isLoading, mode, setMode, currentTrip, setCurrentTrip, sendMessage } = useChat();

  return (
    <FullScreenLayout>
      <div className="flex flex-col h-screen">
        <header className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-heading font-bold text-foreground">
            AI Travel Assistant
          </h1>
        </header>

        <ChatModeSelector mode={mode} onModeChange={setMode} />
        <TripSelector value={currentTrip} onChange={setCurrentTrip} />

        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              How can I help plan your trip?
            </h2>
            <p className="text-muted-foreground mb-8 text-center">
              Ask me anything about destinations, itineraries, or travel tips
            </p>
            <SuggestionChips onSelect={sendMessage} />
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </FullScreenLayout>
  );
}
