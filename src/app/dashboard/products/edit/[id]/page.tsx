import EditProductView from "@/components/dashboard/products/ProductEditView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Product | DotSkills Hub",
  description: "Update product information",
};

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <EditProductView id={id} />;
}
