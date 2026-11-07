import { Trash, Truck } from "lucide-react";
import { useCart } from "../../context/CartProvider";

const CartItem = ({ item }) => {

    const { addToCart, removeFromCart, productDeleteFromCart } = useCart();

    return (
        <div className='flex p-6 bg-white w-full rounded gap-8'>
            <div className="w-[20%]">
                <img src={item.img} alt={item.title} className='w-full object-contain' />
            </div>
            <div className='w-[80%]'>
                <div className="flex justify-between gap-4">
                    <h1 className="text-[15px] line-clamp-1">{item.title}</h1>
                    <button
                        type="button"
                        className="flex items-center pr-2  gap-1 cursor-pointer"
                        onClick={() => productDeleteFromCart(item.productId)}
                    >
                        <Trash size={12} className="text-red-500 fill-red-500" />
                        <span className="text-sm text-red-500">Remove</span>
                    </button>
                </div>
                <div>
                    <div className="mt-3 flex flex-wrap justify-between items-center gap-6 p-2">
                        <div className="flex flex-col items-center">
                            <p className="text-[16px]">₹{item.price}</p>
                            {item.oldPrice && (
                                <div className="flex">
                                    <p className="text-gray-400 text-[13px] line-through">₹{item.oldPrice}</p>
                                    <p className="text-orange-600 text-[13px]">{item.product.off}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center">
                                <button type="button" className="cursor-pointer w-8 sm:w-12" onClick={() => removeFromCart(item.productId)}>-</button>
                                <p>{item.quantity}</p>
                                <button type="button" className="cursor-pointer w-8 sm:w-12" onClick={() => addToCart(item.productId)}>+</button>
                            </div>
                            <p className="text-[15px] text-gray-400">Quantity</p>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm">7 Days Replacement Policy available</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 border-2 border-[#fb641b]  rounded mt-3 text-sm p-1">
                        <Truck className="size-5 text-[#fb641b]" />
                        <p className="text-sm">Delivery Charge : Free</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem;
