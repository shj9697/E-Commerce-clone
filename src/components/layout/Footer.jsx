import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="flex flex-col mt-16">
      <div className="bg-black rounded-none lg:rounded-tl-[45px] w-full lg:w-[95%] lg:ml-auto p-12 flex flex-col">
        <div className="flex flex-col md:flex-row md:gap-8">
          <div className="w-full md:w-[60%] min-w-0">
            <div className="flex flex-col items-start">
              <img src="data:image/png;base64,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"
                alt=""
                className="h-20 mt-4 object-contain"
              />
              <p className="w-full md:leading-4 md:text-[14px] lg:text-[16px] lg:leading-5 text-gray-500 leading-6 mt-4 max-w-[480px] text-[16px]">
                Marfit Stores are committed to providing each customer with the
                highest standard of customer service. Our goal is to sell finest
                exclusive leather and pu products. We will be introducing lot of
                unique products in different genres in the coming future. Keep
                an eye.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-5 mt-6">
              <div>
                <h1 className="md:text-[14px] text-white text-[17px] font-normal ">COMPANY</h1>
                <div className="md:leading-5 md:mt-2 lg:leading-8 text-gray-500 leading-9">
                  <Link to="/TrackOrder" className=" md:text-[14px] cursor-pointer text-[15px] whitespace-nowrap">Track Orders</Link>
                  <p className="md:text-[14px] text-[15px] ">About Us</p>
                  <Link to="/ContactForm" className="md:text-[14px] cursor-pointer text-[15px]">Contact</Link>
                </div>
              </div>
              <div>
                <h1 className="md:text-[14px] text-white text-[17px] font-normal whitespace-nowrap">POLICY & RULES</h1>
                <div className="md:leading-5 md:mt-2 lg:leading-8 flex flex-col text-gray-500 leading-9">
                  <Link to="/TermsAndCondition" className="md:text-[14px] cursor-pointer text-[15px] whitespace-nowrap"> Terms & Conditions</Link>
                  <Link to="/ShippingPolicy" className="md:text-[14px] cursor-pointer text-[15px]"> Shipping Policy</Link>
                </div>
              </div>
              <div className="">
                <h1 className="md:text-[14px] lg:text-[14px] text-white text-[17px] font-normal ">SUPPORT</h1>
                <div className="md:leading-5 md:mt-2 lg:leading-8 text-gray-500 leading-9">
                  <Link to="tel:+919875555937" className="md:text-[14px] lg:text-[14px] flex items-center whitespace-nowrap gap-1">
                    <Phone className="size-4" />
                    <p className="text-sm md:text-base">+91 98755 55937</p>
                  </Link>
                  <Link to="mailto:info@marfit.com" className=" md:text-[14px] lg:text-[14px] flex items-center whitespace-nowrap gap-1">
                    <Mail className="md:size-4 size-5" />
                    <p className="text-sm md:text-base">info@marfit.in</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[40%] pt-10 flex flex-col">
            <div className="flex items-center justify-start gap-5 lg:gap-2 text-white">
              <Link to='https://www.facebook.com/MarfitStores' className="cursor-pointer">
                <Facebook className="md:size-10 size-10" />
              </Link>
              <Link to="https://www.instagram.com/marfit.in" className="cursor-pointer">
                <Instagram className="md:size-10 size-10" />
              </Link>
            </div>
            <div className="flex flex-col items-center md:items-start mt-4">
              <h3 className="text-sm md:text-base font-sans italic whitespace-nowrap text-white">We Accept</h3>
              <img
                src="https://marfit-ea7ba.web.app/static/media/card.9ec34625.png"
                alt="cards"
                className="h-8 mt-4 object-contain object-center md:object-left sm:h-10 sm:w-[400px]"
              />
            </div>
          </div>
        </div>
        <span className="border-b-2 w-full my-4 lg:border-b-3 border-white bg-white"></span>
        <p className="text-sm md:text-base text-center text-white font-normal">
          © Copyright 2020 . All rights reserved | Powered by{" "}
          <span className="text-orange-600">Augend Tech</span>
        </p>
      </div>
    </div >
  );
}

export default Footer;
