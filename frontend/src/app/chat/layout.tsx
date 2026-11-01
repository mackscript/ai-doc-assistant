
"use client";

import { useEffect, useState } from "react";
import {
    useParams,
    usePathname,
    useRouter,
} from "next/navigation";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatSidebar, {
    Chat,
} from "@/components/chat/ChatSidebar";

import {
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
    const pathname = usePathname();

    const chatId = params.chatId as string | undefined;

    const [chats, setChats] = useState<Chat[]>([]);

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
    }, [router, pathname]);


    const handleNewChat = () => {
        router.push("/chat");
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
            console.error("Delete chat error:", error);
        }
    };

    // Logout
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
                    {children}
                </div>
            </div>
        </main>
    );
}
