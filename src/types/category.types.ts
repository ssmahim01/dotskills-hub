// Category Status Type
export type CategoryStatus = 'ACTIVE' | 'INACTIVE';

// Category Model
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId: string | null;
  status: CategoryStatus;
  position: number;
  totalProducts: number;
  createdAt: string;
  updatedAt: string;
}

// Create Category Payload
export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId: string | null;
  status: CategoryStatus;
  position: number;
}

// Update Category Payload
export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  status?: CategoryStatus;
  position?: number;
}

// Category List Response
export interface CategoriesListResponse {
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Category Query Params
export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CategoryStatus | 'all';
  sort?: 'name' | 'position' | 'created';
  order?: 'asc' | 'desc';
}

// Category Overview Stats
export interface CategoryOverviewStats {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
}
