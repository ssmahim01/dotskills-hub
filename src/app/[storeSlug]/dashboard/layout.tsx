import DashboardLayout from "@/components/dashboard/layouts/DashboardLayout";

export default async function MainDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;

  return (
    <div className="flex h-screen bg-background">
      <DashboardLayout storeSlug={storeSlug}>{children}</DashboardLayout>
    </div>
  );
}
