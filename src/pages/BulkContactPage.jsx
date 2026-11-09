import { useState } from "react";
import toast from "react-hot-toast";
import { createLeadAPI } from "../api/leadsApi";

const emptyForm = {
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
};

const BulkContactPage = () => {
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.error("Please enter your name!");
            return;
        }
        if (!form.email.trim()) {
            toast.error("Please enter your email!");
            return;
        }
        if (!/^\+?\d{10,13}$/.test(form.phone.trim())) {
            toast.error("Please enter a valid phone number!");
            return;
        }

        setSubmitting(true);
        const res = await createLeadAPI({ type: "BULK", ...form });
        setSubmitting(false);

        if (!res.status) {
            toast.error(res.message || "Something went wrong, please try again!");
            return;
        }

        toast.success("Form submitted successfully!");
        setForm(emptyForm);
    };

    return (
        <section className="px-4 py-10">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 w-full max-w-md mx-auto p-6 bg-white shadow-md rounded-md"
            >
                <h1 className="text-2xl font-semibold text-center">
                    Corporate Gifting Form
                </h1>

                <label className="font-semibold text-lg" htmlFor="name">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    className="p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none"
                    onChange={handleChange}
                    value={form.name}
                />

                <label className="font-semibold text-lg" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    className="p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none"
                    onChange={handleChange}
                    value={form.email}
                />

                <label className="font-semibold text-lg" htmlFor="phone">
                    Phone
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none"
                    onChange={handleChange}
                    value={form.phone}
                />

                <label className="font-semibold text-lg" htmlFor="company">
                    Company
                </label>
                <input
                    id="company"
                    name="company"
                    type="text"
                    className="p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none"
                    onChange={handleChange}
                    value={form.company}
                />

                <label className="font-semibold text-lg" htmlFor="message">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    className="p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none"
                    onChange={handleChange}
                    value={form.message}
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="p-2 w-40 mx-auto rounded-sm bg-[#fb641b] text-white disabled:opacity-60"
                >
                    {submitting ? "Sending..." : "Send"}
                </button>
            </form>
        </section>
    );
};

export default BulkContactPage;
