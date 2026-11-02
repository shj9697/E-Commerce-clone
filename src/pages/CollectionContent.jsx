import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCollectionBySlugAPI } from "../api/collectionsApi";
import ProductCard from "../component/ProductCard";

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
                const data = await getCollectionBySlugAPI(slug);
                if (!cancelled) setData(data.data);
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
        return <p>Loading......</p>
    }
    if (error) {
        return <p>Error : {error}</p>
    };

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