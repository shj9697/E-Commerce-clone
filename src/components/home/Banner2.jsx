import { Link } from "react-router-dom";

function Banner2({ imgUrl, path, loading = false }) {

    // Checked first: while loading there is no imgUrl yet, so the null check would hide the skeleton
    if (loading) {
        return (
            <div className="pt-2 relative lg:w-full">
                <div className="w-full h-120 bg-gray-300 animate-pulse" />
            </div>
        )
    }

    if (!imgUrl) return null;

    return (
        <Link to={path} >
            <div className="relative bg-white">
                <img src={imgUrl} alt="Banner" />
            </div>
        </Link>
    )
}

export default Banner2;