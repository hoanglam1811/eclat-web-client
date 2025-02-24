import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getBlogById } from "../../../services/ApiServices/blogService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

export default function SkincareBlogDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const token = useSelector((state: RootState) => state.token.token);

    useEffect(() => {
        if (!token || !id) {
            navigate("/login");
            return;
        }
        const fetchBlogDetails = async () => {
            try {
                const response = await getBlogById(Number(id), token);
                console.log(response)
                if (response.status === "ok") {
                    setBlog(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu blog:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogDetails();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen"><Spin size="large" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6 lg:px-24">
            <div className="flex justify-start">
                <Button icon={<ArrowLeftOutlined />} className="mb-5" onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
            </div>

            {blog && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-6xl mx-auto bg-white rounded-md p-6"
                >
                    <h1 className="text-3xl font-bold text-gray-800">{blog.title}</h1>

                    <div className="text-gray-500 mt-2 text-right">
                        Ngày đăng: {new Date(blog.createAt).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            day: "2-digit",
                            month: "2-digit"
                        })}
                    </div>

                    <img
                        src={blog.imageUrls[0]}
                        alt={blog.title}
                        className="w-full h-80 object-cover rounded-lg mt-4"
                    />

                    <div className="mt-15 text-lg text-gray-700 leading-relaxed text-left" dangerouslySetInnerHTML={{ __html: blog.content }} />
                </motion.div>
            )}

        </div>
    );
}
