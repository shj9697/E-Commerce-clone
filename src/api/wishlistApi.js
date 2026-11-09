import api from "./client";

export async function getWishlistAPI() { //only reads the wishlist
    try {
        const res = await api.get("/api/wishlist");
        return {
            status: true,
            data: {
                productData: res.data.data,
                total: res.data.total
            }
        };
    } catch (error) {
        return {
            status: false,
            message: error.response?.data?.error?.message
        };
    }
};

export async function addToWishlistAPI(productId) {
    try {
        const res = await api.post("/api/wishlist", { productId });
        return {
            status: true,
            data: {
                productData: res.data.data,
                total: res.data.total
            }
        };
    } catch (error) {
        return {
            status: false,
            message: error.response?.data?.error?.message
        };
    }
};

export async function removeFromWishlistAPI(productId) {
    try {
        const res = await api.delete(`/api/wishlist/${productId}`);
        return {
            status: true,
            data: {
                productData: res.data.data,
                total: res.data.total
            }
        };
    } catch (error) {
        return {
            status: false,
            message: error.response?.data?.error?.message
        };
    }
};
