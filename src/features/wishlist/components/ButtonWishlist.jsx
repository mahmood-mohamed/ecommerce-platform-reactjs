import React from 'react'
import useWishlistStore from '../hooks/useWishlistStore'

export default function ButtonWishlist({ product, className }) {
    const { addToWishlist, isInWishlist } = useWishlistStore();
    const isActive = isInWishlist(product.id);
    
    return (
        <button
            title={`${isActive ? "Remove from Wishlist" : "Add to Wishlist"}`}
            onClick={(e) => {
                e.preventDefault();
                addToWishlist(product);
            }}
            className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${isActive
                ? "bg-accent-500 text-white"
                : "bg-white/90 text-gray-400 hover:text-accent-500"
                } ${className}`}
        >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                />
            </svg>
        </button>
    )
}
