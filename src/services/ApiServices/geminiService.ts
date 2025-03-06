import axios from "axios";
import { BASE_URL } from "../../constants/api";
import { GEMINI_API_KEY, GEMINI_BASE_URL } from "../../constants/gemini";

// Lấy danh sách tất cả hình ảnh
export async function gemini(history: any) {
    try {
        const response = await axios.post(`${GEMINI_BASE_URL}?key=${GEMINI_API_KEY}`,
        history,
        {
            headers: {
                // Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch images:", error);
        throw error;
    }
}
