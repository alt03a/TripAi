import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Onboarding() {
  return (
    <DashboardLayout>
      <div className="text-center py-12">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
          Welcome to TripTuner
        </h1>
        <p className="text-muted-foreground">
          Onboarding flow coming soon
        </p>
      </div>
    </DashboardLayout>
  );
}
