import useCompareStore from '../hooks/useCompareStore'

export default function ButtonCompare({ product, className, showText = false }) {
    const { addToCompare, isItemInCompare, removeFromCompare } = useCompareStore();
    const active = isItemInCompare(product.id);

    const toggleCompare = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent Link navigation if inside ProductCard
        if (active) {
            removeFromCompare(product.id);
        } else {
            addToCompare(product);
        }
    }

    return (
        <button
            title={active ? "Remove from Compare" : "Add to Compare"}
            onClick={toggleCompare}
            className={`p-2 rounded-full border border-gray-100 flex items-center justify-center transition-all duration-300 shadow-sm
                ${active
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white/90 text-gray-500 hover:text-purple-600 hover:border-purple-200"
                } ${className || ""}`}
        >
            <svg 
                className={`${showText ? "mr-2" : ""} w-4 h-4 shadow-xs`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <path d="M12 3v18"/>
                <path d="m19 8 3 8a5 5 0 0 1-6 0zV7"/>
                <path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1"/>
                <path d="m5 8 3 8a5 5 0 0 1-6 0zV7"/>
                <path d="M7 21h10"/>
            </svg>
            {showText && (
                <span className="text-sm font-semibold">
                    {active ? "In Comparison" : "Compare"}
                </span>
            )}
        </button>
    )
}


