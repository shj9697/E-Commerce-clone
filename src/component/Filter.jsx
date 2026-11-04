import { ListFilter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProductCategoriesAPI, getProductCategoriesBySlugAPI } from '../api/productCategoriesApi';

const Filter = ({ isOpen, onClose, sortBy, category, subCategory, handleSortBy, handleCategoryBy, handleSubCategoryBy, handleReset, handleIsEmbossableBy, handleStock, embossable, stock }) => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const categoryData = await getProductCategoriesAPI();
                const subCategorydata = await getProductCategoriesBySlugAPI(category);
                if (!cancelled) {
                    setData({
                        categoryData: categoryData?.categories || [],
                        subCategoryData: subCategorydata?.categories?.children || []
                    });
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [category, subCategory]);


    if (error) {
        return <p>Error : {error}</p>
    };

    return (
        <div className={`${isOpen ? "fixed inset-0 z-50 flex overflow-y-auto bg-white p-4" : "hidden"} md:static md:flex md:p-0 md:overflow-visible w-full shrink-0 md:w-50 lg:w-70 flex-col text-gray-500 text-[14px] accent-[#fb641b]`}>
            <div className="flex">
                <div className="flex w-full">
                    <ListFilter strokeWidth={1.75} className="h-5 w-5 my-1 mx-3" />
                    <p className="text-xl">Filters</p>
                </div>
                <button
                    onClick={handleReset}
                    className="p-1 border border-gray-200 w-[30%] rounded cursor-pointer"
                >
                    Reset
                </button>
            </div>

            <div className="hidden md:block border border-gray-200 rounded-md p-4 my-2">
                <h1>SORT BY</h1>
                <div className="flex">
                    <input
                        type="checkbox"
                        checked={sortBy === "relevance"}
                        onChange={() => handleSortBy("relevance")}
                    />
                    <label className="ml-2">RELEVANCE</label>
                </div>

                <div className="flex">
                    <input
                        type="checkbox"
                        checked={sortBy === "price-low-to-high"}
                        onChange={() => handleSortBy("price-low-to-high")}
                    />
                    <label className="ml-2">PRICE LOW TO HIGH</label>
                </div>

                <div className="flex">
                    <input
                        type="checkbox"
                        checked={sortBy === "price-high-to-low"}
                        onChange={() => handleSortBy("price-high-to-low")}
                    />
                    <label className="ml-2">PRICE HIGH TO LOW</label>
                </div>
            </div>

            <div className="border border-gray-200 rounded-md p-4">
                <h1>CATEGORIES</h1>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={category === ""}
                        onChange={() => handleCategoryBy("")}
                    />
                    <span>All</span>
                </div>
                {(data?.categoryData || []).map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={category === item.slug}
                            onChange={() => handleCategoryBy(item.slug)}
                        />
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>

            {category && (
                <div className="border border-gray-200 rounded-md p-4 my-2">
                    <h1>SUB CATEGORIES</h1>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={subCategory === ""}
                            onChange={() => handleSubCategoryBy("")}
                        />
                        <span>All</span>
                    </div>
                    {(data?.subCategoryData || []).map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={subCategory === item.slug}
                                onChange={() => handleSubCategoryBy(item.slug)}
                            />
                            <span>{item.name}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="border border-gray-200 rounded-md p-4 my-2">
                <h1>AVAILABILITY</h1>
                {/* The Emboss page always filters by embossable, so it passes no handler */}
                {handleIsEmbossableBy && (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={embossable}
                            onChange={(event) => handleIsEmbossableBy(event.target.checked)}
                        />
                        <span>Embose</span>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={stock}
                        onChange={(event) => handleStock(event.target.checked)}
                    />
                    <span>In Stock</span>
                </div>
            </div>

            <div className="md:hidden sticky bottom-0 mt-auto flex gap-3 bg-white pt-3">
                <button onClick={handleReset} className="flex-1 py-3 border border-gray-300 rounded cursor-pointer">CLEAR ALL</button>
                <button onClick={onClose} className="flex-1 py-3 bg-[#fb641b] text-white rounded cursor-pointer">APPLY</button>
            </div>
        </div>
    )
}

export default Filter