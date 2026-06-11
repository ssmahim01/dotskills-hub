import type { Metadata } from 'next';
import { OrderManagement } from '@/components/dashboard/orders/OrderManagement';

export const metadata: Metadata = {
  title: 'Orders | DotSkillsHub',
  description: 'Manage customer orders',
};

export default function OrdersPage() {
  return <OrderManagement />;
}
