
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

export default function ChatDetailsPage() {
    const params = useParams();
    const chatId = params.chatId as string;

    const requestIdRef = useRef(0);

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);


    useEffect(() => {
        const requestId = ++requestIdRef.current;

        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                setMessages([]);

                const data = await getChatMessages(chatId);


                if (requestId !== requestIdRef.current) return;

                const formattedMessages: Message[] = data.messages.map(
                    (message: any) => ({
                        id: message._id,
                        role: message.role,
                        content: message.content,
                        createdAt: new Date(message.createdAt),
                    })
                );

                setMessages(formattedMessages);
            } catch (error) {
                console.log('error :>> ', error);
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
        } catch (error) {
            setMessages((prev) =>
                prev.filter((msg) => msg.id !== tempMessage.id)
            );
            console.log('error :>> ', error);
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

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <MessageList messages={messages} />

            <MessageInput
                onSend={handleSend}
                isLoading={isSending}
            />
        </div>
    );
}
