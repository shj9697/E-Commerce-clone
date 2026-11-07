import { useState } from "react";
import LoginModal from "./LoginModal";
import { useForm } from "react-hook-form";
import { getAuthenticationAPI, loginAPI } from "../../api/authentication";
import { brandIcon, brandLogo } from "../../assets/brandImages";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthProvider";

const Registration = ({ isOpen, closeModal }) => {
    const { setUser } = useAuth();
    const { register, handleSubmit, reset, watch } = useForm({ mode: "onSubmit" });
    const [step, setStep] = useState("identifier");
    const [mode, setMode] = useState("login");
    const [isPhoneInput, setIsPhoneInput] = useState(false);

    const switchMode = (nextMode) => {
        setMode(nextMode);
        setStep("identifier");
        setIsPhoneInput(false);
        reset();
    }

    // Shows the message of the first field that failed
    const onError = (errors) => {
        toast.error(Object.values(errors)[0].message);
    };

    const handleInputChange = (e) => {
        if (e.target.value.length) {
            const isOnlyNumber = !isNaN(e.target.value);
            setIsPhoneInput(isOnlyNumber);
        }
    }

    const onSubmit = async (formData) => {
        if (mode === "register") {
            try {
                const result = await getAuthenticationAPI(
                    formData.email,
                    formData.password,
                    formData.name
                );
                if (!result.status) {
                    toast.error(result.message || "Registration failed");
                    return;
                }
                // The server signs the new user in, so show them as logged in
                setUser(result.data);
                toast.success("Registered SuccessFully");
                handleCloseModal();
            } catch {
                toast.error("Something went wrong. Please try again.");
            }
            return null;
        } else {
            if (step === "identifier") {
                setStep("password");
                return;
            }
            try {
                const loginData = await loginAPI(
                    formData.email,
                    formData.password
                );
                if (!loginData?.status) {
                    toast.error(loginData?.message || "Login failed");
                    return;
                }
                setUser(loginData?.data || null);
                toast.success("Login SuccessFully");
                handleCloseModal();
            } catch {
                toast.error("Something went wrong. Please try again.");
            }
            return null;
        }
    };

    const handleCloseModal = () => {
        setStep("identifier");
        setIsPhoneInput(false);
        setMode("login");
        reset();
        closeModal();
    }

    // Leaves the site for Google's sign-in page; AuthProvider finishes the login when Google sends the user back
    const handleGoogleLogin = () => {
        // Random code we save now and check when Google sends the user back, to make sure the reply is ours
        const state = crypto.randomUUID();
        sessionStorage.setItem("googleLoginState", state);
        const params = new URLSearchParams({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // our app's Google ID
            redirect_uri: window.location.origin,             // where Google sends the user back
            response_type: "id_token",                        // ask Google for a token with the user's info
            scope: "openid email profile",                    // the info we want: email and profile
            nonce: crypto.randomUUID(),                       // Google requires this for id_token
            state,
        });
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    }

    return (
        <LoginModal isOpen={isOpen} onClose={handleCloseModal}>
            <div className="w-full flex items-start justify-center bg-white">
                <div className="flex items-center mt-6">
                    <img src={brandIcon} className="h-9" />
                    <img src={brandLogo} className="h-9" />
                </div>
            </div>
            {mode === "register" ?
                (
                    <>
                        <form onSubmit={handleSubmit(onSubmit, onError)}>
                            <div className="w-full flex items-center border-0 border-b-2 border-b-[#fb641b] mt-4">
                                <input
                                    type="text"
                                    placeholder="Enter Username"
                                    className="border-gray-400 outline-0 py-2 text-[12px] flex-1"
                                    {...register("name", { required: "Enter Username" })}
                                />
                            </div>

                            <div className="w-full flex items-center border-0 border-b-2 border-b-[#fb641b] mt-4">
                                <input
                                    type="text"
                                    placeholder="Enter Mail Id"
                                    className="border-gray-400 outline-0 py-2 text-[12px] flex-1"
                                    {...register("email", {
                                        required: "Not a valid email!",
                                        pattern: {
                                            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                            message: "Not a valid email!",
                                        },
                                    })}
                                />
                            </div>

                            <div className="w-full flex items-center border-0 border-b-2 border-b-[#fb641b] mt-4">
                                <input
                                    type="password"
                                    placeholder="Enter Password"
                                    className="border-gray-400 outline-0 py-2 text-[12px] flex-1"
                                    {...register("password", {
                                        required: "Enter Password",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters",
                                        },
                                    })}
                                />
                            </div>

                            <div className="w-full flex items-center border-0 gap-2 mt-4">
                                <input type="checkbox" disabled={!watch("name") || !watch("email") || !watch("password")} {...register("terms", { required: "Please accept the terms & conditions" })} />
                                <p className="text-[12px]">I agree to the <span className="text-[#fb641b] text-[12px] cursor-pointer" onClick={() => { window.open("/TermsAndCondition") }}>terms & conditions.</span></p>
                            </div>

                            <button type="submit" className="bg-[#fb641b] text-white p-3 mt-4 text-center w-full cursor-pointer rounded-[10px]">
                                REGISTER
                            </button>
                        </form>

                        <div className="flex flex-col items-center gap-5 mt-4">
                            <div className="flex items-center gap-2">
                                <span className="w-32 h-px bg-gray-500" />
                                <span className="text-gray-500">OR</span>
                                <span className="w-32 h-px bg-gray-500" />
                            </div>
                            <button
                                type="button"
                                onClick={() => switchMode("login")}
                                className="text-[#fb641b] text-[13px] cursor-pointer"
                            >
                                Existing User? Login
                            </button>
                        </div>
                    </>
                )
                :
                (
                    <>
                        <form onSubmit={handleSubmit(onSubmit, onError)}>
                            <div className={step === "password" ? "flex justify-center items-center mt-8 lg:mt-15 opacity-70" : "flex justify-center items-center mt-8 lg:mt-15"}>
                                <div className="w-full flex items-center border-0 border-b-2 border-b-[#fb641b]">
                                    {isPhoneInput &&
                                        <div className="flex flex-row items-center gap-2 mr-2 w-fit">
                                            <p className="">+91</p>
                                            <div className="w-0.5 rounded-md h-4 bg-[#fb641b]" />
                                        </div>}
                                    <input
                                        type="text"
                                        readOnly={step === "password"}
                                        placeholder="Enter Email/Mobile Number"
                                        className="border-gray-400 outline-0 py-2 text-[12px] flex-1"
                                        {...register("email",
                                            {
                                                required: "Not a valid email!",
                                                pattern: {
                                                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$|^\+?[1-9]\d{1,14}$/,
                                                    message: "Not a valid email or mobile number!",
                                                },
                                                onChange: handleInputChange
                                            })}
                                    />
                                </div>
                            </div>

                            {step === "password" &&
                                <div className="w-full flex items-center border-0 border-b-2 border-b-[#fb641b] mt-8">
                                    <input
                                        type="password"
                                        placeholder="Enter Password"
                                        className="border-gray-400 outline-0 text-[12px] flex-1"
                                        {...register("password", {
                                            required: "Enter Password",
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters",
                                            },
                                        })}
                                    />
                                </div>}

                            <button type="submit" className="bg-[#fb641b] text-white p-3 mt-6 lg:mt-10 text-center w-full cursor-pointer rounded-[10px]" >
                                {step === "password" ? "LOGIN" : "NEXT"}
                            </button>
                        </form>

                        <div className="flex flex-col items-center gap-5 mt-6 lg:gap-10 lg:mt-10">
                            <div className="flex items-center gap-2">
                                <span className="w-32 h-px bg-gray-500" />
                                <span className="text-gray-500">OR</span>
                                <span className="w-32 h-px bg-gray-500" />
                            </div>
                            <button type="button" onClick={handleGoogleLogin} aria-label="Sign in with Google" className="p-2 border border-gray-300 rounded-full cursor-pointer">
                                <svg viewBox="0 0 48 48" className="h-6 w-6">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => switchMode("register")}
                                className="text-[#fb641b] text-[13px] cursor-pointer"
                            >
                                New to Marfit ? Create an account
                            </button>
                        </div>
                    </>
                )}
        </LoginModal>
    )
}

export default Registration;