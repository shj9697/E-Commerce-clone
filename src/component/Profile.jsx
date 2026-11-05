import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";
import { updateMeAPI } from "../api/authentication";


function Profile() {

    const { user, setUser, loading } = useAuth();
    const [mode, setMode] = useState("list");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const saveProfile = async () => {
        try {
            const response = await updateMeAPI(name, phone);
            if (!response.status) {
                toast.error(response.message);
                return;
            }
            setUser(response.data);
            setMode("list");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const profileDetails = [
        {
            id: "name",
            label: "User Name",
            value: user?.name,
            editable: true
        },
        {
            id: "email",
            label: "Email",
            value: user?.email,
        },
        {
            id: "phone",
            label: "Phone",
            value: user?.phone,
            editable: true
        },
    ];

    return (
        <div>

            <h2 className="text-2xl text-[#fb641b]">Profile Details</h2>
            <div className="w-20 h-0.5 bg-gray-300 mt-3" />

            {loading ? (
                <div className="animate-pulse">
                    <div className="mt-6">
                        {profileDetails.map((item) => (
                            <div key={item.id} className="flex items-center h-10">
                                <div className="w-[120px] md:w-[250px] shrink-0">
                                    <div className="h-4 w-20 bg-gray-200 rounded" />
                                </div>
                                <div className="h-4 w-40 md:w-56 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 h-10 w-[118px] bg-gray-200 rounded-sm" />
                </div>
            ) : mode === "list" ? (
                <>
                    <div className="mt-6">
                        {profileDetails.map((item) => (
                            <div key={item.id} className="flex text-[15px] md:text-[17px] text-gray-800 leading-10">
                                <p className="w-[120px] md:w-[250px] shrink-0">{item.label}</p>
                                <p className="min-w-0 wrap-break-word">{item.value || "-"}</p>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            setName(user?.name || "");
                            setPhone(user?.phone || "");
                            setMode("edit");
                        }}
                        className="mt-8 bg-[#fb641b] hover:bg-[#fb641b] text-white text-[17px] px-10 py-2 rounded-sm cursor-pointer"
                    >
                        Edit
                    </button>
                </>
            ) : (
                <>
                    <div className="mt-6">
                        {profileDetails.filter((item) => !item.editable).map((item) => (
                            <div key={item.id} className="flex text-[15px] md:text-[17px] text-gray-800 leading-10">
                                <p className="w-[120px] md:w-[250px] shrink-0">{item.label}</p>
                                <p className="min-w-0 wrap-break-word">{item.value || ""}</p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 leading-10">
                            <label htmlFor="name" className="w-[120px] md:w-[250px] shrink-0 text-[15px] md:text-[17px] text-gray-800">
                                User Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="min-w-0 border-0 border-b-2 border-b-gray-400 outline-0 py-2 text-[15px] md:text-[17px] text-gray-800"
                            />
                        </div>
                        <div className="flex items-center gap-3 leading-10">
                            <label htmlFor="phone" className="w-[120px] md:w-[250px] shrink-0 text-[15px] md:text-[17px] text-gray-800">
                                Phone
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="min-w-0 border-0 border-b-2 border-b-gray-400 outline-0 py-2 text-[15px] md:text-[17px] text-gray-800"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMode("list")}
                            className="mt-8 bg-white  text-[#fb641b] border border-[#fb641b] text-[17px] px-10 py-2 rounded-sm cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={saveProfile}
                            className="mt-8 bg-[#fb641b] hover:bg-[#fb641b] text-white text-[17px] px-10 py-2 rounded-sm cursor-pointer"
                        >
                            Save
                        </button>

                    </div>
                </>
            )}
        </div>
    );
}

export default Profile;