import HomepageImage1 from "../../../assets/homepagepic1.png";
import HomepageImage2 from "../../../assets/homepagepic2.png";
import HomepageImage3 from "../../../assets/homepagepic3.png";
import DMSP from "../../../assets/DMSP.png";
import { Carousel } from "antd";
import { useEffect, useState } from "react";
import { ProductCard } from "../../../components/footer/components/Home";
import ProductSkeleton from "./ProductSkeleton";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../../services/ApiServices/productService";
import { getAllBrands } from "../../../services/ApiServices/brandService";
import { getAllSkinTypes } from "../../../services/ApiServices/skinTypeService";

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

                let productsData = products.map((product: any) => ({
                    id: product.productId,
                    name: product.productName,
                    origin_price: Math.min(...product.options.map((option: any) => option.optionPrice)),
                    disc_price: Math.min(...product.options.map((option: any) => option.discPrice)),
                    origin_country: product.originCountry,
                    skinTypeId: product.skinType.skinName,
                    brandId: product.brand.brandName,
                    imageUrl: product.images[0]?.imageUrl,
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

            <section className="p-6 bg-orange-100">
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
                    ) : (
                        products.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))

                    )}
                </menu>
            </section>


            <section className="p-6 bg-orange-50 ">
                <h2 className="text-center text-3xl font-extrabold my-8 text-[#578a3f] ">DANH MỤC SẢN PHẨM</h2>

                <div className="flex flex-col md:flex-row gap-3 items-center mt-10">
                    <div className="w-full md:w-1/4 flex justify-center items-center mb-7">
                        <img
                            src={DMSP}
                            alt="Danh mục sản phẩm"
                            className="w-full max-h-[400px] object-cover rounded-md shadow-lg"
                        />
                    </div>

                    <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 -mt-8 md:-mt-12">
                        {products.slice(0, 4).map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
