import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { GetState, GetCity } from "react-country-state-city";

// initialData is the saved address when editing, null when adding a new one
const AddressPage = ({ handleBack, handleSave, initialData }) => {

    const [phone, setPhone] = useState(initialData ? `91${initialData.phone}` : "");
    const [dialCode, setDialCode] = useState("91");
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [stateId, setStateId] = useState("");
    const [cityId, setCityId] = useState("");
    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        mode: "onSubmit",
        defaultValues: {
            customerName: initialData?.customerName ?? "",
            addressLine1: initialData?.addressLine1 ?? "",
            pincode: initialData?.pincode ?? ""
        }
    });

    const countryId = 101;

    useEffect(() => {
        GetState(countryId).then((states) => {
            setStateList(states);
            // When editing, select the saved state
            const savedState = states.find((state) => state.name === initialData?.state);
            if (savedState) setStateId(String(savedState.id));
        });
    }, [initialData?.state]);

    useEffect(() => {
        if (!stateId) return;
        GetCity(countryId, Number(stateId)).then((cities) => {
            setCityList(cities);
            // When editing, select the saved city
            const savedCity = cities.find((city) => city.name === initialData?.city);
            if (savedCity) setCityId(String(savedCity.id));
        });
    }, [stateId, initialData?.city]);


    const handleStateChange = (e) => {
        setStateId(e.target.value);
        setCityId("");
    };

    const onSubmit = async (data) => {
        if (!phone || !stateId || !cityId) {
            toast.error("Please Fill All The Details");
            return;
        }

        const stateName = stateList.find((state) => state.id === Number(stateId))?.name ?? "";
        const cityName = cityList.find((city) => city.id === Number(cityId))?.name ?? "";
        // The server wants the 10-digit number without the country code
        await handleSave({ ...data, phone: phone.slice(dialCode.length), state: stateName, city: cityName });
    }

    const onError = () => {
        toast.error("Please Fill All The Details");
    };

    return (
        <div className="flex flex-col bg-white">
            <div className="flex mt-2 ">
                <form onSubmit={handleSubmit(onSubmit, onError)} >
                    <div className="flex flex-col gap-3 mb-2">
                        <input
                            type="text"
                            name="" placeholder="Name"
                            className="outline-0 border border-gray-400 bg-white p-2 rounded"
                            {...register("customerName", { required: "Please Fill All The Details" })}
                        />
                        <input type="text"
                            placeholder="Address"
                            className="outline-0 border border-gray-400 bg-white p-2 rounded"
                            {...register("addressLine1", { required: "Please Fill All The Details" })}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <select
                            value={stateId}
                            onChange={handleStateChange}
                            className="border border-gray-400 outline-0 p-2 rounded text-[12px]"
                        >
                            <option value="">Select State</option>
                            {stateList.map((state) => (
                                <option key={state.id} value={state.id}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={cityId}
                            onChange={(e) => setCityId(e.target.value)}
                            disabled={!stateId}
                            className="border border-gray-400 outline-0 p-2 rounded text-[12px] disabled:bg-gray-100"
                        >
                            <option value="">Select City</option>
                            {cityList.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Pincode"
                            className="border border-gray-400 outline-0 p-2 rounded text-[12px]"
                            {...register("pincode", {
                                required: "Pincode is required",
                                pattern: {
                                    value: /^[1-9][0-9]{5}$/,
                                    message: "Enter a valid 6-digit pincode",
                                },
                            })}
                        />
                        <PhoneInput
                            country={'in'}
                            value={phone}
                            onChange={(value, country) => {
                                setPhone(value);
                                setDialCode(country.dialCode);
                            }}
                            className="my-3 "
                        />
                    </div>
                    <div className="flex gap-3 ">
                        <button type="button" className="text-[#fb641b] bg-white border border-[#fb641b] px-10 py-2 cursor-pointer rounded" onClick={handleBack}>Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="bg-[#fb641b] text-white px-10 py-2 cursor-pointer rounded disabled:opacity-60" >{initialData ? "Save" : "Add"}</button>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default AddressPage
