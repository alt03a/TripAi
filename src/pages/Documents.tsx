import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Documents() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-heading font-bold text-foreground mb-6">
        Document Manager
      </h1>
      <p className="text-muted-foreground">
        Document management coming soon
      </p>
    </DashboardLayout>
  );
}
