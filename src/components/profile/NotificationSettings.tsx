import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    tripReminders: true,
    priceAlerts: true,
    recommendations: true,
    newsletter: false,
    documentExpiry: true,
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Manage how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="tripReminders">Trip Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Get notified before your trips
            </p>
          </div>
          <Switch
            id="tripReminders"
            checked={settings.tripReminders}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, tripReminders: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="priceAlerts">Price Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Notify me of price changes
            </p>
          </div>
          <Switch
            id="priceAlerts"
            checked={settings.priceAlerts}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, priceAlerts: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="recommendations">AI Recommendations</Label>
            <p className="text-sm text-muted-foreground">
              Personalized trip suggestions
            </p>
          </div>
          <Switch
            id="recommendations"
            checked={settings.recommendations}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, recommendations: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="documentExpiry">Document Expiry</Label>
            <p className="text-sm text-muted-foreground">
              Alerts for expiring documents
            </p>
          </div>
          <Switch
            id="documentExpiry"
            checked={settings.documentExpiry}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, documentExpiry: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="newsletter">Newsletter</Label>
            <p className="text-sm text-muted-foreground">
              Travel tips and updates
            </p>
          </div>
          <Switch
            id="newsletter"
            checked={settings.newsletter}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, newsletter: checked })
            }
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};
