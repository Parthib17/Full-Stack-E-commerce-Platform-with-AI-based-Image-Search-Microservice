// Updated Products.jsx

import { FaExclamationTriangle, FaSearch, FaFilter, FaTags } from "react-icons/fa";
import ProductCard from "../shared/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCategories } from "../../store/actions";
import Filter from "./Filter";
import useProductFilter from "../../hooks/useProductFilter";
import Loader from "../shared/Loader";
import Paginations from "../shared/Paginations";
import { useSearchParams } from "react-router-dom";

const Products = () => {
    const { isLoading, errorMessage } = useSelector((state) => state.errors);
    const { products, categories, pagination } = useSelector((state) => state.products);
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    
    // Get current search state
    const currentKeyword = searchParams.get("keyword") || "";
    const currentCategory = searchParams.get("category") || "all";
    const [headerSearchTerm, setHeaderSearchTerm] = useState(currentKeyword);
    
    useProductFilter();

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Update header search term when URL params change
    useEffect(() => {
        setHeaderSearchTerm(currentKeyword);
    }, [currentKeyword]);

    // Handle header search
    const handleHeaderSearch = (e) => {
        if (e.key === 'Enter') {
            const searchValue = headerSearchTerm.trim();
            const newParams = new URLSearchParams(searchParams);
            
            if (searchValue) {
                newParams.set("keyword", searchValue);
            } else {
                newParams.delete("keyword");
            }
            newParams.delete("page"); // Reset to first page
            
            window.location.href = `${window.location.pathname}?${newParams.toString()}`;
        }
    };

    const getSearchResultsText = () => {
        if (currentKeyword) {
            return `Search results for "${currentKeyword}"`;
        }
        if (currentCategory && currentCategory !== "all") {
            return `Products in "${currentCategory}"`;
        }
        return "Product Collection";
    };

    const getResultsSubText = () => {
        const totalCount = pagination?.totalElements || 0;
        if (currentKeyword) {
            return `Found ${totalCount} products matching your search`;
        }
        if (currentCategory && currentCategory !== "all") {
            return `Found ${totalCount} products in this category`;
        }
        return `Showing ${totalCount} products`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 py-16">
                <div className="lg:px-14 sm:px-8 px-4">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Our Products
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                            Discover amazing products from our curated collection
                        </p>
                        
                        {/* Header Search Bar */}
                        <div className="flex justify-center">
                            <div className="relative max-w-md w-full">
                                {/* <input 
                                    type="text"
                                    placeholder="Search products..."
                                    value={headerSearchTerm}
                                    onChange={(e) => setHeaderSearchTerm(e.target.value)}
                                    onKeyDown={handleHeaderSearch}
                                    className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 pl-12"
                                /> */}
                                {/* <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300" /> */}
                            </div>
                        </div>
                        
                        {/* Search/Category Indicator */}
                        {(currentKeyword || (currentCategory && currentCategory !== "all")) && (
                            <div className="mt-4 flex justify-center">
                                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                    {currentKeyword && (
                                        <div className="flex items-center text-white text-sm">
                                            <FaSearch className="mr-2" size={12} />
                                            Searching: "{currentKeyword}"
                                        </div>
                                    )}
                                    {!currentKeyword && currentCategory && currentCategory !== "all" && (
                                        <div className="flex items-center text-white text-sm">
                                            <FaTags className="mr-2" size={12} />
                                            Category: {currentCategory}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:px-14 sm:px-8 px-4 py-8 2xl:w-[90%] 2xl:mx-auto">
                {/* Filter Section */}
                <div className="mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-6">
                        <div className="flex items-center mb-4">
                            <FaFilter className="text-purple-600 mr-3" />
                            <h2 className="text-xl font-semibold text-slate-800">Filter Products</h2>
                        </div>
                        <Filter categories={categories || []}/>
                    </div>
                </div>

                {/* Results Section */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                            <Loader />
                        </div>
                    </div>
                ) : errorMessage ? (
                    <div className="flex flex-col justify-center items-center py-20">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-red-200 text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaExclamationTriangle className="text-red-500 text-3xl"/>
                            </div>
                            <h3 className="text-xl font-semibold text-red-600 mb-2">Oops! Something went wrong</h3>
                            <span className="text-red-600 text-lg font-medium">
                                {errorMessage}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="min-h-[700px]">
                        {/* Products Header */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800 mb-2">
                                        {getSearchResultsText()}
                                    </h2>
                                    <p className="text-slate-600">
                                        {getResultsSubText()}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                                    <div className="text-sm text-slate-600">
                                        Sort by:
                                    </div>
                                    <div className="px-4 py-2 bg-white/80 border border-purple-200 rounded-lg text-sm text-slate-700">
                                        Price: {searchParams.get("sortby") === "desc" ? "High to Low" : "Low to High"}
                                    </div>
                                </div>
                            </div>
                            <div className="h-px bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200"></div>
                        </div>

                        {/* Products Grid */}
                        <div className="pb-6 pt-6 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-8">
                           {products && products.length > 0 ? (
                               products.map((item, i) => (
                                   <div key={`${item.productId}-${i}`} className="transform hover:scale-105 transition-transform duration-300">
                                       <ProductCard {...item} />
                                   </div>
                               ))
                           ) : (
                               <div className="col-span-full flex flex-col items-center justify-center py-20">
                                   <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
                                       <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                           <FaSearch className="text-gray-400 text-3xl"/>
                                       </div>
                                       <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                           {currentKeyword ? "No products found for your search" : "No products found"}
                                       </h3>
                                       <p className="text-gray-500 mb-4">
                                           {currentKeyword 
                                               ? `Try searching for "${currentKeyword}" with different keywords or check your spelling`
                                               : "Try adjusting your filters or search terms"
                                           }
                                       </p>
                                       {currentKeyword && (
                                           <button 
                                               onClick={() => window.location.href = window.location.pathname}
                                               className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                                           >
                                               View All Products
                                           </button>
                                       )}
                                   </div>
                               </div>
                           )}
                        </div>

                        {/* Pagination */}
                        {products && products.length > 0 && (
                            <div className="flex justify-center pt-12">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
                                    <Paginations 
                                        numberOfPage={pagination?.totalPages}
                                        totalProducts={pagination?.totalElements}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom CTA Section */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-16 mt-16">
                <div className="lg:px-14 sm:px-8 px-4">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Can't find what you're looking for?
                        </h2>
                        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                            Get in touch with our team and we'll help you find the perfect product for your needs
                        </p>
                        <button className="inline-flex items-center space-x-3 bg-white text-purple-600 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                            <span>Contact Us</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;