import axios from "axios";
import { BASE_URL } from "../../constants/api";

//const ngrokSkipWarning: any = { headers: { "bypass-tunnel-reminder": "true" } };

// Tạo tài khoản Staff
export async function getAllSkinTypes(token: string) {
  try {
    const response = await axios.get(`${BASE_URL}/skintype`, 
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
export async function addSkinType(skinType: any, token: string) {
  try {
    const response = await axios.post(`${BASE_URL}/skintype`, skinType, {
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

// Lấy danh sách tất cả người dùng
export async function editSkinType(skinType: any, token: string) {
  try {
    const response = await axios.put(`${BASE_URL}/skintype/${skinType.id}`, skinType, {
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
