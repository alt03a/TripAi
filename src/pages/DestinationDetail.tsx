import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DestinationDetail() {
  const { id } = useParams();

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-heading font-bold text-foreground mb-6">
        Destination Details
      </h1>
      <p className="text-muted-foreground">
        Destination {id} details coming soon
      </p>
    </DashboardLayout>
  );
}
