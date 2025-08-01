// Updated Filter.jsx

import { Button, FormControl, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { FiArrowDown, FiArrowUp, FiRefreshCw, FiSearch, FiX } from "react-icons/fi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Filter = ({ categories }) => {
    const [searchParams] = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const pathname = useLocation().pathname;
    const navigate = useNavigate();
    
    const [category, setCategory] = useState("all");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const currentCategory = searchParams.get("category") || "all";
        const currentSortOrder = searchParams.get("sortby") || "asc";
        const currentSearchTerm = searchParams.get("keyword") || "";

        setCategory(currentCategory);
        setSortOrder(currentSortOrder);
        setSearchTerm(currentSearchTerm);
    }, [searchParams]);

    // Debounced search effect
    useEffect(() => { 
        const handler = setTimeout(() => {
            const newParams = new URLSearchParams(searchParams);
            
            if (searchTerm && searchTerm.trim() !== "") {
                newParams.set("keyword", searchTerm.trim());
                // Reset to first page when searching
                newParams.delete("page");
            } else {
                newParams.delete("keyword");
            }
            
            navigate(`${pathname}?${newParams.toString()}`);
        }, 700);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, navigate, pathname, searchParams]);

     const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        if (selectedCategory === "all") {
            navigate(pathname); // Reset to base products page
        } else {
            navigate(`${pathname}?category=${selectedCategory}`);
        }
    };

    const handleHeaderSearch = (e) => {
        if (e.key === 'Enter') {
            const searchValue = headerSearchTerm.trim();
            if (searchValue) {
                navigate(`${pathname}?keyword=${encodeURIComponent(searchValue)}`);
            } else {
                navigate(pathname);
            }
        }
    };

    const toggleSortOrder = () => {
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        const newParams = new URLSearchParams(searchParams);
        
        newParams.set("sortby", newOrder);
        // Reset to first page when changing sort
        newParams.delete("page");
        
        navigate(`${pathname}?${newParams.toString()}`);
        setSortOrder(newOrder);
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setCategory("all");
        setSortOrder("asc");
        navigate(pathname);
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    const hasActiveFilters = searchTerm || category !== "all" || sortOrder !== "asc";

    return (
        <div className="flex lg:flex-row flex-col-reverse lg:justify-between justify-center items-center gap-4">
            {/* SEARCH BAR */}
            <div className="relative flex items-center 2xl:w-[450px] sm:w-[420px] w-full">
                <input 
                    type="text"
                    placeholder="Search products by keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-400 text-slate-800 rounded-md py-2 pl-10 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-[#1976d2] transition-all duration-200"
                />
                <FiSearch className="absolute left-3 text-slate-800" size={20} />
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 text-slate-500 hover:text-slate-700 transition-colors duration-200"
                    >
                        <FiX size={20} />
                    </button>
                )}
            </div>

            {/* FILTERS & ACTIONS */}
            <div className="flex sm:flex-row flex-col gap-4 items-center">
                {/* CATEGORY SELECTION */}
                <FormControl
                    className="text-slate-800 border-slate-700"
                    variant="outlined"
                    size="small"
                >
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        value={category}
                        onChange={handleCategoryChange}
                        label="Category"
                        className="min-w-[120px] text-slate-800 border-slate-700"
                    >
                        <MenuItem value="all">All Categories</MenuItem>
                        {categories && categories.length > 0 && categories.map((item) => (
                            <MenuItem key={item.categoryId} value={item.categoryName}>
                                {item.categoryName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* SORT BUTTON */}
                <Tooltip title={`Sorted by price: ${sortOrder === "asc" ? "Low to High" : "High to Low"}`}>
                    <Button 
                        variant="contained" 
                        onClick={toggleSortOrder}
                        color="primary" 
                        className="flex items-center gap-2 h-10 normal-case"
                    >
                        Price
                        {sortOrder === "asc" ? (
                            <FiArrowUp size={16} />
                        ) : (
                            <FiArrowDown size={16} />
                        )}
                    </Button>
                </Tooltip>

                {/* CLEAR FILTERS */}
                {hasActiveFilters && (
                    <button 
                        className="flex items-center gap-2 bg-rose-900 hover:bg-rose-800 text-white px-3 py-2 rounded-md transition duration-300 ease-in shadow-md focus:outline-none transform hover:scale-105"
                        onClick={handleClearFilters}
                    >
                        <FiRefreshCw className="font-semibold" size={16}/>
                        <span className="font-semibold">Clear All</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default Filter;