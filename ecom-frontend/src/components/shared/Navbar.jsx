// Updated Navbar.jsx - Your existing navbar with image search functionality added

import { Badge } from "@mui/material";
import { useState } from "react";
import { FaShoppingCart, FaSignInAlt, FaStore, FaCamera } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import UserMenu from "../UserMenu";
import ImageSearchModal from "./ImageSearchModal"; 
import ImageSearchResults from "./ImageSearchResults"; 

const Navbar = () => {
    const path = useLocation().pathname;
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
    const [isImageResultsOpen, setIsImageResultsOpen] = useState(false);
    const [imageSearchResults, setImageSearchResults] = useState(null);
    const [searchedImage, setSearchedImage] = useState(null);
    
    const { cart } = useSelector((state) => state.carts);
    const { user } = useSelector((state) => state.auth);

    const handleImageSearchResults = (results, image) => {
        setImageSearchResults(results);
        setSearchedImage(image);
        setIsImageSearchOpen(false);
        setIsImageResultsOpen(true);
    };

    const handleNewImageSearch = () => {
        setIsImageResultsOpen(false);
        setIsImageSearchOpen(true);
        setImageSearchResults(null);
        setSearchedImage(null);
    };

    const closeImageResults = () => {
        setIsImageResultsOpen(false);
        setImageSearchResults(null);
        setSearchedImage(null);
    };
    
    return (
        <>
            <div className="h-[80px] bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white z-50 flex items-center sticky top-0 backdrop-blur-lg shadow-2xl border-b border-purple-500/20">
                <div className="lg:px-14 sm:px-8 px-4 w-full flex justify-between items-center">
                    <Link to="/" className="flex items-center text-2xl font-bold group">
                        <div className="mr-3 p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                            <FaStore className="text-2xl text-white" />
                        </div>
                        <span className="font-[Poppins] bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-3xl font-extrabold">
                            E-Shop
                        </span>
                    </Link>

                    <ul className={`flex sm:gap-8 gap-4 sm:items-center text-slate-800 sm:static absolute left-0 top-[80px] sm:shadow-none shadow-2xl ${
                        navbarOpen ? "h-fit sm:pb-0 pb-8" : "h-0 overflow-hidden"
                    } transition-all duration-300 sm:h-fit sm:bg-none bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white sm:w-fit w-full sm:flex-row flex-col px-6 sm:px-0 backdrop-blur-lg border-b border-purple-500/20`}>
                        
                        <li className="font-[500] transition-all duration-300">
                            <Link className={`${
                                path === "/" ? "text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg shadow-lg" : "text-gray-200 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg"
                            } transition-all duration-300 block`}
                            to="/">
                                Home
                            </Link> 
                        </li>

                        <li className="font-[500] transition-all duration-300">
                            <Link className={`${
                                path === "/products" ? "text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg shadow-lg" : "text-gray-200 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg"
                            } transition-all duration-300 block`}
                            to="/products">
                                Products
                            </Link> 
                        </li>

                        <li className="font-[500] transition-all duration-300">
                            <Link className={`${
                                path === "/about" ? "text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg shadow-lg" : "text-gray-200 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg"
                            } transition-all duration-300 block`}
                            to="/about">
                                About
                            </Link> 
                        </li>

                        <li className="font-[500] transition-all duration-300">
                            <Link className={`${
                                path === "/contact" ? "text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg shadow-lg" : "text-gray-200 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg"
                            } transition-all duration-300 block`}
                            to="/contact">
                                Contact
                            </Link> 
                        </li>

                        {/* Image Search Button */}
                        <li className="font-[500] transition-all duration-300">
                            <button
                                onClick={() => setIsImageSearchOpen(true)}
                                className="flex items-center space-x-2 px-4 py-2 
                                    bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 
                                    text-white font-semibold rounded-lg shadow-lg 
                                    hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 
                                    transition-all duration-300 ease-in-out transform 
                                    hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/50
                                    border border-white/20 backdrop-blur-sm
                                    relative overflow-hidden
                                    before:absolute before:inset-0 before:bg-gradient-to-r 
                                    before:from-white/20 before:via-transparent before:to-white/20 
                                    before:transform before:-skew-x-12 before:-translate-x-full 
                                    hover:before:translate-x-full before:transition-transform 
                                    before:duration-700"
                                title="Search by Image"
                            >
                                <FaCamera size={16} />
                                <span className="sm:inline hidden">Search by Image</span>
                                <span className="sm:hidden inline">Image</span>
                            </button>
                        </li>

                        <li className="font-[500] transition-all duration-300">
                            <Link className={`${
                                path === "/cart" ? "text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg shadow-lg" : "text-gray-200 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg"
                            } transition-all duration-300 block flex items-center justify-center`}
                            to="/cart">
                                <Badge
                                    showZero
                                    badgeContent={cart?.length || 0}
                                    color="primary"
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            backgroundColor: '#ec4899',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '0.7rem',
                                            minWidth: '20px',
                                            height: '20px',
                                            borderRadius: '10px',
                                            border: '2px solid white',
                                            boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)'
                                        }
                                    }}>
                                    <FaShoppingCart size={25} />
                                </Badge>
                            </Link> 
                        </li>

                        {(user && user.id) ? (
                            <li className="font-[500] transition-all duration-300">
                                <UserMenu />
                            </li>
                        ) : (
                            <li className="font-[500] transition-all duration-300">
                                <Link className="flex items-center space-x-2 px-6 py-3 
                                    bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 
                                    text-white font-semibold rounded-xl shadow-lg 
                                    hover:from-purple-500 hover:via-pink-500 hover:to-red-500 
                                    transition-all duration-300 ease-in-out transform 
                                    hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50
                                    border border-white/20 backdrop-blur-sm
                                    relative overflow-hidden
                                    before:absolute before:inset-0 before:bg-gradient-to-r 
                                    before:from-white/20 before:via-transparent before:to-white/20 
                                    before:transform before:-skew-x-12 before:-translate-x-full 
                                    hover:before:translate-x-full before:transition-transform 
                                    before:duration-700"
                                to="/login">
                                    <FaSignInAlt />
                                    <span>Login</span>
                                </Link> 
                            </li>
                        )}
                    </ul>

                    <button
                        onClick={() => setNavbarOpen(!navbarOpen)}
                        className="sm:hidden flex items-center sm:mt-0 mt-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20">
                        {navbarOpen ? (
                            <RxCross2 className="text-white text-3xl transform rotate-0 hover:rotate-90 transition-transform duration-300" />
                        ) : (
                            <IoIosMenu className="text-white text-3xl hover:scale-110 transition-transform duration-300" />
                        )}
                    </button>
                </div>
            </div>

            {/* Image Search Modal */}
            <ImageSearchModal
                isOpen={isImageSearchOpen}
                onClose={() => setIsImageSearchOpen(false)}
                onSearchResults={handleImageSearchResults}
            />

            {/* Image Search Results Modal */}
            <ImageSearchResults
                isOpen={isImageResultsOpen}
                onClose={closeImageResults}
                searchResults={imageSearchResults}
                searchImage={searchedImage}
                onNewSearch={handleNewImageSearch}
                products={[]} // You can populate this with actual product search results
            />
        </>
    )
}

export default Navbar;