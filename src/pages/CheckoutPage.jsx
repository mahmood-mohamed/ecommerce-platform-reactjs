import { useState } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../features/cart/hooks/useCartStore";
import * as Yup from "yup";
import { useFormik } from "formik";

export default function CheckoutPage() {
    const { items, getTotalPrice, clearCart } = useCartStore();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [errMsgs, setErrMsgs] = useState({});

    const totalPrice = getTotalPrice();

    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        country: "",
    };

    function onSubmit(values) {
        validationSchema.validate(values, { abortEarly: false })
            .then(() => {
                clearCart();
                setOrderPlaced(true);
                setErrMsgs({});
            })
            .catch((err) => {
                setErrMsgs(err.inner.reduce((acc, err) => {
                    acc[err.path] = err.message;
                    return acc;
                }, {}));
            });
    }

    const validationSchema = Yup.object({
        firstName: Yup.string().trim().min(3, "First Name must be at least 3 characters").required("First Name is required"),
        lastName: Yup.string().trim().min(3, "Last Name must be at least 3 characters").required("Last Name is required"),
        email: Yup.string().trim().email("Please enter a valid email address").matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address").required("Email is required"),
        phone: Yup.string().trim().matches(/^[\d\s\-\(\)\+]+$/, "Please enter a valid phone number").required("Phone is required"),
        address: Yup.string().trim().min(3, "Address must be at least 3 characters").required("Address is required"),
        city: Yup.string().trim().min(3, "City must be at least 3 characters").required("City is required"),
        zipCode: Yup.string().matches(/^[0-9]{5}$/, "Please enter a valid zip code (5 digits)").required("Zip Code is required"),
        country: Yup.string().required("Country is required"),
    });

    const { values, handleChange, handleSubmit, errors, touched, handleBlur } = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
    });

    if (orderPlaced) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-10 h-10 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Order Placed Successfully!
                </h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Thank you for your purchase. Your order has been confirmed and will be
                    shipped shortly.
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Your cart is empty
                </h2>
                <p className="text-gray-500 mb-6">
                    Add some items to your cart before checking out.
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                <p className="text-gray-500 mt-1">
                    Complete your order by filling in the details below
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipping Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">
                                Shipping Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={values.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.firstName && touched.firstName ? "border-red-500" : ""}`}
                                        placeholder="John"
                                    />
                                    {errors.firstName && touched.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={values.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.lastName && touched.lastName ? "border-red-500" : ""}`}
                                        placeholder="Doe"
                                    />
                                    {errors.lastName && touched.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.email && touched.email ? "border-red-500" : ""}`}
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && touched.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={values.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.phone && touched.phone ? "border-red-500" : ""}`}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                    {errors.phone && touched.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={values.address}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.address && touched.address ? "border-red-500" : ""}`}
                                        placeholder="123 Main Street"
                                    />
                                    {errors.address && touched.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={values.city}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.city && touched.city ? "border-red-500" : ""}`}
                                        placeholder="New York"
                                    />
                                    {errors.city && touched.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        ZIP Code
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={values.zipCode}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.zipCode && touched.zipCode ? "border-red-500" : ""}`}
                                        placeholder="10001"
                                    />
                                    {errors.zipCode && touched.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Country
                                    </label>
                                    <select
                                        name="country"
                                        value={values.country}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white ${errors.country && touched.country ? "border-red-500" : ""}`}
                                    >
                                        <option value="" className="text-gray-400">Select country</option>
                                        <option value="US" className="text-gray-900">United States</option>
                                        <option value="CA" className="text-gray-900">Canada</option>
                                        <option value="UK" className="text-gray-900">United Kingdom</option>
                                        <option value="DE" className="text-gray-900">Germany</option>
                                        <option value="FR" className="text-gray-900">France</option>
                                        <option value="AU" className="text-gray-900">Australia</option>
                                    </select>
                                    {errors.country && touched.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Your Order
                            </h3>
                            <div className="divide-y divide-gray-50">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3 py-3">
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 shrink-0">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-emerald-600">Free</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tax</span>
                                    <span>${(totalPrice * 0.08).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                                    <span>Total</span>
                                    <span>${(totalPrice * 1.08).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`mt-6 w-full py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors ${Object.keys(errors).length > 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
