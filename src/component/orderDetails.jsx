import { Mail, MapPin, Phone, UserRound } from "lucide-react";

function OrderDetails(orderInfo) {
    const order = orderInfo.order;
    console.log(order)
    return (
        <div className="bg-[#f5f5f5] p-2">
            {order.items.map((item) => (
                <div key={item.id} className="flex flex-col items-center gap-2 mb-4">
                    <img src={item.imageUrl} alt={item.title} className="w-28 h-28 object-contain" />
                    <div className="flex flex-col items-center">
                        <p className="text-[18px] font-medium">{item.title}</p>
                        <p className="text-[16px]">Quantity: {item.quantity}</p>
                    </div>
                    <h2 className="text-[16px]">Order ID:{order.orderNumber}</h2>
                </div>
            ))}

            <div className="text-[15px]">
                <div className="flex flex-col gap-0.5 bg-white rounded-2xl p-2">
                    <div className="flex flex-row my-2">
                        <UserRound size={50} />
                        <div>
                            <p className="font-medium text-[18px]">Delivery To</p>
                            <p className="text-[14px] text-gray-500">{order.customerName}</p>
                        </div>
                    </div>
                    <span className="w-full h-0.5 bg-gray-200"></span>
                    <div className="mt-2 bg-white rounded-2xl p-2 leading-5">
                        <p className="font-semibold">Contact details</p>
                        <div className="flex items-center gap-3">
                            <Phone size={16} />
                            <p className="text-gray-600">Mobile : {order.phone}</p>
                        </div>
                        <div className="flex flex-col mt-3">
                            <p className="font-semibold">Delivery To :</p>
                            <div className="flex gap-2 mt-0.5">
                                <MapPin size={18} />
                                <div>
                                    <p className="text-gray-600">{order.address.line1}{order.address.line2}</p>
                                    <p className="text-gray-600">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-2 bg-white rounded-2xl p-2">
                    <div>
                        <p className="font-semibold">Payment method</p>
                        <p>ONLINE PAYMENT</p>
                        <p className="text-gray-600">{order.payment.method} · {order.payment.status}</p>
                    </div>
                    <p className="text-right font-semibold mt-4">Total : ₹{order.total}</p>
                </div>

                <div className="mt-2 bg-white rounded-2xl p-2 leading-5">
                    <p className="font-semibold">Updates sent to</p>
                    <div className="flex justify-between mt-2">
                        <div className="flex flex-col">
                            <p>Call</p>
                            <p className="text-gray-600">{order.phone}</p>
                        </div>
                        <div className="flex flex-col">
                            <p>Email</p>
                            <p className="text-gray-600">{order.email}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-2 bg-white rounded-2xl p-2 leading-5">
                    <p className="font-semibold">Order details</p>
                    <p className="text-gray-600">Ordered on : {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                    <p className="text-gray-600">Order ID : {order.orderNumber}</p>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;
