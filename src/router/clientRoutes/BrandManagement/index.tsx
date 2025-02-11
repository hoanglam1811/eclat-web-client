import { useEffect, useState } from "react";
import {
    IconButton,
    Tooltip,
    CircularProgress,
    Paper,
    Backdrop,

} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

import React from "react";
import { IoMdAddCircle } from "react-icons/io";
import { Button } from "../../../components/ui/button";
import AddBrandModal from "./AddBrandForm";
import EditBrandForm from "./EditBrandForm";
import { CloseCircleOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";
import { getAllBrands } from "../../../services/ApiServices/brandService";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const BrandsManagement = () => {
    const [openImageModal, setOpenImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const handleOpenImage = (imageUrl: any) => {
        setSelectedImage(imageUrl);
        setOpenImageModal(true);
    };

    const handleCloseImage = () => {
        setOpenImageModal(false);
    };
    const sampleBrands = [
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

    const [brands, setBrands] = useState(sampleBrands);
    const token = useSelector((state: RootState) => state.token.token);
    //const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [openAddBrand, setOpenAddBrand] = useState<boolean>(false);

    const [openEditBrand, setOpenEditBrand] = useState<boolean>(false);
    const [currentBrand, setCurrentBrand] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const filteredBrands = brands.filter(brand =>
        brand.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages = Math.ceil(brands?.length / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const fetchBrands = () => {
        setLoading(true);
        if (!token) {
            navigate("/login");
            return;
        }
        getAllBrands(token)
            .then((data: any) => {
                setBrands(data.map((brand: any) => ({
                    id: brand.brandId,
                    label: brand.brandName,
                    value: brand.brandName,
                    logo: brand.imgUrl
                })));
            })
            .catch((error: any) => {
                console.error("Error fetching accounts:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const renderTable = () => (
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, backgroundColor: "#fff" }}>
            {/* Tiêu đề bảng */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Input
                        placeholder="Tìm kiếm theo tên thương hiệu"
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
                    onClick={() => setOpenAddBrand(true)}
                    style={{
                        backgroundColor: "#419f97",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}
                >
                    <IoMdAddCircle />
                    Thêm thương hiệu
                </Button>
            </div>
            <div
                style={{
                    display: "flex",
                    fontWeight: "bold",
                    backgroundColor: "#eeeeee",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    borderBottom: "2px solid #ccc"
                }}
            >
                <div style={{ flex: 0.5, textAlign: "center" }}>ID</div>
                <div style={{ flex: 2 }}>Tên</div>
                <div style={{ flex: 2, textAlign: "center" }}>Logo</div>
                <div style={{ flex: 1, textAlign: "center" }}>Hành động</div>
            </div>

            {/* Hàng dữ liệu */}
            {filteredBrands?.slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE
            ).map((brand) => (
                <div
                    key={brand.id}
                    style={{
                        display: "flex",
                        padding: "12px",
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #ddd",
                        transition: "background-color 0.3s",
                        borderRadius: "8px",
                        marginBottom: "5px",
                        alignItems: "center"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                >
                    <div style={{ flex: 0.5, textAlign: "center" }}>{brand.id}</div>
                    <div style={{ flex: 2 }}>{brand.label}</div>
                    <div style={{ flex: 2, textAlign: "center" }}>
                        <img
                            src={brand.logo || "https://github.com/shadcn.png"}
                            alt="Logo"
                            style={{
                                height: 70,
                                width: 120,
                                display: "inline-flex",
                                alignItems: "center",
                                borderRadius: "8px",
                                objectFit: "cover",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                            }}
                            onClick={() => handleOpenImage(brand.logo)}
                        />
                    </div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <Tooltip title="Chỉnh sửa thương hiệu">
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentBrand(brand);
                                    setOpenEditBrand(true);
                                }}
                                sx={{
                                    color: "#1976d2",
                                    "&:hover": { color: "#0d47a1", backgroundColor: "#e3f2fd" }
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            ))}

            <Backdrop open={openImageModal} onClick={handleCloseImage} sx={{ zIndex: 1000 }}>
                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.85)",
                        animation: "fadeIn 0.3s ease-in-out"
                    }}
                >
                    <IconButton
                        onClick={handleCloseImage}
                        sx={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            color: "white",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" }
                        }}
                    >
                        <CloseCircleOutlined style={{ fontSize: 32 }} />
                    </IconButton>
                    <img
                        src={selectedImage}
                        alt="Full Size Logo"
                        style={{
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            borderRadius: "10px",
                            objectFit: "contain",
                            boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
                            animation: "zoomIn 0.3s ease-in-out"
                        }}
                    />
                </div>
            </Backdrop>

            {/* Thanh phân trang */}
            <div style={{ marginTop: "20px", marginBottom: "10px", display: "flex", justifyContent: "center", gap: "8px" }}>
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
        <div className="bg-gray-100 pt-5 pl-5 pb-5 pr-5">
            {/* Header */}
            <div className="flex justify-between mb-5 mt-1">
                <h2 className="text-xl" style={{ marginLeft: "16px", color: "#3f51b5", fontWeight: "bold" }}>QUẢN LÝ THƯƠNG HIỆU</h2>
            </div>

            {loading ? <CircularProgress /> : renderTable()}

            {brands && (
                <AddBrandModal
                    isOpen={openAddBrand}
                    setIsOpen={(open) => setOpenAddBrand(open)}
                    fetchBrand={async () => {
                        fetchBrands();
                    }}
                />
            )}

            {brands && (
                <EditBrandForm
                    isOpen={openEditBrand}
                    setIsOpen={(open) => setOpenEditBrand(open)}
                    brand={currentBrand}
                    fetchBrand={async () => {
                        fetchBrands();
                    }}
                />
            )}
        </div>
    );
};

export default BrandsManagement;
