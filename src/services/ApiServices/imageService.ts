import axios from "axios";
import { BASE_URL } from "../../constants/api";

// Lấy danh sách tất cả hình ảnh
export async function getAllImages(token: any) {
    try {
        const response = await axios.get(`${BASE_URL}/api/Images`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch images:", error);
        throw error;
    }
}

// Lấy chi tiết một hình ảnh theo ID
export async function getImageById(id: any, token: any) {
    try {
        const response = await axios.get(`${BASE_URL}/api/Images/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch image with id ${id}:`, error);
        throw error;
    }
}

// Thêm mới một hình ảnh
export async function addImage(imageData: any, token: any) {
    try {
        const response = await axios.post(`${BASE_URL}/api/Images/insert`, imageData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to add image:", error);
        throw error;
    }
}

// Cập nhật hình ảnh theo ID
export async function updateImage(id: any, imageData: any, token: any) {
    try {
        const response = await axios.put(`${BASE_URL}/api/Images/${id}`, imageData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to update image with id ${id}:`, error);
        throw error;
    }
}

// Xóa hình ảnh theo ID
export async function deleteImage(id: any, token: any) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/Images/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to delete image with id ${id}:`, error);
        throw error;
    }
}
