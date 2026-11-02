import { Mail, Phone, UserRound } from "lucide-react";

function OrderDetails(orderInfo) {
    const order = orderInfo.order;
    console.log(order)
    return (
        <div className="bg-[#f5f5f5] p-2">
            {order.items.map((item) => (
                <div key={item.id} className="flex flex-col items-center gap-2 py-8">
                    <img src={item.imageUrl} alt={item.title} className="w-40 h-40 object-contain" />
                    <div className="flex flex-col items-center">
                        <p className="text-[18px] font-medium">{item.title}</p>
                        <p className="text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <h2 className="text-[14px]">Order ID:{order.orderNumber}</h2>
                </div>
            ))}

            <div className="text-[15px]">
                <div className="flex items-center gap-0.5 bg-white rounded-2xl p-2">
                    <div>
                        <UserRound size={50} />
                        <div>
                            <p className="font-medium text-[22px]">Delivery To</p>
                            <p className="text-[14px]">{order.customerName}</p>
                        </div>
                        <p className="text-gray-600">{order.address.line1}{order.address.line2}</p>
                        <p className="text-gray-600">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                    </div>

                </div>

                <div className="mt-2 bg-white rounded">
                    <p className="font-semibold">Contact details</p>
                    <div className="flex items-center gap-0.5">
                        <Phone size={16} />
                        <p className="text-gray-600">Mobile : {order.phone}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <Mail size={16} />
                        <p className="text-gray-600">Email : {order.email}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-2 bg-white rounded">
                    <div>
                        <p className="font-semibold">Payment method</p>
                        <p>ONLINE PAYMENT</p>
                        <p className="text-gray-600">{order.payment.method} · {order.payment.status}</p>
                    </div>
                    <p className="text-right font-semibold mt-4">Total : ₹{order.total}</p>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;
