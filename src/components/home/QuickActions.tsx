import { Link } from "react-router-dom";
import { MessageCircle, PlusCircle, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";

const actions = [
  {
    title: "Plan New Trip",
    description: "Start planning your next adventure",
    icon: PlusCircle,
    href: "/plan-trip",
    gradient: "from-primary to-primary-glow",
  },
  {
    title: "Chat with AI",
    description: "Get personalized recommendations",
    icon: MessageCircle,
    href: "/chat",
    gradient: "from-accent to-secondary",
  },
  {
    title: "My Trips",
    description: "View and manage your trips",
    icon: Briefcase,
    href: "/trips",
    gradient: "from-secondary to-accent",
  },
];

export const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action) => (
        <Link key={action.title} to={action.href}>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-1">
              {action.title}
            </h3>
            <p className="text-sm text-muted-foreground">{action.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
};
