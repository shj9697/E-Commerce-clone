import { House, PencilIcon, Trash } from "lucide-react";
import ModalBox from "./ModalBox";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { GetState, GetCity } from "react-country-state-city";
import { addAddressAPI, deleteAddressAPI, getAddressesAPI, updateAddressAPI } from "../api/addressApi";

const countryId = 101; // India

const AddressDetails = ({ handleChoosePayment }) => {

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [phone, setPhone] = useState("");
    const [dialCode, setDialCode] = useState("91");
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [stateName, setStateName] = useState("");
    const [cityName, setCityName] = useState("");
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [editId, setEditId] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ mode: "onTouched" });

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const addressData = await getAddressesAPI();
                if (!cancelled) {
                    if (addressData.status) {
                        setAddresses(addressData.data);
                        // Preselect the default so a returning customer can go straight to payment
                        setSelectedAddressId(addressData.data.find((address) => address.isDefault)?.id ?? "");
                    }
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

    useEffect(() => {
        GetState(countryId).then(setStateList);
    }, []);

    useEffect(() => {
        // GetCity needs the state's id, but the dropdowns hold names because the server stores names
        const stateId = stateList.find(state => state.name === stateName)?.id;
        if (stateId) GetCity(countryId, stateId).then(setCityList);
        else setCityList([]);
    }, [stateName, stateList]);

    const onSubmit = async (data) => {
        if (!phone || !stateName || !cityName) return toast.error("Mobile number, state and city are required");
        const addressDetails = { ...data, phone: phone.slice(dialCode.length), state: stateName, city: cityName };
        setSaving(true);
        try {
            const response = editId ? await updateAddressAPI(editId, addressDetails) : await addAddressAPI(addressDetails);
            if (!response.status) return toast.error(response.message);
            if (editId) setAddresses(addresses.map(address => address.id === editId ? response.data : address));
            else setAddresses([...addresses, response.data]);
            setSelectedAddressId(response.data.id);
            setIsOpen(false);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    // address is passed when editing, left empty when adding a new one
    const openModal = (address) => {
        reset({
            customerName: address?.customerName ?? "",
            addressLine1: address?.addressLine1 ?? "",
            pincode: address?.pincode ?? "",
            email: address?.email ?? ""
        });
        setPhone(address ? `91${address.phone}` : "");
        setDialCode("91");
        setStateName(address?.state ?? "");
        setCityName(address?.city ?? "");
        setEditId(address?.id ?? null);
        setIsOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await deleteAddressAPI(id);
            if (!response.status) return toast.error(response.message);
            setAddresses(response.data);
            if (selectedAddressId === id) setSelectedAddressId("");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleProceed = () => {
        if (!selectedAddressId) return toast.error("Please select an address");
        // Not passed when this page is opened on its own route
        handleChoosePayment?.(selectedAddressId);
    };

    if (loading) {
        return (
            <div className="w-full bg-white rounded animate-pulse">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
                {[1, 2].map((rowNumber) => (
                    <div key={rowNumber} className="flex items-start gap-2 w-full bg-gray-100 rounded p-4 my-2">
                        <div className="mt-1 size-4 shrink-0 rounded-full bg-gray-200" />
                        <div className="flex flex-col gap-2 w-full">
                            <div className="h-3 w-32 bg-gray-200 rounded" />
                            <div className="h-3 w-3/4 bg-gray-200 rounded" />
                            <div className="h-3 w-1/2 bg-gray-200 rounded" />
                            <div className="h-3 w-40 bg-gray-200 rounded" />
                        </div>
                    </div>
                ))}
                <div className="h-10 w-full bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded my-2" />
            </div>
        )
    }
    if (error) return <p>Error : {error}</p>;

    return (
        <div className="w-full bg-white rounded">
            <div className="flex items-center text-[15px] text-[#fb6b25] gap-2">
                <House className="text-green-700" />
                <p>Address Details</p>
            </div>

            {addresses.map((address) => (
                <div key={address.id} className="flex items-center justify-between gap-2 w-full bg-gray-100 rounded p-2 my-2 text-[13px] cursor-pointer">
                    <label className="flex items-start gap-2 p-2 my-2 cursor-pointer">
                        <input
                            type="radio"
                            name="selectedAddress"
                            checked={selectedAddressId === address.id}
                            onChange={() => setSelectedAddressId(address.id)}
                            className="mt-1 appearance-none size-4 shrink-0 rounded-full bg-white border checked:bg-[#fb6b25] outline-none cursor-pointer"
                        />
                        <div>
                            <p className="font-medium">{address.customerName}</p>
                            <p className="text-gray-600">{address.addressLine1}</p>
                            <p className="text-gray-600">{address.city} - {address.pincode}, {address.state}</p>
                            <p className="text-gray-600">Mobile : {address.phone}</p>
                        </div>
                    </label>
                    <div className="flex items-center gap-3">
                        <PencilIcon size={15} onClick={() => openModal(address)} className="cursor-pointer text-[#fb641b]" />
                        <Trash size={15} onClick={() => handleDelete(address.id)} />
                    </div>
                </div>
            ))}

            <button className="w-full border border-[#fb641b] text-[15px] text-[#fb6b25] rounded p-2 cursor-pointer" onClick={() => openModal()}>
                ADD ADDRESS
            </button>
            <div className="text-center p-2 bg-[#fb6b25] my-2 rounded">
                <button className="text-white cursor-pointer" onClick={handleProceed}>PROCEED TO PAYMENT</button>
            </div>

            <ModalBox isOpen={isOpen} onClose={() => setIsOpen(false)} title={editId ? "Edit Address" : "Add New Address"}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="flex flex-col gap-3">
                        <label>Contact Details</label>
                        <input
                            type="text"
                            placeholder="Name"
                            className="border border-gray-400 outline-0 p-2 rounded text-[12px]"
                            {...register("customerName", { required: "Name is required" })}
                        />
                        {errors.customerName && <p className="text-red-500 text-[11px]">{errors.customerName.message}</p>}
                        <PhoneInput country={'in'} value={phone} onChange={(value, country) => { setPhone(value); setDialCode(country.dialCode); }} />
                    </fieldset>

                    <fieldset className="flex flex-col gap-3 mt-2">
                        <label>Address Details</label>
                        <input
                            type="text"
                            placeholder="Address (House No., building, street, area)"
                            className="border border-gray-400 outline-0 p-2 rounded text-[12px]"
                            {...register("addressLine1", { required: "Address is required" })}
                        />
                        {errors.addressLine1 && <p className="text-red-500 text-[11px]">{errors.addressLine1.message}</p>}
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Pincode"
                            className="border border-gray-400 outline-0 p-2 rounded text-[12px]"
                            {...register("pincode", {
                                required: "Pincode is required",
                                pattern: { value: /^[1-9][0-9]{5}$/, message: "Enter a valid 6-digit pincode" },
                            })}
                        />
                        {errors.pincode && <p className="text-red-500 text-[11px]">{errors.pincode.message}</p>}
                        <select
                            value={stateName}
                            onChange={(e) => { setStateName(e.target.value); setCityName(""); }}
                            className="border border-gray-400 outline-0 p-2 rounded text-[12px]"
                        >
                            <option value="">Select State</option>
                            {stateList.map((state) => <option key={state.id} value={state.name}>{state.name}</option>)}
                        </select>
                        <select
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                            disabled={!stateName}
                            className="border border-gray-400 outline-0 p-2 rounded text-[12px] disabled:bg-gray-100"
                        >
                            <option value="">Select City</option>
                            {cityList.map((city) => <option key={city.id} value={city.name}>{city.name}</option>)}
                        </select>
                        <input
                            type="text"
                            placeholder="E-Mail"
                            className="border border-gray-400 outline-0 p-2 rounded text-[12px]"
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, message: "Enter a valid email address" },
                            })}
                        />
                        {errors.email && <p className="text-red-500 text-[11px]">{errors.email.message}</p>}
                    </fieldset>

                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#fb6b25] text-white p-3 mt-3 text-center w-full cursor-pointer disabled:opacity-60"
                    >
                        {saving ? "SAVING..." : editId ? "SAVE ADDRESS" : "ADD ADDRESS"}
                    </button>
                </form>
            </ModalBox>
        </div>
    )
}

export default AddressDetails;
