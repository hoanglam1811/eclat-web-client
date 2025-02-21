import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import ProductSkeleton from "../Home/ProductSkeleton";
import { ProductCard } from "../../../components/footer/components/Home";
import RouteNames from "../../../constants/routeNames";
import { getProductById } from "../../../services/ApiServices/productService";
import { notification, Tabs } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { getBrandById } from "../../../services/ApiServices/brandService";
import { getSkinTypeById } from "../../../services/ApiServices/skinTypeService";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const ProductDetails = () => {
    const { TabPane } = Tabs;
    const { id } = useParams<{ id: any }>();
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.token.token);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<any>(null);
    const [brandName, setBrandName] = useState<string | null>(null);
    const [skinTypeName, setSkinTypeName] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [currentImage, setCurrentImage] = useState("");
    const [brandImageUrl, setBrandImageUrl] = useState<string | null>(null);
    const [tabIndex, setTabIndex] = useState(1);
    const [selectedOption, setSelectedOption] = useState<any>(null);

    const [sliderRef, instanceRef] = useKeenSlider({
      slides: { perView: 5 },
    });

    const handleTabChange = (key: any) => {
        setTabIndex(Number(key));
    };

    const sampleReviews = [
        { text: "Sản phẩm rất tốt, dùng thích lắm!", rating: 5, userId: "user1", create_at: "2025-02-18" },
        { text: "Dùng khá ổn, sẽ mua lại!", rating: 4, userId: "user2", create_at: "2025-02-17" },
        { text: "Không hợp da mình lắm", rating: 3, userId: "user3", create_at: "2025-02-16" },
        { text: "Chất lượng tuyệt vời, đáng tiền!", rating: 5, userId: "user4", create_at: "2025-02-15" },
        { text: "Sản phẩm không như mong đợi", rating: 2, userId: "user5", create_at: "2025-02-14" },
        { text: "Được tặng quà kèm theo rất thích!", rating: 4, userId: "user6", create_at: "2025-02-13" },
        { text: "Chắc chắn sẽ mua lại lần sau!", rating: 5, userId: "user7", create_at: "2025-02-12" },
        { text: "Dùng tốt nhưng hơi đắt", rating: 4, userId: "user8", create_at: "2025-02-11" },
        { text: "Không phù hợp với nhu cầu của tôi", rating: 3, userId: "user9", create_at: "2025-02-10" },
        { text: "Tuyệt vời, sẽ giới thiệu cho bạn bè!", rating: 5, userId: "user10", create_at: "2025-02-09" },
    ];

    const handleQuantityChange = (change: any) => {
        setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
    };

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (!token) {
                    notification.error({ message: "Bạn chưa đăng nhập!" });
                    navigate("/login");
                    return;
                }
                const productData = await getProductById(id, token);
                console.log(productData)
                setProduct(productData.data);
                setCurrentImage(productData.data.productImages?.[0]?.imageUrl || "");
                // Lấy tên thương hiệu
                if (productData.data.brandId) {
                    const brandData = await getBrandById(productData.data.brandId, token);
                    setBrandName(brandData.data.brandName);
                    setBrandImageUrl(brandData.data.imgUrl);
                }

                if (productData.data.skinTypeId) {
                    const skinTypeData = await getSkinTypeById(productData.data.skinTypeId, token);
                    setSkinTypeName(skinTypeData.result.skinName);
                }
            } catch (err: any) {
                setError(err.message || "Lỗi khi tải sản phẩm.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleOptionSelect = (option: any) => {
        if(option.optionImages && option.optionImages.length > 0)
          setCurrentImage(option.optionImages[0]);
        // console.log("Bạn đã chọn tùy chọn:", option.optionValue);
        setSelectedOption(option);
    };

    const handleAddToCart = () => {
        if (!selectedOption) {
            notification.error({ message: "Vui lòng chọn một tùy chọn sản phẩm!" });
            return;
        }
    
        const existingCart = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
    
        const productExists = existingCart.find((item: any) => item.optionId === selectedOption.optionId);
    
        if (productExists) {
            productExists.quantity += quantity;
        } else {
            existingCart.push({
                id: product.productId,
                optionId: selectedOption.optionId,
                name: product.productName,
                price: selectedOption.origin_price,
                discountPrice: selectedOption.discPrice,
                quantity: quantity,
                imageUrl: selectedOption.optionImages[0],
                optionValue: product.productName + " - " + selectedOption.optionValue,
            });
        }
    
        sessionStorage.setItem("cartItems", JSON.stringify(existingCart));
    
        sessionStorage.setItem("lastAddedProduct", JSON.stringify({
            id: product.productId,
            optionId: selectedOption.optionId
        }));
    
        navigate(RouteNames.CART);
    };
    

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    if (isLoading) return <div className="text-center py-10">Đang tải...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!product) return <div className="text-center py-10">Sản phẩm không tồn tại.</div>;

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
                                    {/* Large Image */}
                                    <img
                                        src={currentImage}
                                        alt={product.name}
                                        className="w-full h-auto rounded-lg shadow-md object-cover"
                                    />
                                    {/* Thumbnails */}
                                    <div className="flex relative ml-[-10px]">
                                      <button
                                        onClick={() => instanceRef.current?.prev()}
                                      >
                                        <LeftOutlined  
                                        className="text-xl text-black"
                                        />
                                      </button>

                                      <div ref={sliderRef} className="keen-slider" >
                                        {product?.productImages.map((img: any, index: number) => (
                                          <div key={index} className={`keen-slider__slide ${currentImage == img.imageUrl && "border-4 border-orange-500 rounded-lg"}`}
                                            style={{ padding: "10px" }}>
                                            <img
                                              className="w-20 h-20 rounded-lg shadow-md cursor-pointer object-cover"
                                              src={img.imageUrl}
                                              onClick={() => setCurrentImage(img.imageUrl)}
                                              alt={`Slide ${index}`}
                                          />
                                          {currentImage === img.imageUrl && (
                                              <div className="absolute top-0 right-0 bg-orange-500 rounded-sm text-white w-6 h-6 flex items-center justify-center shadow-md">
                                                ✔
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                        {product?.options.map((option:any, index: number) => (
                                          <div key={index} className={`keen-slider__slide ${currentImage == option.optionImages[0] && "border-4 border-orange-500 rounded-lg"}`}
                                            style={{padding:"10px"}}>
                                            <img
                                              className="w-20 h-20 rounded-lg shadow-md cursor-pointer object-cover"
                                              src={option.optionImages[0]}
                                              onClick={() => setCurrentImage(option.optionImages[0])}
                                              alt={`Slide ${index}`}
                                            />
                                            {currentImage === option.optionImages[0] && (
                                              <div className="absolute top-0 right-0 bg-orange-500 rounded-sm text-white w-6 h-6 flex items-center justify-center shadow-md">
                                                ✔
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>

                                      <button
                                        onClick={() => instanceRef.current?.next()}
                                      >
                                        <RightOutlined 
                                        className="text-xl text-black"
                                        />
                                      </button>
                                    </div>


                                </div>
                                {/* Product Details */}
                                <div className="flex flex-col bg-gray-50 rounded-md">
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
                                    <div className="flex flex-col mb-4 mx-4">
                                        <div className="bg-gray-100 rounded-md">
                                            <div className="flex flex-col mb-2">
                                                {/* Giá optionPrice thấp nhất và cao nhất (gạch bỏ) */}
                                                <div className="flex justify-between items-center mt-3 mb-1 ml-20 mr-20">
                                                    <span className=" text-lg font-semibold text-gray-500 line-through">
                                                        {Math.min(...product?.options?.map((option: any) => option.optionPrice))?.toLocaleString("vi-VN")} VND
                                                    </span>
                                                    <span className="text-lg font-semibold text-gray-500">
                                                        -
                                                    </span>
                                                    <span className="text-lg font-semibold text-gray-500 line-through">
                                                        {Math.max(...product?.options?.map((option: any) => option.optionPrice))?.toLocaleString("vi-VN")} VND
                                                    </span>
                                                </div>

                                                {/* Giá discPrice thấp nhất và cao nhất */}
                                                <div className="flex justify-between items-center ml-8 mr-8">
                                                    <span className="text-2xl font-bold text-red-600">
                                                        {Math.min(...product?.options?.map((option: any) => option.discPrice))?.toLocaleString("vi-VN")} VND
                                                    </span>
                                                    <span className="text-lg font-bold text-red-600">
                                                        -
                                                    </span>
                                                    <span className="text-2xl font-bold text-red-600">
                                                        {Math.max(...product?.options?.map((option: any) => option.discPrice))?.toLocaleString("vi-VN")} VND
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-md font-bold text-orange-500 mb-2">(Đã bao gồm VAT)</div>
                                        </div>

                                        {/* Option Prices */}
                                        <div className="mt-4">
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                <h4 className="text-lg font-semibold text-gray-700  text-left w-full">{product.attribute}:</h4>
                                                <div className="grid grid-cols-3 gap-2 ml-6">
                                                {product?.options?.map((option: any) => {
                                                    return (
                                                        <div
                                                            key={option.optionId}
                                                            className={`flex relative items-center p-2 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 ${selectedOption == option && "border-4 border-orange-500 rounded-lg"}`}
                                                            onClick={() => handleOptionSelect(option)}
                                                        >
                                                            <div className="w-2/3 h-8">
                                                                <img
                                                                    src={option.optionImages[0]}
                                                                    alt={option.optionValue}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                            </div>

                                                            <div className="w-full pl-2">
                                                                <span className="text-xs font-semibold text-gray-800">{option.optionValue}</span>
                                                            </div>
                                            {selectedOption === option && (
                                              <div className="absolute top-0 right-0 bg-orange-500 rounded-sm text-white w-6 h-6 flex items-center justify-center shadow-md">
                                                ✔
                                              </div>
                                            )}
                                                        </div>
                                                    );
                                                })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quantity Selector */}
                                        <div className=" space-x-4 mb-6 flex items-center mt-4">
                                            <h4 className="text-lg font-semibold text-gray-700 mb-2 text-left flex flex-wrap">Số lượng:</h4>
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

                                            {/* Tổng số lượng sản phẩm có sẵn từ tất cả options */}
                                            <span className="text-lg text-gray-600 ml-4">
                                                {`${product?.options?.reduce((total: any, option: any) => total + option.quantity, 0)} sản phẩm có sẵn`}
                                            </span>
                                        </div>

                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-center space-x-6">
                                        <button
                                            onClick={handleAddToCart}
                                            className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
                                        >
                                            Thêm vào giỏ
                                        </button>
                                        <button
                                            onClick={handleAddToCart}
                                            className="px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
                                        >
                                            Mua ngay
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
                            <div className="flex items-center mt-11 justify-center p-4">
                                <img
                                    src={brandImageUrl || "https://via.placeholder.com/150"}
                                    alt={brandName || "Brand Logo"}
                                    className="max-h-24 object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-xl">
                    {/* Tabs */}
                    <Tabs
                        activeKey={tabIndex.toString()}
                        onChange={handleTabChange}
                        centered
                        className="text-3xl font-bold text-[#578a3f] mb-4"
                        tabBarStyle={{ borderBottom: '2px solid #f1f1f1' }}
                        tabPosition="top"
                    >
                        <TabPane tab="Mô tả sản phẩm" key="1" />
                        <TabPane tab="Đánh giá" key="2" />
                    </Tabs>

                    {/* Nội dung Tab */}
                    {tabIndex === 1 && (
                        <section className="p-6 bg-gray-100 rounded-xl mt-4 shadow-md">
                            <ul className="text-lg font-semibold text-gray-700 space-y-4">
                                <li className="flex justify-between">
                                    <span className="font-bold text-gray-800">Mô tả sản phẩm:</span>
                                    <span className="text-gray-600 w-[600px] text-right overflow-y-auto max-h-60">
                                        {product?.description || "Chưa có mô tả"}
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="font-bold text-gray-800">Xuất xứ:</span>
                                    <span className="text-gray-600">{product?.originCountry || "N/A"}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="font-bold text-gray-800">Loại da:</span>
                                    <span className="text-gray-600">{skinTypeName || "N/A"}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="font-bold text-gray-800">Thương hiệu:</span>
                                    <span className="text-gray-600">{brandName || "N/A"}</span>
                                </li>
                            </ul>
                        </section>
                    )}

                    {tabIndex === 2 && (
                        <section className="p-6 bg-gray-100 rounded-xl mt-4 shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Đánh giá từ người dùng</h2>
                            {sampleReviews.length > 0 ? (
                                <div
                                    className={`grid grid-cols-1 md:grid-cols-2 gap-6 text-left ${sampleReviews.length > 4 ? "max-h-[500px] overflow-y-auto" : ""}`}
                                >
                                    {sampleReviews.map((review, index) => (
                                        <div key={index} className="p-6 bg-white shadow-lg rounded-xl">
                                            <p className="text-lg font-semibold text-gray-800">Người dùng: {review.userId}</p>
                                            <p className="text-gray-600 mt-2">{review.text}</p>
                                            <p className="text-yellow-500 mt-2">⭐ {review.rating}/5</p>
                                            <p className="text-gray-500 text-sm mt-2">Ngày: {review.create_at}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">Chưa có đánh giá nào.</p>
                            )}
                        </section>
                    )}

                </div>

                {/* Suggested Products */}
                <div className="max-w-7xl mx-auto px-6 mt-3 bg-white shadow-lg mb-3">
                    <h1 className="pt-10 pb-10 text-3xl font-bold text-[#578a3f]">Đề xuất cho bạn</h1>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-7">
                        {isLoading ? (
                            <ProductSkeleton />
                        ) : product.length > 0 ? (
                            product.map((item: any) => <ProductCard key={item.id} product={item} />)
                        ) : (
                            <p className="text-gray-600 col-span-4 text-center">Không có sản phẩm phù hợp.</p>
                        )}
                    </div>
                </div>


            </section>
        </>
    );
};

export default ProductDetails;
