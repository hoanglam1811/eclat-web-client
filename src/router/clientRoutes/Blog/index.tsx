import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card, Input } from "antd";
import { getAllBlogs } from "../../../services/ApiServices/blogService";
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

export default function SkincareBlog() {
    const [search, setSearch] = useState("");
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.token.token);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const filteredArticles = articles.filter((article: any) =>
        article.title.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
    const paginatedBlogs = filteredArticles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                // if (!token) {
                //     navigate("/login");
                //     return;
                // }
                const response = await getAllBlogs();
                console.log(response)
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
        fetchBlogs();
    }, []);

    return (
        <div
            className="min-h-screen bg-gradient-to-r from-pink-100 to-blue-100 py-12 px-6 pt-40"
        >
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">✨ Blog Chăm Sóc Da ✨</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                    Bạn sẽ tìm thấy những bí kíp dưỡng da chuyên sâu, giúp làn da của bạn luôn rạng rỡ và khỏe mạnh! 💖
                </p>
                <div className="flex items-center bg-white shadow-md rounded-full px-4 py-3 w-full max-w-lg mx-auto">
                    <Search className="text-gray-500 mr-3" />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        className="flex-1 px-4 border-none focus:ring-0 focus:outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {paginatedBlogs.map((article: any) => (
                    <motion.div
                        key={article.id}
                        whileHover={{ scale: 1.05 }}
                        className="overflow-hidden rounded-xl shadow-lg bg-white transition-transform duration-300"
                    >
                        <img
                            src={article.imageUrls[0]}
                            alt={article.title}
                            className="w-full h-48 object-cover rounded-t-xl"
                        />
                        <div className="p-5">
                            <h2 className="text-xl font-bold text-gray-800">
                                {article.title}
                            </h2>
                            <div className="flex justify-end mr-5 mt-3">
                                <Link to={`/blog-details/${article.id}`}>
                                    <Button className="mt-4 w-2/3 bg-pink-500 hover:bg-pink-600 text-white">
                                        Đọc tiếp
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))
                }
            </div>

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
        </div>
    );
}
