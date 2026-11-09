import { useState } from "react";
import CartSummary from "./CartSummary";
import Payment from "./Payment";
import AddressStep from "./AddressStep";

const CartDetails = () => {
    const [step, setStep] = useState(0);
    const [checkoutAddressId, setCheckoutAddressId] = useState(null);

    const handleStep = (value) => {
        if (value === 0) {
            setStep(value);
        } else if (step > value) {
            setStep(value);
        }
    }

    const handleChooseAddress = () => {
        setStep(1);
    };

    const handleChoosePayment = (addressId) => {
        setCheckoutAddressId(addressId);
        setStep(2);
    }

    return (
        <div className="w-full">
            <div className="flex bg-white p-4 gap-2 rounded">
                <input type="text"
                    className="bg-white rounded text-[13px] p-2 border border-gray-400 flex-1"
                    placeholder="Enter Coupon Code" />
                <button className="border border-[#fb6b25] text-[15px] text-[#fb6b25] rounded px-5 cursor-pointer">APPLY</button>
            </div>
            <div className="flex flex-col justify-center items-center bg-white mt-5 gap-4 w-full">
                <div className="flex items-center justify-center md:justify-around gap-5 sm:gap-4 text-gray-500 text-[12px] -tracking-tighter border-b border-gray-300 p-4 w-full">
                    <p
                        onClick={() => handleStep(0)}
                        className={`cursor-pointer ${step >= 0 ? "text-green-600" : "text-gray-500"}`}
                    >
                        CART
                    </p>
                    <span className={`whitespace-nowrap shrink-0 ${step >= 1 ? "text-green-600" : "text-gray-500"}`}>-----</span>
                    <p
                        onClick={() => handleStep(1)}
                        className={`cursor-pointer ${step >= 1 ? "text-green-600" : "text-gray-500"}`}
                    >
                        ADDRESS
                    </p>
                    <span className={`whitespace-nowrap shrink-0 ${step >= 1 ? "text-green-600" : "text-gray-500"}`}>-----</span>
                    <p
                        className={`cursor-pointer ${step >= 2 ? "text-green-600" : "text-gray-500"}`}
                    >
                        PAYMENT
                    </p>
                </div>
                <div className="w-full p-4">
                    {step === 0 && <CartSummary handleChooseAddress={handleChooseAddress} />}
                    {step === 1 && <AddressStep handleChoosePayment={handleChoosePayment} />}
                    {step === 2 && <Payment addressId={checkoutAddressId} />}
                </div>
            </div>
        </div >
    )
}

export default CartDetails;
