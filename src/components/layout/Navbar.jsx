import { User, ShoppingCart, Search, X, Menu, ChevronDown, MoveUpRight } from "lucide-react";
import CategoryDropdown from "./CategoryDropdown";
import SearchBar from "./SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartProvider";
import { useEffect, useState } from "react";
import { getProductCategoriesAPI } from "../../api/productCategoriesApi";
import AuthModal from "../common/AuthModal";
import { useAuth } from "../../context/AuthProvider";
import ProfileDropdown from "./ProfileDropdown";
import SideBarModal from "./SideBarModal";
import brandIcon from "../../assets/brand-icon.png";
import brandLogo from "../../assets/brand-logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [MenuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  function toggleCategory(categoryId) {
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null);
    } else {
      setExpandedCategoryId(categoryId);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getProductCategoriesAPI();
        if (!cancelled)
          setCategories(data.categories);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return <p>Error : {error}</p>
  };

  function handleViewCart() {
    navigate("/cart")
  }
  const handleClick = () => {
    navigate("/")
  }

  const sideBarLinks = [
    {
      label: "Contact Us",
      path: "/ContactForm"
    },
    {
      label: "Corporate Gifting",
      path: "/bulkContact"
    },
    {
      label: "Franchise",
      path: "/franchise"
    },
    {
      label: "Terms & Conditions",
      path: "/TermsAndCondition"
    },
  ];

  const accountLinks = [
    {
      label: "Profile",
      path: "/dashboard/profile"
    },
    {
      label: "My Orders",
      path: "/dashboard/orders"
    },
    {
      label: "Wishlist",
      path: "/dashboard/wishlist"
    },
  ];

  return (
    <>
      <div className="sticky top-0 z-50 w-full flex items-center justify-between h-15 px-3 md:px-8 shadow-[0_2px_4px_0_#c9ccd1] bg-white">
        <div className={`md:hidden absolute inset-y-0 right-0 z-10 overflow-x-clip bg-white transition-[width,visibility] duration-500 ease-out ${isSearchOpen ? "w-full visible" : "w-0 invisible"}`}>
          <div className="flex items-center gap-3 h-full px-8">
            <SearchBar isMobile onSelect={() => setIsSearchOpen(false)} />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="cursor-pointer shrink-0"
            >
              <X />
            </button>
          </div>
        </div>
        <div className="w-fit md:w-1/3 flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden cursor-pointer shrink-0"
          >
            <Menu />
          </button>
          <button onClick={handleClick} className="flex items-center gap-1 py-1 cursor-pointer">
            <img src={brandIcon} className="h-7 min-[360px]:h-9 object-contain" />
            <img src={brandLogo} className="h-7 min-[360px]:h-9 object-contain" />
          </button>
        </div>
        <SearchBar />
        <div className="flex justify-end items-center gap-4 w-fit md:w-1/3">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="cursor-pointer"
            >
              <Search />
            </button>
          </div>
          <div className="flex items-center justify-center gap-4 h-full w-fit">
            {user ?
              <ProfileDropdown />
              :
              <button className="flex items-center justify-center text-[14px] w-fit py-0 rounded-full outline-none border-gray-300 cursor-pointer text-[#fb641b]"
                onClick={() => setIsOpen(true)}
              >
                <User className="h-5 fill-[#fb641b]" />
                <span className="hidden md:block whitespace-nowrap">LOGIN /SIGN UP</span>
              </button>
            }
            <button
              className="relative py-0 rounded-full outline-none border-0 cursor-pointer flex items-center text-[14px] gap-1 w-fit"
              onClick={handleViewCart}
            >
              <ShoppingCart className="h-5 w-5 fill-black" />
              {cart.totalItems > 0 && (
                <span className="absolute -top-3 w-4 h-4 -left-2 lg:-top-4 lg:-left-4  lg:w-6 lg:h-6 flex items-center justify-center bg-[#fb641b] text-white text-[10px] leading-none rounded-full">
                  {cart.totalItems > 10 ? "10+" : cart.totalItems}
                </span>
              )}
              <span className="hidden md:inline">CART</span>
            </button>
          </div>
        </div>
      </div>
      <div className="lg:sticky lg:top-15 lg:z-40">
        <CategoryDropdown />
      </div>
      <SideBarModal isOpen={MenuOpen} onClose={() => setMenuOpen(false)}>
        <nav className="flex flex-col text-[18px] font-semibold">
          <Link
            to="/"
            className="flex items-center px-4 pb-4 mb-4 border-b-2 border-gray-400"
            onClick={() => setMenuOpen(false)}
          >
            <img src={brandIcon} className="h-14 object-contain" />
          </Link>
          {!user && (
            <button className="flex items-center border-b border-gray-200 p-5 gap-2"
              onClick={() => {
                setMenuOpen(false);
                setIsOpen(true);
              }}>
              <p className="flex items-center gap-2 text-[#fb641b] font-normal text-left">Login</p>
              <MoveUpRight size={16} className="text-[#fb641b]" />
            </button>
          )}
          {user && accountLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="p-5 border-b border-gray-200 font-normal text-[16px] hover:text-[#fb641b]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/"
            className="p-5 border-b border-gray-200 font-normal text-[16px] hover:text-[#fb641b]"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          {categories.map((category) => {
            const isThisCategoryOpen = expandedCategoryId === category.id;
            return (
              <div key={category.id} className="border-b border-gray-200">
                <div className={`flex items-center justify-between p-5 ${isThisCategoryOpen && "pb-0"}`}>
                  <Link
                    to={`/categories/${category.slug}`}
                    className="flex-1 font-normal text-[16px] hover:text-[#fb641b]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="p-2 cursor-pointer"
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${isThisCategoryOpen ? "rotate-180" : null}`}
                    />
                  </button>
                </div>
                <div className={isThisCategoryOpen ? "flex flex-col" : "hidden"}>
                  <ul>
                    {category.children
                      .map(child => (
                        <li key={child.id}>
                          <Link
                            to={`/categories/${category.slug}/${child.slug}`}
                            className="flex items-center gap-2 px-5 py-3 text-[16px] font-normal text-gray-700 hover:text-[#fb641b]"
                            onClick={() => setMenuOpen(false)}
                          >
                            {child.imageUrl && (
                              <img src={child.imageUrl} alt={child.name} className="w-5 h-5 object-contain" />
                            )}
                            {child.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            );
          })}
          {sideBarLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="p-5 border-b border-gray-200 font-normal text-[16px] hover:text-[#fb641b]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <button
              className="p-5 border-b border-gray-200 font-normal text-[16px] text-left hover:text-[#fb641b] cursor-pointer"
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
            >
              Logout
            </button>
          )}
        </nav>
      </SideBarModal>
      {/* Login/Signup Model */}
      <AuthModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </>
  );
};
export default Navbar;
