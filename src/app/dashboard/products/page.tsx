import type { Metadata } from 'next';
import { ProductManagement } from '@/components/dashboard/products/ProductManagement';

export const metadata: Metadata = {
  title: 'Products | DotSkillsHub',
  description: 'Manage products for your store',
};

export default function ProductsPage() {
  return <ProductManagement />;
}
