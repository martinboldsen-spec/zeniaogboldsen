'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ArtPrint } from '@/lib/art-print-service';

export type CartItem = ArtPrint & {
  selectedFrame: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string, frame: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        // Simple add, no quantity logic for now
        set({ items: [...currentItems, item] });
      },
      removeItem: (itemId, frame) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === itemId && item.selectedFrame === frame)
          ),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
