import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-accent">
          <Bot className="h-4 w-4 text-accent-foreground" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex items-start max-w-[70%]">
        <div className="rounded-lg px-4 py-3 bg-muted">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};
