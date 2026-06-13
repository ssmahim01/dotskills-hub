import DashboardLayout from "@/components/dashboard/layouts/DashboardLayout";

export default function MainDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}
