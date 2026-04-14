import { Link } from "react-router-dom";
import { useState } from "react";
import useCartStore from "../features/cart/hooks/useCartStore";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const items = useCartStore((s) => s.items);

    const links = [
        { to: "/", label: "Home" },
        { to: "/products", label: "Products" },
        { to: "/wishlist", label: "Wishlist" },
        { to: "/compare", label: "Compare" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="text-xl font-bold bg-linear-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                            ShopHub
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Cart + Mobile Toggle */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/cart"
                            className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {items.length}
                                </span>
                            )}
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-primary-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 space-y-1">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className="block px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-primary-600 hover:bg-primary-50 transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
