import HomepageImage1 from "../../../assets/homepagepic1.png";
import HomepageImage2 from "../../../assets/homepagepic2.png";
import HomepageImage3 from "../../../assets/homepagepic3.png";
import DMSP from "../../../assets/DMSP.png";
import { Button, Carousel } from "antd";
import { useEffect, useState } from "react";
import { ProductCard } from "../../../components/footer/components/Home";
import ProductSkeleton from "./ProductSkeleton";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../../services/ApiServices/productService";
import { getAllBrands } from "../../../services/ApiServices/brandService";
import { getAllSkinTypes } from "../../../services/ApiServices/skinTypeService";
import { getAllBlogs } from "../../../services/ApiServices/blogService";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, Rate } from "antd";

const Home = () => {
    const token = useSelector((state: RootState) => state.token.token);
    const navigate = useNavigate();
    const [products, setProducts] = useState<any>([]);
    const [productsFull, setProductsFull] = useState(products);

    useEffect(() => {
        const fetchProducts = async () => {
            // if (!token) {
            //     navigate("/login");
            //     return;
            // }
            try {
                setIsLoading(true);
                const [products] = await Promise.all([
                    getAllProducts(),
                    getAllBrands(),
                    getAllSkinTypes(),
                ]);
                console.log(products);
                const allProducts = products.data
                let productsData = allProducts.map((product: any) => ({
                    id: product.productId,
                    name: product.productName,
                    origin_price: Math.min(...product.options.map((option: any) => option.optionPrice)),
                    disc_price: Math.min(...product.options.map((option: any) => option.discPrice)),
                    origin_country: product.originCountry,
                    skinTypeId: product.skinType.skinName,
                    brandId: product.brand.brandName,
                    imageUrl: product.images[0],
                }));

                setProducts(productsData);
                setProductsFull(productsData);
            } catch (error: any) {
                setError(error.toString());
                console.error("Error fetching skin types", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [token, navigate]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const feedbacks = [
        {
            name: "Chị Kiều Trang",
            image: "https://chothuestudio.com/wp-content/uploads/2025/02/B0A8627-1024x1536.jpg",
            stars: 5,
            comment:
                "Làn da mình thuộc kiểu da khô, rất khó chăm sóc. Nhưng từ khi dùng sản phẩm này, da mình trở nên mềm mại và căng mướt hơn bao giờ hết!",
        },
        {
            name: "Anh Minh Khang",
            image: "https://chothuestudio.com/wp-content/uploads/2024/07/10-3.jpg",
            stars: 4.5,
            comment:
                "Sản phẩm rất tuyệt vời! Mình đã thử nhiều loại trước đây nhưng chỉ khi dùng sản phẩm này mới thấy hiệu quả rõ rệt.",
        },
        {
            name: "Chị Ngọc Bích",
            image: "https://chothuestudio.com/wp-content/uploads/2024/07/7d32b9e8e5f736a96fe618-510x765.jpg",
            stars: 5,
            comment:
                "Không chỉ giúp da mình trắng sáng hơn mà còn giúp kiểm soát dầu rất tốt. Rất đáng tiền!",
        },
        {
            name: "Anh Hữu Tín",
            image: "https://chothuestudio.com/wp-content/uploads/2024/07/TCA_3811-1024x1536.jpg",
            stars: 4,
            comment:
                "Mình không quá quan tâm đến skincare, nhưng sau khi dùng thử, mình nhận thấy sự khác biệt rõ ràng. Sẽ tiếp tục sử dụng!",
        },
        {
            name: "Chị Thanh Hà",
            image: "https://chothuestudio.com/wp-content/uploads/2024/07/fe712441785eab00f24f21-510x765.jpg",
            stars: 5,
            comment:
                "Chưa bao giờ mình cảm thấy da mịn màng và khỏe khoắn như thế này. Cảm ơn sản phẩm tuyệt vời!",
        },
        {
            name: "Chị Hương Giang",
            image: "https://chothuestudio.com/wp-content/uploads/2024/07/61284a1d1602c55c9c1322-510x765.jpg",
            stars: 4.5,
            comment:
                "Da mình từng rất nhạy cảm, nhưng sản phẩm này rất dịu nhẹ và mang lại hiệu quả nhanh chóng. Rất thích!",
        },
        {
            name: "Anh Tuấn Phong",
            image: "https://chothuestudio.com/wp-content/uploads/2024/07/7-3-510x765.jpg",
            stars: 4.5,
            comment:
                "Thiết kế bao bì đẹp, sản phẩm chất lượng. Mình sẽ tiếp tục ủng hộ thương hiệu này!",
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
    };

    return (
        <>
            {/* Carousel Section */}
            <section style={{ backgroundColor: "#fdf5e6" }}>
                <Carousel autoplaySpeed={3000} autoplay >
                    <div>
                        <img
                            src={HomepageImage1}
                            alt="Slide 1"
                            style={{
                                width: "100%",
                                height: "650px",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                    <div>
                        <img
                            src={HomepageImage2}
                            alt="Slide 2"
                            style={{
                                width: "100%",
                                height: "650px",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                    <div>
                        <img
                            src={HomepageImage3}
                            alt="Slide 1"
                            style={{
                                width: "100%",
                                height: "650px",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                </Carousel>
            </section>

            <section
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    padding: "20px 40px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <div className="bg-orange-400" style={{ color: "#ffffff", padding: "15px", borderRadius: "5px", textAlign: "center", fontWeight: "bold" }}>
                    <h3 style={{ margin: 0 }}>MIỄN PHÍ vận chuyển</h3>
                    <p style={{ fontSize: "14px", margin: "5px 0" }}>Đơn hàng từ 500.000 VNĐ</p>
                </div>
                <div className="bg-orange-400" style={{ color: "#ffffff", padding: "15px", borderRadius: "5px", textAlign: "center", fontWeight: "bold" }}>
                    <h3 style={{ margin: 0 }}>Hoàn trả dễ dàng</h3>
                    <p style={{ fontSize: "14px", margin: "5px 0" }}>Đảm bảo hài lòng</p>
                </div>
                <div className="bg-orange-400" style={{ color: "#ffffff", padding: "15px", borderRadius: "5px", textAlign: "center", fontWeight: "bold" }}>
                    <h3 style={{ margin: 0 }}>Ưu đãi thành viên</h3>
                    <p style={{ fontSize: "14px", margin: "5px 0" }}>Dành riêng cho bạn</p>
                </div>
                <div className="bg-orange-400" style={{ color: "#ffffff", padding: "15px", borderRadius: "5px", textAlign: "center", fontWeight: "bold" }}>
                    <h3 style={{ margin: 0 }}>Hỗ trợ 24/7</h3>
                    <p style={{ fontSize: "14px", margin: "5px 0" }}>Luôn sẵn sàng</p>
                </div>
            </section>

            <section className="p-6 bg-orange-200">
                <h2 className="text-center text-3xl font-bold my-8 text-[#578a3f]">SẢN PHẨM BÁN CHẠY</h2>
                <menu className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mt-10">
                    {isLoading ? (
                        <ProductSkeleton />
                    ) : error ? (
                        <p className="text-center text-2xl font-semibold text-red-600 md:col-span-3 lg:col-span-4">
                            Lỗi khi tải sản phẩm.
                        </p>
                    ) : products.length === 0 ? (
                        <p className="text-center text-2xl font-semibold text-gray-600 md:col-span-3 lg:col-span-4">
                            Không có sản phẩm nào phù hợp.
                        </p>
                    ) : products.slice(0, 5).map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </menu>
            </section>

            <section className="p-6 bg-orange-100">
                <h2 className="text-center text-3xl font-bold my-8 text-[#578a3f]">GIẢM GIÁ CỰC SÂU</h2>
                <menu className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mt-10">
                    {isLoading ? (
                        <ProductSkeleton />
                    ) : error ? (
                        <p className="text-center text-2xl font-semibold text-red-600 md:col-span-3 lg:col-span-4">
                            Lỗi khi tải sản phẩm.
                        </p>
                    ) : (
                        products
                            .filter((product: any) =>
                                Math.round(((product.origin_price - product.disc_price) / product.origin_price) * 100) >= 40
                            )
                            .map((product: any) => <ProductCard key={product.id} product={product} />)
                    )}

                </menu>
            </section>

            <section className="p-10 bg-orange-50">
                <div className="flex flex-col md:flex-row gap-6 items-center mt-10 max-w-6xl mx-auto">
                    {/* Hình ảnh */}
                    <div className="w-full md:w-2/5 flex justify-center items-center relative">
                        <img
                            src={DMSP}
                            alt="Danh mục sản phẩm"
                            className="w-full max-h-[500px] object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-10 rounded-xl"></div>
                    </div>

                    {/* Nội dung */}
                    <div className="w-full md:w-3/5 p-8">
                        <h3 className="text-2xl font-bold text-[#578a3f] mb-5 tracking-wide">
                            Éclat - Hành Trình Chạm Tới Vẻ Đẹp Tự Nhiên
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg text-left">
                            Éclat không chỉ là một trang web về chăm sóc da, mà còn là "người bạn đồng hành" giúp bạn khám phá chính mình.
                            Mỗi làn da đều có một câu chuyện riêng, và Éclat sẽ giúp bạn lắng nghe làn da của mình để tìm ra "giải pháp hoàn hảo nhất".
                            <br /><br />
                            Với những công nghệ tiên tiến và nội dung chuyên sâu, Éclat mang đến "trải nghiệm cá nhân hóa", giúp bạn hiểu rõ về "loại da, nhu cầu dưỡng da"
                            và tìm kiếm các sản phẩm phù hợp nhất. Hãy để Éclat dẫn lối trên hành trình "chinh phục vẻ đẹp tự nhiên", để mỗi ngày bạn đều tự tin với làn da khỏe mạnh, rạng rỡ.
                        </p>

                        <div className="mt-10">
                            <button onClick={() => navigate("/products")} className="px-6 py-3 text-lg font-semibold text-white bg-[#578a3f] rounded-lg shadow-md transition duration-300 hover:bg-[#466e32] hover:shadow-lg">
                                Bắt đầu hành trình của bạn
                            </button>
                        </div>
                    </div>
                </div>
            </section>


            <section className="p-6 bg-orange-100 pt-16 pb-13">
                <h2 className="text-center text-3xl font-bold mb-8 text-[#578a3f]">
                    KHÁCH HÀNG CỦA CHÚNG TÔI NÓI GÌ
                </h2>
                <div className="max-w-5xl mx-auto">
                    <Slider {...settings}>
                        {feedbacks.map((feedback, index) => (
                            <Card
                                key={index}
                                className="rounded-lg text-center p-6 bg-white"
                            >
                                <img
                                    src={feedback.image}
                                    alt={feedback.name}
                                    className="w-30 h-30 rounded-full mx-auto mb-4"
                                />
                                <h3 className="text-lg font-bold">{feedback.name}</h3>
                                <Rate disabled defaultValue={feedback.stars} allowHalf className="my-2" />
                                <p className="text-gray-600 italic">"{feedback.comment}"</p>
                            </Card>
                        ))}
                    </Slider>
                </div>
            </section>

            <section className="p-6 bg-orange-200">
                <h2 className="text-center text-3xl font-extrabold my-8 text-[#578a3f] ">GÓC LÀM ĐẸP</h2>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {articles.slice(0, 4).map((article: any) => (
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
            </section>
        </>
    );
};

export default Home;
