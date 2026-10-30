
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import api from "@/lib/axios";

const LoginPage = () => {
    const router = useRouter()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState(
        {
            email: "",
            password: "",
        }
    );

    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const validation = () => {
        const newErrors = {
            email: "",
            password: ""
        }


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

        return Object.values(newErrors).every(el => el === '')
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = validation()
        console.log('result :>> ', result);


        if (!result) {
            return
        }

        setIsLoading(true)
        try {

            const response = await api.post('/api/auth/login', {
                email,
                password
            })

            setError("")
            if (response?.data?.success) {

                const { token, user } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                router.push("/chat");
            }
        } catch (error: any) {

            setError(error?.response?.data?.message)
        } finally {
            setIsLoading(false);
        }

    };
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            router.replace("/chat");
        }
    }, [router]);

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

                    <p className="text-center   text-sm text-red-500">{error}</p>
                    {isLoading ? <button
                        className="w-full cursor-pointer rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        loading...
                    </button> : <button
                        type="submit"
                        className="w-full cursor-pointer rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Login
                    </button>}


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
