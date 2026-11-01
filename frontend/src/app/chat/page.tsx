
"use client";

import { useState } from "react";

import PdfUpload from "@/components/chat/PdfUpload";

export default function ChatPage() {
    const [file, setFile] = useState<File | null>(null);

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
                        Upload your PDF and start asking questions.
                        Get accurate answers directly from your document.
                    </p>
                </div>


                <div className="space-y-4">
                    <div className="text-center">
                        <h2 className="text-lg font-medium text-white">
                            Upload your document
                        </h2>

                        <p className="mt-1 text-sm text-gray-400">
                            Start a new conversation with your PDF.
                        </p>
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
                    Each conversation is connected to one PDF.
                    Your AI assistant answers using that document only.
                </p>

            </div>
        </div>
    );
}
