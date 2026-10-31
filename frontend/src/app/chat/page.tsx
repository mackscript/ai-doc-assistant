"use client"

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import PdfUpload from "@/components/chat/PdfUpload";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatSidebar, { Chat } from "@/components/chat/ChatSidebar";
import { createChat, deleteChat, getAllChats, getChatMessages, sendChatMessage } from "@/service/chatService";
interface Message {
    id: string,
    role: "user" | "assistant"
    content: string,
    createdAt: Date,
}

export default function ChatPage() {
    const activeChatIdRef = useRef<string | null>(null);
    const router = useRouter()
    const [messages, setMessages] = useState<Message[]>([])
    const [isSending, setIsSending] = useState(false);
    const [file, setFile] = useState<File | null>(null)
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);



    const handleSend = async (message: string) => {
        if (!message.trim() || isSending) return;

        setIsSending(true);

        let chatId = activeChatId;


        try {

            if (!chatId) {
                const chatResponse = await createChat("New Chat");

                if (!chatResponse.success) {
                    throw new Error("Failed to create chat");
                }

                const newChat = chatResponse.data;

                chatId = newChat._id;

                setActiveChatId(chatId);
                setChats((prev) => [newChat, ...prev]);
            }

            if (!chatId) {
                throw new Error("Chat ID is missing");
            }

            let tempMessage: Message | null = null;
            tempMessage = {
                id: crypto.randomUUID(),
                role: "user",
                content: message.trim(),
                createdAt: new Date(),
            };

            setMessages((prev) => [...prev, tempMessage!]);


            const data = await sendChatMessage(chatId, message.trim());

            const userMessage: Message = {
                id: data.userMessage._id,
                role: "user",
                content: data.userMessage.content,
                createdAt: new Date(data.userMessage.createdAt),
            };

            const assistantMessage: Message = {
                id: data.assistantMessage._id,
                role: "assistant",
                content: data.assistantMessage.content,
                createdAt: new Date(data.assistantMessage.createdAt),
            };

            setMessages((prev) => [
                ...prev.filter((msg) => msg.id !== tempMessage.id),
                userMessage,
                assistantMessage,
            ]);

            const updatedChats = await getAllChats();
            setChats(updatedChats);

        } catch (error: any) {

            console.error(
                "Send message error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                error.message ||
                "Failed to send message"
            );

        } finally {
            setIsSending(false);
        }
    };




    const handleNewChat = async () => {

        try {
            const response = await createChat("New Chat");

            if (response.success) {
                const newChat = response.data;
                setChats((prev) => [newChat, ...prev]);
                setActiveChatId(newChat._id);
                setMessages([]);
            }
        } catch (error: any) {
            console.error(
                "Create chat error:",
                error.response?.data || error.message
            );
        }
    };

    const handleSelectChat = async (chatId: string) => {
        setActiveChatId(chatId);
        setMessages([]);
        activeChatIdRef.current = chatId;
        try {
            const data = await getChatMessages(chatId);


            console.log('data :>> ', data, activeChatId, chatId);
            if (activeChatIdRef.current !== chatId) return;

            const formattedMessages: Message[] = data.messages.map(
                (message: any) => ({
                    id: message._id,
                    role: message.role,
                    content: message.content,
                    createdAt: new Date(message.createdAt),
                })
            );

            console.log('formattedMessages :>> ', formattedMessages);
            setMessages(formattedMessages);
        } catch (error: any) {
            console.error("Get chat messages error:", error);
        }
    };


    const handleDeleteChat = async (chatId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this chat?"
        );

        if (!confirmed) return;

        try {
            await deleteChat(chatId);

            setChats((prev) =>
                prev.filter((chat) => chat._id !== chatId)
            );

            if (activeChatId === chatId) {
                setActiveChatId(null);
                setMessages([]);
            }

        } catch (error: any) {
            console.error(
                "Delete chat error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message || "Failed to delete chat"
            );
        }
    };


    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.replace("/login");
        }
        const fetchChats = async () => {
            try {
                const chats = await getAllChats();
                setChats(chats);
            } catch (error: any) {
                console.error(
                    "Fetch chats error:",
                    error.response?.data || error.message
                );
            }
        };

        fetchChats();

    }, [router]);


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.replace("/login");
    };
    return (
        <main className="flex h-screen flex-col bg-gray-950 text-white">

            <ChatHeader onLogout={handleLogout} />

            <div className="flex min-h-0 flex-1">

                <ChatSidebar chats={chats}
                    activeChatId={activeChatId}
                    onNewChat={handleNewChat}
                    onSelectChat={handleSelectChat}
                    onDeleteChat={handleDeleteChat}
                />

                <div className="flex min-w-0 flex-1 flex-col">

                    <PdfUpload
                        file={file}
                        onFileChange={setFile}
                    />

                    <MessageList messages={messages} />

                    <MessageInput onSend={handleSend} isLoading={isSending}
                    />

                </div>
            </div>
        </main>
    );
}
