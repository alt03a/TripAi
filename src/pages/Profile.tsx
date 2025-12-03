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
import { Shield, Github, Linkedin } from "lucide-react";

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

      {/* Developer Credit */}
      <div className="mt-12 pt-8 border-t border-border/40">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Developed with <span className="text-coral animate-pulse">♥</span> by{" "}
            <span className="font-semibold bg-gradient-to-r from-primary via-coral to-golden bg-clip-text text-transparent">
              Sk Altab Hossen
            </span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/alt03a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 transform duration-200"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/sk-altab-hossen-877b19223"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#0A66C2] transition-colors hover:scale-110 transform duration-200"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
