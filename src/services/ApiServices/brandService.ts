import axios from "axios";
import { BASE_URL } from "../../constants/api";

//const ngrokSkipWarning: any = { headers: { "bypass-tunnel-reminder": "true" } };

// Tạo tài khoản Staff
export async function getAllBrands(token: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/Brands`, 
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

// Lấy danh sách tất cả người dùng
export async function addBrand(categoryData: any, token: string) {
  try {
    const response = await axios.post(`${BASE_URL}/api/Brands/insert`, categoryData, {
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

export async function updateBrand(categoryData: any, token: string) {
  try {
    const response = await axios.put(`${BASE_URL}/api/Brands/${categoryData.id}`, categoryData, {
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

export async function deleteBrand(categoryData: any, token: string) {
  try {
    const response = await axios.delete(`${BASE_URL}/api/Brands/${categoryData.id}`, {
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
