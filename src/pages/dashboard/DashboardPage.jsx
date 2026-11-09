import { useEffect } from "react";
import { Link, NavLink, useNavigate, useOutlet, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthProvider";
import ProfilePage from "./ProfilePage";
import { ArrowLeft, Heart, LogOut, MapPinHouse, Package, UserPen } from "lucide-react";

const dashboardMenus = [
    {
        id: "profile",
        name: "Profile",
        path: "profile",
        icon: <UserPen size={24} className="text-[#fb641b]" />
    },
    {
        id: "orders",
        name: "Orders",
        path: "orders",
        icon: <Package size={24} className="text-[#fb641b]" />
    },
    {
        id: "wishlist",
        name: "Wishlist",
        path: "wishlist",
        icon: <Heart size={24} className="text-[#fb641b]" />

    },
    {
        id: "address",
        name: "Address",
        path: "address",
        icon: <MapPinHouse size={24} className="text-[#fb641b]" />
    },
];

function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const outlet = useOutlet();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (!loading && !user) {
            toast.error("Please log in to access your dashboard");
            navigate("/");
        }
    }, [loading, user, navigate]);

    if (!loading && !user) return null;

    return (
        <div className="mx-auto flex flex-col lg:flex-row gap-6 w-full p-2 md:p-8">
            <div className={`w-full lg:w-[258px] shrink-0 flex-col gap-6 ${outlet ? "hidden lg:flex" : "flex"}`}>
                <div>
                    <div className="h-40 bg-gray-200"></div>
                    <div className="bg-white shadow-[0_1px_4px_0_#d7dade] flex flex-col items-center gap-3 pb-6 px-4">
                        <img src="https://constant.myntassets.com/mymyntra/assets/img/default-image.png" alt="Myprofile" className="relative bg-gray-300 size-29 lg:size-29 -mt-12.5 lg:-mt-12 object-cover" />
                        <p className="text-sm lg:text-base text-gray-700 text-center wrap-break-word w-full">{user?.email}</p>
                    </div>
                </div>
                <aside className="bg-white shadow-[0_1px_4px_0_#d7dade] lg:py-8">
                    <ul className="flex flex-col justify-start lg:block">
                        {dashboardMenus.map((item) => (
                            <li key={item.id} className="flex-1 lg:flex-none">
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center justify-start h-[52px] lg:h-[68px] px-3 lg:px-8 text-[15px] lg:text-[17px] whitespace-nowrap border-b-4 lg:border-b-0 lg:border-r-[6px] gap-2 
                                    ${isActive
                                            ? "bg-[#e9ecef] border-[#fb641b] text-gray-900 font-semibold"
                                            : !outlet && item.id === "profile"
                                                ? "border-transparent text-gray-700 hover:bg-gray-50 lg:bg-[#e9ecef] lg:border-[#fb641b] lg:text-gray-900 lg:font-semibold"
                                                : "border-transparent text-gray-700 hover:bg-gray-50"
                                        }`
                                    }
                                >
                                    {item.icon}
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                        <li className="flex-1 lg:flex-none">
                            <button
                                onClick={logout}
                                className="lg:hidden flex items-center justify-start w-full h-[52px] lg:h-[68px] px-3 lg:px-8 text-[15px] lg:text-[17px] whitespace-nowrap border-b-4 lg:border-b-0 lg:border-r-[6px] gap-2 border-transparent text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                                <LogOut size={24} className="text-[#fb641b]" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </aside>
            </div>
            <section className={`flex-1 min-w-0 bg-white shadow-[0_1px_4px_0_#d7dade] min-h-[590px] p-4 md:p-8 ${outlet ? "block" : "hidden lg:block"}`}>
                {searchParams.get("order") ? (
                    <Link to="/dashboard/orders" className="flex items-center gap-2 mb-4 text-gray-700">
                        <ArrowLeft size={20} />
                        Back
                    </Link>
                ) : outlet && (
                    <Link to="/dashboard" className="lg:hidden flex items-center gap-2 mb-4 text-gray-700">
                        <ArrowLeft size={20} />
                        Back
                    </Link>
                )}
                {outlet || <ProfilePage />}
            </section>
        </div>
    );
}

export default DashboardPage;
