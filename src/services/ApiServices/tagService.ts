import axios from "axios";
import { BASE_URL } from "../../constants/api";

const API_URL = `${BASE_URL}/api/Tags`;

export async function getAllTags(token: string) {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get tags:", error);
        throw error;
    }
}

export async function getTagById(id: number, token: string) {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get tag by ID:", error);
        throw error;
    }
}

export async function addTag(tagData: any, token: string) {
    try {
        const response = await axios.post(`${API_URL}/insert`, tagData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to add tag:", error);
        throw error;
    }
}

export async function updateTag(id: number, tagData: any, token: string) {
    try {
        const response = await axios.put(`${API_URL}/${id}`, tagData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update tag:", error);
        throw error;
    }
}

// Xóa Tag
export async function deleteTag(id: number, token: string) {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to delete tag:", error);
        throw error;
    }
}
