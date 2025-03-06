import React, { useState } from "react";
import { Form, Input, Button, message, notification } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined, ShoppingCartOutlined, KeyOutlined, LockOutlined } from "@ant-design/icons";
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { updateUserPassword } from "../../../services/ApiServices/userService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

const AccountChangePassword = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form] = Form.useForm();
    const users = useSelector((state: RootState) => state.token.user);
    console.log(users)
    const token = useSelector((state: any) => state.token.token);
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleInputChange = (e: any) => {
        setPasswords({ ...passwords, [e.target.id]: e.target.value });
    };

    const handleUpdatePassword = async () => {
        if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
            notification.error({ message: "Vui lòng điền đầy đủ thông tin!" });
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            notification.error({ message: "Mật khẩu xác nhận không khớp!" });
            return;
        }

        if (!users) return null;

        try {
            setIsLoading(true);
            const requestData = {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword,
            };

            const response = await updateUserPassword(users?.userId, requestData, token);

            if (response.code === 0) {
                notification.success({ message: "Cập nhật mật khẩu thành công!" });
                setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                notification.error({ message: response.message || "Cập nhật thất bại!" });
            }
        } catch (err) {
            message.error("Có lỗi xảy ra! Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <section className="bg-gray-100 pt-40">
                <div className="bg-gray-100 top-0 left-0 items-start ml-8 z-10 ">
                    <div>
                        <Breadcrumb className="">
                            <BreadcrumbList className="text-[#000]">
                                <BreadcrumbItem>
                                    <Link to="/" className="md:text-xl text-lg">
                                        Trang chủ
                                    </Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <p className="text-[#000] font-medium md:text-xl text-lg">
                                        Hồ sơ khách hàng
                                    </p>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <p className="text-[#000] font-medium md:text-xl text-lg">
                                        Đổi mật khẩu
                                    </p>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="bg-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-6">
                    {/* Sidebar */}
                    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 col-start-2 col-end-5">
                        <h2 className="text-lg font-bold text-gray-800">Trang Tài Khoản</h2>
                        <h2 className="text-md font-semibold text-gray-800 mb-4">
                            Xin chào, <span className="text-blue-600">{users?.username}!</span>
                        </h2>
                        <ul className="space-y-4 mt-10">
                            <li>
                                <Link
                                    to="/account"
                                    className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition"
                                >
                                    <UserOutlined className="text-green-600" />
                                    <span>Thông tin tài khoản</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/account/orders"
                                    className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition"
                                >
                                    <ShoppingCartOutlined className="text-green-600" />
                                    <span>Đơn hàng của bạn</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/account/change-password"
                                    className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition"
                                >
                                    <KeyOutlined className="text-green-600" />
                                    <span>Đổi mật khẩu</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Change Password Section */}
                    <section className="bg-white shadow-md rounded-lg p-6 border border-gray-200 col-start-5 col-end-12">
                        <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2 border-b-2 border-gray-300 pb-2">
                            <KeyOutlined className="text-red-500" />
                            Đổi Mật Khẩu
                        </h2>

                        <form className="space-y-6">
                            <div className="max-w-5xl mx-auto p-6 bg-[rgba(255,255,255,0.75)] rounded-md">
                                {/* Old Password */}
                                <div className="text-left">
                                    <label
                                        htmlFor="oldPassword"
                                        className="block text-gray-700 font-medium"
                                    >
                                        Mật khẩu cũ
                                    </label>
                                    <input
                                        type="password"
                                        id="oldPassword"
                                        value={passwords.oldPassword}
                                        onChange={handleInputChange}
                                        placeholder="Nhập mật khẩu cũ"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* New Password and Confirm Password - Flex layout */}
                                <div className="flex space-x-6">
                                    {/* New Password */}
                                    <div className="flex-1 mt-5 text-left">
                                        <label
                                            htmlFor="password"
                                            className="block text-gray-700 font-medium"
                                        >
                                            Mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            value={passwords.newPassword}
                                            onChange={handleInputChange}
                                            placeholder="Nhập mật khẩu mới"
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="flex-1 mt-5 text-left">
                                        <label
                                            htmlFor="confirmPassword"
                                            className="block text-gray-700 font-medium"
                                        >
                                            Xác nhận mật khẩu
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            value={passwords.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Xác nhận mật khẩu mới"
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end mt-8">
                                    <Button
                                        onClick={handleUpdatePassword}
                                        className="bg-[#316ad3] text-white px-4 py-2 rounded hover:bg-[#51b8af]"
                                    >
                                        {isSubmitting ? "Đang lưu..." : "Lưu"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </>
    );
};

export default AccountChangePassword;
