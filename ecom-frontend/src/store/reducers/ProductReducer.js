const initialState = {
    products: null,
    categories: null,
    pagination: {},
};

// In ProductReducer.js - Remove the duplicate case and add proper state updates
export const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_PRODUCTS":
            return {
                ...state,
                products: action.payload,
                pagination: {
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
            };

        case "FETCH_CATEGORIES":
            return {
                ...state,
                categories: action.payload,
                pagination: {
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
            };
            
        case "IS_FETCHING":
            return { ...state, loading: true };
            
        case "IS_SUCCESS":
            return { ...state, loading: false, error: null };
            
        default:
            return state;
    }
};