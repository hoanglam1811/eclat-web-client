import axios from "axios";
import { BASE_URL } from "../../constants/api";

// Tạo quiz mới
export async function createQuiz(questionText: any, file: any, token: any) {
    const formData = new FormData();
    formData.append("question_text", questionText);
    if (file) {
        formData.append("file", file);
    }

    try {
        const response = await axios.post(`${BASE_URL}/quiz/create-quiz`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create quiz:", error);
        throw error;
    }
}

// Lấy danh sách quiz
export async function getAllQuiz(token: any) {
    try {
        const response = await axios.get(`${BASE_URL}/quiz`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch quizzes:", error);
        throw error;
    }
}

export async function getQuizById(id: string, token: any) {
    try {
        const response = await axios.get(`${BASE_URL}/quiz/${id}/details`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch quizzes:", error);
        throw error;
    }
}

// Cập nhật quiz
export async function updateQuiz(id: any, questionText: any, file: any, token: any) {
    const formData = new FormData();
    formData.append("question_text", questionText);
    if (file) {
        formData.append("file", file);
    }

    try {
        const response = await axios.put(`${BASE_URL}/quiz/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to update quiz with ID ${id}:`, error);
        throw error;
    }
}

// Xóa quiz
export async function deleteQuiz(id: any, token: any) {
    try {
        const response = await axios.delete(`${BASE_URL}/quiz/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to delete quiz with ID ${id}:`, error);
        throw error;
    }
}

// Xóa hình ảnh của quiz
export async function deleteQuizImage(id: any, token: any) {
    try {
        const response = await axios.delete(`${BASE_URL}/quiz/${id}/image`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to delete quiz image with ID ${id}:`, error);
        throw error;
    }
}

// Nộp quiz và xác định loại da
export async function submitQuiz(payload: any, token: any) {
    try {
        const response = await axios.post(`${BASE_URL}/quiz/submit`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to submit quiz:", error);
        throw error;
    }
}
