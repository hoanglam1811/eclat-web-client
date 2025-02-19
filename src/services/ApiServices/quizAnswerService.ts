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