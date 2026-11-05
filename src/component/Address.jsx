import { Pencil, PencilIcon, Plus, Trash } from "lucide-react";
import AddressPage from "./AddressPage";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { addAddressAPI, deleteAddressAPI, getAddressesAPI, updateAddressAPI } from "../api/addressApi";

function Address() {

    const [mode, setMode] = useState("list");
    const [editId, setEditId] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const addressData = await getAddressesAPI();
                if (!cancelled) {
                    if (addressData.status) setAddresses(addressData.data);
                    else setError(addressData.message);
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    const switchMode = (nextMode) => {
        setMode(nextMode);
    }

    const handleBack = () => {
        setEditId(null);
        switchMode('list')
    }

    const handleSave = async (addressDetails) => {
        try {
            const response = editId ? await updateAddressAPI(editId, addressDetails) : await addAddressAPI(addressDetails);
            if (!response.status) return toast.error(response.message);
            setAddresses((prev) => editId ? prev.map((existingAddress) => (existingAddress.id === editId ? response.data : existingAddress)) : [...prev, response.data]);
            setEditId(null);
            switchMode("list");
        } catch (err) {
            toast.error(err.message);
        }
    }

    const handleEdit = (id) => {
        setEditId(id);
        switchMode("form");
    }

    const handleDelete = async (id) => {
        try {
            const response = await deleteAddressAPI(id);
            if (!response.status) return toast.error(response.message);
            // The server returns the addresses that are left
            setAddresses(response.data);
        } catch (err) {
            toast.error(err.message);
        }
    }

    if (loading) {
        return (
            <div className="w-full flex flex-col gap-4">
                <h2 className="text-2xl text-[#fb641b]">Your Address List</h2>
                <div className="w-20 h-0.5 bg-gray-300" />
                <div className="w-full animate-pulse">
                    {[1, 2].map((rowNumber) => (
                        <div key={rowNumber} className="flex items-center justify-between rounded p-4 mb-4">
                            <div className="flex flex-col gap-6 py-3">
                                <div className="h-4 w-40 rounded bg-gray-300" />
                                <div className="h-4 w-64 rounded bg-gray-300" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded bg-gray-300" />
                                <div className="w-4 h-4 rounded bg-gray-300" />
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-300" />
                        <div className="h-4 w-32 rounded bg-gray-300" />
                    </div>
                </div>
            </div>
        );
    }
    if (error) {
        return <p>Error : {error}</p>
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <h2 className="text-2xl text-[#fb641b]">Your Address List</h2>
            <div className="w-20 h-0.5 bg-gray-300" />
            {mode === "form" ?
                <AddressPage
                    handleBack={handleBack}
                    handleSave={handleSave}
                    initialData={editId ? addresses.find((address) => address.id === editId) : null}
                />
                :
                <div className="w-full">
                    {addresses.map((address) => (
                        <div key={address.id} className="flex items-center justify-between border-b-gray-500 rounded p-4 mb-4">
                            <div>
                                <p className="text-[17px] text-gray-800 leading-10" >{address.customerName}</p>
                                <p className="text-[17px] text-gray-800 leading-10">{address.addressLine1}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <PencilIcon size={15}
                                    onClick={() => handleEdit(address.id)}
                                    className="cursor-pointer text-[#fb641b]"
                                />
                                <Trash size={15}
                                    onClick={() => handleDelete(address.id)}
                                    className="cursor-pointer text-[#fb641b]"
                                />
                            </div>
                        </div>
                    ))}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => switchMode("form")}
                    >
                        <Plus size={20} strokeWidth={3} className="bg-green-900 text-white rounded-4xl" />
                        <p>Add New Address</p>
                    </div>
                </div>
            }
        </div >
    );
}

export default Address;
