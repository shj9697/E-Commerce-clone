import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import "swiper/css";
import "swiper/css/navigation";
import { AuthProvider } from "./context/AuthProvider";
import { CartProvider } from "./context/CartProvider";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import Orders from "./pages/dashboard/Orders";
import Wishlist from "./pages/dashboard/Wishlist";
import Address from "./pages/dashboard/Address";
import AddressDetails from "./pages/dashboard/AddressDetails";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import SubCategoriesRoute from "./pages/SubCategoriesRoute";
import ProductDetailsRoute from "./pages/ProductDetailsRoute";
import Emboss from "./pages/Emboss";
import Franchise from "./pages/Franchise";
import BulkContact from "./pages/BulkContact";
import ContactForm from "./pages/ContactForm";
import TrackingOrders from "./pages/TrackingOrders";
import TermsAndCondition from "./pages/TermsAndCondition";
import ShippingPolicy from "./pages/ShippingPolicy";
import CartPage from "./pages/CartPage";
import CollectionContent from "./pages/CollectionContent";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="w-full bg-[#eef0f3]">
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories/:slug" element={<Categories />} />
              <Route path="/categories/:categorySlug/:subCategorySlug" element={<SubCategoriesRoute />} />
              <Route path="/categories/:categorySlug/:subCategorySlug/:productId" element={<ProductDetailsRoute />} />
              <Route path="/emboss" element={<Emboss />} />
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
