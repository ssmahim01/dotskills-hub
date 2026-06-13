import DashboardOverview from "@/components/dashboard/Overview";

interface Props {
   params: Promise<{ storeSlug: string }>;
}

export default async function DashboardOverviewPage({
  params,
}: Props) {
  const { storeSlug } = await params;
  return (
    <DashboardOverview
      storeSlug={storeSlug}
    />
  );
}