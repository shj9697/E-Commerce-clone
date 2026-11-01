import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Breadcrumb from "../component/Breadcrumb";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Heart, MapPin } from "lucide-react";
import { useCart } from "../context/CartProvider";
import { useAuth } from "../context/AuthProvider";
import ProductCard from "../component/ProductCard";
import { getProductDetailsAPI, getRelatedProductsAPI } from "../api/productapi";
import { getPincodeAPI } from "../api/home";

function ProductDetailsPage() {
    const navigate = useNavigate();
    const { parentId, subId, productId } = useParams();
    const similarSwiperRef = useRef(null);
    const alsoLikeSwiperRef = useRef(null);
    const [pincode, setPincode] = useState(700000);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [data, setData] = useState([]);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productDetails, setProductDetails] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
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
        const { data } = await getPincodeAPI(pincode);
        if (data?.serviceable) {
            setMessage(data?.message || "Available at your Pincode");
            setMessageType('success');
        } else {
            setMessage(data?.message || "Not-availble at your pincode");
            setMessageType('error');
        }
    }

    const handleBuyNow = async (productId) => {
        await addToCart(productId);
        // The server orders the whole cart, so show all of it
        navigate(`/cart`);
    };

    const corporateContact = () => {
        navigate(`/bulkContact?SKU`);
    }

    const handleImages = (index) => {
        setActiveImage(index);
    };

    if (loading) {
        return <p>Loading......</p>
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

    const handleQuantityChange = async (e) => {
        const selectedQuantity = Number(e.target.value);
        setQuantity(selectedQuantity);
        await addToCart(productId, selectedQuantity);
    };

    return (
        <section>
            <Breadcrumb
                paths={[
                    { title: productDetails?.categoryRef?.name ?? parentId, link: `/categories/${parentId}` },
                    { title: productDetails?.subcategoryRef?.name ?? subId, link: `/categories/${parentId}/${subId}` },
                    { title: productDetails?.slug ?? productId, link: `/categories/${parentId}/${subId}/${productId}` },
                ]}
            />
            <div className="flex flex-col justify-between w-full px-8 bg-white lg:flex-row lg:h-135">
                <div className="flex flex-col w-full lg:w-1/2 xl:w-[45%] pt-3 relative">
                    <div className="flex flex-col-reverse lg:flex-row">
                        <div className="flex flex-row lg:flex-col justify-center-safe lg:justify-start gap-2 overflow-x-auto">
                            {(productDetails?.images || []).map((img, index) => {
                                return (
                                    <div key={img.id} className={`w-16 h-16 shrink-0 p-2 rounded-lg border-2 ${activeImage === index ? "border-[#fb641b]" : "border-transparent"}`}>
                                        <img src={img.url} alt={img.alt} className="w-full h-full cursor-pointer object-contain" onClick={() => handleImages(index)} />
                                    </div>
                                )
                            })}
                        </div>
                        <div className="w-full my-4 lg:flex-1 lg:mx-4 lg:my-10">
                            <div className="h-90">
                                <img src={(productDetails?.images || [])?.[activeImage]?.url || ""} alt={(productDetails?.images || [])?.[activeImage]?.alt || "product-image"} className="w-full h-full cursor-pointer object-contain" />
                            </div>
                            <div className="hidden lg:flex justify-center gap-5 mt-5">
                                <button className="px-9 py-2 bg-white cursor-pointer border-2 border-[#fb641b] whitespace-nowrap hover:-translate-y-2 transition-transform duration-200 ease-out" onClick={() => addToCart(productId)}>ADD TO CART</button>
                                <button className="px-9 py-2 bg-[#fb641b] text-white cursor-pointer whitespace-nowrap hover:-translate-y-2 transition-transform duration-200 ease-out" onClick={() => handleBuyNow(productId)}>BUY NOW</button>
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
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
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
                        <div className="flex items-start gap-4">
                            <h1 className="text-[#878787] shrink-0 w-1/2">Height</h1>
                            <p className="flex-1">32 cm</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <h1 className="text-[#878787] shrink-0 w-1/2">Width</h1>
                            <p className="flex-1">45 cm</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <h1 className="text-[#878787] shrink-0 w-1/2">Thickness</h1>
                            <p className="flex-1">7 cm</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <h1 className="text-[#878787] shrink-0 w-1/2">Model Name</h1>
                            <p className="flex-1">Genuine Leather Laptop Messenger Bag</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <h1 className="text-[#878787] shrink-0 w-1/2">Closure</h1>
                            <p className="flex-1">Zipper</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <h1 className="text-[#878787] shrink-0 w-1/2">Sales Package</h1>
                            <p className="flex-1">1 piece Laptop Messenger Bag</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <h1 className="text-[#878787] shrink-0 w-1/2">Leather Type</h1>
                            <p className="flex-1">Top Grain</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <h1 className="text-[#878787] shrink-0 w-1/2">Weight</h1>
                            <p className="flex-1">700 g</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <h1 className="text-[#878787] shrink-0 w-1/2">Compartments</h1>
                            <p className="flex-1">1 main compartments with with inner slip pockets</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <h1 className="text-[#878787] shrink-0 w-1/2">Covered in Warranty</h1>
                            <p className="flex-1">Warranty Covers Only Manufacturing Defects</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <h1 className="text-[#878787] shrink-0 w-1/2">Domestic Warranty</h1>
                            <p className="flex-1">1 Year</p>
                        </div>
                    </div>
                    <div className="py-4 h-20">
                        <div className="w-full h-0.5 bg-gray-300 mb-4"></div>
                        <p className="text-2xl font-semibold ml-5 max-sm:text-[12px]">Ratings & Review</p>
                        <p className="text-center my-10 max-sm:text-[12px]">No ratings or reviews</p>
                    </div>
                </div>
            </div>
            <div className="m-4 rounded-md bg-white ">
                <div className="flex">
                    <div className="flex flex-col p-3">
                        <h1 className="text-2xl font-normal">Similar Products</h1>
                        <div className="flex items-center gap-2 my-1">
                            <span className="w-15 h-px bg-black"></span>
                            <span className="w-px h-4 bg-black rotate-45"></span>
                            <span className="w-px h-4 bg-black rotate-45"></span>
                            <span className="w-15 h-px bg-black"></span>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <Swiper
                        modules={[Navigation, A11y]}
                        onSwiper={(swiper) => (similarSwiperRef.current = swiper)}
                        spaceBetween={20}
                        slidesPerView={6}
                        className="py-4"
                        breakpoints={{
                            320: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 4,
                            },
                            1024: {
                                slidesPerView: 5,
                            },
                            1440: {
                                slidesPerView: 6
                            }
                        }}
                    >
                        {similar.map((item) => (
                            <SwiperSlide key={item.id} className="w-60! h-84!">
                                <ProductCard item={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        onClick={() => similarSwiperRef.current?.slidePrev()}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white-600 text-black w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button
                        onClick={() => similarSwiperRef.current?.slideNext()}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white-900 text-black w-10 h-10 rounded-full shadow-xl flex items-center justify-center transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="m-4 p-3 rounded-md bg-white ">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-normal">You may also like</h1>
                        <div className="flex items-center gap-2 my-1">
                            <span className="w-15 h-px bg-black"></span>
                            <span className="w-px h-4 bg-black rotate-45"></span>
                            <span className="w-px h-4 bg-black rotate-45"></span>
                            <span className="w-15 h-px bg-black"></span>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <Swiper
                        modules={[Navigation, A11y]}
                        onSwiper={(swiper) => (alsoLikeSwiperRef.current = swiper)}
                        spaceBetween={20}
                        slidesPerView={6}
                        className="py-4"
                        breakpoints={{
                            320: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 4,
                            },
                            1024: {
                                slidesPerView: 5,
                            },
                            1440: {
                                slidesPerView: 6
                            }
                        }}
                    >
                        {data.map((item) => (
                            <SwiperSlide key={item.id} className="w-60! h-84!">
                                <ProductCard item={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        onClick={() => alsoLikeSwiperRef.current?.slidePrev()}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white-600 text-black w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button
                        onClick={() => alsoLikeSwiperRef.current?.slideNext()}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white-900 text-black w-10 h-10 rounded-full shadow-xl flex items-center justify-center transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="lg:hidden sticky bottom-0 z-1 flex justify-center gap-5 md:px-10 p-3 bg-white">
                <button className="flex-1 py-2 bg-white cursor-pointer border-2 border-[#fb641b] whitespace-nowrap hover:-translate-y-2 transition-transform duration-200 ease-out" onClick={() => addToCart(productId)}>ADD TO CART</button>
                <button className="flex-1 py-2 bg-[#fb641b] text-white cursor-pointer whitespace-nowrap hover:-translate-y-2 transition-transform duration-200 ease-out" onClick={() => handleBuyNow(productId)}>BUY NOW</button>
            </div>
        </section >
    );
}

export default ProductDetailsPage;