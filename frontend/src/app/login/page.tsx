
"use client";

import Link from "next/link";
import React, { useState } from "react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState(
        {
            email: "",
            password: "",
        }
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = {
            email: "",
            password: "",
        };


        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!email.includes("@")) {
            newErrors.email = "Please enter a valid email";
        }
        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);


        if (newErrors.email || newErrors.password) {
            return;
        }
        console.log("Login successful");

        console.log("Email:", email);
        console.log("Password:", password);
    };


    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-950 px-4">

            <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8">

                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome Back
                </h1>

                <p className="text-gray-400 mb-8">
                    Login to your AI Document Assistant account.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm text-gray-300 mb-2">
                            Email Address
                        </label>

                        <input
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);

                                setErrors((prev) => ({
                                    ...prev,
                                    email: "",
                                }));
                            }}
                            type="email"
                            placeholder="you@example.com"
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                        <span className="">
                            {
                                errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )
                            }
                        </span>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-2">
                            Password
                        </label>

                        <input
                            value={password}
                            onChange={(e) => {

                                setPassword(e.target.value);

                                setErrors((prev) => ({
                                    ...prev,
                                    password: "",
                                }));
                            }}

                            type="password"
                            placeholder="Enter your password"
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                        />
                        <span className="">
                            {
                                errors.password && (
                                    <p className="text-sm text-red-500">
                                        {errors.password}
                                    </p>
                                )
                            }
                        </span>

                    </div>


                    <button
                        type="submit"
                        className="w-full cursor-pointer rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Login
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-blue-500 hover:underline">
                        Register
                    </Link>
                </p>

            </div>
        </main>
    );
}

export default LoginPage;
