import api from "./client";

export async function getHomePageContentAPI() {
    try {
        const res = await api.get("/api/home");
        return {
            data: res.data?.data,
        };
    } catch (err) {
        return {
            data: null,
            message: err.response?.data?.error?.message || err.message
        };
    }
};
