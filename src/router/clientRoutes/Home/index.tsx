import HomepageImage1 from "../../../assets/homepagepic1.png";
import HomepageImage2 from "../../../assets/homepagepic2.png";
import HomepageImage3 from "../../../assets/homepagepic3.png";
import DMSP from "../../../assets/DMSP.png";
import { Carousel } from "antd";
import { useNavigate } from "react-router-dom";
import RouteNames from "../../../constants/routeNames";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useState } from "react";
import { removeToken, removeUser } from "../../../reducers/tokenSlice";
import RoleNames from "../../../constants/roleNames";
import { Card } from "../../../components/footer/components/Home";
import ProductSkeleton from "./ProductSkeleton";

const Home = () => {

    const products = [
        {
            id: "1",
            name: " Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 50,
            description: "Beautiful earrings with a unique palm design.",
            origin_price: 835000,
            disc_price: 120000,
            origin_country: "USA",
            skinTypeId: "All Skin Types",
            brandId: "Brand A",
            average_rating: 4.5,
            status: "Hết hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/thumb_4340a9c074534f69bb76537f11da26c5_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "2",
            name: " Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 30,
            description: "Elegant necklace with a red birthstone.",
            origin_price: 100000,
            disc_price: 90000,
            origin_country: "USA",
            skinTypeId: "Sensitive Skin",
            brandId: "Brand B",
            average_rating: 4.8,
            status: "Còn hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/glam_2.11.1_18a5ca6f9b814d9bb11125d8c6d2f704_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "3",
            name: "Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 20,
            description: "Dainty butterfly necklace in gold.",
            origin_price: 1200000,
            disc_price: 600000,
            origin_country: "Vietnam",
            skinTypeId: "All Skin Types",
            brandId: "Brand C",
            average_rating: 4.9,
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
            status: "Còn hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/1200_x_1200_5b80186af6344e41b036b8dc310db177_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "5",
            name: "Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 20,
            description: "Dainty butterfly necklace in gold.",
            origin_price: 1200000,
            disc_price: 600000,
            origin_country: "Vietnam",
            skinTypeId: "All Skin Types",
            brandId: "Brand C",
            average_rating: 4.9,
            status: "Còn hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/1200_x_1200_5b80186af6344e41b036b8dc310db177_1024x1024.png",
            total_reviews: 200
        },
    ];

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

            {/* Feature Section */}
            <section
                style={{
                    fontFamily: "Montserrat, sans-serif",
                    display: "flex",
                    justifyContent: "space-around",
                    padding: "20px 40px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <div style={{ backgroundColor: "#2980b9", color: "#ffffff", padding: "15px", borderRadius: "5px", textAlign: "center", fontWeight: "bold" }}>
                    <h3 style={{ margin: 0 }}>MIỄN PHÍ vận chuyển</h3>
                    <p style={{ fontSize: "14px", margin: "5px 0" }}>Đơn hàng từ 500.000 VNĐ</p>
                </div>
                <div style={{ backgroundColor: "#2980b9", color: "#ffffff", padding: "15px", borderRadius: "5px", textAlign: "center", fontWeight: "bold" }}>
                    <h3 style={{ margin: 0 }}>Hoàn trả dễ dàng</h3>
                    <p style={{ fontSize: "14px", margin: "5px 0" }}>Đảm bảo hài lòng</p>
                </div>
                <div style={{ backgroundColor: "#2980b9", color: "#ffffff", padding: "15px", borderRadius: "5px", textAlign: "center", fontWeight: "bold" }}>
                    <h3 style={{ margin: 0 }}>Ưu đãi thành viên</h3>
                    <p style={{ fontSize: "14px", margin: "5px 0" }}>Dành riêng cho bạn</p>
                </div>
                <div style={{ backgroundColor: "#2980b9", color: "#ffffff", padding: "15px", borderRadius: "5px", textAlign: "center", fontWeight: "bold" }}>
                    <h3 style={{ margin: 0 }}>Hỗ trợ 24/7</h3>
                    <p style={{ fontSize: "14px", margin: "5px 0" }}>Luôn sẵn sàng</p>
                </div>
            </section>
            <hr className=" mt-20 w-[50%] mx-auto border-t-2 border-[#578a3f]" />
            <section className="p-6">
                <h2 className="text-center text-3xl font-extrabold my-8 text-[#578a3f]">SẢN PHẨM BÁN CHẠY</h2>
                <menu className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mt-10">
                    {isLoading ? (
                        <ProductSkeleton />
                    ) : error ? (
                        <p className="text-center text-2xl font-semibold text-red-600 md:col-span-3 lg:col-span-4">
                            Error loading scholarship programs.
                        </p>
                    ) : products.length === 0 ? (
                        <p className="text-center text-2xl font-semibold text-gray-600 md:col-span-3 lg:col-span-4">
                            No data found matching your search.
                        </p>
                    ) : (
                        products.map((product: any) => (
                            <Card key={product.id} product={product} />
                        ))

                    )}
                </menu>
            </section>

            <hr className=" mt-10 w-[50%] mx-auto border-t-2 border-[#578a3f]" />

            <section className="p-6">
                <h2 className="text-center text-3xl font-extrabold my-8 text-[#578a3f]">DANH MỤC SẢN PHẨM</h2>

                <div className="flex flex-col md:flex-row gap-3 items-center mt-10">
                    <div className="w-full md:w-1/4 flex justify-center items-center">
                        <img
                            src={DMSP}
                            alt="Danh mục sản phẩm"
                            className="w-full max-h-[400px] object-cover rounded-md shadow-lg"
                        />
                    </div>

                    <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 -mt-8 md:-mt-12">
                        {products.slice(0, 4).map((product: any) => (
                            <Card key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
