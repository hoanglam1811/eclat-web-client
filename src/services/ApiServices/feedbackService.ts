import axios from "axios";
import { BASE_URL } from "../../constants/api";

export async function createFeedback(feedbackData: any, token: string) {
    try {
        const response = await axios.post(`${BASE_URL}/feedback`, feedbackData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create feedback:", error);
        throw error;
    }
}

export async function getAllFeedback(token: string) {
    try {
        const response = await axios.get(`${BASE_URL}/feedback`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch feedback list:", error);
        throw error;
    }
}

export async function getFeedbackByUserId(userId: string, token: string) {
    try {
        const response = await axios.get(`${BASE_URL}/feedback/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch feedback by user ID:", error);
        throw error;
    }
}

export async function updateFeedbackById(feedbackId: number, feedbackData: any, token: string) {
    try {
        const response = await axios.put(`${BASE_URL}/feedback/${feedbackId}`, feedbackData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update feedback:", error);
        throw error;
    }
}

export async function deleteFeedbackById(feedbackId: number, token: string) {
    try {
        const response = await axios.delete(`${BASE_URL}/feedback/${feedbackId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to delete feedback:", error);
        throw error;
    }
}
