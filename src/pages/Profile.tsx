import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PreferencesForm } from "@/components/profile/PreferencesForm";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { PrivacySettings } from "@/components/profile/PrivacySettings";
import { SignOutButton } from "@/components/profile/SignOutButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

export default function Profile() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-heading font-bold text-foreground mb-6">
        Profile & Settings
      </h1>
      
      <ProfileHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PreferencesForm />
        <div className="space-y-6">
          <NotificationSettings />
          <PrivacySettings />
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isAdmin && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/admin")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Button>
              )}
              <SignOutButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
