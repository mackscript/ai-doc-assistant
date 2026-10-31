
"use client";

interface ChatHeaderProps {
    onLogout: () => void;
}

export default function ChatHeader({
    onLogout,
}: ChatHeaderProps) {
    return (
        <header className="flex items-center justify-between border-b border-gray-800 p-4">
            <div>
                <h1 className="text-xl font-bold">
                    AI Document Assistant
                </h1>

                <p className="text-sm text-gray-400">
                    Chat with your documents
                </p>
            </div>

            <button
                type="button"
                onClick={onLogout}
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-red-600"
            >
                Logout
            </button>
        </header>
    );
}
