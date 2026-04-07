

export default function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col animate-pulse">
            {/* Image */}
            <div className="relative aspect-square bg-gray-200">
                {/* badge */}
                <div className="absolute top-3 left-3 w-20 h-5 bg-gray-300 rounded-full"></div>

                {/* wishlist + compare */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="absolute top-14 right-3 w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                {/* category */}
                <div className="w-16 h-2 bg-gray-200 rounded mb-2"></div>

                {/* title */}
                <div className="space-y-2 mb-3">
                    <div className="w-full h-3 bg-gray-300 rounded"></div>
                    <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
                </div>

                {/* rating */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-gray-300 rounded"></div>
                        ))}
                    </div>
                    <div className="w-8 h-2 bg-gray-200 rounded"></div>
                </div>

                {/* price + button */}
                <div className="mt-auto flex items-center justify-between">
                    <div className="w-16 h-3 bg-gray-300 rounded"></div>
                    <div className="w-24 h-5 bg-gray-300 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}
