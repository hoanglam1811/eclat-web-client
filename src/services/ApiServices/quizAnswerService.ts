import axios from "axios";
import { BASE_URL } from "../../constants/api";

export async function createQuizAnswer(data: any, token: any) {
    try {
        const response = await axios.post(`${BASE_URL}/quizAnswer`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create quiz answer:", error);
        throw error;
    }
}

export async function getQuizAnswers(token: any) {
    try {
        const response = await axios.get(`${BASE_URL}/quizAnswer`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch quiz answers:", error);
        throw error;
    }
}

// Lấy chi tiết một câu trả lời theo ID
export async function getQuizAnswerById(quizAnswerId: number, token: string) {
    try {
        const response = await axios.get(`${BASE_URL}/quizAnswer/${quizAnswerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch quiz answer with ID ${quizAnswerId}:`, error);
        throw error;
    }
}

// Cập nhật câu trả lời của quiz
export async function updateQuizAnswer(quizAnswerId: number, data: any, token: string) {
    try {
        const response = await axios.put(`${BASE_URL}/quizAnswer/${quizAnswerId}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to update quiz answer with ID ${quizAnswerId}:`, error);
        throw error;
    }
}

// Xóa câu trả lời của quiz
export async function deleteQuizAnswer(quizAnswerId: number, token: string) {
    try {
        const response = await axios.delete(`${BASE_URL}/quizAnswer/${quizAnswerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to delete quiz answer with ID ${quizAnswerId}:`, error);
        throw error;
    }
}