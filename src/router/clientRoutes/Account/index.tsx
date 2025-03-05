import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import { Link } from "react-router-dom";
import RouteNames from "../../../constants/routeNames";
import { EditOutlined, KeyOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { useSelector } from "react-redux";
import { getUserById, updateUserEmail } from "../../../services/ApiServices/userService";
import { useEffect, useState } from "react";
import { RootState } from "../../../store/store";
import ScreenSpinner from "../../../components/ScreenSpinner";
import { Button, Form, Input, Modal, notification } from "antd";
import { CircularProgress } from "@mui/material";

const Account = () => {
    const users = useSelector((state: RootState) => state.token.user);
    const token = useSelector((state: any) => state.token.token);
    const [user, setUser] = useState<any>({
        username: "",
        email: "",
        phone: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchAccount = async () => {
        try {
            setIsLoading(true);
            if (!users) return;
            const response = await getUserById(users.userId, token);
            if (response.code == 0) {
                setUser(response.result);
            }
        }
        catch (err: any) {
            setError(err.toString());
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchAccount();
    }, []);

    const handleOpenModal = () => {
        form.setFieldsValue({
            username: user.username,
            email: user.email,
            phone: user.phone,
        });
        setIsModalOpen(true);
    };

    // Xử lý đóng modal
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleUpdate = async () => {
        if (!users) return;
        try {
            setIsSubmitting(true);
            const values = await form.validateFields();
            const updatedUser = {
                ...values,
                update_at: new Date().toISOString().split("T")[0],
                username: user.username,
            };

            const response = await updateUserEmail(users.userId, updatedUser, token);
            console.log(response)
            if (response.code === 0) {
                setUser(updatedUser);
                notification.success({ message: "Cập nhật thông tin thành công!" });
                setIsModalOpen(false);
            } else {
                notification.error(response.message || "Cập nhật thất bại!");
            }
        } catch (err: any) {
            notification.error({ message: "Vui lòng kiểm tra lại thông tin!" });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            {isLoading && <CircularProgress />}
            <section className="bg-gray-100 p-6">

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
                                        Thông tin tài khoản
                                    </p>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            </section>

            {/* <div className="flex items-center justify-center max-w-full bg-gray-100"> */}
            <div className="bg-gray-100">

                <div className="text-red-500">{error}</div>
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-6">
                    {/* Sidebar */}
                    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 col-start-2 col-end-5">
                        <h2 className="text-lg font-bold text-gray-800">Trang Tài Khoản</h2>
                        <h2 className="text-md font-semibold text-gray-800 mb-4">Xin chào,<span className="text-blue-600"> {user.username}!</span></h2>
                        <ul className="space-y-4 mt-10">
                            <li>
                                <Link
                                    to={RouteNames.ACCOUNT}
                                    className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition"
                                >
                                    <UserOutlined className="text-green-600" />
                                    <span>Thông tin tài khoản</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={RouteNames.ACCOUNT_ORDERS}
                                    className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition"
                                >
                                    <ShoppingCartOutlined className="text-green-600" />
                                    <span>Đơn hàng của bạn</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={RouteNames.ACCOUNT_CHANGE_PASSWORD}
                                    className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition"
                                >
                                    <KeyOutlined className="text-green-600" />
                                    <span>Đổi mật khẩu</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Profile Details */}
                    <section className=" bg-white shadow-md rounded-lg p-6 border border-gray-200 col-start-5 col-end-12">
                        <div className="flex justify-between items-center border-b-2 border-gray-300 pb-2">
                            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                                <UserOutlined className="text-blue-500" />
                                Thông Tin Tài Khoản
                            </h2>
                            <EditOutlined
                                className="text-blue-500 cursor-pointer text-xl hover:text-blue-700 transition"
                                onClick={handleOpenModal}
                            />
                        </div>


                        <div className="space-y-6 mt-3">
                            {/* Name */}
                            <div className="flex justify-between items-center border-b pb-4">
                                <span className="text-black font-bold">Tên người dùng:</span>
                                <span className="font-medium text-black">{user.username}</span>
                            </div>

                            {/* Email */}
                            <div className="flex justify-between items-center border-b pb-4">
                                <span className="text-black font-bold">Email:</span>
                                <span className="font-medium text-black">{user.email || "N/a"}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-black font-bold">Số điện thoại:</span>
                                <span className="font-medium text-black">{user.phone || "N/a"}</span>
                            </div>
                        </div>

                        <Modal
                            title="Chỉnh sửa thông tin cá nhân"
                            open={isModalOpen}
                            onCancel={handleCancel}
                            footer={[
                                <Button key="cancel" onClick={handleCancel}>
                                    Hủy
                                </Button>,
                                <Button key="submit" type="primary" loading={isSubmitting} onClick={handleUpdate}>
                                    Lưu thay đổi
                                </Button>,
                            ]}
                        >
                            <Form form={form} layout="vertical">
                                <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email!" }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
                                    <Input />
                                </Form.Item>
                            </Form>
                            <div className="flex justify-between items-center border-b pb-4">
                                <span className="text-orange-500 font-medium">Khi bạn muốn thay đổi đồng nghĩa với việc bạn sẽ phải xác thực email thêm 1 lần nữa, nếu đồng ý hãy bấm "Lưu thay đổi"</span>
                            </div>
                        </Modal>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Account;
