import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card, Input } from "antd";

const articles = [
    {
        id: 1,
        title: "10 Bước Chăm Sóc Da Hoàn Hảo",
        description: "Khám phá các bước dưỡng da giúp làn da bạn rạng rỡ hơn mỗi ngày!",
        image: "https://www.guardian.com.vn/media/amasty/blog/cache/T/h/616/342/Thi_t_k_ch_a_c_t_n_18__1.png",
    },
    {
        id: 2,
        title: "Những Sai Lầm Khi Chăm Sóc Da Mặt",
        description: "Tránh ngay những lỗi này để có làn da khỏe đẹp tự nhiên!",
        image: "https://www.guardian.com.vn/media/amasty/blog/cache/6/2/616/342/625x345_2x_1_.png",
    },
    {
        id: 3,
        title: "Sản Phẩm Phù Hợp Với Từng Loại Da",
        description: "Chọn đúng sản phẩm giúp bạn dưỡng da hiệu quả hơn bao giờ hết!",
        image: "https://www.guardian.com.vn/media/amasty/blog/cache/G/D/616/342/GDA_Beauty_Blog-01_3.jpg",
    },
    {
        id: 4,
        title: "Bộ đôi MOISTURE: Bí quyết cho tóc mềm mượt từ bơ hạt mỡ",
        description: "Không chỉ dưỡng ẩm cho da, Bơ Hạt Mỡ còn ứng dụng trong...",
        image: "https://www.guardian.com.vn/media/.renditions/wysiwyg/sp/thuong-hieu-monday-2.png",
    }
];

export default function SkincareBlog() {
    const [search, setSearch] = useState("");
    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div 
            className="min-h-screen bg-gradient-to-r from-pink-100 to-blue-100 py-12 px-6" 
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
                    />
                </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                        <motion.div
                            key={article.id}
                            whileHover={{ scale: 1.05 }}
                            className="overflow-hidden rounded-xl shadow-lg bg-white transition-transform duration-300"
                        >
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-48 object-cover rounded-t-xl"
                            />
                            <div className="p-5">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {article.title}
                                </h2>
                                <p className="text-gray-600 text-sm mt-2">
                                    {article.description}
                                </p>
                                <div className="flex justify-end mr-5 mt-3">
                                    <Button className="mt-4 w-1/3 bg-pink-500 hover:bg-pink-600 text-white">
                                        Đọc tiếp
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center col-span-3">
                        Không tìm thấy bài viết phù hợp.
                    </p>
                )}
            </div>
        </div>
    );
}
