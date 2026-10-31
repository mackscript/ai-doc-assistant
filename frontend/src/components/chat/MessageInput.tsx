
"use client";

import React, { useState } from "react";

interface MessageInputProps {
    onSend: (message: string) => void;
    isLoading?: boolean;
}

export default function MessageInput({
    onSend,
    isLoading = false,
}: MessageInputProps) {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const message = input.trim();

        if (!message || isLoading) return;

        onSend(message);
        setInput("");
    };

    return (
        <footer className="border-t border-gray-800 p-4">
            <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-4xl gap-3"
            >
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    placeholder="Ask something about your document..."
                    disabled={isLoading}
                    className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 outline-none focus:border-blue-500"
                />

                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="rounded-xl bg-blue-600 px-6 font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? "Sending..." : "Send"}
                </button>
            </form>
        </footer>
    );
}
