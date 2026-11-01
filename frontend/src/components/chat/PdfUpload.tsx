
"use client";

import api from "@/lib/axios";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface PdfUploadProps {
    file: File | null;
    onFileChange: (file: File | null) => void;
}

export default function PdfUpload({
    file,
    onFileChange,
}: PdfUploadProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

        if (selectedFile.type !== "application/pdf") {
            setUploadError("Only PDF files are allowed");
            e.target.value = "";
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setUploadError("File size must be less than 10MB");
            e.target.value = "";
            return;
        }

        setUploadError("");
        onFileChange(selectedFile);
    };

    const formatFileSize = (bytes: number) => {
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    const handleUpload = async () => {
        if (!file || isUploading) return;

        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        setUploadError("");

        try {
            const response = await api.post(
                "/api/documents/upload",
                formData
            );

            if (!response.data.success) {
                throw new Error("PDF upload failed");
            }

            const chatId = response.data.chat?.id;

            if (!chatId) {
                throw new Error("Chat ID not received from server");
            }

            onFileChange(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }


            router.push(`/chat/${chatId}`);
        } catch (error: any) {
            setUploadError(
                error.response?.data?.message ||
                error.message ||
                "PDF upload failed"
            );
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="border-b border-gray-800 p-4">
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="flex w-full justify-between">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
                >
                    Choose PDF
                </button>

                {file && (
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="mt-3 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                    >
                        {isUploading ? "Uploading..." : "Upload PDF"}
                    </button>
                )}
            </div>

            {file && (
                <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-800 p-3">
                    <div>
                        <p className="text-sm font-medium text-white">
                            {file.name}
                        </p>

                        <p className="text-xs text-gray-400">
                            {formatFileSize(file.size)}
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => {
                            onFileChange(null);

                            if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                            }
                        }}
                        className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                        Remove
                    </button>
                </div>
            )}

            {uploadError && (
                <p className="mt-2 text-sm text-red-500">
                    {uploadError}
                </p>
            )}
        </div>
    );
}
