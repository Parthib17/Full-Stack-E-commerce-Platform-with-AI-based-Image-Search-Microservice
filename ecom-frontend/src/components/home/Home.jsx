import { useDispatch, useSelector } from "react-redux";
import HeroBanner from "./HeroBanner";
import { useEffect } from "react";
import { fetchProducts } from "../../store/actions";
import ProductCard from "../shared/ProductCard";
import Loader from "../shared/Loader";
import { FaExclamationTriangle, FaStar, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
    const dispatch = useDispatch();
    const {products} = useSelector((state) => state.products);
    const { isLoading, errorMessage } = useSelector(
        (state) => state.errors
    );
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
            {/* Hero Section */}
            <div className="lg:px-14 sm:px-8 px-4">
                <div className="py-6">
                    <HeroBanner />
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-white/60 backdrop-blur-sm">
                <div className="lg:px-14 sm:px-8 px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaStar className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Premium Quality</h3>
                            <p className="text-slate-600">Handpicked products with guaranteed quality and authenticity</p>
                        </div>
                        <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Fast Shipping</h3>
                            <p className="text-slate-600">Quick delivery to your doorstep with real-time tracking</p>
                        </div>
                        <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">24/7 Support</h3>
                            <p className="text-slate-600">Round-the-clock customer service for all your needs</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Products Section */}
            <div className="py-16 lg:px-14 sm:px-8 px-4">
                <div className="text-center mb-16">
                    <div className="inline-block">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
                            Featured Products
                        </h1>
                        <div className="h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-full mb-4"></div>
                    </div>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Discover our handpicked selection of top-rated items just for you!
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader />
                    </div>
                ) : errorMessage ? (
                    <div className="flex flex-col justify-center items-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl border border-red-200">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <FaExclamationTriangle className="text-red-500 text-3xl"/>
                        </div>
                        <span className="text-red-600 text-lg font-medium text-center">
                            {errorMessage}
                        </span>
                    </div>
                ) : (
                    <>
                        <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-8 mb-12">
                            {products && 
                            products?.slice(0,4)
                                    .map((item, i) => <ProductCard key={i} {...item} />
                            )}
                        </div>
                        
                        {/* View All Products Button */}
                        <div className="text-center">
                            <Link 
                                to="/products"
                                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm relative overflow-hidden group">
                                <span className="relative z-10">View All Products</span>
                                <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            </Link>
                        </div>
                    </>
                )}
            </div>

            {/* Newsletter Section */}
            <div className="py-16 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
                <div className="lg:px-14 sm:px-8 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Stay Updated
                        </h2>
                        <p className="text-gray-300 text-lg mb-8">
                            Subscribe to our newsletter for exclusive deals and new arrivals
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input 
                                type="email" 
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;