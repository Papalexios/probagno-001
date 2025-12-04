import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductDimension } from '@/types/product';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, dimension: ProductDimension, quantity?: number) => void;
  removeItem: (productId: string, dimensionId: string) => void;
  updateQuantity: (productId: string, dimensionId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, dimension, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.id && item.dimensionId === dimension.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id && item.dimensionId === dimension.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isOpen: true,
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                product,
                dimensionId: dimension.id,
                dimension,
                quantity,
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, dimensionId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.dimensionId === dimensionId)
          ),
        }));
      },

      updateQuantity: (productId, dimensionId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, dimensionId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.dimensionId === dimensionId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.salePrice || item.dimension.price;
          return total + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'probagno-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
