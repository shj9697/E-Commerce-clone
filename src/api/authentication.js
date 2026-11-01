import api from "./client";

export async function getAuthenticationAPI(email, password, name) {
    try {
        const res = await api.post("/api/auth/register", { email, password, name });
        return {
            status: true,
            data: {
                email: res.data?.data?.user?.email,
                password: res.data?.data?.user?.hasPassword,
                name: res.data?.data?.user?.name
            }
        };
    } catch (error) {
        return { status: false, message: error.response?.data?.error?.message };
    }
}

export async function loginAPI(email, password) {
    try {
        const res = await api.post("/api/auth/login", { email, password });
        return {
            status: true,
            data: res.data?.data?.user
        };
    } catch (error) {
        return {
            status: false,
            message: error.response?.data?.error?.message
        };
    }
}

// credential is the ID token Google's sign-in button hands back
export async function googleLoginAPI(credential) {
    try {
        const res = await api.post("/api/auth/google", { credential });
        return {
            status: true,
            data: res.data?.data?.user
        };
    } catch (error) {
        return {
            status: false,
            message: error.response?.data?.error?.message
        };
    }
}

// The tokens are httpOnly cookies, so JavaScript can't delete them; the server clears them
export async function logoutAPI() {
    try {
        const res = await api.post("/api/auth/logout");
        return {
            status: true,
            data: res.data?.data?.user
        };
    } catch (error) {
        return {
            status: false,
            message: error.response?.data?.error?.message || error.message
        };
    }
}

// authentication.js

// loginAPI()
//      ↓
// login backend

// refreshTokenAPI()
//      ↓
// refresh backend

// meAPI()
//      ↓
// current-user backend

export async function meAPI() { // Asks the server who is logged in (using the login cookie).
    // Returns the user's details, or null if nobody is logged in.
    try {
        const res = await api.get("/api/auth/me");
        return res.data.data;
    } catch (error) {
        // 401 means nobody is signed in; anything else is a failure, not a sign-out
        if (error.response?.status === 401) return null;
        throw new Error("Could not load your account. Please try again.");
    }
}

export async function updateMeAPI(name, phone) { // update of name,phonenumber
    try {
        const res = await api.patch("/api/auth/me", { name, phone });
        return {
            status: true,
            data: res.data.data
        };
    } catch (error) {
        return {
            status: false,
            message: error.response?.data?.error?.message || "Something went wrong. Please try again."
        };
    }
};

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



