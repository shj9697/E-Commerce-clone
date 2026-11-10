import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Breadcrumb from "../components/common/Breadcrumb";
import { Heart, MapPin } from "lucide-react";
import { useCart } from "../context/CartProvider";
import { useAuth } from "../context/AuthProvider";
import SliderItem from "../components/common/SliderItem";
import { getPincodeAPI, getProductDetailsAPI, getRelatedProductsAPI } from "../api/productApi";

const specs = [
    { label: "Height", value: "32 cm" },
    { label: "Width", value: "45 cm" },
    { label: "Thickness", value: "7 cm" },
    { label: "Model Name", value: "Genuine Leather Laptop Messenger Bag" },
    { label: "Closure", value: "Zipper" },
    { label: "Sales Package", value: "1 piece Laptop Messenger Bag" },
    { label: "Leather Type", value: "Top Grain" },
    { label: "Weight", value: "700 g" },
    { label: "Compartments", value: "1 main compartments with with inner slip pockets" },
    { label: "Covered in Warranty", value: "Warranty Covers Only Manufacturing Defects" },
    { label: "Domestic Warranty", value: "1 Year" },
];

function ProductDetailsPage() {
    const navigate = useNavigate();
    const { categorySlug, subCategorySlug, productId } = useParams();
    const [pincode, setPincode] = useState(700000);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [data, setData] = useState([]);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productDetails, setProductDetails] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [zoomOrigin, setZoomOrigin] = useState(null);
    const { addToCart } = useCart();
    const { toggleWishList, isInWishList, user } = useAuth();
    const wishListed = isInWishList(productId);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const productDetails = await getProductDetailsAPI(productId);
                const data = await getRelatedProductsAPI(productId);
                if (!cancelled) {
                    setSimilar(data.similar);
                    setData(data.youMayAlsoLike);
                    setProductDetails(productDetails.data);
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [productId]);

    const pincodeVerify = async () => {
        const data = await getPincodeAPI(pincode);
        if (data?.data?.serviceable) {
            setMessage(data?.data?.message || "Available at your Pincode");
            setMessageType('success');
        } else {
            setMessage(data?.message || "Not-availble at your pincode");
            setMessageType('error');
        }
    }

    const handleBuyNow = async (productId) => {
        // The server orders the whole cart, so show all of it
        if (await addToCart(productId, quantity)) navigate(`/cart`);
    };

    const corporateContact = () => {
        navigate("/bulkContact");
    }

    const handleImages = (index) => {
        setActiveImage(index);
    };

    const handleZoom = (e) => {
        const box = e.currentTarget.getBoundingClientRect();
        setZoomOrigin(`${((e.clientX - box.left) / box.width) * 100}% ${((e.clientY - box.top) / box.height) * 100}%`);
    };

    if (loading) {
        return (
            <section>
                <Breadcrumb loading />
                <div className="flex flex-col justify-between w-full px-8 bg-white lg:flex-row lg:h-135">
                    <div className="flex flex-col-reverse lg:flex-row w-full lg:w-1/2 xl:w-[45%] pt-3">
                        <div className="flex flex-row lg:flex-col justify-center lg:justify-start gap-2">
                            <div className="w-16 h-16 rounded-lg bg-gray-300 animate-pulse" />
                            <div className="w-16 h-16 rounded-lg bg-gray-300 animate-pulse" />
                            <div className="w-16 h-16 rounded-lg bg-gray-300 animate-pulse" />
                            <div className="w-16 h-16 rounded-lg bg-gray-300 animate-pulse" />
                        </div>
                        <div className="w-full my-4 lg:flex-1 lg:mx-4 lg:my-10">
                            <div className="h-90 rounded-md bg-gray-300 animate-pulse" />
                        </div>
                    </div>
                    <div className="w-full lg:flex-1 py-10">
                        <div className="h-8 w-3/4 mb-4 rounded bg-gray-300 animate-pulse" />
                        <div className="h-8 w-1/3 mb-8 rounded bg-gray-300 animate-pulse" />
                        <div className="h-10 w-24 mb-8 rounded bg-gray-300 animate-pulse" />
                        <div className="h-4 w-full mb-2 rounded bg-gray-300 animate-pulse" />
                        <div className="h-4 w-full mb-2 rounded bg-gray-300 animate-pulse" />
                        <div className="h-4 w-2/3 rounded bg-gray-300 animate-pulse" />
                    </div>
                </div>
                <div className="flex flex-col gap-4 m-4">
                    <SliderItem loading />
                    <SliderItem loading />
                </div>
            </section>
        );
    }

    if (error) {
        return <p>Error : {error}</p>
    };

    const itemDetails = {
        id: productDetails.id,
        title: productDetails.title,
        price: productDetails.price,
        oldPrice: productDetails.oldPrice,
        discount: productDetails.discount,
        img: productDetails.images?.[0]?.url,
    }

    const handleQuantityChange = (e) => {
        setQuantity(Number(e.target.value));
    };

    return (
        <section>
            <Breadcrumb
                paths={[
                    { title: productDetails?.categoryRef?.name ?? categorySlug, link: `/categories/${categorySlug}` },
                    { title: productDetails?.subcategoryRef?.name ?? subCategorySlug, link: `/categories/${categorySlug}/${subCategorySlug}` },
                    { title: productDetails?.title ?? productId, link: `/categories/${categorySlug}/${subCategorySlug}/${productId}` },
                ]}
            />
            <div className="flex flex-col justify-between w-full px-8 bg-white lg:flex-row lg:h-135">
                <div className="flex flex-col w-full lg:w-1/2 xl:w-[45%] pt-3 relative">
                    <div className="flex flex-col-reverse lg:flex-row">
                        <div className="flex flex-row lg:flex-col justify-center-safe lg:justify-start gap-2 overflow-x-auto">
                            {(productDetails?.images || []).map((img, index) => {
                                return (
                                    <div key={img.id} className={`w-16 h-16 shrink-0 p-2 rounded-lg border-2 ${activeImage === index ? "border-[#fb641b]" : "border-transparent"}`}>
                                        <img src={img.url} alt={productDetails?.title} className="w-full h-full cursor-pointer object-contain" onClick={() => handleImages(index)} />
                                    </div>
                                )
                            })}
                        </div>
                        <div className="w-full my-4 lg:flex-1 lg:mx-4 lg:my-10">
                            <div className="h-90 overflow-hidden" onMouseMove={handleZoom} onMouseLeave={() => setZoomOrigin(null)}>
                                <img src={productDetails?.images?.[activeImage]?.url}
                                    alt={productDetails?.title}
                                    style={{ transformOrigin: zoomOrigin }}
                                    className={`w-full h-full cursor-zoom-in object-contain transition-transform duration-200 ${zoomOrigin ? "scale-200" : ""}`} />
                            </div>
                            <div className="hidden lg:flex justify-center gap-5 mt-5">
                                <button className="px-9 py-2 bg-white cursor-pointer border-2 border-[#fb641b] whitespace-nowrap hover:-translate-y-2 transition-transform duration-200 ease-out"
                                    onClick={() => addToCart(productId, quantity)}>ADD TO CART</button>
                                <button className="px-9 py-2 bg-[#fb641b] text-white cursor-pointer whitespace-nowrap hover:-translate-y-2 transition-transform duration-200 ease-out"
                                    onClick={() => handleBuyNow(productId)}>BUY NOW</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:flex-1 py-10 overflow-x-hidden lg:overflow-y-scroll no-scrollbar">
                    <div>
                        <div className="flex items-center justify-between">
                            <h1 className="text-[18px] lg:text-4xl lg:leading-10">{productDetails.title}</h1>
                            <div className="bg-white cursor-pointer">
                                {user ?
                                    <Heart
                                        size={24}
                                        strokeWidth={2}
                                        className={wishListed ? "fill-red-500 text-red-500 cursor-pointer" : "fill-white text-gray-600 cursor-pointer"}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            toggleWishList(itemDetails);
                                        }}
                                    />
                                    : null}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 my-2">
                            <p className="text-[18px] lg:text-4xl">₹{productDetails.price} </p>
                            {productDetails.oldPrice && (
                                <>
                                    <p className="text-[18px] line-through text-gray-600 lg:text-2xl">₹{productDetails.oldPrice}</p>
                                    <p className="text-[18px] text-[#fb641b] font-medium lg:text-md">{productDetails.discount}</p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex  w-[50%]">
                        <div className="flex flex-col sm:w-" >
                            <h1 className="text-lg font-semibold">Quantity</h1>
                            <div>
                                <select value={quantity} onChange={handleQuantityChange} className="w-full h-full text-center cursor-pointer border-2 rounded-md border-gray-500">
                                    <option value="" disabled>Qty</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                                        <option key={count} value={count}>{count}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <button className="mt-15 text-[#fb641b] font-semibold cursor-pointer" onClick={corporateContact} >For bulk - Click here</button>
                    <div className="flex items-center gap-4 mt-5">
                        <h2 className="text-[18px] font-medium text-gray-500 shrink-0">Delivery </h2>
                        <div className="flex items-center gap-2 border-b-2 border-[#fb641b] p-2 min-w-0">
                            <MapPin className="text-[#fb641b] shrink-0" />
                            <input onChange={e => setPincode(e.target.value)} type="text" value={pincode} className="w-[100px] outline-none min-w-0" />
                            <button className="text-[#fb641b] font-medium cursor-pointer shrink-0" onClick={pincodeVerify}>Check</button>
                        </div>
                    </div>
                    <p className={`${messageType === 'error' ? 'text-[#fb641b]' : 'text-green-500'} font-medium ml-21`}>{message}</p>
                    <div className="py-4 h-20 ">
                        <div className="w-full h-0.5 bg-gray-500 mb-4"></div>
                        <p className="text-[18px] lg:text-2xl ml-5">Product Details</p>
                        <div className="w-full h-0.5 bg-gray-500 mt-4"></div>
                    </div>
                    <p className="max-sm:text-[12px] text-[16px] my-4">
                        BUY 100% Original Leather Products From MARFIT. Leather will long last and will never peel off like an artificial Leather. Customer satisfaction guaranteed. PRODUCT DETAIL : Removable, adjustable nylon long shoulder strap | Metal Hardware : durable enough for daily use Zip-top closure pure genuine leather CFC zipper | Handle type : Fixed solid full grain leather double handle , carried in 3 ways Handbags , Shoulder bag & Satchels . TO PROCESS AND CLAIM WARRANTY : Customer needs to send the product to the MARFIT, Kolkata. The Product will be rectified and send back to the Customer. This warranty shall be void if the product is damaged due to misuse, abuse, physical mishandling or natural causes such as flood, fire, earthquake or other perils.
                    </p>
                    <div className="sm:leading-6 max-sm:text-[14px] md:leading-10">
                        {specs.map((spec) => (
                            <div key={spec.label} className="flex items-start gap-4">
                                <h1 className="text-[#878787] shrink-0 w-1/2">{spec.label}</h1>
                                <p className="flex-1">{spec.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="py-4 h-20">
                        <div className="w-full h-0.5 bg-gray-300 mb-4"></div>
                        <p className="text-2xl font-semibold ml-5 max-sm:text-[12px]">Ratings & Review</p>
                        <p className="text-center my-10 max-sm:text-[12px]">No ratings or reviews</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 m-4">
                <SliderItem title="Similar Products" list={similar} />
                <SliderItem title="You may also like" list={data} />
            </div>
            <div className="lg:hidden sticky bottom-0 z-1 flex justify-center gap-5 md:px-10 p-3 bg-white">
                <button className="flex-1 py-2 bg-white cursor-pointer border-2 border-[#fb641b] whitespace-nowrap hover:-translate-y-2 transition-transform duration-200 ease-out" onClick={() => addToCart(productId, quantity)}>ADD TO CART</button>
                <button className="flex-1 py-2 bg-[#fb641b] text-white cursor-pointer whitespace-nowrap hover:-translate-y-2 transition-transform duration-200 ease-out" onClick={() => handleBuyNow(productId)}>BUY NOW</button>
            </div>
        </section >
    );
}

export default ProductDetailsPage;