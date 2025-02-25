import { useEffect, useState } from "react";
import { Search, Edit, Plus, Trash2 } from "lucide-react";
import { Button, Input, Modal, Form, Upload, message, notification, Spin, Card, Popconfirm, Typography } from "antd";
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from "../../../services/ApiServices/blogService";
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const ITEMS_PER_PAGE = 8;
export default function SkincareBlogManagement() {
    const [search, setSearch] = useState("");
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [editingBlog, setEditingBlog] = useState<any>([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.token.token);
    const user = useSelector((state: RootState) => state.token.user);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalPages = Math.ceil(articles?.length / ITEMS_PER_PAGE);
    const paginatedBlogs = articles
        ?.filter((a: any) => a.title.toLowerCase().includes(search.toLowerCase()))
        .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const fetchBlogs = async () => {
        try {
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await getAllBlogs(token);
            if (response.status === "ok") {
                setArticles(response.data);
            } else {
                setError("Không thể tải dữ liệu blog.");
            }
        } catch (err: any) {
            setError("Lỗi khi gọi API: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleCreateOrUpdate = async (values: any) => {
        if (!token || !user) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true)
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("content", values.content);
            formData.append("userId", user?.userId)
            if (values.images && values.images.fileList.length > 0) {
                values.images.fileList.forEach((img: any) => {
                    formData.append("images", img.originFileObj);
                });
            }
            console.log(formData)
            console.log(values)

            if (editingBlog) {
                notification.success({ message: "Cập nhật bài viết thành công, vui lòng chờ giây lát" });
                await updateBlog(editingBlog.id, formData, token);
            } else {
                notification.success({ message: "Tạo bài viết thành công, vui lòng chờ giây lát" });
                await createBlog(formData, token);
            }
            setModalVisible(false);
            form.resetFields();
            await fetchBlogs();
        } catch (err) {
            message.error("Có lỗi xảy ra");
        }
        finally{
          setLoading(false);
        }
    };

    const handleEdit = (blog: any) => {
        setEditingBlog(blog);
        form.setFieldsValue({ title: blog.title, content: blog.content });
        setModalVisible(true);
    };

    const handleDelete = async (id: any) => {
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            await deleteBlog(id, token);
            notification.success({ message: "Xóa bài viết thành công" });
            await fetchBlogs();
        } catch (err) {
            notification.error({ message: "Xóa thất bại" });
        }
    };

    return (
        <div className="p-6 bg-gray-100">
            <div className="flex justify-between items-center mb-6">
                <Input
                    className="w-2/3"
                    placeholder="🔍 Tìm kiếm bài viết..."
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingBlog(null);
                        form.resetFields();
                        setModalVisible(true);
                    }}
                >
                    Tạo bài viết
                </Button>

            </div>

            {loading ? (
                <div className="flex justify-center"><Spin size="large" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {paginatedBlogs.map((article: any) => (
                        <Card
                            key={article.id}
                            cover={<img src={article.imageUrls[0]} alt={article.title} className="h-48 object-cover" />}
                            className="shadow-lg rounded-lg"
                            actions={[
                                <EditOutlined key="edit" onClick={() => handleEdit(article)} />,
                                <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(article.id)} okText="Có" cancelText="Không">
                                    <DeleteOutlined key="delete" style={{ color: "red" }} />
                                </Popconfirm>,
                            ]}
                        >
                            <Typography.Title level={4}>{article.title}</Typography.Title>
                            <Typography.Paragraph ellipsis={{ rows: 1 }}>
                                <div dangerouslySetInnerHTML={{ __html: article.content.slice(0, 100) + "..." }} />
                            </Typography.Paragraph>
                        </Card>
                    ))}
                </div>
            )}

            <div style={{ marginTop: "20px", marginBottom: "10px", display: "flex", justifyContent: "end", gap: "8px" }}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                            padding: "8px 12px",
                            backgroundColor: currentPage === index + 1 ? "#419f97" : "#f1f1f1",
                            color: currentPage === index + 1 ? "white" : "black",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: currentPage === index + 1 ? "bold" : "normal",
                            transition: "background-color 0.3s",
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            <Modal
                title={editingBlog ? "📝 Chỉnh sửa bài viết" : "🆕 Tạo bài viết mới"}
                open={modalVisible}
                onCancel={() => !loading && setModalVisible(false)}
                onOk={() => !loading && form.submit()}
                okText={loading ? "Đang lưu..." : "OK"}
                cancelText={"Huỷ"}
                okButtonProps={{ disabled: loading }} 
                cancelButtonProps={{ disabled: loading }}
            >
                <Form className="mt-6" form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
                    <Form.Item name="title" label="📝 Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
                        <Input placeholder="Nhập tiêu đề bài viết..." />
                    </Form.Item>
                    <Form.Item name="content" label="📜 Nội dung" rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}>
                        <ReactQuill theme="snow" />
                    </Form.Item>
                    <Form.Item name="images" label="🖼 Hình ảnh">
                        <Upload
                            beforeUpload={() => false}
                            listType="picture-card"
                            multiple
                        >
                            <Button>📤 Upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
