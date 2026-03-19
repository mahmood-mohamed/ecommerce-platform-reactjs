import { useState, useEffect } from "react";
import { getProducts, getCategories, filterProducts } from "../features/products/services/productService";
import ProductCard from "../features/products/components/ProductCard";
import { useSearchParams } from "react-router-dom";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState(() => searchParams.get("search") || "");
    const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get("category") || "");
    const [sortBy, setSortBy] = useState(() => searchParams.get("sortBy") || "title");
    const [sortOrder, setSortOrder] = useState(() => searchParams.get("sortOrder") || "asc");
    const [currentPage, setCurrentPage] = useState(() => Number(searchParams.get("page")) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [totalProducts, setTotalProducts] = useState(0);

    // Sync URL to state when searchParams change (handles back/forward navigation)
    useEffect(() => {
        const urlSearch = searchParams.get("search") || "";
        const urlCategory = searchParams.get("category") || "";
        const urlSortBy = searchParams.get("sortBy") || "title";
        const urlSortOrder = searchParams.get("sortOrder") || "asc";
        const urlPage = Number(searchParams.get("page")) || 1;

        setSearch(prev => prev !== urlSearch ? urlSearch : prev);
        setSelectedCategory(prev => prev !== urlCategory ? urlCategory : prev);
        setSortBy(prev => prev !== urlSortBy ? urlSortBy : prev);
        setSortOrder(prev => prev !== urlSortOrder ? urlSortOrder : prev);
        setCurrentPage(prev => prev !== urlPage ? urlPage : prev);
    }, [searchParams]);

    // Sync state to URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (selectedCategory) params.set("category", selectedCategory);
        if (sortBy !== "title") params.set("sortBy", sortBy);
        if (sortOrder !== "asc") params.set("sortOrder", sortOrder);
        if (currentPage !== 1) params.set("page", currentPage.toString());

        setSearchParams(params);
    }, [search, selectedCategory, sortBy, sortOrder, currentPage, setSearchParams]);

    useEffect(() => {
        async function loadProducts() {
            setLoading(true);
            await filterProducts({
                search,
                category: selectedCategory,
                minPrice,
                maxPrice,
                sortBy,
                sortOrder,
                page: currentPage,
                limit: 8,
            }).then((result) => {
                setProducts(result.data);
                setTotalProducts(result.total);
                setCurrentPage(result.page);
                setTotalPages(result.totalPages);
            }).catch((err) => console.error(err));

            const cats = await getCategories();
            setCategories(cats);
            setLoading(false);
        }
        loadProducts();
    }, [search, selectedCategory, sortBy, sortOrder, currentPage, minPrice, maxPrice]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
                <p className="text-gray-500">
                    Browse our collection of {totalProducts} premium products
                </p>
            </div>

            {/* Filters Bar */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-8">

                {/* Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">

                    {/* Search */}
                    <div className="md:col-span-2">
                        <div className="relative">
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>

                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200
                                bg-gray-50 focus:bg-white
                                focus:ring-2 focus:ring-primary-500
                                focus:border-transparent
                                transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                            bg-gray-50 focus:bg-white
                            focus:ring-2 focus:ring-primary-500
                            focus:border-transparent
                            transition-all text-sm"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* Sort */}
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [by, order] = e.target.value.split("-");
                            setSortBy(by);
                            setSortOrder(order);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                            bg-gray-50 focus:bg-white
                            focus:ring-2 focus:ring-primary-500
                            focus:border-transparent
                            transition-all text-sm"
                    >
                        <option value="title-asc">Name: A → Z</option>
                        <option value="title-desc">Name: Z → A</option>
                        <option value="price-asc">Price: Low → High</option>
                        <option value="price-desc">Price: High → Low</option>
                        <option value="rating-desc">Rating: Best First</option>
                    </select>
                </div>

                {/* Bottom Row */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">

                    {/* Price Range */}
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price Range:
                        </label>

                        <div className="space-y-2">

                            {/* Values */}
                            <div className="flex justify-between text-sm font-medium text-gray-600">
                                <span>$ {minPrice}</span>
                                <span>$ {maxPrice}</span>
                            </div>

                            {/* Sliders */}
                            <div className="relative flex items-center">

                                {/* Background Track */}
                                <div className="absolute w-full h-2 bg-gray-200 rounded-full" />

                                {/* Active Range */}
                                <div
                                    className="absolute h-2 bg-primary-600 rounded-full"
                                    style={{
                                        left: `${(minPrice / 1000) * 100}%`,
                                        right: `${100 - (maxPrice / 1000) * 100}%`,
                                    }}
                                />

                                {/* Min Slider */}
                                <input
                                    type="range"
                                    min={0}
                                    max={1000}
                                    step={25}
                                    value={minPrice}
                                    onChange={(e) => {
                                        const value = Math.min(Number(e.target.value), maxPrice - 25);
                                        setMinPrice(value);
                                    }}
                                    className="absolute z-10 w-full pointer-events-none appearance-none bg-transparent 
                                        [&::-webkit-slider-thumb]:pointer-events-auto
                                        [&::-webkit-slider-thumb]:h-7
                                        [&::-webkit-slider-thumb]:w-7
                                        [&::-webkit-slider-thumb]:rounded-full
                                        [&::-webkit-slider-thumb]:bg-primary-600
                                        [&::-webkit-slider-thumb]:cursor-pointer"
                                />

                                {/* Max Slider */}
                                <input
                                    type="range"
                                    min={0}
                                    max={1000}
                                    step={25}
                                    value={maxPrice}
                                    onChange={(e) => {
                                        const value = Math.max(Number(e.target.value), minPrice + 25);
                                        setMaxPrice(value);
                                    }}
                                    className="absolute z-10 w-full pointer-events-none appearance-none bg-transparent 
                                        [&::-webkit-slider-thumb]:pointer-events-auto
                                        [&::-webkit-slider-thumb]:h-7
                                        [&::-webkit-slider-thumb]:w-7
                                        [&::-webkit-slider-thumb]:rounded-full
                                        [&::-webkit-slider-thumb]:bg-primary-600
                                        [&::-webkit-slider-thumb]:cursor-pointer"
                                />

                            </div>
                        </div>
                    </div>

                    {/* Reset */}
                    <button
                        type="button"
                        disabled={!search && !selectedCategory && sortBy === "title" && sortOrder === "asc" && minPrice === 0 && maxPrice === 1000}
                        onClick={() => {
                            setSearch("");
                            setSelectedCategory("");
                            setSortBy("title");
                            setSortOrder("asc");
                            setMinPrice(0);
                            setMaxPrice(1000);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-gray-900 text-white cursor-pointer
                            hover:bg-gray-800 transition-all text-sm 
                            disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        Reset
                    </button>

                </div>
            </div>

            {/* Loading Spinner */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
                    <p className="text-gray-500 text-sm">Loading products...</p>
                </div>
            ) : (
                <>
                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Empty State */}
                    {products.length === 0 && (
                        <div className="text-center py-16">
                            <svg
                                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                />
                            </svg>
                            <p className="text-gray-500 text-lg">No products found</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                (pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                            ? "bg-primary-600 text-white"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            )}
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                                }
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
