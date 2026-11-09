import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard";
import { useAuth } from "../../context/AuthProvider";

function WishlistPage() {
    const navigate = useNavigate();

    const { wishList, wishListLoading } = useAuth();

    return (
        <div>
            <h2 className="text-2xl text-[#fb641b]">Your Wishlist Items</h2>
            <div className="w-20 h-0.5 bg-gray-300 mt-3" />

            {wishListLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 mt-6">
                    {Array.from({ length: 8 }).map((placeholder, index) => (
                        <ProductCard key={index} loading />
                    ))}
                </div>
            ) : wishList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <p className="text-gray-500">Your wishlist is empty</p>
                    <button className="bg-[#fb641b] text-white px-6 py-2 mt-10 rounded cursor-pointer" onClick={() => { navigate('/') }}>Take me back to shopping</button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 mt-6">
                    {wishList.map((item) => (
                        <ProductCard item={item} key={item.id} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default WishlistPage;
