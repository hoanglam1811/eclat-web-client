import axios from "axios";
import { BASE_URL } from "../../constants/api";

const ngrokSkipWarning: any = { headers: { "bypass-tunnel-reminder": "true" } };
//const token = useSelector((state: RootState) => state.token.token);

// Tạo tài khoản Staff
export async function createStaff(userData: any) {
  try {
    const response = await axios.post(`${BASE_URL}/users`, userData, ngrokSkipWarning);
    return response.data;
  } catch (error) {
    console.error("Failed to create staff:", error);
    throw error;
  }
}

// Lấy danh sách tất cả người dùng
export async function getAllUsers(token: string) {
  try {
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get users:", error);
    throw error;
  }
}

// Lấy thông tin một user theo ID
export async function getUserById(userId: any, token: any) {
  try {
    if (token)
      ngrokSkipWarning.headers["Authorization"] = "Bearer " + token;
    else ngrokSkipWarning.headers["Authorization"] = null;

    const response = await axios.get(`${BASE_URL}/users/${userId}`, ngrokSkipWarning);

    ngrokSkipWarning.headers["Authorization"] = null;
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
export async function updateUserEmail(userId: any, requestData: any, token: string) {
  try {
    const response = await axios.put(`${BASE_URL}/users/updateEmail/${userId}`, requestData, { headers: { Authorization: "Bearer " + token } });
    return response.data;
  } catch (error) {
    console.error(`Failed to update user with ID ${userId}:`, error);
    throw error;
  }
}

export async function updateUserPassword(userId: string, requestData: any, token: string) {
  try {
    const response = await axios.put(
      `${BASE_URL}/users/updatePassword/${userId}`,
      requestData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update password for user ${userId}:`, error);
    throw error;
  }
}

// Xóa user theo ID
export async function deleteUser(userId: any) {
  try {
    const response = await axios.delete(`${BASE_URL}/users/${userId}`, ngrokSkipWarning);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete user with ID ${userId}:`, error);
    throw error;
  }
}

export async function forgotPassword(email: any) {
  try {
    const response = await axios.post(`${BASE_URL}/users/forgot-password`, null, {
      params: { email },
      ...ngrokSkipWarning,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to send forgot password email to ${email}:`, error);
    throw error;
  }
}

// Xác thực OTP
export async function verifyOtp(email: any, otp: any) {
  try {
    const response = await axios.post(`${BASE_URL}/users/verify-otp`, null, {
      params: { email, otp },
      ...ngrokSkipWarning,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to verify OTP for email ${email}:`, error);
    throw error;
  }
}

// Đặt lại mật khẩu
export async function resetPassword(email: any, otp: any, newPassword: any) {
  try {
    const response = await axios.post(`${BASE_URL}/users/reset-password`, null, {
      params: { email, otp, newPassword },
      ...ngrokSkipWarning,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to reset password for email ${email}:`, error);
    throw error;
  }
}

