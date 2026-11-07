import { CreditCard } from "lucide-react";
import { useCart } from "../../context/CartProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createRazorpayOrderAPI, getPaymentConfigAPI, placeOrderAPI, verifyRazorpayPaymentAPI } from "../../api/paymentApi";

const Payment = ({ addressId }) => {

    const { cart, refreshCart } = useCart();
    const navigate = useNavigate();
    const [paymentConfig, setPaymentConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [placing, setPlacing] = useState(false);

    //when the payment page opens, it asks the server which payment options are allowed (COD, Razorpay) and saves the answer.
    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const configData = await getPaymentConfigAPI();
                if (!cancelled) {
                    if (configData.status)
                        setPaymentConfig(configData.data);
                    else setError(configData.message);
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [])

    // step:- 1 the starting point 
    //Runs when the user clicks the ORDER button.
    const handleOrder = async () => {
        if (!paymentMethod) return toast.error("Please choose a payment method");
        setPlacing(true);
        try {
            if (paymentMethod === "cod") {
                const reply = await placeOrderAPI(addressId); // 1. place the order
                await finishOrder(reply);                     // 2. show success/error
            } else {
                await payWithRazorpay();
            }
        } catch (err) {
            setPlacing(false);
            toast.error(err.message);
        }
    };

    // step:- 2 opens the payment popup
    // It asks the server to create a Razorpay order for this address. If that fails, it turns the button back on and shows the error.
    // In short: create the order, then either fake the payment (test mode) or show the real payment popup.

    const payWithRazorpay = async () => {
        const reply = await createRazorpayOrderAPI(addressId);
        if (!reply.status) {
            setPlacing(false);
            return toast.error(reply.message);
        }
        const order = reply.data;

        // Test mode: skip the popup and pretend the user paid
        if (order.isDummy) {
            return verifyPayment({ razorpay_order_id: order.razorpayOrderId, razorpay_payment_id: "pay_dummy", razorpay_signature: "dummy" });
        }

        // Real mode: open Razorpay's popup
        new window.Razorpay({
            key: order.keyId, // razorpay account key 
            order_id: order.razorpayOrderId, //Which order the user is paying for
            name: order.name, //The shop name shown at the top of the popup
            prefill: order.prefill, //The customer's name, email and phone, already filled in for them
            handler: verifyPayment, // "When the payment succeeds, call my verifyPayment function"
            modal: { ondismiss: () => setPlacing(false) } // "If the user closes the popup without paying, run setPlacing(false)", which turns the button back on
        }).open(); //Ends the settings and shows the popup
    };

    // step:- 3 checks the payment is real
    // It sends Razorpay's payment details to the server. The server checks them and places the order.
    // Razorpay calls this after the customer pays, outside handleOrder's try/catch
    const verifyPayment = async (razorpayResponse) => {
        try {
            const reply = await verifyRazorpayPaymentAPI(razorpayResponse); // 1. server checks the payment
            await finishOrder(reply);                                        // 2. show success/error
        } catch (err) {
            setPlacing(false);
            toast.error(err.message);
        }
    };

    //step:-4 the ending
    // Both COD and Razorpay end up here.
    const finishOrder = async (orderData) => {
        setPlacing(false);
        if (!orderData.status)
            return toast.error(orderData.message);
        await refreshCart();
        toast.success(`Order ${orderData.data.orderNumber} placed`);
        navigate("/dashboard/orders");
    };

    // COD:      handleOrder → finishOrder
    // Razorpay: handleOrder → payWithRazorpay → (user pays) → verifyPayment → finishOrder

    if (loading) {
        return (
            <div className="w-full flex flex-col gap-4 animate-pulse">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-gray-200" />
                    <div className="h-4 w-36 bg-gray-200 rounded" />
                </div>
                <div className="flex flex-col gap-3 border border-gray-100 rounded p-3">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-4 w-56 bg-gray-200 rounded" />
                </div>
                <div className="h-12 w-full bg-gray-200 rounded" />
            </div>
        )
    }
    if (error) {
        return <p>Error : {error}</p>
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <CreditCard className="text-green-500" />
                <h1 className="text-[#fb6b25]">CHOOSE PAYMENT</h1>
            </div>
            {/* Real radio inputs, so the options work with Tab/Space and screen readers, and each has visible text */}
            <div className="flex flex-col gap-2 border border-gray-100 rounded p-2">
                {paymentConfig.cod && (
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "cod"}
                            onChange={() => setPaymentMethod("cod")}
                            className="accent-[#fb6b25] cursor-pointer"
                        />
                        <span>Cash On Delivery</span>
                    </label>
                )}
                {paymentConfig.razorpay && (
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "razorpay"}
                            onChange={() => setPaymentMethod("razorpay")}
                            className="accent-[#fb6b25] cursor-pointer"
                        />
                        <img src="https://marfit-ea7ba.web.app/static/media/razorpay.cb9bcca7.png" alt="" className="h-12 w-20" />
                        <span>Pay via Razorpay</span>
                    </label>
                )}
            </div>
            <button
                className="bg-[#fb641b] text-white rounded p-3 text-center w-full cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={placing}
                onClick={handleOrder}
            >
                {placing ? "PLACING ORDER..." : `ORDER FOR ₹${cart.totalAmount}`}
            </button>
        </div>
    )
}

export default Payment;
