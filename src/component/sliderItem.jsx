import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import ProductCard from "./ProductCard";

const SliderItem = ({ title, handleViewAll, list, loading = false }) => {
    const swiperRef = useRef(null);


    return (
        <div className="p-3 rounded-md bg-white w-full">
            {loading ? (
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="h-5 w-40 rounded bg-gray-300 animate-pulse"></h1>
                        <div className="flex items-center gap-2 my-1">
                            <span className="w-15 h-0.5 rounded bg-gray-300 animate-pulse"></span>
                            <span className="w-0.5 h-4 rotate-42 rounded bg-gray-300 animate-pulse"></span>
                            <span className="w-0.5 h-4 rotate-42 rounded bg-gray-300 animate-pulse"></span>
                            <span className="w-15 h-0.5 rounded bg-gray-300 animate-pulse"></span>
                        </div>
                    </div>
                    {handleViewAll && (
                        <span className="h-9 w-24 rounded bg-gray-300 animate-pulse"></span>
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-base md:text-xl">{title}</h1>
                        <div className="flex items-center gap-2 my-1">
                            <span className="w-15 h-0.5 bg-black"></span>
                            <span className="w-0.5 h-4 bg-black rotate-42"></span>
                            <span className="w-0.5 h-4 bg-black rotate-42"></span>
                            <span className="w-15 h-0.5 bg-black"></span>
                        </div>
                    </div>
                    {handleViewAll && (
                        <button
                            className="text-white text-sm bg-[#fb641b] px-6 py-2 rounded cursor-pointer"
                            onClick={handleViewAll}
                        >
                            View All
                        </button>
                    )}
                </div>
            )}

            <div className="relative w-full">
                <Swiper
                    modules={[Navigation, A11y]}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
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
                    {loading
                        ?
                        Array.from({ length: 6 }).map((placeholder, index) => (
                            <SwiperSlide key={index} className="w-full">
                                <div
                                    className="cursor-pointer p-2 h-80"
                                    style={{
                                        borderTop: "1px solid rgba(0,0,0,.03)",
                                        borderLeft: "1px solid rgba(0,0,0,.1)",
                                        boxShadow: "1px 2px 3px rgba(0,0,0,.2)"
                                    }}
                                >
                                    <div className='relative flex justify-between'>
                                        <img className="h-45 min-w-0 rounded-md w-full bg-gray-300 animate-pulse" />
                                    </div>
                                    <div className="mt-3">
                                        <p className="h-4 w-full mb-2 rounded bg-gray-300 animate-pulse"></p>
                                        <p className="h-4 w-1/2 mb-2 rounded bg-gray-300 animate-pulse"></p>
                                        <div className="flex items-center gap-2">
                                            <p className="h-4 w-12 rounded bg-gray-300 animate-pulse"></p>
                                            <span className="h-4 w-10 rounded bg-gray-300 animate-pulse"></span>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                        :
                        list.map((item) => (
                            <SwiperSlide key={item.id} className="w-full">
                                <ProductCard item={item} loading={loading} />
                            </SwiperSlide>
                        ))}
                </Swiper>

                <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-black w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                </button>
                <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-black w-10 h-10 rounded-full shadow-xl flex items-center justify-center transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </button>
            </div>
        </div >
    )
}

export default SliderItem;