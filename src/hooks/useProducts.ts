import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, Category, ProductImage, ProductDimension } from '@/types/product';
import { useEffect } from 'react';
import { products as initialProducts, categories as initialCategories } from '@/data/products';

// Type for database product
interface DbProduct {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  description: string;
  description_en: string;
  category: string;
  subcategory: string | null;
  base_price: number;
  sale_price: number | null;
  images: ProductImage[];
  dimensions: ProductDimension[];
  materials: string[];
  colors: string[];
  features: string[];
  in_stock: boolean;
  featured: boolean;
  best_seller: boolean;
  created_at: string;
  updated_at: string;
}

interface DbCategory {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  description: string | null;
  image: string | null;
  product_count: number;
  created_at: string;
  updated_at: string;
}

// Convert database product to app product type
const toAppProduct = (db: DbProduct): Product => ({
  id: db.id,
  name: db.name,
  nameEn: db.name_en,
  slug: db.slug,
  description: db.description,
  descriptionEn: db.description_en,
  category: db.category,
  subcategory: db.subcategory || undefined,
  basePrice: Number(db.base_price),
  salePrice: db.sale_price ? Number(db.sale_price) : undefined,
  images: db.images as ProductImage[],
  dimensions: db.dimensions as ProductDimension[],
  materials: db.materials,
  colors: db.colors,
  features: db.features,
  inStock: db.in_stock,
  featured: db.featured,
  bestSeller: db.best_seller,
  createdAt: db.created_at,
  updatedAt: db.updated_at,
});

// Convert database category to app category type
const toAppCategory = (db: DbCategory): Category => ({
  id: db.id,
  name: db.name,
  nameEn: db.name_en,
  slug: db.slug,
  description: db.description || undefined,
  image: db.image || undefined,
  productCount: db.product_count,
});

// Convert app product to database format
const toDbProduct = (product: Product): Omit<DbProduct, 'created_at' | 'updated_at'> => ({
  id: product.id,
  name: product.name,
  name_en: product.nameEn,
  slug: product.slug,
  description: product.description,
  description_en: product.descriptionEn,
  category: product.category,
  subcategory: product.subcategory || null,
  base_price: product.basePrice,
  sale_price: product.salePrice || null,
  images: product.images,
  dimensions: product.dimensions,
  materials: product.materials,
  colors: product.colors,
  features: product.features,
  in_stock: product.inStock,
  featured: product.featured,
  best_seller: product.bestSeller,
});

// Fetch all products
export function useProductsQuery() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map((p) => toAppProduct(p as unknown as DbProduct));
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          // Invalidate and refetch products on any change
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

// Fetch single product by slug with real-time updates
export function useProductBySlug(slug: string) {
  const queryClient = useQueryClient();

  // Set up real-time subscription for this specific product
  useEffect(() => {
    if (!slug) return;

    const channel = supabase
      .channel(`product-${slug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `slug=eq.${slug}`,
        },
        (payload) => {
          console.log('Product change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['product', slug] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug, queryClient]);

  return useQuery({
    queryKey: ['product', slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Error fetching product:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return toAppProduct(data as unknown as DbProduct);
    },
    enabled: !!slug,
    staleTime: 0,
  });
}

// Fetch categories
export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map((c) => toAppCategory(c as unknown as DbCategory));
    },
  });
}

// Create product mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      const dbProduct = toDbProduct(product);
      const { data, error } = await supabase
        .from('products')
        .insert(dbProduct as any)
        .select()
        .single();

      if (error) throw error;
      return toAppProduct(data as unknown as DbProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Update product mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      const dbUpdates: any = {};
      
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.nameEn !== undefined) dbUpdates.name_en = updates.nameEn;
      if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.descriptionEn !== undefined) dbUpdates.description_en = updates.descriptionEn;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.subcategory !== undefined) dbUpdates.subcategory = updates.subcategory;
      if (updates.basePrice !== undefined) dbUpdates.base_price = updates.basePrice;
      if (updates.salePrice !== undefined) dbUpdates.sale_price = updates.salePrice;
      if (updates.images !== undefined) dbUpdates.images = updates.images;
      if (updates.dimensions !== undefined) dbUpdates.dimensions = updates.dimensions;
      if (updates.materials !== undefined) dbUpdates.materials = updates.materials;
      if (updates.colors !== undefined) dbUpdates.colors = updates.colors;
      if (updates.features !== undefined) dbUpdates.features = updates.features;
      if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
      if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
      if (updates.bestSeller !== undefined) dbUpdates.best_seller = updates.bestSeller;

      const { data, error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return toAppProduct(data as unknown as DbProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Delete product mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Seed database with initial products (admin only)
export function useSeedProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Convert all initial products to database format (omit the non-UUID id, let DB generate)
      const dbProducts = initialProducts.map((p) => {
        const dbProduct = toDbProduct(p);
        // Remove the string ID - let Supabase generate a proper UUID
        const { id, ...productWithoutId } = dbProduct;
        return productWithoutId;
      });
      
      // Insert products one by one to handle duplicates gracefully
      for (const product of dbProducts) {
        const { error } = await supabase
          .from('products')
          .upsert(product as any, { onConflict: 'slug' });
        
        if (error) {
          console.error('Error inserting product:', product.slug, error);
        }
      }

      // Seed categories too (also let DB generate UUIDs)
      const dbCategories = initialCategories.map((c) => ({
        name: c.name,
        name_en: c.nameEn,
        slug: c.slug,
        description: c.description || null,
        image: c.image || null,
        product_count: c.productCount,
      }));

      for (const category of dbCategories) {
        const { error } = await supabase
          .from('categories')
          .upsert(category, { onConflict: 'slug' });
        
        if (error) {
          console.error('Error inserting category:', category.slug, error);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
