import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "swiper/css";
import "swiper/css/navigation";
import { AuthProvider } from "./context/AuthProvider";
import { CartProvider } from "./context/CartProvider";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import OrdersPage from "./pages/dashboard/OrdersPage";
import WishlistPage from "./pages/dashboard/WishlistPage";
import AddressPage from "./pages/dashboard/AddressPage";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductListRoute from "./pages/ProductListRoute";
import ProductDetailsRoute from "./pages/ProductDetailsRoute";
import EmbossPage from "./pages/EmbossPage";
import FranchisePage from "./pages/FranchisePage";
import BulkContactPage from "./pages/BulkContactPage";
import ContactPage from "./pages/ContactPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import ShippingPolicyPage from "./pages/ShippingPolicyPage";
import CartPage from "./pages/CartPage";
import CollectionPage from "./pages/CollectionPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <div className="w-full bg-[#eef0f3]">
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories/:slug" element={<CategoryPage />} />
              <Route path="/categories/:categorySlug/:subCategorySlug" element={<ProductListRoute />} />
              <Route path="/categories/:categorySlug/:subCategorySlug/:productId" element={<ProductDetailsRoute />} />
              <Route path="/emboss" element={<EmbossPage />} />
              <Route path="/franchise" element={<FranchisePage />} />
              <Route path="/bulkContact" element={<BulkContactPage />} />
              <Route path="/ContactForm" element={<ContactPage />} />
              <Route path="/TrackOrder" element={<TrackOrderPage />} />
              <Route path="/TermsAndCondition" element={<TermsAndConditionsPage />} />
              <Route path="/ShippingPolicy" element={<ShippingPolicyPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/dashboard" element={<DashboardPage />}>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="address" element={<AddressPage />} />
              </Route>
              <Route path="/:slug" element={<CollectionPage />} />
              <Route path="*" element={<NotFoundPage />} />
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
