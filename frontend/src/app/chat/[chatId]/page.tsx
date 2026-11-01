
"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";

import {
    getChatMessages,
    sendChatMessage,
} from "@/service/chatService";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: Date;
}

interface ChatInfo {
    _id: string;
    title: string;
    documentId: string | null;
}

export default function ChatDetailsPage() {
    const params = useParams();
    const chatId = params.chatId as string;

    const requestIdRef = useRef(0);

    const [chat, setChat] = useState<ChatInfo | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const requestId = ++requestIdRef.current;

        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                setError("");
                setMessages([]);
                setChat(null);

                const data = await getChatMessages(chatId);

                if (requestId !== requestIdRef.current) return;

                setChat(data.chat);

                const formattedMessages: Message[] = data.messages.map(
                    (message: any) => ({
                        id: message._id,
                        role: message.role,
                        content: message.content,
                        createdAt: new Date(message.createdAt),
                    })
                );

                setMessages(formattedMessages);
            } catch (error: any) {
                if (requestId !== requestIdRef.current) return;

                setError(
                    error.response?.data?.message ||
                    "Unable to load chat. Please try again."
                );
            } finally {
                if (requestId === requestIdRef.current) {
                    setIsLoading(false);
                }
            }
        };

        if (chatId) {
            fetchMessages();
        }

        return () => {
            requestIdRef.current++;
        };
    }, [chatId]);

    const handleSend = async (message: string) => {
        if (!message.trim() || isSending) return;

        setIsSending(true);
        setError("");

        const tempMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: message.trim(),
            createdAt: new Date(),
        };

        setMessages((prev) => [...prev, tempMessage]);

        try {
            const data = await sendChatMessage(chatId, message.trim());

            setMessages((prev) => [
                ...prev.filter((msg) => msg.id !== tempMessage.id),
                {
                    id: data.userMessage._id,
                    role: "user",
                    content: data.userMessage.content,
                    createdAt: new Date(data.userMessage.createdAt),
                },
                {
                    id: data.assistantMessage._id,
                    role: "assistant",
                    content: data.assistantMessage.content,
                    createdAt: new Date(data.assistantMessage.createdAt),
                },
            ]);
        } catch (error: any) {
            setMessages((prev) =>
                prev.filter((msg) => msg.id !== tempMessage.id)
            );

            setError(
                error.response?.data?.message ||
                "Failed to send message. Please try again."
            );
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center text-gray-400">
                Loading chat...
            </div>
        );
    }

    if (error && !chat) {
        return (
            <div className="flex flex-1 items-center justify-center p-6">
                <p className="text-sm text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col">

            <div className="border-b border-gray-800 px-5 py-3">
                <h1 className="truncate text-sm font-medium text-white">
                    {chat?.title || "Document Chat"}
                </h1>

                <p className="text-xs text-gray-500">
                    Ask questions about this PDF
                </p>
            </div>


            <MessageList messages={messages} />

            {error && (
                <p className="px-5 py-2 text-sm text-red-400">
                    {error}
                </p>
            )}


            <MessageInput
                onSend={handleSend}
                isLoading={isSending}
            />
        </div>
    );
}
