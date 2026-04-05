import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";
const useCartStore = create(
    persist((set, get) => ({
        items: [],

        addToCart: (product) => {
            const items = get().items;
            const existingItem = items.find((item) => item.id === product.id);

            if (existingItem) {
                // Prevent exceeding stock
                if (existingItem.quantity >= product.stock) return;
                set({
                    items: items.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                });
                toast.success("Product quantity increased");
            } else {
                set({
                    items: [...items, { ...product, quantity: 1 }],
                });
                toast.success("Product added to cart 🛒");
            }
        },

        removeFromCart: (productId) => {
            set({
                items: get().items.filter((item) => item.id !== productId),
            });
            toast.success("Product removed from cart 🗑️");
        },

        updateQuantity: (productId, newQuantity) => {
            const items = get().items;
            const item = items.find((i) => i.id === productId);

            if (!item) return;

            // Prevent exceeding stock
            if (newQuantity > item.stock && item.stock > 0) {
                toast.error(`Product quantity exceeds stock. Maximum quantity is ${item.stock}`);
                return;
            }

            // Prevent quantity from going to 0 or negative
            if (newQuantity <= 0) {
                toast.error("Product quantity must be at least 1");
                return;
            }
            set({
                items: items.map((i) =>
                    i.id === productId ? { ...i, quantity: newQuantity } : i
                ),
            });
        },

        clearCart: () => set({ items: [] }),

        getTotalItems: () => {
            return get().items.reduce((sum, item) => sum + item.quantity, 0);
        },

        getTotalPrice: () => {
            return get().items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
        },
    }),
    {
        name: "cart-storage",
    }
));

export default useCartStore;
