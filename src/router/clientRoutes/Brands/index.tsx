import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Select, Slider } from "antd";
import { Carousel } from 'antd';
import BrandSkeleton from "./BrandSkeleton";
import { BrandCard } from "../../../components/footer/components/Brand";
import { getAllBrands } from "../../../services/ApiServices/brandService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { FaceMesh } from "@mediapipe/face_mesh";

const Brands = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = useSelector((state: RootState) => state.token.token);
    const navigate = useNavigate();
    const [brands, setBrands] = useState<any>([]);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        const fetchBrands = async () => {
            setIsLoading(true);
            try {
                // if (!token) {
                //     navigate("/login");
                //     return;
                // }
                const data = await getAllBrands();
                console.log(data)
                setBrands(data);
            } catch (err) {
                setError("Lỗi khi tải dữ liệu thương hiệu.");
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchBrands();
    }, []);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalPages = Math.ceil(brands?.length / ITEMS_PER_PAGE);
    const paginatedBrands = brands?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <section className="bg-gray-100 p-6 pt-40">
                
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
                                    Lỗi load thương hiệu
                                </p>
                            ) : brands.length === 0 ? (
                                <p className="text-center text-2xl font-semibold text-gray-600 md:col-span-3 lg:col-span-4">
                                    Không có dữ liệu phù hợp với search của bạn.
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

