import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductSkeleton from "./ProductSkeleton";
import { ProductCard } from "../../../components/footer/components/Home";
import { Button, Select, Slider } from "antd";
import { Carousel } from 'antd';
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { getAllProducts } from "../../../services/ApiServices/productService";
import { getAllBrands } from "../../../services/ApiServices/brandService";
import { getAllSkinTypes } from "../../../services/ApiServices/skinTypeService";
import { originCountries } from "../FormAddProduct/originCountries";


const Products = () => {
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const handlePriceChange = (value: any) => {
        setPriceRange(value);
    };
    const [selectedBrands, setSelectedBrands] = useState<any>([]);
    const [brands, setBrands] = useState<any>([]);

    const handleBrandChange = (selectedValues: any) => {
        setSelectedBrands(selectedValues);
    };

    const [selectedSkinTypes, setSelectedSkinTypes] = useState<any>([]);
    const [skinTypes, setSkinTypes] = useState<any>([]);
    const handleSkinTypeChange = (selectedValues: any) => {
        setSelectedSkinTypes(selectedValues);
    };

    const [selectedOriginCountry, setSelectedOriginCountry] = useState<any>([]);
    const [countries, setCountries] = useState(originCountries.map((country: any) => (
        { label: country, value: country }
    )));
    const handleOriginCountryChange = (selectedValues: any) => {
        setSelectedOriginCountry(selectedValues);
    };

    const [products, setProducts] = useState<any>([]);
    const [productsFull, setProductsFull] = useState(products);

    const token = useSelector((state: RootState) => state.token.token);
    const navigate = useNavigate();
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalPages = Math.ceil(products?.length / ITEMS_PER_PAGE);
    const paginatedmProducts = products?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        const storedSkinType = sessionStorage.getItem("selectedSkinType");
        if (storedSkinType) {
            const parsedSkinTypes = JSON.parse(storedSkinType);
            setSelectedSkinTypes(parsedSkinTypes);
        }
    }, []);

    const handleClearFilters = () => {
        setSelectedBrands([]);
        setSelectedSkinTypes([]);
        setSelectedOriginCountry([]);
    }

    const fetchProducts = async () => {
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            setIsLoading(true);
            const [products, brands, skinTypes] = await Promise.all([
                getAllProducts(token),
                getAllBrands(token),
                getAllSkinTypes(token),
            ]);
            console.log(products)

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
            setBrands(brands.map((brand: any) => ({
                label: brand.brandName,
                value: brand.brandName,
                logo: brand.imgUrl
            })));
            setSkinTypes(skinTypes.result.map((skinType: any) => ({
                label: skinType.skinName,
                value: skinType.skinName
            })));
        } catch (error: any) {
            setError(error.toString());
            console.error("Error fetching skin types", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        setProducts(productsFull.filter((product: any) =>
            (selectedBrands.length === 0 || selectedBrands.includes(product.brandId)) &&
            (selectedSkinTypes.length === 0 || selectedSkinTypes.includes(product.skinTypeId)) &&
            (selectedOriginCountry.length === 0 || selectedOriginCountry.includes(product.origin_country)) &&
            priceRange[0] <= product.disc_price && product.disc_price <= priceRange[1]
        ));
    }, [selectedBrands, selectedSkinTypes, selectedOriginCountry, priceRange, productsFull]);

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
                                        Danh sách sản phẩm
                                    </p>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            </section>

            <div className="max-w-8xl mx-auto p-6 bg-gray-100 ">
                <div style={{ width: '100%', height: '120px', overflow: 'hidden', }}>
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
                            {brands.map((brand: any, index: any) => (
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
                                            marginTop: '25px',
                                        }}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </div>


            <div className="max-w-8xl mx-auto p-6 bg-gray-100">
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
                                tipFormatter={(value: any) => `${value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`} // Hiển thị giá trị bằng triệu đồng
                            />
                            <div className="mt-2 text-sm text-gray-600">
                                <span>{`Từ: ${priceRange[0].toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`}</span> -
                                <span>{` Đến: ${priceRange[1].toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`}</span>
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
                                    value={skinTypes.filter((skin: any) => selectedSkinTypes.includes(skin.value))}
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
                        <Button
                            danger
                            className="bg-red-500 w-full mt-4"
                            size="large"
                            onClick={handleClearFilters}
                        >Xoá tìm kiếm</Button>
                    </div>

                    <section className="w-full md:w-4/5 p-6 bg-white shadow-md">
                        <menu className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
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
                                paginatedmProducts.map((product: any) => (
                                    <ProductCard key={product.id} product={product} />
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

export default Products;

