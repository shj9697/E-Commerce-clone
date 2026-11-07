import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCollectionBySlugAPI } from "../api/collectionsApi";
import ProductCard from "../components/common/ProductCard";
import NotFound from "./NotFound";

const CollectionContent = () => {
    const { slug } = useParams();
    const [data, setData] = useState({ title: "", products: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const result = await getCollectionBySlugAPI(slug);
                if (cancelled) return;
                setData(result.data);
                // A slug with no collection shows NotFound; any other failure (server down, network) shows the error
                if (!result.data && !result.notFound) setError(result.message);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [slug]);
    if (loading) {
        return (
            <div className="p-8 bg-white">
                <div className="h-7 w-48 rounded bg-gray-300 animate-pulse"></div>
                <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <ProductCard key={index} loading />
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return <p>Error : {error}</p>
    };

    // /:slug catches every one-segment URL, so a slug with no collection is a wrong address
    if (!data) return <NotFound />;

    return (

        <div className="p-8 bg-white">
            <h1 className="text-2xl">{data?.title || ""}</h1>
            <div className="crossline flex items-center gap-2 ">
                <span className="w-20 h-0.5 bg-black"></span>
                <span className="w-0.5 h-6 bg-black rotate-40"></span>
                <span className="w-0.5 h-6 bg-black rotate-40"></span>
                <span className="w-20 h-0.5 bg-black"></span>
            </div>

            <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4">

                {(data?.products || []).map((item) => (
                    <ProductCard item={item} key={item.id} />
                ))}
            </div>
        </div>
    )
}

export default CollectionContent;