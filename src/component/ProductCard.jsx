import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const ProductCard = ({ item }) => {

    const navigate = useNavigate();
    const { toggleWishList, isInWishList, user } = useAuth();
    const wishListed = isInWishList(item.id);

    const handleViewProductDetails = (item) => {
        navigate(`/categories/${item.categoryRef.slug}/${item.subcategoryRef.slug}/${item.id}`)
    }

    return (
        <div
            className="cursor-pointer p-2 h-80"
            style={{
                borderTop: "1px solid rgba(0,0,0,.03)",
                borderLeft: "1px solid rgba(0,0,0,.1)",
                boxShadow: "1px 2px 3px rgba(0,0,0,.2)"
            }}
        >
            <div className='relative flex justify-between' onClick={() => handleViewProductDetails(item)}>
                <img src={item.img} className="h-45 min-w-0 object-contain rounded-md w-full" />
                {user ?
                    <Heart
                        size={24}
                        strokeWidth={2}
                        className={wishListed ? "absolute top-1 right-1 lg:static shrink-0 fill-red-500 text-red-500 cursor-pointer" : "absolute top-1 right-1 lg:static shrink-0 fill-white text-gray-600 cursor-pointer"}
                        onClick={(event) => {
                            event.stopPropagation();// Its only job is preventing the redirect.
                            toggleWishList(item); //adds the product to the wishlist, or removes it if it's already there.
                        }}
                    />
                    :
                    null
                }
            </div>
            <div>
                <p className="text-sm mb-2 text-left line-clamp-2">{item.title}</p>
                <p className="text-sm">Rs. {item.price}</p>
                {item.oldPrice && (
                    <div className="flex items-center gap-2">
                        <p className="text-sm line-through text-gray-500">Rs. {item.oldPrice} </p>
                        <span className="text-sm text-orange-600">{item.discount}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductCard;