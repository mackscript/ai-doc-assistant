
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import PdfUpload from "@/components/chat/PdfUpload";
import { createChat } from "@/service/chatService";

export default function ChatPage() {
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const handleNewChat = async () => {
        if (isCreating) return;

        try {
            setIsCreating(true);

            const response = await createChat("New Chat");

            if (response.success) {
                router.push(`/chat/${response.data._id}`);
            }
        } catch (error) {
            console.error("Create chat error:", error);
            alert("Unable to create chat. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto bg-gray-950 px-5 py-10">

            <div className="w-full max-w-2xl space-y-8">


                <div className="space-y-3 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-3xl">
                        ✨
                    </div>

                    <h1 className="text-3xl font-semibold tracking-tight text-white">
                        AI Document Assistant
                    </h1>

                    <p className="text-sm leading-6 text-gray-400">
                        Upload your documents and start asking questions.
                        Get accurate answers directly from your PDFs.
                    </p>

                </div>


                <div className="flex justify-center">

                    <button
                        onClick={handleNewChat}
                        disabled={isCreating}
                        className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span className="text-lg">+</span>
                        {isCreating ? "Creating Chat..." : "Start New Chat"}
                    </button>

                </div>


                <div className="space-y-4">

                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-800" />
                        <span className="text-xs text-gray-500">
                            OR UPLOAD A DOCUMENT
                        </span>
                        <div className="h-px flex-1 bg-gray-800" />
                    </div>

                    <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/60 p-6 transition hover:border-violet-500/60 sm:p-10">

                        <PdfUpload
                            file={file}
                            onFileChange={setFile}
                        />

                        <p className="mt-4 text-center text-xs text-gray-500">
                            PDF files only · Maximum file size 10 MB
                        </p>

                    </div>

                </div>


                <p className="text-center text-xs text-gray-500">
                    Your documents are processed securely.
                    Start a conversation whenever you're ready.
                </p>

            </div>

        </div>
    );
}
