import { ChevronDown, Heart, Lock, LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";


function ProfileDropdown() {

    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const profileMenus = [
        {
            id: "profile",
            name: "Profile",
            path: '/dashboard',
            icon: <UserRound className="size-4" />
        },
        {
            id: "wishlist",
            name: "Wishlist",
            path: '/dashboard/wishlist',
            icon: <Heart className="size-4" />
        },
        {
            id: "orders",
            name: "My Orders",
            path: '/dashboard/orders',
            icon: <Lock className="size-4" />
        },
        {
            id: "logout",
            name: "Logout",
            onClick: logout,
            icon: <LogOut className="size-4" />
        },
    ]

    return (
        <div className="relative group h-full">
            {isOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            )}
            <Link
                to="/dashboard"
                className="flex lg:hidden items-center cursor-pointer hover:text-[#fb641b] h-full w-fit"
            >
                <UserRound className="size-5" />
            </Link>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="hidden lg:flex items-center gap-1 cursor-pointer hover:text-[#fb641b] h-full w-fit"
            >
                <UserRound className="size-5 lg:hidden" />
                <span className="hidden lg:inline font-medium whitespace-nowrap">{user?.name || "U"}</span>
                <ChevronDown
                    size={16}
                    className={`hidden lg:block lg:group-hover:rotate-180 transition-all duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            {/* child menus */}
            <div className={`absolute -right-3 lg:right-auto lg:left-[50%] lg:translate-x-[-55%] top-full pt-6 lg:group-hover:block z-50 ${isOpen ? "block" : "hidden"}`}>
                <div className="w-48 bg-white shadow-lg border border-gray-200">
                    <ul className="relative py-2 after:content-[''] after:absolute after:bg-white after:w-2 after:h-2 after:rotate-45 after:top-[-5px] after:right-7 lg:after:right-auto lg:after:left-[50%] after:border after:border-gray-200 after:border-r-0 after:border-b-0">
                        {profileMenus?.map((item) => (
                            <li key={item.id}>
                                {item?.onClick ?
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            item.onClick();
                                        }}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#fb641b] flex items-center gap-2 w-full cursor-pointer"
                                    >
                                        {item?.icon || ""}
                                        {item?.name || ""}
                                    </button>
                                    :
                                    <Link
                                        to={item?.path || "/"}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        <div className="flex items-center gap-2 text-[#fb641b]">
                                            {item?.icon || ""}
                                            {item?.name || ""}
                                        </div>
                                    </Link>
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ProfileDropdown;
