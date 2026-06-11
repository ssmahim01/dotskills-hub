import type { Metadata } from 'next';
import { CustomerManagement } from '@/components/dashboard/customers/CustomerManagement';

export const metadata: Metadata = {
  title: 'Customers | DotSkillsHub',
  description: 'Manage store customers',
};

export default function CustomersPage() {
  return <CustomerManagement />;
}
