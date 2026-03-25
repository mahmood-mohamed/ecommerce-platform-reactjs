import { create } from "zustand";
import { persist } from "zustand/middleware";


// Create a store for compare items using zustand and persist
// Two items can be compared at a time if add more than two items it will remove the oldest item
// store time when item is added to compare and remove the oldest item when new item is added
// this error in console when i open the compare page solve it
// in locale storage show like this >> compare-products	[object Object]
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

                    return { items: newItems };
                }),

            removeFromCompare: (productId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.product.id !== productId),
                })),

            isItemInCompare: (productId) =>
                get().items.some((item) => item.product.id === productId),

            compareList: () => get().items.map((item) => item.product),

            clearCompare: () =>
                set(() => ({
                    items: [],
                })),
        }),
        {
            name: "compare-storage", // Changed name slightly to avoid old buggy data
        }
    )
);

export default useCompareStore;

