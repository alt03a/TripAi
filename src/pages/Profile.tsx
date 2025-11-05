import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Profile() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-heading font-bold text-foreground mb-6">
        Profile & Settings
      </h1>
      <p className="text-muted-foreground">
        Profile settings coming soon
      </p>
    </DashboardLayout>
  );
}
