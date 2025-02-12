import axios from "axios";
import { BASE_URL } from "../../constants/api";

// Lấy option theo ID
export async function getOptionById(id: number, token: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/options/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch option:", error);
        throw error;
    }
}

// Thêm mới option
export async function addOption(optionData: any, token: string) {
    try {
        const response = await axios.post(`${BASE_URL}/api/options/insert`, optionData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to add option:", error);
        throw error;
    }
}

// Cập nhật option
export async function updateOption(id: number, updatedData: any, token: string) {
    try {
        const response = await axios.put(`${BASE_URL}/api/options/${id}`, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update option:", error);
        throw error;
    }
}

// Xóa option theo ID
export async function deleteOption(id: number, token: string) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/options/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to delete option:", error);
        throw error;
    }
}
