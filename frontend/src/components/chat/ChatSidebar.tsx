
"use client";
export interface Chat {
    _id: string;
    title: string;
}

interface ChatSidebarProps {
    chats: Chat[];
    activeChatId: string | null;
    onNewChat: () => void;
    onSelectChat: (chatId: string) => void;
    onDeleteChat: (chatId: string) => void;
}

export default function ChatSidebar({
    chats,
    activeChatId,
    onNewChat,
    onSelectChat,
    onDeleteChat,
}: ChatSidebarProps) {
    return (
        <aside className="flex h-full w-72 flex-col border-r border-gray-800 bg-gray-900 p-4">
            <button
                type="button"
                onClick={onNewChat}
                className="mb-6 cursor-pointer rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium hover:bg-blue-700"
            >
                + New Chat
            </button>

            <h2 className="mb-3 text-sm font-semibold text-gray-400">
                Recent Chats
            </h2>

            <div className="flex-1 space-y-2 overflow-y-auto">
                {chats.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No chats yet
                    </p>
                ) : (
                    chats.map((chat) => (
                        <div
                            key={chat._id}
                            className={`flex items-center gap-2 rounded-lg p-2 ${activeChatId === chat._id
                                ? "bg-gray-700"
                                : "hover:bg-gray-800"
                                }`}
                        >
                            <button
                                type="button"
                                onClick={() => onSelectChat(chat._id)}
                                className="min-w-0 flex-1 truncate text-left text-sm text-gray-200"
                            >
                                {chat.title}
                            </button>

                            <button
                                type="button"
                                onClick={() => onDeleteChat(chat._id)}
                                className="shrink-0 text-xs text-red-400 hover:text-red-300"
                                aria-label="Delete chat"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
}
