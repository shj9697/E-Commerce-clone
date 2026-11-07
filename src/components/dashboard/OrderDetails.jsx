import { Bell, Box, Mail, MapPin, Phone, UserRound } from "lucide-react";
import deliveryAddressIcon from "../../assets/delivery-address.svg";

function OrderDetails(orderInfo) {
    const order = orderInfo.order;
    return (
        <div className="bg-[#f5f5f5] p-6">
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
                <div className="flex flex-col gap-0.5 bg-white rounded-2xl p-4">
                    <div className="flex flex-row my-2 gap-2">
                        <img src="https://assets.myntassets.com/assets/images/2026/JUNE/17/vAviurqR_d0a7490162924bf4afd3946f4b839450.png" alt="User" className="h-10 w-10" />
                        <div className="gap-3">
                            <p className="font-semibold text-[14px]">Delivery To</p>
                            <p className="text-gray-600">{order.customerName}</p>
                        </div>
                    </div>
                    <span className="w-full h-0.5 bg-gray-200"></span>
                    <div className="flex items-center mt-2 bg-white rounded-2xl gap-3">
                        <Phone size={16} />
                        <div className="flex flex-col">
                            <p className="font-semibold">Contact details</p>
                            <p className="text-gray-600">Mobile : {order.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-start mt-2 bg-white rounded-2xl gap-3">
                        <MapPin size={16} className="mt-1 shrink-0" />
                        <div className="flex flex-col">
                            <div className="flex flex-col">
                                <p className="font-semibold">Delivery Address </p>
                                <div>
                                    <p className="text-gray-600">{order.address.line1}{order.address.line2 && `, ${order.address.line2}`}</p>
                                    <p className="text-gray-600">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                                </div>
                            </div>
                        </div>
                        <img src={deliveryAddressIcon} alt="" className="ml-auto self-end" />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-2 bg-white rounded-2xl p-4">
                    <div>
                        <p className="font-semibold">Payment method</p>
                        <p className="text-gray-600">{order.payment.method === "COD" ? "Cash On Delivery" : "Razorpay"}</p>
                        <p className="text-gray-600">{order.payment.status}</p>
                    </div>
                    <p className="text-right font-semibold mt-4">Total : ₹{order.total}</p>
                </div>

                <div className="mt-2 bg-white rounded-2xl p-4 leading-5">
                    <div className="flex gap-2">
                        <Bell size={16} className="mt-1 shrink-0" />
                        <p className="font-semibold">Updates sent to</p>
                    </div>
                    <div className="flex gap-5 mt-2">
                        <div className="flex flex-col">
                            <p className="text-gray-600">Call</p>
                            <p>{order.phone}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-gray-600">Email</p>
                            <p>{order.email}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-2 bg-white rounded-2xl p-4 leading-5">
                    <div className="flex gap-2">
                        <Box size={16} />
                        <p className="font-semibold">Order details</p>
                    </div>
                    <p className="text-gray-600">Ordered on : {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                    <p className="text-gray-600">Order ID : {order.orderNumber}</p>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;
