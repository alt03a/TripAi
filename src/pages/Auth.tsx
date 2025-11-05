import { AuthLayout } from "@/components/layout/AuthLayout";

export default function Auth() {
  return (
    <AuthLayout>
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
          Sign In
        </h1>
        <p className="text-muted-foreground">
          Authentication flow coming soon
        </p>
      </div>
    </AuthLayout>
  );
}
