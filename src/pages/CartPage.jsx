import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartProvider";
import CartItem from "../components/cart/CartItem";
import CartDetails from "../components/cart/CartDetails";
import { useAuth } from "../context/AuthProvider";


const CartPage = () => {
    const { cart, cartLoading } = useCart();
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            toast.error("Please log in to access your cart");
            navigate("/");
        }
    }, [loading, user, navigate]);

    const Homepage = () => {
        navigate('/')
    };

    if (loading || (cartLoading && cart.items.length === 0)) {
        return (
            <div className='flex flex-col lg:flex-row items-start w-full gap-6 lg:px-6 py-10 animate-pulse'>
                <div className='w-full lg:w-2/3 flex flex-col gap-4'>
                    <div className="h-8 w-48 rounded-lg bg-gray-300" />
                    {[1, 2, 3].map((placeholder) => (
                        <div key={placeholder} className="h-28 w-full rounded-lg bg-gray-300" />
                    ))}
                </div>
                <div className='w-full lg:w-1/3 h-64 rounded-lg bg-gray-300' />
            </div>
        )
    }

    if (!user) return null;


    return (
        <div className="w-full lg:px-2">
            {cart.items.length === 0 ?
                <div className="flex items-center justify-center gap-3 flex-col p-5 w-full h-96 my-36">
                    <h1 className="text-2xl sm:text-4xl text-gray-900 whitespace-nowrap">Your cart is empty</h1>
                    <p className="text-center text-base text-gray-700">Add items in your cart and come back later to process checkout.</p>
                    <button className="bg-[#FB6B25] text-white p-4 rounded-md cursor-pointer whitespace-nowrap" onClick={() => Homepage()}>Continue to shopping</button>
                </div>
                :
                <div className='flex flex-col lg:flex-row items-start w-full gap-6 lg:px-6 py-10'>
                    <div className='w-full lg:w-2/3 flex flex-col gap-4'>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className='text-2xl'>Your Cart</h1>
                                <p className="bg-[#fb641b] text-white p-1 rounded-xl text-[14px]">{cart.totalItems} items</p>
                            </div>
                            <div className="flex items-center gap-2 my-1">
                                <span className="w-15 h-1 bg-[#fb641b]"></span>
                            </div>
                        </div>
                        {cart.items.map((item) => (
                            <CartItem key={item.productId} item={item} />
                        ))}
                    </div>
                    <div className='w-full lg:w-1/3'>
                        <CartDetails />
                    </div>
                </div>
            }
        </div>
    )
};

export default CartPage;
