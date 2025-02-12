import { useEffect, useState } from "react";
import {
    CircularProgress,
    IconButton,
    Paper,

} from "@mui/material";

import { Edit as EditIcon } from "@mui/icons-material";
import React from "react";
import { Button, Input, Tooltip } from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { IoMdAddCircle } from "react-icons/io";
import AddSkinTypeModal from "./AddSkinTypeForm";
import EditSkinTypeModal from "./EditSkinTypeForm";
import { getAllSkinTypes } from "../../../services/ApiServices/skinTypeService";
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;
const SkinTypesManagement = () => {
    const sampleSkinTypes = [
        { id: "1", label: 'Da Dầu', description: 'Oily skin is characterized by excess oil production, leading to shiny skin and often enlarged pores. It is prone to acne and blackheads.' },
        { id: "2", label: 'Da Khô', description: 'Dry skin can feel tight, rough, and may appear flaky or dull. It lacks natural moisture and can be more sensitive to environmental factors.' },
        { id: "3", label: 'Da Nhạy Cảm', description: 'Sensitive skin reacts easily to products, weather, or other environmental factors. It may experience redness, itching, or irritation.' },
        { id: "4", label: 'Da Hỗn Hợp', description: 'Combination skin features a mix of dry and oily areas, typically with an oily T-zone (forehead, nose, chin) and dry or normal cheeks.' },
        { id: "5", label: 'Da Lão Hóa', description: 'Aging skin tends to show signs of fine lines, wrinkles, and loss of elasticity. It can feel drier and more sensitive due to a decrease in collagen production.' },
        { id: "6", label: 'Da Mụn', description: 'Acne-prone skin is characterized by frequent breakouts, pimples, and blackheads. It may be oily and prone to clogged pores.' }
    ];
    const [skintypes, setSkintypes] = useState(sampleSkinTypes);
    //const [skintypes, setSkintypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentSkintypes, setCurrentSkintypes] = useState<any | null>(null);
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.token.token)

    const [openAddSkintype, setOpenAddSkintype] = useState<boolean>(false);
    const [openEditSkintype, setOpenEditSkintype] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const filteredSkintypes = skintypes.filter(skintype =>
        skintype.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages = Math.ceil(filteredSkintypes?.length / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const fetchSkintypes = () => {
        setLoading(true);
        if (!token) {
            navigate("/login");
            return;
        }
        getAllSkinTypes(token)
            .then((data: any) => {
                setSkintypes(data.result.map((skintype: any) => ({
                    id: skintype.id,
                    label: skintype.skinName,
                    description: skintype.description
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
        fetchSkintypes();
    }, []);

    const renderTable = () => (
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, backgroundColor: "#fff" }}>
            {/* Thanh tìm kiếm và nút hành động */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Input
                        placeholder="Tìm kiếm theo loại da"
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
                    onClick={() => setOpenAddSkintype(true)}
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
                    Thêm loại da
                </Button>
            </div>
            <div
                style={{
                    display: "flex",
                    fontWeight: "bold",
                    backgroundColor: "#f1f1f1",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "12px",
                    borderBottom: "2px solid #ccc"
                }}
            >
                <div style={{ flex: 0.5, textAlign: "center" }}>ID</div>
                <div style={{ flex: 2 }}>Tên</div>
                <div style={{ flex: 2 }}>Mô tả</div>
                <div style={{ flex: 1, textAlign: "center" }}>Hành động</div>
            </div>

            {/* Data Rows */}
            {filteredSkintypes?.slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE
            ).map((account) => (
                <div
                    key={account.id}
                    style={{
                        display: "flex",
                        padding: "12px",
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #ddd",
                        borderRadius: "8px",
                        marginBottom: "5px",
                        alignItems: "center",
                        transition: "background-color 0.3s, transform 0.2s"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                        e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#fff";
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                >
                    <div style={{ flex: 0.5, textAlign: "center" }}>{account.id}</div>
                    <div style={{ flex: 2 }}>{account.label}</div>
                    <div style={{ flex: 2 }}>{account.description}</div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <Tooltip title="Edit Skin Type">
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentSkintypes(account);
                                    setOpenEditSkintype(true);
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

            {/* Pagination */}
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "5px" }}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                            padding: "6px 12px",
                            backgroundColor: currentPage === index + 1 ? "#419f97" : "#e0e0e0",
                            color: currentPage === index + 1 ? "white" : "black",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow: currentPage === index + 1 ? "0 2px 6px rgba(0,0,0,0.2)" : "none"
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </Paper>

    );

    return (
        <>
            <div className="bg-gray-100 pt-5 pb-5 pl-5 pr-5">
                <div className="flex justify-between mb-5 mt-1">
                    <h2 className="text-xl" style={{ marginLeft: "16px", color: "#3f51b5", fontWeight: "bold" }}>
                        QUẢN LÝ LOẠI DA
                    </h2>
                </div>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        {renderTable()}
                    </>
                )}
                {/* Modals */}
                {openAddSkintype && (
                    <AddSkinTypeModal
                        isOpen={openAddSkintype}
                        setIsOpen={setOpenAddSkintype}
                        fetchCategory={fetchSkintypes}
                    />
                )}

                {openEditSkintype && (
                    <EditSkinTypeModal
                        isOpen={openEditSkintype}
                        setIsOpen={setOpenEditSkintype}
                        skintype={currentSkintypes}
                        fetchSkinType={fetchSkintypes}
                    />
                )}
            </div>
        </>
    );
};

export default SkinTypesManagement;
