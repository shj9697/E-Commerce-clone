import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { getOrdersAPI } from "../../api/ordersApi";
import OrderDetails from "../../components/dashboard/OrderDetails";

function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedOrder = orders.find((order) => order.orderNumber === searchParams.get("order"));

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const reply = await getOrdersAPI();
                if (cancelled) return;
                if (reply.status) setOrders(reply.data);
                else setError(reply.message);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    if (loading) {
        return (
            <div>
                <h2 className="text-2xl text-[#fb641b]">Your Order</h2>
                <div className="w-20 h-0.5 bg-gray-300 mt-3" />
                <div className="flex flex-col gap-4 mt-6 animate-pulse">
                    {[1, 2].map((cardNumber) => (
                        <div key={cardNumber} className="border border-gray-200 rounded p-4">
                            <div className="flex justify-between gap-2 border-b border-gray-200 pb-3">
                                <div>
                                    <div className="h-4 w-32 rounded bg-gray-300" />
                                    <div className="h-3 w-20 mt-2 rounded bg-gray-300" />
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="h-3 w-16 rounded bg-gray-300" />
                                    <div className="h-3 w-24 mt-2 rounded bg-gray-300" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 py-3">
                                <div className="w-16 h-16 rounded bg-gray-300" />
                                <div className="flex-1 h-4 rounded bg-gray-300" />
                                <div className="h-3 w-10 rounded bg-gray-300" />
                                <div className="h-4 w-14 rounded bg-gray-300" />
                            </div>
                            <div className="flex justify-end border-t border-gray-200 pt-3">
                                <div className="h-4 w-28 rounded bg-gray-300" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <p>Error : {error}</p>
    }
    if (selectedOrder) {
        return <OrderDetails order={selectedOrder} />;
    }

    return (
        <div>

            <h2 className="text-2xl text-[#fb641b]">Your Order</h2>
            <div className="w-20 h-0.5 bg-gray-300 mt-3" />
            {orders.length === 0 ?
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <h2 className="text-2xl text-[#fb641b]">Empty Order List</h2>
                    <p className="mt-2 text-[17px] text-gray-500">You have no items in your orderlist.</p>
                    <button className="bg-[#fb641b] text-white px-6 py-2 mt-10 rounded cursor-pointer" onClick={() => { navigate('/') }}>Take me back to shopping</button>
                </div>
                :
                <div className="flex flex-col gap-4 mt-6">
                    {orders.map((order) => (
                        <div key={order.orderNumber} onClick={() => setSearchParams({ order: order.orderNumber })} className="border border-gray-200 rounded p-4 cursor-pointer">
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
                                <div key={item.id} className="flex items-center gap-4 py-3">
                                    <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-contain" />
                                    <p className="flex-1 text-[15px] line-clamp-1">{item.title}</p>
                                    <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                                    <p className="text-[15px]">₹{item.lineTotal}</p>
                                </div>
                            ))}
                            <p className="text-right font-semibold border-t border-gray-200 pt-3">Total : ₹{order.total}</p>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}

export default Orders;
