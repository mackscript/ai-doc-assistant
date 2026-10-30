"use client"

import React, { useState } from "react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validation = () => {
        let newErrors = {
            fullName: "",
            email: "",
            password: "",
        }
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);

        return Object.values(newErrors).every((error) => error === "")
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const isValid = validation();
        console.log('isValid :>> ', isValid);
        console.log("Register Data:", formData);
    }


    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8">

                <h1 className="text-3xl font-bold text-white mb-2">
                    Create Account
                </h1>

                <p className="text-gray-400 mb-8">
                    Get started with AI Document Assistant.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm text-gray-300 mb-2">
                            Full Name
                        </label>
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={(e) => handleChange(e)}
                            type="text"
                            placeholder="Enter your name"
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-sm">
                                {errors.fullName}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={(e) => handleChange(e)}
                            type="email"
                            placeholder="you@example.com"
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            name="password"
                            value={formData.password}
                            onChange={(e) => handleChange(e)}
                            type="password"
                            placeholder="Create a password"
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full cursor-pointer rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Create Account
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Login
                    </a>
                </p>

            </div>
        </main>
    );
}