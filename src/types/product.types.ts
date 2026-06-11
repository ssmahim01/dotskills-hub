// Product Status Type
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

// Product Model
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  sku: string;
  images: string[];
  costPrice: number;
  sellingPrice: number;
  discountPrice: number | null;
  stock: number;
  lowStockThreshold: number;
  totalSold: number;
  rating: number;
  isFeatured: boolean;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

// Create Product Payload
export interface CreateProductPayload {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  sku: string;
  images: string[];
  costPrice: number;
  sellingPrice: number;
  discountPrice: number | null;
  stock: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  status: ProductStatus;
}

// Update Product Payload
export interface UpdateProductPayload {
  name?: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  sku?: string;
  images?: string[];
  costPrice?: number;
  sellingPrice?: number;
  discountPrice?: number | null;
  stock?: number;
  lowStockThreshold?: number;
  isFeatured?: boolean;
  status?: ProductStatus;
}

// Product List Response
export interface ProductsListResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Product Query Params
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: ProductStatus | 'all';
  featured?: boolean | 'all';
  sort?: 'name' | 'price' | 'sold' | 'created';
  order?: 'asc' | 'desc';
}

// Product Overview Stats
export interface ProductOverviewStats {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  outOfStockProducts: number;
  featuredProducts: number;
}
