import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">
        AI Document Assistant
      </h1>

      <p className="text-gray-400 text-lg mb-8">
        Upload your documents and ask questions using AI.
      </p>

      <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium">
        Get Started
      </button>
    </main>
  );
}
