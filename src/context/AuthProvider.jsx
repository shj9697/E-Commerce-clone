import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { addToWishlistAPI, getWishlistAPI, googleLoginAPI, logoutAPI, meAPI, removeFromWishlistAPI } from "../api/authentication";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wishList, setWishList] = useState([]);
    const [wishListLoading, setWishListLoading] = useState(false);
    // A profile update replaces the user object; only signing in or out should reload the wishlist
    const loggedIn = !!user;

    useEffect(() => {
        if (!loggedIn) {
            setWishList([]);
            return;
        }
        let cancelled = false;
        async function load() {
            try {
                setWishListLoading(true);
                const response = await getWishlistAPI();
                if (cancelled) return;
                if (!response.status) {
                    toast.error(response.message);
                    return;
                }
                setWishList(response.data.productData);
            } catch (err) {
                if (!cancelled) toast.error(err.message);
            } finally {
                if (!cancelled) setWishListLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, [loggedIn]);

    const toggleWishList = async (item) => {
        const exists = wishList.find((wishListItem) => wishListItem.id === item.id);
        try {
            const response = exists ? await removeFromWishlistAPI(item.id) : await addToWishlistAPI(item.id);
            if (!response.status) {
                toast.error(response.message);
                return;
            }
            setWishList(response.data.productData);
            toast.success(exists ? "Removed from Wishlist" : "Added to Wishlist");
        } catch (err) {
            toast.error(err.message);
        }
    };

    //It checks whether a product is in the wishlist, so the heart knows whether to be red or white.
    const isInWishList = (id) => wishList.find((wishItem) => wishItem.id === id);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                // Google's sign-in page sends the user back with the ID token in the URL hash
                const googleParams = new URLSearchParams(window.location.hash.slice(1));
                if (googleParams.has("state")) {
                    window.history.replaceState(null, "", window.location.pathname);
                    // A state we didn't store means the redirect didn't start from our Google button
                    if (googleParams.get("id_token") && googleParams.get("state") === sessionStorage.getItem("googleLoginState")) {
                        const loginData = await googleLoginAPI(googleParams.get("id_token"));
                        if (loginData.status) toast.success("Login SuccessFully");
                        else toast.error(loginData.message || "Google login failed");
                    }
                }
                const data = await meAPI();
                if (!cancelled) setUser(data);
            } catch (err) {
                if (!cancelled) toast.error(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        // The tokens are httpOnly cookies the page can't read, so ask the server who is signed in
        load();
        return () => { cancelled = true; };
    }, []);

    const logout = useCallback(async () => {
        try {
            const response = await logoutAPI();
            if (!response.status) toast.error(response.message);
        } catch (err) {
            toast.error(err.message);
        }
        setUser(null);
        navigate("/");
    }, [navigate]);


    useEffect(() => { // its for session checker
        if (!loggedIn) return;
        // Asking the server also refreshes an expired access token; once the refresh
        // token has expired that fails too, and the user is logged out
        const checkSession = async () => {
            try {
                if (!(await meAPI())) {
                    toast.error("Session expired");
                    // Skip logoutAPI: with the session already gone it would only fail and toast again
                    setUser(null);
                    navigate("/");
                }
            } catch {
                // A network or server error isn't a sign-out; the next check retries
            }
        };
        const timer = setInterval(checkSession, 60 * 1000); //runs the check every 60 seconds.
        window.addEventListener("focus", checkSession);
        return () => {
            clearInterval(timer);
            window.removeEventListener("focus", checkSession);
        };
    }, [loggedIn, navigate]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout, wishList, wishListLoading, toggleWishList, isInWishList }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};