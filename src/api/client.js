import axios from "axios";

// PART 1: make your own axios that already knows the server address
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "",
    withCredentials: true,
});

// PART 2: a checker that runs automatically after EVERY server reply
api.interceptors.response.use(
    // 2a. The reply is OK → give it back as it is
    (res) => res,
    // 2b. The reply is an ERROR → run this
    async (error) => {
        const request = error.config; // the request that failed (e.g. "get wishlist")
        // Is it "token expired" (401), and haven't we retried this request yet?
        if (error.response?.status === 401 && !request.retried && !request.url.includes("/api/auth/refresh") && !request.url.includes("/api/auth/login")) {
            request.retried = true; // note: retry only once
            try {
                await api.post("/api/auth/refresh", null);// ask for a new token
            } catch {
                return Promise.reject(error); // couldn't get one → user is logged out → send the error on
            }
            return api(request);  // got a new token → send the failed request again
        }
        return Promise.reject(error); // any other error → send it on to the function's catch
    }
);

export default api; // PART 3: let other files use it

//An interceptor is a function axios runs on every request or response automatically, 
//so you don't have to repeat that code in each API call.
// Think of it as a checkpoint every request passes through.