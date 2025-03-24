import { useEffect, useState } from "react";
import { Table, Tooltip, Tag, Button, Modal, Rate, Input } from "antd";
import { getAllFeedback, getFeedbackByProductId } from "../../../services/ApiServices/feedbackService";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const { TextArea } = Input;

const FeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: any) => state.token.token);
    const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const data = await getAllFeedback(token);
            console.log(data.result)
            setFeedbacks(data.result);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedFeedback(null);
    };

    const columns = [
        { title: "Mã đơn", dataIndex: "orderDetailId", key: "orderId" },
        { title: "Sản phẩm", dataIndex: "productName", key: "productName" },
        {
            title: "Ngày mua",
            dataIndex: "createAt",
            key: "purchaseDate",
            render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
            render: (rating: number) => <Rate disabled value={rating} />,
        },
        {
            title: "Bình luận",
            dataIndex: "text",
            key: "text",
            render: (text: any) => (
                <Tooltip title={text}>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", maxWidth: 300 }}>
                        {text?.length > 50 ? text.slice(0, 50) + "..." : text}
                    </span>
                </Tooltip>
            ),
        },

    ];

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Quản lý đánh giá sản phẩm</h2>
            <Table columns={columns} dataSource={feedbacks || []} loading={loading} rowKey="orderId" />

            <Modal
                title="Chi tiết đánh giá"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                {selectedFeedback && (
                    <div>
                        <h3 className="text-lg font-semibold">{selectedFeedback.productName}</h3>
                        <Rate disabled value={selectedFeedback.rating} className="text-3xl" />
                        <p className="mt-2 italic">{selectedFeedback.comment}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default FeedbackManagement;
