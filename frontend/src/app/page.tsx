"use client"
import Image from "next/image";
import Link from "next/link";


import { useEffect } from "react";

import { useRouter } from "next/navigation";


export default function Home() {

  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/chat");
    }
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">
        AI Document Assistant
      </h1>

      <p className="text-gray-400 text-lg mb-8">
        Upload your documents and ask questions using AI.
      </p>

      <Link
        href="/login"
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium text-white"
      >
        Get Started
      </Link>
    </main>
  );
}
