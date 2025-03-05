import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import { Link } from "react-router-dom";
import RouteNames from "../../../constants/routeNames";
import { KeyOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, Modal, notification, Rate, Table, Tag, Tooltip } from "antd";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { getUserById } from "../../../services/ApiServices/userService";
import { createFeedback, getFeedbackByUserId } from "../../../services/ApiServices/feedbackService";
import { getOrdersByUserId } from "../../../services/ApiServices/orderService";
import { ShoppingCartIcon } from "lucide-react";

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
    const [submitting, setSubmitting] = useState(false);
    const [feedbacks, setFeedbacks] = useState<Record<number, any>>({});
    const [showReviewed, setShowReviewed] = useState(false);

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
            const response = await getOrdersByUserId(users.userId, token);

            const formattedOrders = response.map((order: any) => {
                const hasFeedback = order.orderDetails.some((detail: any) =>
                    detail.optionResponse.some((option: any) => option.product?.feedbacks?.length > 0)
                );

                return {
                    id: order.orderId,
                    product: order.orderDetails
                        .map((detail: any) =>
                            `Sản phẩm ${detail.optionResponse[0]?.product?.productName} - ${detail.optionResponse[0]?.optionValue}`
                        )
                        .join(", "),
                    quantity: order.orderDetails.reduce((sum: number, item: any) => sum + item.quantity, 0),
                    date: order.createAt,
                    status: order.status === "SUCCESS" || "PAID" ? "Thành công" : "Đã huỷ",
                    imageUrl: order.orderDetails[0]?.optionResponse[0]?.optionImages[0],
                    hasFeedback,
                    orderDetails: order.orderDetails,
                    paymentMethod: order.paymentMethod === "Cash" ? "Tiền mặt" : order.paymentMethod === "vnpay" ? "VNPay" : "Khác",
                    totalPrices: order.totalPrices
                };
            });

            setOrders(formattedOrders);
        } catch (error) {
            console.error("Lỗi khi tải danh sách đơn hàng:", error);
        }
    };

    const fetchFeedbacks = async () => {
        try {
            const response = await getFeedbackByUserId(user.id, token);
            if (response.code === 0) {
                const feedbackData = response.result.reduce((acc: any, feedback: any) => {
                    acc[feedback.orderDetailId] = feedback;
                    return acc;
                }, {});
                setFeedbacks(feedbackData);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách đơn hàng:", error);
        }
    };

    useEffect(() => {
        fetchAccount();
        fetchOrders();
        fetchFeedbacks();
    }, []);

    const handleRatingChange = (productId: string, optionId: string, value: number) => {
        setRatings((prev) => ({ ...prev, [`${productId}-${optionId}`]: value }));
    };

    const handleCommentChange = (productId: string, optionId: string, value: string) => {
        setComments((prev) => ({ ...prev, [`${productId}-${optionId}`]: value }));
    };

    const handleOpenModal = async (order: any) => {
        setIsModalOpen(true);
        setSelectedOrder(order);
        await fetchFeedbacks();
    };

    const handleSubmit = async (productId: string, optionId: string, orderDetailId: number) => {
        if (submitting) return;
        setSubmitting(true);

        const key = `${productId}-${optionId}`;
        const selectedRating = ratings[key];
        const selectedComment = comments[key];

        if (!selectedRating || !selectedComment.trim()) {
            notification.error({ message: "Vui lòng nhập đánh giá và chọn sao" });
            return;
        }

        if (!user) {
            notification.error({ message: "Vui lòng đăng nhập" });
            return;
        }

        try {
            await createFeedback({
                userId: user.id,
                productId,
                optionId,
                orderDetailId,
                rating: selectedRating,
                text: selectedComment,
                create_at: new Date().toISOString().split("T")[0],
                update_at: new Date().toISOString().split("T")[0],
            }, token);

            notification.success({ message: "Đánh giá thành công!" });

            await fetchFeedbacks();

            setRatings((prev) => ({ ...prev, [key]: 0 }));
            setComments((prev) => ({ ...prev, [key]: "" }));

            handleCancel();
        } catch (error) {
            notification.error({ message: "Gửi đánh giá thất bại!" });
        } finally {
            setSubmitting(false);
        }
    };

    const columns: any = [
        {
            title: "#",
            key: "index",
            render: (_: any, __: any, index: number) => index + 1,
        },
        { title: "Mã đơn", dataIndex: "id", key: "id" },
        {
            title: "Sản Phẩm",
            dataIndex: "product",
            key: "product",
            render: (text: string) => {
                const isLong = text.length > 15;
                return (
                    <Tooltip title={isLong ? text : ""}>
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", maxWidth: 250 }}>
                            {isLong ? text.slice(0, 15) + "..." : text}
                        </span>
                    </Tooltip>
                );
            }
        },
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
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            render: (status: any) => {
                let color = status === "Thành công" ? "green" : status === "Đã huỷ" ? "red" : "blue";
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: "Hình thức",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            render: (method: any) => <Tag color="blue">{method}</Tag>
        },
        {
            title: "Tổng đơn",
            dataIndex: "totalPrices",
            key: "totalPrices",
            align: "right",
            render: (price: number) => price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
        },
        {
            title: "",
            key: "action",
            render: (_: any, record: any) => (
                <>
                    {record.hasFeedback ? (
                        <Button type="default" onClick={() => handleOpenModal(record)}>
                            Xem đánh giá
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            onClick={() => handleOpenModal(record)}
                            disabled={record.status !== "Thành công"}
                        >
                            Đánh giá
                        </Button>
                    )}
                </>
            )
        }
    ];

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
                        <h2 className="text-2xl font-extrabold mb-6 text-gray-800 flex items-center gap-2 border-b-2 border-gray-300 pb-2">
                            <ShoppingCartIcon className="w-6 h-6 text-blue-500" />
                            Lịch sử mua hàng
                        </h2>
                        <Table dataSource={orders} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} bordered />

                        <Modal
                            title={selectedOrder?.hasFeedback ? "Xem đánh giá" : "Đánh giá sản phẩm"}
                            open={isModalOpen}
                            onCancel={handleCancel}
                            footer={null}
                        >
                            {selectedOrder && (
                                <div className="space-y-6">
                                    <div className="max-h-[500px] overflow-y-auto pr-2">
                                        {selectedOrder.orderDetails.map((orderDetail: any) => {
                                            const productData = orderDetail.optionResponse?.[0]?.product;
                                            const imageUrl = orderDetail.optionResponse?.[0]?.optionImages?.[0] || "";
                                            const optionId = orderDetail.optionResponse?.[0]?.optionId;
                                            const orderDetailId = orderDetail.orderDetailId;

                                            if (!productData || !optionId) return null;

                                            // Lấy feedback nếu có
                                            const existingFeedback = feedbacks[orderDetailId];

                                            return (
                                                <div key={orderDetailId} className="border-b pb-4 mb-4">
                                                    <div className="grid grid-cols-5 gap-4 items-center">
                                                        <div className="col-span-1 flex justify-center">
                                                            <img src={imageUrl} alt={productData.productName} className="w-20 h-20 rounded-lg object-cover" />
                                                        </div>
                                                        <div className="col-span-4">
                                                            <h3 className="text-lg font-semibold">
                                                                {productData.productName} - {orderDetail.optionResponse?.[0]?.optionValue}
                                                            </h3>
                                                            <p className="text-gray-600">Số lượng: {orderDetail.quantity}</p>
                                                        </div>
                                                    </div>

                                                    {existingFeedback ? (
                                                        <div className="mt-4">
                                                            <p className="font-medium">Đánh giá của bạn:</p>
                                                            <Rate disabled value={existingFeedback.rating} className="text-3xl" />
                                                            <p className="mt-2 italic">
                                                                {existingFeedback.text.charAt(0).toUpperCase() + existingFeedback.text.slice(1)}
                                                            </p>

                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="flex justify-center mt-4">
                                                                <Rate
                                                                    allowHalf
                                                                    value={ratings[`${productData.productId}-${optionId}`] || 0}
                                                                    onChange={(value) => handleRatingChange(productData.productId, optionId, value)}
                                                                    className="text-3xl"
                                                                />
                                                            </div>

                                                            <div className="mt-4">
                                                                <span className="font-medium">Viết đánh giá:</span>
                                                                <TextArea
                                                                    value={comments[`${productData.productId}-${optionId}`] || ""}
                                                                    onChange={(e) => handleCommentChange(productData.productId, optionId, e.target.value)}
                                                                    placeholder="Nhập đánh giá của bạn..."
                                                                    className="mt-2"
                                                                />
                                                            </div>

                                                            <div className="flex justify-end mt-4 gap-3">
                                                                <Button
                                                                    type="primary"
                                                                    loading={submitting}
                                                                    onClick={() => handleSubmit(productData.productId, optionId, orderDetailId)}
                                                                    disabled={!ratings[`${productData.productId}-${optionId}`] || !comments[`${productData.productId}-${optionId}`]?.trim()}
                                                                >
                                                                    Gửi
                                                                </Button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}



                                        <div className="flex justify-end mt-6">
                                            <Button onClick={handleCancel}>Đóng</Button>
                                        </div>
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