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
import { Input, Select } from "antd";
import { getAllProducts } from "../../../services/ApiServices/productService";
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";

const ITEMS_PER_PAGE = 5;

const ProductsManagement = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<any | null>(null);

    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.token.token);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const statusOptions = [
        { value: "all", label: 'Tất cả' },
        { value: "true", label: 'Hoạt động' },
        { value: "false", label: 'Không hoạt động' }
    ]

    const [currentPage, setCurrentPage] = useState<number>(1);

    const filteredProducts = products.filter(product =>
        (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brandId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.skinTypeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.origin_country.toLowerCase().includes(searchQuery.toLowerCase())
        ) &&
        (statusFilter === "all" || product.status === (statusFilter === "true" ? "Hoạt động" : "Không hoạt động"))
    );

    const totalPages = Math.ceil(filteredProducts?.length / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (id: any) => {
        navigate(`/staff/product-update/${id}`);
    };

    const fetchProducts = () => {
        setLoading(true);
        if (!token) {
            navigate("/login");
            return;
        }
        getAllProducts()
            .then((data) => {
                const sortedProducts = data.data
                    .map((product: any) => {
                        const totalQuantity = product.options.reduce((total: number, option: any) => total + option.quantity, 0);

                        return {
                            id: product.productId,
                            name: product.productName,
                            origin_price: Math.min(...product.options.map((option: any) => option.optionPrice)),
                            disc_price: Math.min(...product.options.map((option: any) => option.discPrice)),
                            quantity: totalQuantity == 0 ? "Hết hàng" : totalQuantity,
                            origin_country: product.originCountry,
                            skinTypeId: product.skinType.skinName,
                            brandId: product.brand.brandName,
                            imageUrl: product.images[0]?.imageUrl,
                            status: product.status ? "Hoạt động" : "Không hoạt động",
                            createAt: new Date(product.createAt) // Chuyển về kiểu Date để sắp xếp
                        };
                    })
                    .sort((a: any, b: any) => b.createAt.getTime() - a.createAt.getTime());

                setProducts(sortedProducts);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            })
            .finally(() => {
                setLoading(false);
            });

    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const renderTable = () => (
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, backgroundColor: "#fff" }}>
            {/* Thanh tìm kiếm và nút hành động */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Input
                        placeholder="Tìm kiếm theo tên sản phẩm, loại da, xuất xứ, thương hiệu.."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        prefix={<SearchOutlined style={{ color: "#3f51b5" }} />}
                        style={{
                            width: '600px',
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
                    <div className="text-left ml-[100px]">
                        <span>Trạng thái: </span>
                        <Select
                            options={statusOptions}
                            value={statusOptions.find((option) => option.value == statusFilter)}
                            onChange={(e: any) => {
                                setStatusFilter(e)
                            }}
                            style={{ width: '100%' }}
                            placeholder="Chọn trang thái"
                        />
                    </div>
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
                        width: '180px',
                        height: '60px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                    }}
                >
                    <IoMdAddCircle size={"24"} />
                    Thêm sản phẩm
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
                <div style={{ flex: 1 }}>Xuất xứ</div>
                <div style={{ flex: 1 }}>Loại da</div>
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
                    <div style={{ flex: 1 }}>{account.origin_country}</div>
                    <div style={{ flex: 1 }}>{account.skinTypeId}</div>
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
