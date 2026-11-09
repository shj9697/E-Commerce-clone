import Breadcrumb from "../components/common/Breadcrumb";
import { useEffect, useState } from "react";
import ProductCard from "../components/common/ProductCard";
import Filter from "../components/common/Filter";
import { getProductsAPI } from "../api/productCategoriesApi";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";

function EmbossPage() {
    const [sortBy, setSortBy] = useState("relevance");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [stock, setStock] = useState(true);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const productListData = await getProductsAPI({
                    page: currentPage,
                    limit: 8,
                    category: category,
                    subCategory: subCategory,
                    sort: sortBy,
                    embossable: true,
                    inStock: stock,
                    minPrice: priceRange[0],
                    // The slider's top (10000) means "no upper limit", so pricier products still show
                    maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined
                });
                if (!cancelled) setData(productListData);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [category, subCategory, currentPage, sortBy, stock, priceRange]);

    if (loading && !data) {
        return (
            <div className="w-full bg-white px-4 pb-16 md:px-8 md:pb-0">
                <div className="h-8 w-48 my-3 bg-gray-200 rounded animate-pulse" />
                <div className="bg-white py-5 w-full flex flex-col gap-6 md:flex-row md:gap-10">
                    <div className="hidden md:flex w-full shrink-0 md:w-50 lg:w-70 flex-col gap-2 animate-pulse">
                        <div className="h-8 w-full bg-gray-200 rounded" />
                        <div className="h-28 w-full bg-gray-200 rounded-md" />
                        <div className="h-48 w-full bg-gray-200 rounded-md" />
                        <div className="h-24 w-full bg-gray-200 rounded-md" />
                    </div>
                    <div className="flex-1 min-w-0 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((placeholder, index) => (
                            <ProductCard key={index} loading />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
    if (error) {
        return <p>Error : {error}</p>
    };

    // Every filter change starts again from page 1
    const handleSortBy = (value) => { setSortBy(value); setCurrentPage(1); };
    const handleCategoryBy = (value) => { setCategory(value); setSubCategory(""); setCurrentPage(1); };
    const handleSubCategoryBy = (value) => { setSubCategory(value); setCurrentPage(1); };
    const handleStock = (value) => { setStock(value); setCurrentPage(1); };
    const handlePriceRange = (value) => { setPriceRange(value); setCurrentPage(1); };

    const handleReset = () => {
        setSortBy("relevance");
        setCategory("");
        setSubCategory("");
        setStock(true);
        setPriceRange([0, 10000]);
        setCurrentPage(1);
    };

    return (
        <div className="w-full bg-white px-4 pb-16 md:px-8 md:pb-0">
            <Breadcrumb paths={[{ title: "Emboss" }]} />
            <div className="bg-white py-5 w-full flex flex-col gap-6 md:flex-row md:gap-10">
                <Filter
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    handleSortBy={handleSortBy}
                    handleCategoryBy={handleCategoryBy}
                    handleSubCategoryBy={handleSubCategoryBy}
                    handleReset={handleReset}
                    sortBy={sortBy}
                    category={category}
                    subCategory={subCategory}
                    stock={stock}
                    handleStock={handleStock}
                    priceRange={priceRange}
                    handlePriceRange={handlePriceRange}
                />
                <div className="flex flex-col flex-1 min-w-0 pb-4 gap-6">
                    <div className="w-full grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                        {(data?.products || []).map(item => (
                            <ProductCard item={item} key={item.id} />
                        ))}
                    </div>
                    <div className="flex justify-center items-center px-2 gap-2">
                        <button disabled={currentPage <= 1} className="bg-[#fb641b] text-white px-6 py-2 cursor-pointer disabled:bg-white" onClick={() => setCurrentPage(prev => prev - 1)}> Prev</button>
                        <h1>Page {currentPage} of {data?.totalPages || 1}</h1>
                        <button disabled={currentPage >= data?.totalPages} className="bg-[#fb641b] text-white px-6 py-2 cursor-pointer disabled:bg-white" onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                    </div>
                </div>
            </div>
            <div className="md:hidden fixed bottom-0 inset-x-0 z-40 flex bg-white border-t border-gray-200">
                <button onClick={() => setIsSortOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-3 border-r border-gray-200 cursor-pointer">
                    <ArrowUpDown size={18} /> SORT
                </button>
                <button onClick={() => setIsFilterOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-3 cursor-pointer">
                    <SlidersHorizontal size={18} /> FILTER
                </button>
            </div>
            {isSortOpen && (
                <div onClick={() => setIsSortOpen(false)} className="md:hidden fixed inset-0 z-50 flex items-end bg-black/40">
                    <div onClick={(event) => event.stopPropagation()} className="w-full bg-white rounded-t-xl p-4">
                        <p className="text-xs text-gray-500 pb-3 border-b border-gray-200">SORT BY</p>
                        {[
                            { value: "relevance", label: "Relevance" },
                            { value: "price-low-to-high", label: "Price: Low to High" },
                            { value: "price-high-to-low", label: "Price: High to Low" },
                        ].map(option => (
                            <button
                                key={option.value}
                                onClick={() => { handleSortBy(option.value); setIsSortOpen(false); }}
                                className={`block w-full text-left py-3 cursor-pointer ${sortBy === option.value ? "text-[#fb641b] font-semibold" : "text-gray-700"}`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmbossPage;
