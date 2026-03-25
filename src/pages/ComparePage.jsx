import { useState, useEffect } from "react";
import { getProducts } from "../features/products/services/productService";
import useCompareStore from "../features/compare/hooks/useCompareStore";

export default function ComparePage() {
    const [products, setProducts] = useState([]);
    const { items, addToCompare, removeFromCompare, clearCompare } = useCompareStore();
    
    // Get the two products from the store items
    const productA = items[0]?.product;
    const productB = items[1]?.product;

    useEffect(() => {
        async function load() {
            const allProducts = await getProducts();
            setProducts(allProducts);
        }
        load();
    }, []);

    const handleSelectProduct = (productId, slot) => {
        if (!productId) {
            if (slot === 'A' && productA) removeFromCompare(productA.id);
            if (slot === 'B' && productB) removeFromCompare(productB.id);
            return;
        }

        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
            addToCompare(product);
        }
    };

    const comparisonFields = [
        { 
            label: "Price", 
            key: "price", 
            format: (v) => `$${v?.toFixed(2) || "—"}`,
            isBetter: (valA, valB) => valA < valB // Lower price is better
        },
        { label: "Category", key: "category", format: (v) => v || "—" },
        { 
            label: "Rating", 
            key: "rating", 
            format: (v) => (v ? `${v} / 5` : "—"),
            isBetter: (valA, valB) => valA > valB // Higher rating is better
        },
        { 
            label: "Stock", 
            key: "stock", 
            format: (v) => (v != null ? `${v} units` : "—"),
            isBetter: (valA, valB) => valA > valB // More stock is better
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Compare Products</h1>
                    <p className="text-gray-500 mt-1">
                        Select two products to compare them side by side
                    </p>
                </div>
                {items.length > 0 && (
                    <button 
                        onClick={clearCompare}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Product Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product A
                    </label>
                    <select
                        value={productA?.id || ""}
                        onChange={(e) => handleSelectProduct(e.target.value, 'A')}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                        <option value="">Select a product...</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product B
                    </label>
                    <select
                        value={productB?.id || ""}
                        onChange={(e) => handleSelectProduct(e.target.value, 'B')}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                        <option value="">Select a product...</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Comparison Table */}
            {productA || productB ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="p-4 bg-gray-50 font-semibold text-sm text-gray-500 w-1/4">
                                    Feature
                                </th>
                                <th className="p-4 text-center border-l border-gray-100 w-3/8">
                                    {productA ? (
                                        <div className="relative group">
                                            <button 
                                                onClick={() => removeFromCompare(productA.id)}
                                                className="absolute -top-2 -right-2 bg-white shadow-md rounded-full p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                            <img
                                                src={productA.thumbnail}
                                                alt={productA.title}
                                                className="w-24 h-24 object-cover rounded-xl mx-auto mb-3 shadow-sm"
                                            />
                                            <p className="text-sm font-bold text-gray-900 line-clamp-2 px-2">
                                                {productA.title}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="py-8 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-100">
                                            <p className="text-sm text-gray-400">Select Product A</p>
                                        </div>
                                    )}
                                </th>
                                <th className="p-4 text-center border-l border-gray-100 w-3/8">
                                    {productB ? (
                                        <div className="relative group">
                                            <button 
                                                onClick={() => removeFromCompare(productB.id)}
                                                className="absolute -top-2 -right-2 bg-white shadow-md rounded-full p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                            <img
                                                src={productB.thumbnail}
                                                alt={productB.title}
                                                className="w-24 h-24 object-cover rounded-xl mx-auto mb-3 shadow-sm"
                                            />
                                            <p className="text-sm font-bold text-gray-900 line-clamp-2 px-2">
                                                {productB.title}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="py-8 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-100">
                                            <p className="text-sm text-gray-400">Select Product B</p>
                                        </div>
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonFields.map((field) => {
                                const valA = productA?.[field.key];
                                const valB = productB?.[field.key];
                                const isABetter = productA && productB && field.isBetter?.(valA, valB);
                                const isBBetter = productA && productB && field.isBetter?.(valB, valA);

                                return (
                                    <tr key={field.key} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors">
                                        <td className="p-4 bg-gray-50/50 text-sm font-medium text-gray-600">
                                            {field.label}
                                        </td>
                                        <td className={`p-4 text-center text-sm border-l border-gray-100 ${isABetter ? 'text-green-600 font-bold bg-green-50/50' : 'text-gray-800'}`}>
                                            {productA ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    {isABetter && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                                                    {field.format(valA)}
                                                </div>
                                            ) : "—"}
                                        </td>
                                        <td className={`p-4 text-center text-sm border-l border-gray-100 ${isBBetter ? 'text-green-600 font-bold bg-green-50/50' : 'text-gray-800'}`}>
                                            {productB ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    {isBBetter && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                                                    {field.format(valB)}
                                                </div>
                                            ) : "—"}
                                        </td>
                                    </tr>
                                );
                            })}
                            <tr className="border-t border-gray-100">
                                <td className="p-4 bg-gray-50/50 text-sm font-medium text-gray-600">
                                    Description
                                </td>
                                <td className="p-4 text-sm text-gray-600 border-l border-gray-100 leading-relaxed text-center sm:text-left">
                                    <p className="line-clamp-4 hover:line-clamp-none cursor-default transition-all duration-300">
                                        {productA?.description || "—"}
                                    </p>
                                </td>
                                <td className="p-4 text-sm text-gray-600 border-l border-gray-100 leading-relaxed text-center sm:text-left">
                                    <p className="line-clamp-4 hover:line-clamp-none cursor-default transition-all duration-300">
                                        {productB?.description || "—"}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                    <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-10 h-10 text-purple-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Select Products to Compare
                    </h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                        Choose two products from the dropdowns above or from the product cards to see a detailed
                        side-by-side comparison.
                    </p>
                </div>
            )}
        </div>
    );
}

