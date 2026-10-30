"use client"

import React, { useState } from "react";


interface Message {
    id: string,
    role: "user" | "assistant"
    content: string,
    createdAt: Date,
}
export default function ChatPage() {

    const [messages, setMessage] = useState<Message[]>([])
    const [input, setInput] = useState<string>("");


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
