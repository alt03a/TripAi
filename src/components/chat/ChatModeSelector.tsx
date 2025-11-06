import { ChatMode } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Compass, MessageCircle, MapPin } from "lucide-react";

interface ChatModeSelectorProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

export const ChatModeSelector = ({ mode, onModeChange }: ChatModeSelectorProps) => {
  const modes: { value: ChatMode; label: string; icon: any }[] = [
    { value: "planning", label: "Planning", icon: Compass },
    { value: "advice", label: "Advice", icon: MessageCircle },
    { value: "local", label: "Local Info", icon: MapPin },
  ];

  return (
    <div className="border-b border-border bg-muted/50 p-2">
      <div className="flex gap-1">
        {modes.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant={mode === value ? "default" : "ghost"}
            size="sm"
            onClick={() => onModeChange(value)}
            className="flex-1"
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};
