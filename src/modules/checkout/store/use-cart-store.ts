import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TenantCart {
    productIds: string[];
};

interface CartState {
    tenantCarts: Record<string, TenantCart>;
    addProduct: (tenantSlug: string, productId: string) => void;
    removeProduct: (tenantSlug: string, productId: string) => void;
    clearCart: (tenantSlug: string) => void;
    clearAllCarts: () => void;
    getCartByTenant: (tenantSlug: string) => string[];
};

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            tenantCarts: {},
            addProduct: (tenantSlug, productId) =>
                set((state) => ({
                    tenantCarts: {
                        ...state.tenantCarts,
                        [tenantSlug]: {
                            productIds: [
                                ...(state.tenantCarts[tenantSlug]?.productIds || []),
                                productId,
                            ]
                        }
                    }
                })),
            removeProduct: (tenantSlug, productId) =>
                set((state) => ({
                    tenantCarts: {
                        ...state.tenantCarts,
                        
                        // filter out the productId from the specific tenantSlug
                        [tenantSlug]: {
                            productIds: state.tenantCarts[tenantSlug]?.productIds.filter(
                                (id) => id !== productId
                            ) || [],
                        }
                    }
                })),
            clearCart: (tenantSlug) =>
                set((state) => ({
                    tenantCarts: {
                        ...state.tenantCarts,
                        [tenantSlug]: {
                            productIds: [],
                        },
                    },
                })),
            clearAllCarts: () =>
                set({
                    tenantCarts: {},
                }),
            getCartByTenant: (tenantSlug) => 
                get().tenantCarts[tenantSlug]?.productIds || [],
        }), 
        {
            name: "4rchiv3dGarm3nts-cart",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);