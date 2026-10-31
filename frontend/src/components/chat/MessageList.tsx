
"use client";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: Date;
}

interface MessageListProps {
    messages: Message[];
}

export default function MessageList({
    messages,
}: MessageListProps) {
    return (
        <section className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">
                        Upload a PDF and start asking questions.
                    </p>
                </div>
            ) : (
                messages.map((message) => (
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
                ))
            )}
        </section>
    );
}
