import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  productName: z.string().min(1, 'Product name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be positive'),
  total: z.number().min(0, 'Total must be positive'),
});

export const createOrderSchema = z.object({
  customer: z.string().min(1, 'Customer is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  customerPhone: z
    .string()
    .min(10, 'Phone must be at least 10 characters')
    .max(20, 'Phone must be less than 20 characters'),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  subtotal: z.number().min(0, 'Subtotal must be positive'),
  tax: z.number().min(0, 'Tax must be positive').default(0),
  shippingCost: z.number().min(0, 'Shipping cost must be positive').default(0),
  total: z.number().min(0, 'Total must be positive'),
  paymentMethod: z.string().optional().or(z.literal('')),
  shippingAddress: z.string().optional().or(z.literal('')),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional().or(z.literal('')),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']).default('pending'),
  paymentStatus: z.enum(['pending', 'paid', 'refunded', 'failed']).default('pending'),
});

export const updateOrderSchema = createOrderSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'At least one field must be provided for update'
);

export const markAsPaidSchema = z.object({
  paymentMethod: z.string().min(1, 'Payment method is required'),
  transactionId: z.string().optional().or(z.literal('')),
});

export const shipOrderSchema = z.object({
  trackingNumber: z.string().min(1, 'Tracking number is required'),
  shippingAddress: z.string().min(1, 'Shipping address is required').optional(),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;
export type MarkAsPaidFormData = z.infer<typeof markAsPaidSchema>;
export type ShipOrderFormData = z.infer<typeof shipOrderSchema>;
