import { useState } from "react";
import toast from "react-hot-toast";
import { trackOrderAPI } from "../api/ordersApi";
import { useAuth } from "../context/AuthProvider";

const TrackOrderPage = () => {
    const { user } = useAuth();
    const [orderNumber, setOrderNumber] = useState("");
    const [email, setEmail] = useState("");
    const [order, setOrder] = useState(null);
    const [searching, setSearching] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!orderNumber.trim()) {
            toast.error("Please enter your order number!");
            return;
        }
        // A signed-in owner can look up their own order without the email
        if (!user && !email.trim()) {
            toast.error("Please enter your email!");
            return;
        }
        setSearching(true);
        setOrder(null);
        try {
            const reply = await trackOrderAPI(orderNumber.trim().toUpperCase(), email.trim());
            if (reply.status) setOrder(reply.data);
            else toast.error(reply.message || "No order found for those details");
        } catch {
            toast.error("Something went wrong, please try again!");
        } finally {
            setSearching(false);
        }
    };

    return (
        <section className="px-4 py-10">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 w-full max-w-md mx-auto p-6 bg-[#f6f6f6] rounded-md"
            >
                <h1 className="text-center font-semibold text-2xl">Track Your Order</h1>

                <label className="font-semibold text-lg" htmlFor="orderNumber">
                    Order Number
                </label>
                <input
                    id="orderNumber"
                    name="orderNumber"
                    type="text"
                    placeholder="MRF-261005-8287"
                    className="p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none"
                    onChange={(e) => setOrderNumber(e.target.value)}
                    value={orderNumber}
                />

                <label className="font-semibold text-lg" htmlFor="email">
                    Email {user && <span className="text-sm font-normal text-gray-500">(optional for your own orders)</span>}
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    className="p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />

                <button
                    type="submit"
                    disabled={searching}
                    className="p-2 w-40 mx-auto mt-2 rounded-sm bg-[#fb641b] text-white cursor-pointer disabled:opacity-60"
                >
                    {searching ? "Searching..." : "Track"}
                </button>
            </form>

            {order && (
                <div className="w-full max-w-2xl mx-auto mt-8 p-4 bg-white border border-gray-200 rounded">
                    <div className="flex flex-wrap justify-between gap-2 border-b border-gray-200 pb-3">
                        <div>
                            <p className="font-semibold">{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-[#fb641b]">{order.status}</p>
                            <p className="text-sm text-gray-500">{order.payment.method} · {order.payment.status}</p>
                        </div>
                    </div>
                    {order.items.map((item) => (
                        <div key={item.id ?? item.sku} className="flex items-center gap-4 py-3">
                            {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-contain" />}
                            <p className="flex-1 text-[15px] line-clamp-1">{item.title}</p>
                            <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                            <p className="text-[15px]">₹{item.lineTotal}</p>
                        </div>
                    ))}
                    <div className="flex flex-wrap justify-between gap-2 border-t border-gray-200 pt-3">
                        <p className="text-sm text-gray-500">
                            {order.customerName}, {order.address.line1}{order.address.line2 && `, ${order.address.line2}`}, {order.address.city}, {order.address.state} - {order.address.pincode}
                        </p>
                        <p className="font-semibold">Total : ₹{order.total}</p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TrackOrderPage;
