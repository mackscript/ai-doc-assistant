
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PdfUpload from "@/components/chat/PdfUpload";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatSidebar, { Chat } from "@/components/chat/ChatSidebar";

import {
    createChat,
    deleteChat,
    getAllChats,
} from "@/service/chatService";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const params = useParams();

    const chatId = params.chatId as string | undefined;

    const [chats, setChats] = useState<Chat[]>([]);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.replace("/login");
            return;
        }

        const fetchChats = async () => {
            try {
                const data = await getAllChats();
                setChats(data);
            } catch (error) {
                console.error("Fetch chats error:", error);
            }
        };

        fetchChats();
    }, [router]);

    const handleNewChat = async () => {
        try {
            const response = await createChat("New Chat");

            if (response.success) {
                const newChat = response.data;

                setChats((prev) => [newChat, ...prev]);

                router.push(`/chat/${newChat._id}`);
            }
        } catch (error) {
            console.error("Create chat error:", error);
        }
    };

    const handleSelectChat = (id: string) => {
        router.push(`/chat/${id}`);
    };

    const handleDeleteChat = async (id: string) => {
        const confirmed = window.confirm("Delete this chat?");
        if (!confirmed) return;

        try {
            await deleteChat(id);

            setChats((prev) =>
                prev.filter((chat) => chat._id !== id)
            );

            if (chatId === id) {
                router.push("/chat");
            }
        } catch (error) {
            console.log('error :>> ', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
    };

    return (
        <main className="flex h-screen flex-col bg-gray-950 text-white">
            <ChatHeader onLogout={handleLogout} />

            <div className="flex min-h-0 flex-1">
                <ChatSidebar
                    chats={chats}
                    activeChatId={chatId ?? null}
                    onNewChat={handleNewChat}
                    onSelectChat={handleSelectChat}
                    onDeleteChat={handleDeleteChat}
                />

                <div className="flex min-w-0 flex-1 flex-col">
                    <PdfUpload
                        file={file}
                        onFileChange={setFile}
                    />

                    {children}
                </div>
            </div>
        </main>
    );
}
