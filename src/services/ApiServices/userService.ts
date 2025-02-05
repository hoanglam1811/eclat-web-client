import axios from "axios";
import { BASE_URL } from "../../constants/api";

const ngrokSkipWarning = { headers: { "bypass-tunnel-reminder": "true" } };

// Tạo tài khoản Staff
export async function createStaff(userData:any) {
  try {
    const response = await axios.post(`${BASE_URL}/users`, userData, ngrokSkipWarning);
    return response.data;
  } catch (error) {
    console.error("Failed to create staff:", error);
    throw error;
  }
}

// Lấy danh sách tất cả người dùng
export async function getAllUsers() {
  try {
    const response = await axios.get(`${BASE_URL}/users`, ngrokSkipWarning);
    return response.data;
  } catch (error) {
    console.error("Failed to get users:", error);
    throw error;
  }
}

// Lấy thông tin một user theo ID
export async function getUserById(userId:any) {
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}`, ngrokSkipWarning);
    return response.data;
  } catch (error) {
    console.error(`Failed to get user with ID ${userId}:`, error);
    throw error;
  }
}

// Lấy thông tin của user hiện tại
export async function getMyInfo() {
  try {
    const response = await axios.get(`${BASE_URL}/users/myInfo`, ngrokSkipWarning);
    return response.data;
  } catch (error) {
    console.error("Failed to get my info:", error);
    throw error;
  }
}

// Cập nhật thông tin user
export async function updateUser(userId:any, userData:any) {
  try {
    const response = await axios.put(`${BASE_URL}/users/${userId}`, userData, ngrokSkipWarning);
    return response.data;
  } catch (error) {
    console.error(`Failed to update user with ID ${userId}:`, error);
    throw error;
  }
}

// Xóa user theo ID
export async function deleteUser(userId:any) {
  try {
    const response = await axios.delete(`${BASE_URL}/users/${userId}`, ngrokSkipWarning);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete user with ID ${userId}:`, error);
    throw error;
  }
}
