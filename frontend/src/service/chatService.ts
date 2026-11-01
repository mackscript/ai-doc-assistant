
import api from "@/lib/axios";

export interface Chat {
    _id: string;
    title: string;
    documentId: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export const getAllChats = async (): Promise<Chat[]> => {
    const response = await api.get("/api/chat");

    return response.data.data;
};

export const getChatMessages = async (chatId: string) => {
    const response = await api.get(`/api/chat/${chatId}`);

    return response.data.data;
};

export const sendChatMessage = async (
    chatId: string,
    message: string
) => {
    const response = await api.post(
        `/api/chat/${chatId}/messages`,
        { message }
    );

    return response.data.data;
};

export const deleteChat = async (chatId: string) => {
    const response = await api.delete(`/api/chat/${chatId}`);

    return response.data;
};
