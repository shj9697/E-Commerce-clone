import api from "./client";

export async function getCollectionBySlugAPI(slug) {
    try {
        const res = await api.get(`/api/collections/${slug}`);
        return {
            data: res.data?.data,
        };
    } catch (err) {
        return {
            data: null,
            notFound: err.response?.status === 404,
            message: err.response?.data?.error?.message || err.message
        };
    }
};
