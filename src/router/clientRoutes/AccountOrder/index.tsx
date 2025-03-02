import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import { Link } from "react-router-dom";
import RouteNames from "../../../constants/routeNames";
import { KeyOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, Modal, notification, Rate, Table, Tag } from "antd";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { useEffect, useState } from "react";
import { Textarea } from "../../../components/ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { getUserById } from "../../../services/ApiServices/userService";
import { createFeedback } from "../../../services/ApiServices/feedbackService";
import { getTransactionsByUserId } from "../../../services/ApiServices/vnpayService";

const { TextArea } = Input;

const AccountOrder = () => {
    const users = useSelector((state: RootState) => state.token.user);
    const token = useSelector((state: any) => state.token.token);
    const [error, setError] = useState<any>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [comments, setComments] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>();
    const [orders, setOrders] = useState<any[]>([]);

    const fetchAccount = async () => {
        try {
            setIsLoading(true);
            if (!users) return;
            const response = await getUserById(users.userId, token);
            if (response.code == 0) {
                setUser(response.result);
            }
        } catch (err: any) {
            setError(err.toString());
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            if (!users) return;
            const response = await getTransactionsByUserId(users.userId, token);
            const formattedOrders = response.map((transaction: any) => ({
                id: transaction.order.orderId,
                product: transaction.order.orderDetails.map((detail: any) => `Sản phẩm ${detail.optionId}`).join(", "),
                quantity: transaction.order.orderDetails.reduce((sum: number, item: any) => sum + item.quantity, 0),
                date: transaction.createAt,
                status: transaction.status === "SUCCESS" ? "Thành công" : "Đã huỷ",
                imageUrl: "https://www.guardian.com.vn/media/catalog/product/cache/30b2b44eba57cd45fd3ef9287600968e/3/0/3016843_z7akcsj6o0ihd3hb.jpg",
                option: "Chi tiết sản phẩm"
            }));
            setOrders(formattedOrders);
        } catch (error) {
            console.error("Lỗi khi tải danh sách đơn hàng:", error);
        }
    };

    useEffect(() => {
        fetchAccount();
        fetchOrders();
    }, []);

    const handleRatingChange = (productId: string, value: number) => {
        setRatings((prev) => ({ ...prev, [productId]: value }));
    };

    const handleCommentChange = (productId: string, value: string) => {
        setComments((prev) => ({ ...prev, [productId]: value }));
    };


    const handleSubmit = async (productId: any) => {
        const selectedRating = ratings[productId];
        const selectedComment = comments[productId];

        if (!selectedRating || !selectedComment.trim()) {
            notification.error({ message: "Vui lòng nhập đánh giá và chọn sao" });
            return;
        }

        if (!user) return notification.error({ message: "Vui lòng đăng nhập" });

        try {
            await createFeedback({
                userId: user.id,
                orderId: selectedOrder.id,
                productId,
                rating: selectedRating,
                comment: selectedComment,
            }, token);
            notification.success({ message: "Đánh giá thành công!" });
            setRatings((prev) => ({ ...prev, [productId]: 0 }));
            setComments((prev) => ({ ...prev, [productId]: "" }));
            handleCancel();
        } catch (error) {
            notification.error({ message: "Gửi đánh giá thất bại!" });
        }
    };

    const columns: any = [
        { title: "ID Đơn Hàng", dataIndex: "id", key: "id" },
        { title: "Sản Phẩm", dataIndex: "product", key: "product" },
        { title: "Số Lượng", dataIndex: "quantity", key: "quantity", align: "center" },
        {
            title: "Ngày Mua",
            dataIndex: "date",
            key: "date",
            render: (date: string) => {
                const formattedDate = new Date(date).toLocaleDateString("vi-VN", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric"
                });
                return formattedDate;
            }
        },

        {
            title: "Trạng Thái", dataIndex: "status", key: "status",
            render: (status: any) => {
                let color = status === "Thành công" ? "green" : status === "Đã huỷ" ? "red" : "blue";
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: "Hành động", key: "action",
            render: (_: any, record: any) => (
                <Button
                    type="primary"
                    onClick={() => handleReview(record)}
                    disabled={record.status !== "Thành công"}
                >
                    Đánh giá
                </Button>
            )
        }
    ];

    const handleReview = (order: any) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setRatings({});
        setComments({});
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
                        <h2 className="text-lg font-bold mb-6">Đơn hàng của bạn</h2>
                        <Table dataSource={orders} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} bordered />

                        <Modal title="Đánh giá sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                            {selectedOrder && (
                                <div className="space-y-6">
                                    {selectedOrder.product.split(", ").map((product: any, index: any) => (
                                        <div key={index} className="border-b pb-4 mb-4">
                                            <div className="grid grid-cols-5 gap-4 items-center">
                                                <div className="col-span-1 flex justify-center">
                                                    <img src={selectedOrder.imageUrl} alt={product} className="w-20 h-20 rounded-lg object-cover" />
                                                </div>
                                                <div className="col-span-4">
                                                    <h3 className="text-lg font-semibold">{product}</h3>
                                                </div>
                                            </div>

                                            <div className="flex justify-center mt-4">
                                                <Rate
                                                    allowHalf
                                                    value={ratings[product] || 0}
                                                    onChange={(value) => handleRatingChange(product, value)}
                                                    className="text-3xl"
                                                />
                                            </div>

                                            <div className="mt-4">
                                                <span className="font-medium">Viết đánh giá:</span>
                                                <TextArea
                                                    value={comments[product] || ""}
                                                    onChange={(e) => handleCommentChange(product, e.target.value)}
                                                    placeholder="Nhập đánh giá của bạn..."
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="flex justify-end mt-4 gap-3">
                                                <Button type="primary" onClick={() => handleSubmit(product)} disabled={!ratings[product] || !comments[product]?.trim()}>
                                                    Gửi
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Nút Huỷ chỉ hiển thị một lần, nằm dưới cùng bên phải */}
                                    <div className="flex justify-end mt-6">
                                        <Button onClick={handleCancel}>Huỷ</Button>
                                    </div>
                                </div>
                            )}
                        </Modal>

                    </section>
                </div>
            </div>
        </>
    );
}

export default AccountOrder;