"use client"

import React, { useRef, useState } from "react";


interface Message {
    id: string,
    role: "user" | "assistant"
    content: string,
    createdAt: Date,
}
export default function ChatPage() {

    const [messages, setMessage] = useState<Message[]>([])
    const [input, setInput] = useState<string>("");

    const [file, setFile] = useState<File | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        console.log('selectedFile :>> ', selectedFile);
        if (!selectedFile) return;

        if (selectedFile.type !== "application/pdf") {
            alert("Only PDF files are allowed");
            return;
        }


        if (selectedFile.size > 10 * 1024 * 1024) {
            alert("File size must be less than 10MB");
            return;
        }

        setFile(selectedFile);

    }
    const formatFileSize = (bytes: number): string => {
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };
    const handleSend = (e: any) => {
        e.preventDefault()
        if (!input.trim()) return;

        const newMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: input,
            createdAt: new Date()
        }

        setInput("")
        setMessage((prev) => [...prev, newMessage])
    }


    return (
        <main className="min-h-screen bg-gray-950 text-white flex flex-col">

            <header className="border-b border-gray-800 p-4">
                <h1 className="text-xl font-bold">
                    AI Document Assistant
                </h1>
                <p className="text-sm text-gray-400">
                    Chat with your documents
                </p>
            </header>

            <div className="border-b border-gray-800 p-4">

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                >
                    Upload PDF
                </button>
                {file && (
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-800 p-3">

                        <div>
                            <p className="text-sm font-medium text-white">
                                {file.name}
                            </p>

                            <p className="text-xs text-gray-400">
                                {formatFileSize(file.size)}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="text-sm text-red-400 hover:text-red-300"
                        >
                            Remove
                        </button>

                    </div>
                )}

            </div>
            <section className="flex-1 p-6 space-y-6">

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-md rounded-2xl px-4 py-3 ${message.role === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-800 text-gray-200"
                                }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}

            </section>


            <footer className="border-t border-gray-800 p-4">

                <form className="max-w-4xl mx-auto flex gap-3">

                    <input

                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        placeholder="Ask something about your document..."
                        className="flex-1 rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 outline-none focus:border-blue-500"
                    />

                    <button
                        onClick={handleSend}
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 px-6 rounded-xl font-medium"
                    >
                        Send
                    </button>

                </form>

            </footer>

        </main>
    );
}
