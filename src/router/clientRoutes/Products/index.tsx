import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { useState } from "react";
import ProductSkeleton from "./ProductSkeleton";
import { Card } from "../../../components/footer/components/Home";
import { Select, Slider } from "antd";
import { Carousel } from 'antd';


const Products = () => {
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const handlePriceChange = (value: any) => {
        setPriceRange(value);
    };
    const [selectedBrands, setSelectedBrands] = useState([]);
    const brands = [
        {
            label: 'Cocoon',
            value: 'cocoon',
            logo: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/202667140005381.6239fc9e2048c.png'
        },
        {
            label: 'L\'Oreal',
            value: 'loreal',
            logo: 'https://cdn.worldvectorlogo.com/logos/l-oreal-3.svg'
        },
        {
            label: 'CeraVe',
            value: 'cerave',
            logo: 'https://i.pinimg.com/originals/01/df/ad/01dfadb784cdcd91ebb730d30592b481.png'
        },
        {
            label: 'Cetaphil',
            value: 'cetaphil',
            logo: 'https://www.cetaphil.com.vn/on/demandware.static/-/Sites/default/dwf51c375b/Cetaphil_Logo_285.png'
        },
        {
            label: 'The Ordinary',
            value: 'ordinary',
            logo: 'https://logovectordl.com/wp-content/uploads/2020/12/the-ordinary-logo-vector.png'
        },
        {
            label: 'Hada Labo',
            value: 'hada_labo',
            logo: 'https://hadalabo.com.vn/wp-content/uploads/2021/03/HDLB_logo_m.png'
        },
        {
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
                                    <Link to="/" className="md:text-xl text-lg">
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

            <div style={{ width: '100%', height: '120px', overflow: 'hidden',  }}>
                <div style={{ direction: 'rtl' }}>
                    <Carousel
                        autoplay
                        autoplaySpeed={1500}
                        dots={false}
                        slidesToShow={4}
                        slidesToScroll={1}
                        infinite={true}
                        effect="scrollx"
                    >
                        {brands.map((brand, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                }}
                            >
                                <img
                                    src={brand.logo}
                                    alt={brand.label}
                                    style={{
                                        maxHeight: '80px',
                                        objectFit: 'contain',
                                        margin: '0 10px', // Khoảng cách giữa các logo
                                    }}
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>



            <div className="max-w-8xl mx-auto p-6 bg-white shadow-lg  mb-12">
                <div className="flex gap-2">
                    <div className="w-full md:w-1/5 p-6 bg-white shadow-md">
                        <div>
                            <h4 className="font-medium text-lg text-left">KHOẢNG GIÁ</h4>
                            <Slider
                                range
                                min={0}
                                max={10000000}
                                step={50000}
                                value={priceRange}
                                onChange={handlePriceChange}
                                tooltipVisible
                                tipFormatter={(value: any) => `${value / 1000}K VNĐ`} // Hiển thị giá trị bằng triệu đồng
                            />
                            <div className="mt-2 text-sm text-gray-600">
                                <span>{`Từ: ${priceRange[0] / 1000}K VNĐ`}</span> -
                                <span>{` Đến: ${priceRange[1] / 1000}K VNĐ`}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h4 className="font-medium text-lg text-left">THƯƠNG HIỆU</h4>
                        </div>

                        <div className="w-[100%] mt-1">
                            <div>
                                <Select
                                    options={brands}
                                    value={selectedBrands}
                                    onChange={handleBrandChange}
                                    style={{ width: '100%' }}
                                    placeholder="Chọn thương hiệu"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-medium text-lg text-left">LOẠI DA</h4>
                        </div>
                        <div className="w-[100%] mt-1">
                            <div style={{ maxHeight: 135, overflowY: 'auto' }}>
                                <Select
                                    options={skinTypes}
                                    value={selectedSkinTypes}
                                    onChange={handleSkinTypeChange}
                                    style={{ width: '100%' }}
                                    placeholder="Chọn loại da"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-medium text-lg text-left">XUẤT XỨ</h4>
                        </div>
                        <div className="mt-1" >
                            <Select
                                options={countries}
                                value={selectedOriginCountry}
                                onChange={handleOriginCountryChange}
                                style={{ width: '100%' }}
                                placeholder="Chọn quốc gia"
                            />
                        </div>
                    </div>

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

