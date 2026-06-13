import type { Metadata } from 'next';
import { CategoriesManagement } from '@/components/dashboard/categories/CategoriesManagement';

export const metadata: Metadata = {
  title: 'Categories | DotSkillsHub',
  description: 'Manage product categories for your store',
};

export default function CategoriesPage() {
  return <CategoriesManagement />;
}
