import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import "swiper/css";
import "swiper/css/navigation";

import { AuthProvider } from "./context/AuthProvider";
import { CartProvider } from "./context/CartProvider";

import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Dashboard from "./component/Dashboard";
import Profile from "./component/Profile";
import Orders from "./component/Orders";
import Wishlist from "./component/Wishlist";
import Address from "./component/Address";
import AddressDetails from "./component/AddressDetails";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import SubCategories from "./pages/SubCategories";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import Embose from "./pages/Embose";
import Franchise from "./pages/Franchise";
import BulkContact from "./pages/BulkContact";
import ContactForm from "./pages/ContactForm";
import TrackingOrders from "./pages/TrackingOrders";
import TermsAndCondition from "./pages/TermsAndCondition";
import ShippingPolicy from "./pages/ShippingPolicy";
import CartPage from "./pages/cartPage";
import CollectionContent from "./pages/CollectionContent";
import NotFound from "./pages/notFound";

function App() {
  return (
    <div className="w-full bg-[#eef0f3]">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories/:slug" element={<Categories />} />
              <Route path="/categories/:categorySlug/:subCategorySlug" element={<SubCategories />} />
              <Route path="/categories/:parentId/:subId/:productId" element={<ProductDetailsPage />} />
              <Route path="/emboss" element={<Embose />} />
              <Route path="/franchise" element={<Franchise />} />
              <Route path="/bulkContact" element={<BulkContact />} />
              <Route path="/ContactForm" element={<ContactForm />} />
              <Route path="/TrackOrder" element={<TrackingOrders />} />
              <Route path="/TermsAndCondition" element={<TermsAndCondition />} />
              <Route path="/ShippingPolicy" element={<ShippingPolicy />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/AddressDetails" element={<AddressDetails />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route path="profile" element={<Profile />} />
                <Route path="orders" element={<Orders />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="address" element={<Address />} />
              </Route>
              <Route path="/:slug" element={<CollectionContent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
