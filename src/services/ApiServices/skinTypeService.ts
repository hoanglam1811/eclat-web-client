import axios from "axios";
import { BASE_URL } from "../../constants/api";

//const ngrokSkipWarning: any = { headers: { "bypass-tunnel-reminder": "true" } };

export async function getSkinTypeById(id: number) {
  try {
    const response = await axios.get(`${BASE_URL}/skintype/${id}`, {
      headers: {
        // Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get skin type by ID:", error);
    throw error;
  }
}

export async function getAllSkinTypes() {
  try {
    const response = await axios.get(`${BASE_URL}/skintype`,
      {
        headers: {
          // Authorization: `Bearer ${token}`,
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
