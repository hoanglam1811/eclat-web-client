import { useEffect, useState } from "react";
import {
    IconButton,
    Tooltip,
    CircularProgress,
    Paper,

} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

import React from "react";
import { IoMdAddCircle } from "react-icons/io";
import { Button } from "../../../components/ui/button";
import { DeleteOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import RouteNames from "../../../constants/routeNames";
import { Input } from "antd";

const ITEMS_PER_PAGE = 5;

const ProductsManagement = () => {
    const sampleProducts = [
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
            status: "Ngừng hoạt động",
            imageUrl: "https://product.hstatic.net/1000006063/product/1200_x_1200_5b80186af6344e41b036b8dc310db177_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "5",
            name: "Son lỏ, Romand, FOIF, Romand #23 (Starry Edition)",
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

    const [products, setProducts] = useState(sampleProducts);
    //const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<any | null>(null);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState<number>(1);
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts?.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (id: any) => {
        navigate(`/staff/product-update/${id}`);
    };

    //   const fetchCategories = () => {
    //     setLoading(true);
    //     getAllCategories()
    //       .then((data) => {
    //         setCategories(data.data);
    //       })
    //       .catch((error) => {
    //         console.error("Error fetching accounts:", error);
    //       })
    //       .finally(() => {
    //         setLoading(false);
    //       });
    //   };

    //   useEffect(() => {
    //     fetchCategories();
    //   }, []);

    const renderTable = () => (
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, backgroundColor: "#fff" }}>
            {/* Thanh tìm kiếm và nút hành động */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Input
                        placeholder="Tìm kiếm theo tên sản phẩm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        prefix={<SearchOutlined style={{ color: "#3f51b5" }} />}
                        style={{
                            width: '400px',
                            padding: '10px',
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f9f9f9"
                        }}
                    />
                    <Button
                        onClick={() => setSearchQuery('')}
                        style={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: "8px",
                        }}
                    >
                        <DeleteOutlined />
                    </Button>
                </div>

                <Button
                    onClick={() => navigate(RouteNames.PRODUCT_ADDITION)}
                    style={{
                        backgroundColor: '#419f97',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}
                >
                    <IoMdAddCircle />
                    Tạo sản phẩm mới
                </Button>
            </div>

            {/* Tiêu đề cột */}
            <div
                style={{
                    display: 'flex',
                    fontWeight: 'bold',
                    backgroundColor: '#eeeeee',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    borderBottom: "2px solid #ccc"
                }}
            >
                <div style={{ flex: 0.5, textAlign: "center" }}>ID</div>
                <div style={{ flex: 2 }}>Tên</div>
                <div style={{ flex: 1 }}>Số lượng</div>
                <div style={{ flex: 1 }}>Thương hiệu</div>
                <div style={{ flex: 1 }}>Trạng thái</div>
                <div style={{ flex: 1, textAlign: "center" }}>Hành động</div>
            </div>

            {/* Hàng dữ liệu */}
            {filteredProducts?.slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE
            ).map((account) => (
                <div
                    key={account.id}
                    style={{
                        display: 'flex',
                        padding: '12px',
                        backgroundColor: '#fff',
                        borderBottom: '1px solid #ddd',
                        transition: 'background-color 0.3s',
                        borderRadius: "8px",
                        marginBottom: "5px"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                >
                    <div style={{ flex: 0.5, textAlign: "center" }}>{account.id}</div>
                    <div style={{ flex: 2 }}>{account.name}</div>
                    <div style={{ flex: 1 }}>{account.quantity}</div>
                    <div style={{ flex: 1 }}>{account.brandId}</div>
                    <div style={{ flex: 1 }}>{account.status}</div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <Tooltip title="Xem chi tiết">
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentProduct(account);
                                    handleViewDetails(account.id);
                                }}
                                sx={{ color: 'blue', '&:hover': { color: '#1976d2' } }}
                            >
                                <EyeOutlined style={{ fontSize: 24 }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            ))}

            {/* Thanh phân trang */}
            <div style={{ marginTop: "20px", marginBottom: '10px', display: "flex", justifyContent: "center", gap: "8px" }}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                            padding: "8px 12px",
                            backgroundColor: currentPage === index + 1 ? "#419f97" : "#f1f1f1",
                            color: currentPage === index + 1 ? "white" : "black",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: currentPage === index + 1 ? "bold" : "normal",
                            transition: "background-color 0.3s",
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </Paper>
    );

    return (
        <div className="bg-gray-100 pt-5 pb-5 pl-5 pr-5">
            <div className="flex justify-between mb-5 mt-1">
                <h2 className="text-xl" style={{ marginLeft: "16px", color: "#3f51b5", fontWeight: "bold" }}>
                    QUẢN LÝ KHO SẢN PHẨM
                </h2>
            </div>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    {renderTable()}
                </>
            )}
        </div>
    );
};

export default ProductsManagement;