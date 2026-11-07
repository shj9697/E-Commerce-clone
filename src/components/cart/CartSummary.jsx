import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartProvider";

const CartSummary = ({ handleChooseAddress }) => {

    const { cart } = useCart();

    return (
        <div className="bg-white w-full">
            <div className="flex items-center text-[15px] text-[#fb641b] gap-2">
                <ShoppingCart />
                <p>Cart Summary</p>
            </div>
            <div className="text-gray-500 text-[13px] my-2 border-b border-b-gray-400">
                <p>PRICE DETAILS</p>
            </div>
            <div className="flex justify-between text-[14px]">
                <p>Total</p>
                <p>₹ {cart.totalAmount}</p>
            </div>
            <div className="flex justify-between text-[14px]">
                <p>Shipping Fees</p>
                <p>Free</p>
            </div>
            <div className="flex justify-between bg-gray-200 p-2 border border-[#fb641b] my-2">
                <p>SubTotal</p>
                <p>₹ {cart.totalAmount}</p>
            </div>
            <div className="text-center p-2 bg-[#fb641b] my-2">
                <button className="text-white text- cursor-pointer" onClick={handleChooseAddress}>CHOOSE ADDRESS</button>
            </div>
        </div>
    )
}

export default CartSummary;
