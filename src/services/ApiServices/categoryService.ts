import axios from "axios";
import { BASE_URL } from "../../constants/api";

export async function getAllCategories(token: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/Categories`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    return response.data;
  } catch (error) {
    console.error("Failed to create staff:", error);
    throw error;
  }
}

export async function getCategoryById(id: number, token: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/Categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch category with ID ${id}:`, error);
    throw error;
  }
}

// Lấy danh sách tất cả người dùng
export async function addCategory(categoryData: any, token: string) {
  try {
    const response = await axios.post(`${BASE_URL}/api/Categories/insert`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get users:", error);
    throw error;
  }
}

// Cập nhật danh mục theo ID
export async function updateCategory(id: number, categoryData: any, token: string) {
  try {
    const response = await axios.put(`${BASE_URL}/api/Categories/${id}`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update category with ID ${id}:`, error);
    throw error;
  }
}

// Xóa danh mục theo ID
export async function deleteCategory(id: number, token: string) {
  try {
    const response = await axios.delete(`${BASE_URL}/api/Categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to delete category with ID ${id}:`, error);
    throw error;
  }
}