import api from "./client";

export async function getRelatedProductsAPI(identifier, limit = 10) {
    try {
        const res = await api.get(`/api/products/${identifier}/related?limit=${limit}`);
        return {
            similar: res.data.data.similar,
            youMayAlsoLike: res.data.data.youMayAlsoLike,
        };
    } catch (error) {
        return {
            similar: [],
            youMayAlsoLike: [],
            message: error.response?.data?.error?.message
        };
    }
}

// Navbar suggestions: categories first, then products. Under 2 characters returns []
export async function searchProductsAPI(query) {
    try {
        const res = await api.get(`/api/products/search?q=${encodeURIComponent(query)}`);
        return {
            results: res.data.data
        };
    } catch (error) {
        return {
            results: [],
            message: error.response?.data?.error?.message
        };
    }
};

export async function getProductDetailsAPI(id) {
    try {
        const res = await api.get(`/api/products/${id}`);
        return {
            data: res.data.data
        }
    } catch (error) {
        return {
            data: [],
            message: error.response?.data?.error?.message
        };
    }
}

export async function getPincodeAPI(code) {
    try {
        const res = await api.get(`/api/pincodes/${code}`);
        return {
            data: res.data?.data
        };
    } catch (err) {
        return {
            data: null,
            message: err.response?.data?.error?.message || err.message
        };
    }
}
