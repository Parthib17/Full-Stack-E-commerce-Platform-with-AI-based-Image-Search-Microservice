// Updated useProductFilter.js

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, searchProductsByKeyword, fetchProductsByCategory } from "../store/actions";

const useProductFilter = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { categories } = useSelector(state => state.products);

    useEffect(() => {
        const params = new URLSearchParams();

        const currentPage = searchParams.get("page")
            ? Number(searchParams.get("page"))
            : 1;

        params.set("pageNumber", currentPage - 1);

        const sortOrder = searchParams.get("sortby") || "asc";
        const categoryParams = searchParams.get("category") || null;
        const keyword = searchParams.get("keyword") || null;
        
        params.set("pageSize", "10");
        params.set("sortBy", "price");
        params.set("sortOrder", sortOrder);

        // Create query string without category and keyword for API calls
        const baseQueryString = params.toString();

        // Priority: keyword search > category search > general search
        if (keyword && keyword.trim() !== "") {
            // Search by keyword
            console.log("Searching by keyword:", keyword);
            dispatch(searchProductsByKeyword(keyword.trim(), baseQueryString));
        } else if (categoryParams && categoryParams !== "all" && categories) {
            // Find category ID by name
            const selectedCategory = categories.find(cat => cat.categoryName === categoryParams);
            if (selectedCategory) {
                console.log("Searching by category ID:", selectedCategory.categoryId);
                dispatch(fetchProductsByCategory(selectedCategory.categoryId, baseQueryString));
            } else {
                // Fallback to general products if category not found
                console.log("Category not found, fetching all products");
                dispatch(fetchProducts(baseQueryString));
            }
        } else {
            // General product fetch
            console.log("Fetching all products");
            dispatch(fetchProducts(baseQueryString));
        }

    }, [dispatch, searchParams, categories]);
};

export default useProductFilter;