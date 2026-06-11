import { z } from 'zod';
import { CATEGORY_MAX_NAME_LENGTH, CATEGORY_MAX_DESCRIPTION_LENGTH } from '@/lib/constants/category.constants';

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(CATEGORY_MAX_NAME_LENGTH, `Name must be at most ${CATEGORY_MAX_NAME_LENGTH} characters`)
    .trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .trim(),
  description: z
    .string()
    .max(CATEGORY_MAX_DESCRIPTION_LENGTH, `Description must be at most ${CATEGORY_MAX_DESCRIPTION_LENGTH} characters`)
    .trim()
    .optional()
    .default(''),
  image: z.string().url('Please provide a valid image URL').optional().default(''),
  parentId: z.string().optional().nullable().default(null),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  position: z
    .number()
    .int('Position must be an integer')
    .min(0, 'Position must be a non-negative number')
    .optional()
    .default(0),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
