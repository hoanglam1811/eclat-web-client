import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import ProductSkeleton from "../Home/ProductSkeleton";
import { Card } from "../../../components/footer/components/Home";
import RouteNames from "../../../constants/routeNames";
import { StarFilled, StarOutlined, UserOutlined, TagsOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';


const ProductDetails = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (change: any) => {
        setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
    };

    const products = [
        {
            id: "1",
            name: "Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 50,
            description: "Beautiful earrings with a unique palm design.",
            origin_price: 835000,
            disc_price: 120000,
            origin_country: "USA",
            skinTypeId: "All Skin Types",
            brandId: "https://logovectordl.com/wp-content/uploads/2020/12/the-ordinary-logo-vector.png",
            average_rating: 5,
            status: "Hết hàng",
            usage_instruct: "Sử dụng khi đi tiệc, có thể kết hợp với các trang sức khác để tạo sự nổi bật. Lau sạch sau khi sử dụng.",
            imageUrl: "https://product.hstatic.net/1000006063/product/thumb_4340a9c074534f69bb76537f11da26c5_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "2",
            name: "Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 30,
            description: "Elegant necklace with a red birthstone.",
            origin_price: 100000,
            disc_price: 90000,
            origin_country: "USA",
            skinTypeId: "Sensitive Skin",
            brandId: "Brand B",
            average_rating: 4,
            usage_instruct: "Dùng khi mặc trang phục tối màu để tạo điểm nhấn. Giữ nơi khô ráo và thoáng mát.",
            status: "Còn hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/glam_2.11.1_18a5ca6f9b814d9bb11125d8c6d2f704_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "3",
            name: "Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 20,
            description: "Dainty butterfly necklace in gold.Phù hợp với các bộ trang phục ngày hè. Tránh tiếp xúc với hóa chất và nước để duy trì độ bóng lâu dài.",
            origin_price: 1200000,
            disc_price: 600000,
            origin_country: "Vietnam",
            skinTypeId: "All Skin Types",
            brandId: "Brand C",
            average_rating: 4.9,
            usage_instruct: "Phù hợp với các bộ trang phục ngày hè. Tránh tiếp xúc với hóa chất và nước để duy trì độ bóng lâu dài.",
            status: "Còn hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/1_b5d9938d4e0d4b71b98a3ac1e059d73e_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "4",
            name: "Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 20,
            description: "Dainty butterfly necklace in gold.",
            origin_price: 1200000,
            disc_price: 600000,
            origin_country: "Vietnam",
            skinTypeId: "All Skin Types",
            brandId: "Brand C",
            average_rating: 4.9,
            usage_instruct: "Thích hợp cho các buổi tiệc và sự kiện quan trọng. Nên đeo sau khi hoàn tất trang điểm để tránh tiếp xúc trực tiếp với các sản phẩm mỹ phẩm.",
            status: "Còn hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/1200_x_1200_5b80186af6344e41b036b8dc310db177_1024x1024.png",
            total_reviews: 200
        }
    ];


    const { id } = useParams<{ id: string }>();
    const product = products.find((product) => product.id === id);

    const handleAddToCart = (product: any, quantity: any) => {
        const existingCart = JSON.parse(sessionStorage.getItem("cartItems") || "[]");

        const productExists = existingCart.find((item: any) => item.id == product.id);
        console.log(productExists)
        if (productExists) {
            productExists.quantity += quantity;
        } else {
            existingCart.push({
                id: product.id,
                name: product.name,
                price: product.origin_price,
                discountPrice: product.disc_price,
                quantity: 1,
                imageUrl: product.imageUrl,
                color: product.color || "N/A",
            });
        }

        // Lưu danh sách sản phẩm cập nhật vào sessionStorage
        sessionStorage.setItem("cartItems", JSON.stringify(existingCart));
        navigate(RouteNames.CART);
    };

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <section className="bg-gray-100 p-6">
                <div className="bg-gray-100 top-0 left-0 items-start ml-8 z-10 ">
                    <div>
                        <Breadcrumb className="">
                            <BreadcrumbList className="text-[#000]">
                                <BreadcrumbItem>
                                    <Link to="/" className="md:text-xl text-lg">Trang chủ</Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <p className="text-[#000] font-medium md:text-xl text-lg">Thông tin sản phẩm {product?.name}</p>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>

                {/* Product Info */}
                <div className="mt-10 max-w-7xl mx-auto bg-gray-50">
                    {/* Main Grid Container */}
                    <div className="grid grid-cols-5 grid-rows-2 gap-3">
                        {/* Product Details Section (80%) */}
                        <div className="col-span-4 row-span-2 p-8 bg-white shadow-md">
                            {/* Image Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <img
                                        src={product?.imageUrl}
                                        alt={product?.name}
                                        className="w-full h-auto rounded-lg shadow-md object-cover"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex flex-col">
                                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{product?.name}</h1>

                                    {/* Ratings & Reviews */}
                                    <div className="flex ml-20 items-center space-x-3 mb-6">
                                        <span className="text-2xl font-bold text-yellow-600">
                                            {product?.average_rating ? `${product.average_rating.toFixed(1)}` : "Chưa có đánh giá"}
                                        </span>
                                        <div className="flex space-x-1">
                                            {Array.from({ length: 5 }, (_, index) => {
                                                const rating = product?.average_rating ?? 0;
                                                const isFullStar = index < Math.floor(rating);
                                                const isHalfStar = index === Math.floor(rating) && rating % 1 >= 0.5;

                                                return (
                                                    <span
                                                        key={index}
                                                        className={`text-lg ${isFullStar
                                                            ? "text-yellow-500"
                                                            : isHalfStar
                                                                ? "text-yellow-300"
                                                                : "text-gray-400"
                                                            }`}
                                                    >
                                                        {!isFullStar ? "☆" : "⭐"}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                        <span className="text-xl text-gray-600">|</span>
                                        {product?.total_reviews ? (
                                            <span className="text-lg text-gray-600 font-medium">{product.total_reviews} đánh giá</span>
                                        ) : (
                                            <span className="text-lg text-gray-400">Chưa có đánh giá</span>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="text-xl font-semibold text-gray-500 line-through mb-2">
                                        {(product?.origin_price)?.toLocaleString("vi-VN")} VND
                                    </div>
                                    <div className="text-3xl font-bold text-red-600">
                                        {(product?.disc_price)?.toLocaleString("vi-VN")} VND
                                    </div>
                                    <div className="text-md font-bold text-black-1 mb-6">(Đã bao gồm VAT)</div>

                                    {/* Quantity Selector */}
                                    <div className="flex justify-center items-center space-x-4 mb-6">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            className="px-4 py-2 bg-gray-200 text-lg rounded hover:bg-gray-300"
                                        >
                                            -
                                        </button>
                                        <span className="text-xl">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            className="px-4 py-2 bg-gray-200 text-lg rounded hover:bg-gray-300"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-center space-x-6">
                                        <button
                                            onClick={() => handleAddToCart(product, quantity)}
                                            className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
                                        >
                                            Thêm vào giỏ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Section (20%) */}
                        <div className="col-span-1 row-span-1 bg-white p-6 shadow-md">
                            {/* Grid Layout */}
                            <div className=" gap-4 ">
                                {/* Phần Miễn phí vận chuyển */}
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 mb-4">Miễn phí vận chuyển</h2>
                                    <ul className="space-y-4">
                                        <li className="flex items-center text-left">
                                            <img
                                                src="https://hasaki.vn/images/graphics/img_quality_3.png"
                                                alt="Authentic"
                                                className="w-10 h-10 mr-3"
                                            />
                                            <span>Đền bù 100% nếu phát hiện hàng giả</span>
                                        </li>
                                        <li className="flex items-center text-left">
                                            <img
                                                src="https://hasaki.vn/images/graphics/img_quality_2.png"
                                                alt="FreeShip"
                                                className="w-10 h-10 mr-3"
                                            />
                                            <span>Giao Hàng Miễn Phí</span>
                                        </li>
                                        <li className="flex items-center text-left">
                                            <img
                                                src="https://media.hcdn.vn/hsk/icons/img_quality_44.png"
                                                alt="Return"
                                                className="w-10 h-10 mr-3"
                                            />
                                            <span>Đổi trả trong 30 ngày từ ngày mua</span>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                        <div className="col-span-1 row-span-1 bg-white p-6 shadow-md">
                            <div className="flex items-center justify-center p-4">
                                <img
                                    src={product?.brandId || "https://via.placeholder.com/150"} // Placeholder nếu không có hình ảnh thương hiệu
                                    alt="Brand Logo"
                                    className="max-h-24 object-contain"
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Suggested Products */}
                <div className="max-w-7xl mx-auto px-6 mt-3 bg-white shadow-lg mb-3">
                    <h1 className="pt-10 pb-10 text-3xl font-bold text-[#578a3f]">Đề xuất cho bạn</h1>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-7">
                        {isLoading ? (
                            <ProductSkeleton />
                        ) : products.length > 0 ? (
                            products.map((item) => <Card key={item.id} product={item} />)
                        ) : (
                            <p className="text-gray-600 col-span-4 text-center">Không có sản phẩm phù hợp.</p>
                        )}
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg">
                    <h1 className="mt-2 text-3xl font-bold text-[#578a3f]">Chi tiết sản phẩm</h1>
                    <section className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                        <ul className="text-lg font-semibold text-gray-700 space-y-4">
                            {/* Mô tả sản phẩm */}
                            <li className="flex justify-between">
                                <span className="font-bold text-gray-800">Mô tả sản phẩm:</span>
                                <span className="text-gray-600">{product?.description ?
                                    <div className="max-h-60 overflow-y-auto w-[600px] text-right">{product.description}</div> :
                                    "Chưa có mô tả"
                                }</span>
                            </li>

                            {/* Xuất xứ */}
                            <li className="flex justify-between">
                                <span className="font-bold text-gray-800">Xuất xứ:</span>
                                <span className="text-gray-600">{product?.origin_country || "N/A"}</span>
                            </li>

                            {/* Loại da */}
                            <li className="flex justify-between">
                                <span className="font-bold text-gray-800">Loại da:</span>
                                <span className="text-gray-600">{product?.skinTypeId || "N/A"}</span>
                            </li>

                            {/* Thương hiệu */}
                            <li className="flex justify-between">
                                <span className="font-bold text-gray-800">Thương hiệu:</span>
                                <span className="text-gray-600">{product?.brandId || "N/A"}</span>
                            </li>

                            <li className="flex justify-between">
                                <span className="font-bold text-gray-800">Dung tích:</span>
                                <span className="text-gray-600">{product?.brandId || "N/A"}</span>
                            </li>

                            {/* Hướng dẫn sử dụng */}
                            <li className="flex justify-between">
                                <span className="font-bold text-gray-800">Hướng dẫn sử dụng:</span>
                                <span className="text-gray-600">{product?.usage_instruct ?
                                    <div className="max-h-60 overflow-y-auto  w-[600px] text-right">{product.usage_instruct}</div> :
                                    "Chưa có hướng dẫn sử dụng"
                                }</span>
                            </li>
                        </ul>
                    </section>
                </div>
            </section>
        </>
    );
};

export default ProductDetails;
