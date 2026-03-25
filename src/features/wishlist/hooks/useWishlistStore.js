import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWishlistStore = create(
    persist(
        (set, get) => ({
            items: [],

            addToWishlist: (product) => {
                const items = get().items;
                const exists = items.find((item) => item.id === product.id);
                if (exists) {
                    get().removeFromWishlist(product.id);
                } else {
                    set({ items: [...items, product] });
                    toast.success("Product added to wishlist ❤️");
                }
            },

            removeFromWishlist: (productId) => {
                set({
                    items: get().items.filter((item) => item.id !== productId)
                });
            },

            clearWishlist: () => {
                set({ items: [] });
            },


            isInWishlist: (productId) => {
                return get().items.some((item) => item.id === productId);
            },
        }),
        {
            name: "wishlist-storage",
        }
    )
);

export default useWishlistStore;
