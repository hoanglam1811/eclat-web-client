import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import { Link } from "react-router-dom";
import RouteNames from "../../../constants/routeNames";
import { KeyOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Modal, notification, Rate, Table, Tag } from "antd";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { useEffect, useState } from "react";
import { Textarea } from "../../../components/ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { getUserById } from "../../../services/ApiServices/userService";
import { createFeedback } from "../../../services/ApiServices/feedbackService";

const AccountOrder = () => {
    const users = useSelector((state: RootState) => state.token.user);
    const token = useSelector((state: any) => state.token.token);
    const [error, setError] = useState<any>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>();

    const fetchAccount = async () => {
        try {
            setIsLoading(true);
            if (!users) return;
            const response = await getUserById(users.userId, token);
            console.log(response)
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

    const handleSubmit = async () => {
        if (!rating || !comment.trim()) {
            notification.error({ message: "Vui lòng nhập đánh giá và chọn sao" });
            return;
        }

        if (!user) return notification.error({ message: "Vui lòng đăng nhập" });

        try {
            await createFeedback({
                userId: user.id,
                orderId: selectedOrder.id,
                rating,
                comment,
            }, token);
            notification.success({ message: "Đánh giá thành công!" });
            handleCancel();
        } catch (error) {
            notification.error({ message: "Gửi đánh giá thất bại!" });
        }
    };

    const orders = [
        {
            id: "ORD12345",
            product: "Sản phẩm A",
            quantity: 2,
            date: "2023-12-25",
            status: "Đang giao",
            imageUrl: "https://www.guardian.com.vn/media/catalog/product/cache/30b2b44eba57cd45fd3ef9287600968e/3/0/3016843_z7akcsj6o0ihd3hb.jpg",
            option: "Màu xanh - 500ml"
        },
        {
            id: "ORD12346",
            product: "Sản phẩm B",
            quantity: 1,
            date: "2023-12-20",
            status: "Hoàn thành",
            imageUrl: "https://www.guardian.com.vn/media/catalog/product/cache/30b2b44eba57cd45fd3ef9287600968e/3/0/3016843_z7akcsj6o0ihd3hb.jpg",
            option: "Loại dưỡng ẩm - 200ml"
        },
    ];

    const columns: any = [
        { title: "ID Đơn Hàng", dataIndex: "id", key: "id" },
        { title: "Sản Phẩm", dataIndex: "product", key: "product" },
        { title: "Số Lượng", dataIndex: "quantity", key: "quantity", align: "center" },
        { title: "Ngày Mua", dataIndex: "date", key: "date" },
        {
            title: "Trạng Thái", dataIndex: "status", key: "status",
            render: (status: any) => {
                let color = status === "Hoàn thành" ? "green" : status === "Đã hủy" ? "red" : "blue";
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: "Hành động", key: "action",
            render: (_: any, record: any) => (
                <Button type="primary" onClick={() => handleReview(record)}>Đánh giá</Button>
            )
        }
    ];

    const handleReview = (order: any) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setRating(0);
        setComment("");
    };

    return (
        <>
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
                                        Đơn hàng của bạn
                                    </p>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            </section>

            <div className="bg-gray-100">
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-6">
                    {/* Sidebar */}
                    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 col-start-2 col-end-5">
                        <h2 className="text-lg font-bold text-gray-800">Trang Tài Khoản</h2>
                        <h2 className="text-md font-semibold text-gray-800 mb-4">Xin chào,<span className="text-blue-600"> {user?.username}!</span></h2>
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

                    <section className="bg-white shadow-md rounded-lg p-6 border border-gray-200 col-start-5 col-end-12">
                        <div className="p-6">
                            <h2 className="text-lg font-bold mb-6">Đơn hàng của bạn</h2>
                            <Table dataSource={orders} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} bordered />

                            {/* Modal Đánh Giá */}
                            <Modal title="Đánh giá sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                                {selectedOrder && (
                                    <div className="space-y-4 mt-5">
                                        <div className="grid grid-cols-5 gap-4 items-center">
                                            <div className="col-span-1 flex justify-center">
                                                <img src={selectedOrder.imageUrl} alt={selectedOrder.product} className="w-20 h-20 rounded-lg object-cover" />
                                            </div>
                                            <div className="col-span-4">
                                                <h3 className="text-lg font-semibold">{selectedOrder.product}</h3>
                                                <p className="text-gray-600">{selectedOrder.option}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-center mt-6">
                                            <Rate allowHalf value={rating} onChange={setRating} className="text-3xl" />
                                        </div>

                                        <div className="mt-4">
                                            <span className="font-medium">Viết đánh giá:</span>
                                            <Textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Nhập đánh giá của bạn..."
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* Nút Hủy và Gửi */}
                                        <div className="flex justify-end mt-4 gap-3">
                                            <Button onClick={handleCancel}>Huỷ</Button>
                                            <Button type="primary" onClick={handleSubmit} disabled={rating === 0 || !comment.trim()}>Gửi</Button>
                                        </div>
                                    </div>
                                )}
                            </Modal>

                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default AccountOrder;