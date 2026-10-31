
"use client";

import api from "@/lib/axios";
import React, { useRef, useState } from "react";

interface PdfUploadProps {
    file: File | null;
    onFileChange: (file: File | null) => void;
}


export default function PdfUpload({
    file,
    onFileChange,
}: PdfUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState("");

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

        if (selectedFile.type !== "application/pdf") {
            alert("Only PDF files are allowed");
            e.target.value = "";
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            alert("File size must be less than 10MB");
            e.target.value = "";
            return;
        }

        onFileChange(selectedFile);
    };

    const formatFileSize = (bytes: number) => {
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    const handleUpload = async () => {
        if (!file) return;


        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        setUploadError("");
        setUploadSuccess("");

        try {
            const response = await api.post(
                "/api/documents/upload",
                formData
            );

            if (response.data.success) {
                setUploadSuccess(response.data.message || "PDF uploaded successfully");

                onFileChange(null);

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }

                console.log("Upload response:", response.data);
            }
        } catch (error: any) {
            setUploadError(
                error.response?.data?.message || "PDF upload failed"
            );
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="border-b border-gray-800 p-4">
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="w-full justify-between flex">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
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
                        onClick={() => {
                            onFileChange(null);
                            if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                            }
                        }}
                        className="text-sm text-red-400 hover:text-red-300"
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

            {uploadSuccess && (
                <p className="mt-2 text-sm text-green-500">
                    {uploadSuccess}
                </p>
            )}
        </div>
    );
}
