import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PreferencesForm } from "@/components/profile/PreferencesForm";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { PrivacySettings } from "@/components/profile/PrivacySettings";
import { SignOutButton } from "@/components/profile/SignOutButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Profile() {
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
            <CardContent>
              <SignOutButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
