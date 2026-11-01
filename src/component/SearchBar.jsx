import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductDetailsAPI, searchProductsAPI } from "../api/productapi";

function SearchBar({ isMobile, onSelect }) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    // Waits until typing pauses, so every keystroke doesn't send a request
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }
        let cancelled = false;
        const timer = setTimeout(async () => {
            try {
                const data = await searchProductsAPI(query.trim());
                if (!cancelled) setResults(data.results);
            } catch {
                if (!cancelled) setResults([]);
            }
        }, 300);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [query]);

    const handleSelect = async (result) => {
        setQuery("");
        onSelect?.();
        if (result.type === "category") {
            navigate(result.parentSlug ? `/categories/${result.parentSlug}/${result.slug}` : `/categories/${result.slug}`);
            return;
        }
        // Search results have no category, but the product page URL needs it
        const productDetails = await getProductDetailsAPI(result.sku);
        if (!productDetails.data.categoryRef)
            return toast.error("Product not found");
        navigate(`/categories/${productDetails.data.categoryRef.slug}/${productDetails.data.subcategoryRef.slug}/${productDetails.data.id}`);
    };

    return (
        <div className={`relative items-center justify-between px-4 py-1 border border-gray-400 ${results.length > 0 ? "rounded-t-2xl" : "rounded-full"} ${isMobile ? "flex w-full" : "hidden md:flex w-1/3"}`}>
            <div className="relative w-full">
                <input type="text" placeholder="What are you looking for?" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus={isMobile} className="outline-none border-0 placeholder-black px-5 py-0.5 w-full" />
            </div>
            <Search className="text-black-700" size={20} />
            {results.length > 0 && (
                <div className="absolute top-full -inset-x-px max-h-96 overflow-y-auto bg-white border border-t-0 border-gray-400 shadow-lg z-46 px-2 pb-4 pt-1 rounded-b-md text-lg font-normal">
                    {results.map((result) => (
                        <div key={result.sku ?? result.slug} onClick={() => handleSelect(result)} className="search-result-item leading-10 line-clamp-1 cursor-pointer hover:bg-gray-200 active:bg-gray-200">{result.label}</div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
