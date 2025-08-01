// ImageSearchResults.jsx
import { useState } from 'react';
import { FiX, FiImage, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { FaCamera } from 'react-icons/fa';
import ProductCard from '../shared/ProductCard';

const ImageSearchResults = ({ 
    isOpen, 
    onClose, 
    searchResults, 
    searchImage, 
    onNewSearch,
    products = [] // This will come from your product search based on the analysis results
}) => {
    const [showFullResults, setShowFullResults] = useState(false);

    if (!isOpen) return null;

    const handleSearchByCategory = () => {
        // Extract category from search results and trigger product search
        if (searchResults?.category) {
            const categoryName = capitalizeFirstLetter(searchResults.category.trim());
            
            if (categoryName) {
                // Navigate to products page with category filter
                window.location.href = `/products?category=${encodeURIComponent(categoryName)}`;
            }
        }
    };

    // Helper function to capitalize first letter
    const capitalizeFirstLetter = (str) => {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FaCamera className="text-2xl" />
                            <h2 className="text-xl font-bold">Image Search Results</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors duration-200 p-1"
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
                    {/* Left Side - Image and Analysis */}
                    <div className="lg:w-1/3 p-6 border-r border-gray-200">
                        <div className="space-y-4">
                            {/* Uploaded Image */}
                            {searchImage && (
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                                        <FiImage className="mr-2" />
                                        Your Image
                                    </h3>
                                    <img 
                                        src={URL.createObjectURL(searchImage)} 
                                        alt="Search" 
                                        className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                                    />
                                </div>
                            )}

                            {/* Analysis Results */}
                            {searchResults && (
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Analysis Results
                                    </h3>
                                    
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        {/* Detected Category */}
                                        {searchResults.category && (
                                            <div>
                                                <h4 className="font-medium text-gray-700 text-sm mb-2">Detected Category:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="bg-purple-100 text-purple-800 px-3 py-2 rounded-full text-sm font-medium">
                                                        {capitalizeFirstLetter(searchResults.category)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Additional Info if available */}
                                        {searchResults.confidence && (
                                            <div>
                                                <h4 className="font-medium text-gray-700 text-sm mb-2">Confidence:</h4>
                                                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs inline-block">
                                                    {Math.round(searchResults.confidence * 100)}%
                                                </div>
                                            </div>
                                        )}

                                        {/* Show raw response for debugging */}
                                        <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                                            <details>
                                                <summary className="cursor-pointer">Raw API Response</summary>
                                                <pre className="mt-2 whitespace-pre-wrap">
                                                    {JSON.stringify(searchResults, null, 2)}
                                                </pre>
                                            </details>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2 mt-4">
                                        <button
                                            onClick={handleSearchByCategory}
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2"
                                        >
                                            <FiSearch size={16} />
                                            <span>Browse Category</span>
                                        </button>
                                        
                                        <button
                                            onClick={onNewSearch}
                                            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 flex items-center justify-center space-x-2"
                                        >
                                            <FiRefreshCw size={16} />
                                            <span>New Search</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Product Results */}
                    <div className="lg:w-2/3 p-6 overflow-y-auto">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Category Products
                            </h3>
                            <p className="text-gray-600">
                                {searchResults?.category 
                                    ? `Click "Browse Category" to explore ${capitalizeFirstLetter(searchResults.category)} products`
                                    : 'Use "Browse Category" to find items in the detected category'
                                }
                            </p>
                        </div>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {products.map((product, index) => (
                                    <div key={product.productId || index} className="transform hover:scale-105 transition-transform duration-300">
                                        <ProductCard {...product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <FiSearch className="text-gray-400 text-2xl" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-600 mb-2">
                                    Ready to Browse {searchResults?.category ? capitalizeFirstLetter(searchResults.category) : 'Category'}
                                </h4>
                                <p className="text-gray-500 max-w-sm">
                                    {searchResults?.category 
                                        ? `We detected "${capitalizeFirstLetter(searchResults.category)}" in your image. Click "Browse Category" to explore this category.`
                                        : 'Click "Browse Category" to explore products in the detected category'
                                    }
                                </p>
                                {searchResults?.category && (
                                    <button 
                                        onClick={handleSearchByCategory}
                                        className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                                    >
                                        Browse {capitalizeFirstLetter(searchResults.category)}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageSearchResults;