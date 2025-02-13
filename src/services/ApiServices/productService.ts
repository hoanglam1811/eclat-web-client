import axios from "axios";
import { BASE_URL } from "../../constants/api";

//const ngrokSkipWarning: any = { headers: { "bypass-tunnel-reminder": "true" } };

// Tạo tài khoản Staff
export async function getAllProducts(token: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/Products`, 
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
export async function addProduct(product: any, token: string) {
  try {
    const response = await axios.post(`${BASE_URL}/api/Products/insert`, product, {
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
