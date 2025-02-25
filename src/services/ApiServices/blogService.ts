import axios from "axios";
import { BASE_URL } from "../../constants/api";

// Lấy danh sách blog
export async function getAllBlogs() {
    try {
        const response = await axios.get(`${BASE_URL}/blogs/blogs`, {
            headers: {
                // Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get blogs:", error);
        throw error;
    }
}

// Lấy blog theo ID
export async function getBlogById(id: number) {
    try {
        const response = await axios.get(`${BASE_URL}/blogs/blogs/${id}`, {
            headers: {
                // Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get blog by ID:", error);
        throw error;
    }
}

// Tạo blog mới
export async function createBlog(formData: FormData, token: string) {
    try {
        const response = await axios.post(`${BASE_URL}/blogs/blogs`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create blog:", error);
        throw error;
    }
}

// Cập nhật blog
export async function updateBlog(id: number, formData: FormData, token: string) {
    try {
        const response = await axios.put(`${BASE_URL}/blogs/blogs/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update blog:", error);
        throw error;
    }
}

// Xóa blog
export async function deleteBlog(id: number, token: string) {
    try {
        const response = await axios.delete(`${BASE_URL}/blogs/blogs/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to delete blog:", error);
        throw error;
    }
}
