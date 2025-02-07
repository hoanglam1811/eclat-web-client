import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Select, Slider } from "antd";
import { Carousel } from 'antd';
import BrandSkeleton from "./BrandSkeleton";
import { BrandCard } from "../../../components/footer/components/Brand";

const Brands = () => {
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const handlePriceChange = (value: any) => {
        setPriceRange(value);
    };
    const [selectedBrands, setSelectedBrands] = useState([]);
    const brands = [
        {
            id: "1",
            label: 'Cocoon',
            value: 'cocoon',
            logo: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/202667140005381.6239fc9e2048c.png'
        },
        {
            id: "2",
            label: 'L\'Oreal',
            value: 'loreal',
            logo: 'https://cdn.worldvectorlogo.com/logos/l-oreal-3.svg'
        },
        {
            id: "3",
            label: 'CeraVe',
            value: 'cerave',
            logo: 'https://i.pinimg.com/originals/01/df/ad/01dfadb784cdcd91ebb730d30592b481.png'
        },
        {
            id: "4",
            label: 'Cetaphil',
            value: 'cetaphil',
            logo: 'https://www.cetaphil.com.vn/on/demandware.static/-/Sites/default/dwf51c375b/Cetaphil_Logo_285.png'
        },
        {
            id: "5",
            label: 'The Ordinary',
            value: 'ordinary',
            logo: 'https://logovectordl.com/wp-content/uploads/2020/12/the-ordinary-logo-vector.png'
        },
        {
            id: "6",
            label: 'Hada Labo',
            value: 'hada_labo',
            logo: 'https://hadalabo.com.vn/wp-content/uploads/2021/03/HDLB_logo_m.png'
        },
        {
            id: "7",
            label: 'Kiehl\'s',
            value: 'kiehls',
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/kiehls-logo-png-transparent.png'
        }
    ];

    const handleBrandChange = (selectedValues: any) => {
        setSelectedBrands(selectedValues);
    };

    const [selectedSkinTypes, setSelectedSkinTypes] = useState([]);
    const skinTypes = [
        { label: 'Da Dầu', value: 'oily' },
        { label: 'Da Khô', value: 'dry' },
        { label: 'Da Nhạy Cảm', value: 'sensitive' },
        { label: 'Da Hỗn Hợp', value: 'combination' },
        { label: 'Da Lão Hóa', value: 'aging' },
        { label: 'Da Mụn', value: 'acne' },
    ];
    const handleSkinTypeChange = (selectedValues: any) => {
        setSelectedSkinTypes(selectedValues);
    };

    const [selectedOriginCountry, setSelectedOriginCountry] = useState([]);
    const countries = [
        { label: "Việt Nam", value: "vietnam" },
        { label: "Hàn Quốc", value: "south_korea" },
        { label: "Mỹ", value: "usa" },
        { label: "Nhật Bản", value: "japan" },
        { label: "Pháp", value: "france" },
        { label: "Anh", value: "uk" },
        { label: "Úc", value: "australia" },
        { label: "Hà Lan", value: "netherlands" },
        { label: "Đức", value: "germany" },
        { label: "Thái Lan", value: "thailand" }
    ];
    const handleOriginCountryChange = (selectedValues: any) => {
        setSelectedOriginCountry(selectedValues);
    };

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
        {
            id: "6",
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
            id: "7",
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
            id: "8",
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
            id: "9",
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
            id: "10",
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

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalPages = Math.ceil(brands?.length / ITEMS_PER_PAGE);
    const paginatedBrands = brands?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <>
            <section className="bg-gray-100 p-6">
                <div className="bg-gray-100 top-0 left-0 items-start ml-8 z-10 ">
                    <div>
                        <Breadcrumb className="">
                            <BreadcrumbList className="text-[#333]">
                                <BreadcrumbItem>
                                    <Link to="/" className="md:text-xl text-lg">
                                        Trang chủ
                                    </Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <p className="text-[#333] font-medium md:text-xl text-lg">
                                        Danh sách thương hiệu
                                    </p>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            </section>

            <div className="max-w-8xl mx-auto p-6 bg-gray-100">
                <div className="flex gap-2">

                    <section className="w-full p-6 bg-white shadow-md">
                        <menu className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                            {isLoading ? (
                                <BrandSkeleton />
                            ) : error ? (
                                <p className="text-center text-2xl font-semibold text-red-600 md:col-span-3 lg:col-span-4">
                                    Error loading brands.
                                </p>
                            ) : brands.length === 0 ? (
                                <p className="text-center text-2xl font-semibold text-gray-600 md:col-span-3 lg:col-span-4">
                                    No data found matching your search.
                                </p>
                            ) : (
                                paginatedBrands.map((brands: any) => (
                                    <BrandCard key={brands.id} brand={brands} />
                                ))
                            )}

                        </menu>
                        <div style={{ marginTop: "20px", marginBottom: '10px', textAlign: 'right' }}>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    style={{
                                        margin: "0 5px",
                                        padding: "5px 10px",
                                        backgroundColor: currentPage === index + 1 ? "#419f97" : "#f1f1f1",
                                        color: currentPage === index + 1 ? "white" : "black",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>

    );
};

export default Brands;

