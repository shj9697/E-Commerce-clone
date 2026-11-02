import api from "./client";

export async function getProductCategoriesAPI() {
    try {
        const res = await api.get(`/api/categories`);

        return {
            categories: res.data.data.sort((a, b) => a.sortOrder - b.sortOrder),
        };
    } catch (error) {
        return {
            categories: [],
            message: error.response?.data?.error?.message
        };
    }
};

export async function getProductsAPI({ page, limit, category, subCategory, search, sort, minPrice, maxPrice, embossable, inStock }) {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    category && params.append("category", category);
    subCategory && params.append("subcategory", subCategory);
    search && params.append("search", search);
    sort && params.append("sort", sort);
    minPrice && params.append("minPrice", minPrice);
    maxPrice && params.append("maxPrice", maxPrice);
    embossable && params.append("embossable", embossable);
    inStock && params.append("inStock", inStock);

    try {
        const res = await api.get(`/api/products?${params}`);
        return {
            products: res.data.data,
            total: res.data.totalProducts,
            totalPages: res.data.totalPages
        };
    } catch (error) {
        return {
            products: [],
            total: 0,
            totalPages: 0,
            message: error.response?.data?.error?.message
        };
    }
};

export async function getProductCategoriesBySlugAPI(slug) {
    try {
        const res = await api.get(`/api/categories/` + slug);
        return {
            categories: res.data.data,
        };
    } catch (error) {
        return {
            categories: [],
            message: error.response?.data?.error?.message
        };
    }
};

export async function getProductCategoriesBySubSlugAPI(categorySlug, subCategorySlug) {
    try {
        const res = await api.get(`/api/categories/${categorySlug}/${subCategorySlug}`);
        return {
            categories: res.data.data,
        };
    } catch (error) {
        return {
            categories: [],
            message: error.response?.data?.error?.message
        };
    }
};
