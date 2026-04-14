import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../features/products/services/productService";
import useCartStore from "../features/cart/hooks/useCartStore";
import ButtonWishlist from "../features/wishlist/components/ButtonWishlist";
import ButtonCompare from "../features/compare/components/ButtonCompare";
import reviews from "../data/reviews";
import Slider from "react-slick";
import ProductDetailsSkeleton from "../features/products/components/ProductDetailsSkeleton";

export default function ProductDetailsPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(null);
    const addToCart = useCartStore((s) => s.addToCart);

    // We use useMemo so we don't re-filter on every countdown tick
    const filteredReviews = useMemo(() => {
        return reviews.filter(r => r.productId === Number(id));
    }, [id]);

    // Sort reviews by date (newest first)
    const sortedReviews = filteredReviews.sort((a, b) => b.date - a.date);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };


    useEffect(() => {
        async function load() {
            setLoading(true);
            const p = await getProductById(id);
            setProduct(p);
            setLoading(false);
        }
        load();
    }, [id]);

    useEffect(() => {
        // Initialize countdown in seconds
        const now = Date.now();
        const offerEndsAt = now + 2 * 24 * 60 * 60 * 1000; // 2 days from now
        let remainingSeconds = Math.floor(
            (offerEndsAt - now) / 1000
        );

        // Set initial value via setTimeout to avoid synchronous setState in effect
        const initTimeout = setTimeout(() => setCountdown(remainingSeconds), 0);

        const interval = setInterval(() => {
            remainingSeconds -= 1;
            if (remainingSeconds <= 0) {
                setCountdown(0);
                clearInterval(interval);
            } else {
                setCountdown(remainingSeconds);
            }
        }, 1000);

        return () => {
            clearTimeout(initTimeout);
            clearInterval(interval);
        };
    }, []);

    const formatCountdown = (totalSeconds) => {
        if (totalSeconds === null || totalSeconds <= 0) return null;
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return { days, hours, minutes, seconds };
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`w-5 h-5 ${i <= Math.round(rating)
                        ? "text-amber-500 fill-current"
                        : "text-gray-300 fill-current"
                        }`}
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <ProductDetailsSkeleton />
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Product Not Found
                </h2>
                <Link
                    to="/products"
                    className="text-primary-600 inline-block mt-2 border-2 border-primary-600 rounded-full px-4 py-2 hover:text-primary-700 font-medium hover:bg-primary-600 hover:text-white transition-colors"
                >
                    ← Back to Products
                </Link>
            </div>
        );
    }

    const time = formatCountdown(countdown);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <Link to="/" className="hover:text-primary-600 transition-colors">
                    Home
                </Link>
                <span>/</span>
                <Link
                    to="/products"
                    className="hover:text-primary-600 transition-colors"
                >
                    Products
                </Link>
                <span>/</span>
                <span className="text-gray-800 font-medium truncate">
                    {product.title}
                </span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Image */}
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full border block border-gray-100 rounded-3xl shadow-sm aspect-square object-cover"
                />

                {/* Info */}
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-2">
                        {product.category}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {product.title}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex">{renderStars(product.rating)}</div>
                        <span className="text-sm text-gray-500">
                            ({product.rating} rating)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="text-3xl font-bold text-gray-900 mb-6">
                        ${product.price.toFixed(2)}
                    </div>

                    {/* Offer Countdown */}
                    {time && (
                        <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 mb-6">
                            <p className="text-sm font-medium text-amber-800 mb-3">
                                🔥 Limited Time Offer — Ends In:
                            </p>
                            <div className="flex gap-3">
                                {[
                                    { value: time.days, label: "Days" },
                                    { value: time.hours, label: "Hours" },
                                    { value: time.minutes, label: "Min" },
                                    { value: time.seconds, label: "Sec" },
                                ].map((unit) => (
                                    <div
                                        key={unit.label}
                                        className="text-center bg-white rounded-xl px-3 py-2 shadow-sm min-w-[60px]"
                                    >
                                        <div className="text-xl font-bold text-gray-900">
                                            {String(unit.value).padStart(2, "0")}
                                        </div>
                                        <div className="text-xs text-gray-500">{unit.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6">
                        {product.description}
                    </p>

                    {/* Stock */}
                    <div className="flex items-center gap-2 mb-6">
                        <div
                            className={`w-2.5 h-2.5 rounded-full ${product.stock > 10
                                ? "bg-emerald-500"
                                : product.stock > 0
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                        />
                        <span className="text-sm text-gray-600">
                            {product.stock > 10
                                ? "In Stock"
                                : product.stock > 0
                                    ? `Only ${product.stock} left`
                                    : "Out of Stock"}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between gap-3 mt-auto">
                        <button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className="flex-1 px-6 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                           🛒 Add to Cart
                        </button>
                        <ButtonWishlist product={product} className="rounded-xl px-6 py-3.5 border border-gray-200"/>
                        <ButtonCompare product={product} showText={true} className="rounded-xl px-4 py-3.5 border border-gray-200 flex-1 sm:flex-initial"/>
                    </div>

                    {/* --- REVIEWS SECTION START --- */}
                    <div className="mt-10 border-t border-gray-100">
                        <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {sortedReviews.length} verified experiences
                            </p>
                        </div>

                        {/* Reviews are sorted newest first */}
                        {sortedReviews.length > 0 ? (
                            <div className="mb-4">
                            <Slider {...settings}>
                                {sortedReviews.map((review) => (
                                    <div 
                                        key={review.id} 
                                        className="bg-gray-50 rounded-xl mt-2 p-6 border border-gray-200 hover:shadow-sm transition-all"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                                                    {review.user.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">{review.user}</p>
                                                    <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex text-amber-500">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed text-sm ">
                                            "{review.comment}"
                                        </p>
                                    </div>
                                ))}
                            </Slider>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                                <p className="text-gray-400">No reviews yet for this product. Be the first to share your thoughts!</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
