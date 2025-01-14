import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { useState } from "react";
import ProductSkeleton from "./ProductSkeleton";
import { Card } from "../../../components/footer/components/Home";


const Products = () => {

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
        }
    ];

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <>
            <section>
                <div className="mt-10 mb-10 top-0 left-0 items-start ml-8 z-10">
                    <div>
                        <Breadcrumb className="">
                            <BreadcrumbList className="text-[#333]">
                                <BreadcrumbItem>
                                    <Link to="/" className="md:text-xl text-lg text-blue-600 hover:text-blue-800">
                                        Trang chủ
                                    </Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <p className="text-[#333] font-medium md:text-xl text-lg">
                                        Danh sách sản phẩm
                                    </p>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            </section>

            <div className="max-w-8xl mx-auto p-6 bg-white shadow-lg  mb-12">
                {/* Breadcrumb */}
                {/* Main Content */}
                <div className="flex gap-2">
                    {/* Filter Section - 20% */}
                    <div className="w-full md:w-1/5 p-6 bg-white  shadow-md">
                        <h3 className="text-2xl font-semibold mb-6">Lọc sản phẩm</h3>
                        <div>
                            <h4 className="font-medium text-lg">Thương hiệu</h4>
                            {/* Thêm các checkbox hoặc dropdown cho từng thương hiệu */}
                        </div>
                        <div className="mt-4">
                            <h4 className="font-medium text-lg">Loại da</h4>
                            {/* Thêm các checkbox hoặc dropdown cho từng loại da */}
                        </div>
                        <div className="mt-4">
                            <h4 className="font-medium text-lg">Xuất xứ</h4>
                            {/* Thêm các checkbox hoặc dropdown cho xuất xứ */}
                        </div>
                    </div>

                    {/* Products Section - 80% */}
                    <section className="w-full md:w-4/5 p-6 bg-white shadow-md">
                        <menu className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                            {isLoading ? (
                                <ProductSkeleton />
                            ) : error ? (
                                <p className="text-center text-2xl font-semibold text-red-600 md:col-span-3 lg:col-span-4">
                                    Error loading products.
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
                </div>
            </div>
        </>

    );
};

export default Products;

