import { ListFilter } from 'lucide-react';
import { useEffect, useState } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { getProductCategoriesAPI, getProductCategoriesBySlugAPI } from '../../api/productCategoriesApi';

const Filter = ({ isOpen, onClose, filters, updateFilter, handleReset }) => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [range, setRange] = useState(filters.priceRange);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const categoryData = await getProductCategoriesAPI();
                const subCategorydata = await getProductCategoriesBySlugAPI(filters.category);
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
    }, [filters.category, filters.subCategory]);

    useEffect(() => {
        setRange(filters.priceRange);
    }, [filters.priceRange]); // follows Reset

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
                        checked={filters.sortBy === "relevance"}
                        onChange={() => updateFilter({ sortBy: "relevance" })}
                    />
                    <label className="ml-2">RELEVANCE</label>
                </div>

                <div className="flex">
                    <input
                        type="checkbox"
                        checked={filters.sortBy === "price-low-to-high"}
                        onChange={() => updateFilter({ sortBy: "price-low-to-high" })}
                    />
                    <label className="ml-2">PRICE LOW TO HIGH</label>
                </div>

                <div className="flex">
                    <input
                        type="checkbox"
                        checked={filters.sortBy === "price-high-to-low"}
                        onChange={() => updateFilter({ sortBy: "price-high-to-low" })}
                    />
                    <label className="ml-2">PRICE HIGH TO LOW</label>
                </div>
            </div>

            <div className="border border-gray-200 rounded-md p-4">
                <h1>CATEGORIES</h1>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={filters.category === ""}
                        onChange={() => updateFilter({ category: "", subCategory: "" })}
                    />
                    <span>All</span>
                </div>
                {loading && !data
                    ? [1, 2, 3, 4].map((placeholder) => (
                        <div key={placeholder} className="h-4 w-32 my-0.5 bg-gray-200 rounded animate-pulse" />
                    ))
                    : data.categoryData.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={filters.category === item.slug}
                                onChange={() => updateFilter({ category: item.slug, subCategory: "" })}
                            />
                            <span>{item.name}</span>
                        </div>
                    ))}
            </div>

            {filters.category && (
                <div className="border border-gray-200 rounded-md p-4 my-2">
                    <h1>SUB CATEGORIES</h1>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={filters.subCategory === ""}
                            onChange={() => updateFilter({ subCategory: "" })}
                        />
                        <span>All</span>
                    </div>
                    {loading && !data
                        ? [1, 2, 3].map((placeholder) => (
                            <div key={placeholder} className="h-4 w-28 my-0.5 bg-gray-200 rounded animate-pulse" />
                        ))
                        : data.subCategoryData.map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={filters.subCategory === item.slug}
                                    onChange={() => updateFilter({ subCategory: item.slug })}
                                />
                                <span>{item.name}</span>
                            </div>
                        ))}
                </div>
            )}

            <div className="border border-gray-200 rounded-md p-4 my-2">
                <h1>AVAILABILITY</h1>
                {/* The Emboss page always filters by embossable, so its filters have no embossable key */}
                {"embossable" in filters && (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={filters.embossable}
                            onChange={(event) => updateFilter({ embossable: event.target.checked })}
                        />
                        <span>Embose</span>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={filters.stock}
                        onChange={(event) => updateFilter({ stock: event.target.checked })}
                    />
                    <span>In Stock</span>
                </div>
            </div>
            {/* Arrow keys only fire onInput, so apply the price when the key is released */}
            <div className="border border-gray-200 rounded-md p-4 my-2" onKeyUp={(event) => event.key.startsWith("Arrow") && updateFilter({ priceRange: range })}>
                <h1>PRICE RANGE</h1>
                <RangeSlider
                    min={0}
                    max={10000}
                    step={100}
                    value={range}
                    onInput={setRange}
                    onThumbDragEnd={() => updateFilter({ priceRange: range })}
                    onRangeDragEnd={() => updateFilter({ priceRange: range })}
                    className="my-4 w-full h-1! bg-gray-200! [&_.range-slider\_\_range]:bg-[#fb641b]! [&_.range-slider\_\_thumb]:bg-[#fb641b]! [&_.range-slider\_\_thumb]:size-4!"
                />
                <div className="flex justify-between w-full">
                    <span>₹{range[0]}</span>
                    <span>₹{range[1]}{range[1] === 10000 && "+"}</span>
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