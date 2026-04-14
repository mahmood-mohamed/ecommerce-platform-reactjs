
export default function ProductDetailsSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">

            {/* Breadcrumb */}
            <div className="flex gap-2 mb-8">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* Image */}
                <div className="w-full aspect-square bg-gray-200 rounded-3xl"></div>

                {/* Info */}
                <div className="flex flex-col gap-4">

                    {/* Category */}
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>

                    {/* Title */}
                    <div className="h-8 w-3/4 bg-gray-200 rounded"></div>

                    {/* Rating */}
                    <div className="flex gap-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-5 h-5 bg-gray-200 rounded"></div>
                        ))}
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>

                    {/* Price */}
                    <div className="h-8 w-32 bg-gray-200 rounded"></div>

                    {/* Countdown */}
                    <div className="bg-gray-100 border rounded-2xl p-4 flex gap-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                <div className="h-3 w-8 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                        <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
                    </div>

                    {/* Stock */}
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-4">
                        <div className="h-12 flex-1 bg-gray-200 rounded-xl"></div>
                        <div className="h-12 w-20 bg-gray-200 rounded-xl"></div>
                        <div className="h-12 w-24 bg-gray-200 rounded-xl"></div>
                    </div>

                    {/* Reviews */}
                    <div className="mt-10 border-t pt-6 space-y-4">
                        <div className="h-6 w-40 bg-gray-200 rounded"></div>

                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-gray-100 p-6 rounded-xl space-y-4">
                                
                                <div className="flex justify-between">
                                    <div className="flex gap-3 items-center">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                            <div className="h-3 w-16 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>

                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, j) => (
                                            <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                                    <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
