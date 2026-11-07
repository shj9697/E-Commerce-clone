import api from "./client";

export async function getCartAPI() {
    try {
        const res = await api.get("/api/cart");
        return {
            status: true,
            data: {
                items: res.data?.data?.items || [],
                totalItems: res.data?.data?.summary?.itemCount || 0,
                totalAmount: res.data?.data?.summary?.subtotal || 0
            }
        };
    } catch (err) {
        return {
            status: false,
            message: err.response?.data?.error?.message || err.message
        };
    }
};

export async function addToCartAPI(productId, quantity) {
    try {
        const res = await api.post("/api/cart/items", { productId, quantity });
        return {
            status: true,
            data: {
                items: res.data.data.items,
                totalItems: res.data.data.summary.itemCount,
                totalAmount: res.data.data.summary.subtotal
            }
        };
    } catch (err) {
        return {
            status: false,
            message: err.response?.data?.error?.message || err.message
        };
    }
};

export async function updateCartItemAPI(productId, quantity) {
    try {
        const res = await api.patch("/api/cart/items", { productId, quantity });
        return {
            status: true,
            data: {
                items: res.data.data.items,
                totalItems: res.data.data.summary.itemCount,
                totalAmount: res.data.data.summary.subtotal
            }
        };
    } catch (err) {
        return {
            status: false,
            message: err.response?.data?.error?.message || err.message
        };
    }
};

export async function productDeleteFromCartAPI(productId) {
    try {
        const res = await api.delete(`/api/cart/items/${productId}`);
        return {
            status: true,
            data: {
                items: res.data.data.items,
                totalItems: res.data.data.summary.itemCount,
                totalAmount: res.data.data.summary.subtotal
            }
        };
    } catch (err) {
        return {
            status: false,
            message: err.response?.data?.error?.message || err.message
        };
    }
};
