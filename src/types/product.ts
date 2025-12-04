export interface ProductDimension {
  id: string;
  width: number;
  height: number;
  depth: number;
  price: number;
  sku: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  category: string;
  subcategory?: string;
  basePrice: number;
  salePrice?: number;
  images: ProductImage[];
  dimensions: ProductDimension[];
  materials: string[];
  colors: string[];
  features: string[];
  inStock: boolean;
  featured: boolean;
  bestSeller: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  description?: string;
  image?: string;
  productCount: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  dimensionId: string;
  dimension: ProductDimension;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
}
