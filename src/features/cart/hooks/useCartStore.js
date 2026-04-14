import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";
const useCartStore = create(
    persist((set, get) => ({
        items: [],
        lastActionTime: 0,

        addToCart: (product) => {
            const now = Date.now();
            if (now - get().lastActionTime < 500) return; // Prevent rapid clicks
            set({ lastActionTime: now });

            const items = get().items;
            const existingItem = items.find((item) => item.id === product.id);

            if (existingItem) {
                // Prevent exceeding stock
                if (existingItem.quantity >= product.stock) {
                    toast.error("⚠️ Maximum stock reached");
                    return;
                };
                set({
                    items: items.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                });
                toast.success("Quantity updated 🛒⬆️");
            } else {
                set({
                    items: [...items, { ...product, quantity: 1 }],
                });
                toast.success("Added to cart 🛒");
            }
        },

        removeFromCart: (productId) => {
            const items = get().items;
            const item = items.find((i) => i.id === productId);
            set({
                items: get().items.filter((item) => item.id !== productId),
            });
            toast.info(`Removed ${item?.title.slice(0, 20) + "..." || "item"} from cart 🗑️`);
        },

        updateQuantity: (productId, newQuantity) => {
            const items = get().items;
            const item = items.find((i) => i.id === productId);

            if (!item) return;

            // Prevent exceeding stock
            if (newQuantity > item.stock && item.stock > 0) {
                toast.error(`Max available: ${item.stock}`);
                return;
            }

            // Prevent quantity from going to 0 or negative
            if (newQuantity <= 0) {
                toast.error("Minimum quantity is 1");
                return;
            }
            set({
                items: items.map((i) =>
                    i.id === productId ? { ...i, quantity: newQuantity } : i
                ),
            });
            toast.success("Cart updated 🛒🔄");
        },

        clearCart: () => {
            set({ items: [] })
            toast.success("Cart cleared 🧹");
        },

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
