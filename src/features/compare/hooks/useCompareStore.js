import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";

const useCompareStore = create(
    persist(
        (set, get) => ({
            items: [],

            addToCompare: (product) =>
                set((state) => {
                    // Check if already in compare
                    if (state.items.some((item) => item.product.id === product.id)) {
                        return state;
                    }

                    const newItems = [...state.items, { product, time: Date.now() }];

                    // If more than 2 items, remove the oldest one
                    if (newItems.length > 2) {
                        newItems.sort((a, b) => a.time - b.time); // Sort by time (oldest first)
                        newItems.shift(); // Remove the oldest
                    }
                    toast.success("Product added to compare ⚖️");

                    return { items: newItems };
                }),

            removeFromCompare: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.product.id !== productId),
                }));
                toast.info("Removed from compare ⚖️");
            },

            isItemInCompare: (productId) =>
                get().items.some((item) => item.product.id === productId),

            compareList: () => get().items.map((item) => item.product),

            clearCompare: () => {
                set(() => ({
                    items: [],
                }));
                toast.success("Compare list cleared 🧹");
            },
        }),
        {
            name: "compare-storage", // Changed name slightly to avoid old buggy data
        }
    )
);

export default useCompareStore;

