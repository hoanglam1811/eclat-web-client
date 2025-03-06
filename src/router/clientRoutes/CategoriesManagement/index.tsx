import { useEffect, useMemo, useState } from "react";
import {
    IconButton,
    Tooltip,
    CircularProgress,
    Paper,

} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

import { IoMdAddCircle } from "react-icons/io";
import { Button } from "../../../components/ui/button";
import AddCategoryModal from "./AddCategoryForm";
import EditCategoryModal from "./EditCategoryForm";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { getAllCategories } from "../../../services/ApiServices/categoryService";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const CategoriesManagement = () => {
    const sampleCategories = [
        { id: 1, categoryName: "Cleanser", description: "Sản phẩm làm sạch da, loại bỏ bụi bẩn và dầu thừa." },
        { id: 2, categoryName: "Toner", description: "Cân bằng độ pH và dưỡng ẩm nhẹ nhàng cho da." },
        { id: 3, categoryName: "Moisturizer", description: "Kem dưỡng ẩm giúp da mềm mịn và ngăn ngừa khô da." },
        { id: 4, categoryName: "Sunscreen", description: "Kem chống nắng bảo vệ da khỏi tác hại của tia UV." },
        { id: 5, categoryName: "Serum", description: "Tinh chất đậm đặc hỗ trợ điều trị các vấn đề về da như thâm nám, lão hóa." },
        { id: 6, categoryName: "Exfoliator", description: "Sản phẩm tẩy tế bào chết, giúp da sáng và mịn màng hơn." },
        { id: 7, categoryName: "Sheet Mask", description: "Mặt nạ giấy cung cấp dưỡng chất và cấp ẩm tức thì." },
        { id: 8, categoryName: "Eye Cream", description: "Kem dưỡng mắt giúp giảm bọng mắt và nếp nhăn." },
        { id: 9, categoryName: "Facial Oil", description: "Dầu dưỡng hỗ trợ giữ ẩm và tái tạo da." },
        { id: 10, categoryName: "Spot Treatment", description: "Sản phẩm đặc trị các vấn đề cụ thể như mụn hoặc sẹo." },
    ];
    const token = useSelector((state: RootState) => state.token.token)
    const navigate = useNavigate();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [openAddCategory, setOpenAddCategory] = useState<boolean>(false);
    const [openEditCategory, setOpenEditCategory] = useState<boolean>(false);
    const [currentCategory, setCurrentCategory] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const filteredCategories = categories.filter(category =>
        category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages = Math.ceil(filteredCategories?.length / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const fetchCategories = async () => {
        setLoading(true);
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            const data = await getAllCategories(token)
            setCategories(data.map((category: any) => ({
                id: category.categoryId,
                categoryName: category.categoryName,
                description: category.description
            }))
            );
            console.log(data);
        } catch (error: any) {
            console.error("Error fetching accounts:", error);
        }
        finally {
            setLoading(false);
        };
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const renderTable = () => (
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, backgroundColor: "#fff" }}>
            {/* Thanh tìm kiếm và nút hành động */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Input
                        placeholder="Tìm kiếm theo tên loại"
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
                    onClick={() => setOpenAddCategory(true)}
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
                    Thêm loại mới
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
            {filteredCategories?.slice(
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
                    <div style={{ flex: 2 }}>{account.categoryName}</div>
                    <div style={{ flex: 2 }}>{account.description}</div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <Tooltip title="Edit Category">
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentCategory(account);
                                    setOpenEditCategory(true);
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
        <div className="bg-gray-100 pt-5 pb-5 pl-5 pr-5">
            <div className="flex justify-between mb-5 mt-1">
                <h2 className="text-xl" style={{ marginLeft: "16px", color: "#3f51b5", fontWeight: "bold" }}>
                    QUẢN LÝ LOẠI SẢN PHẨM
                </h2>
            </div>

            {/* Table or Loading */}
            {loading ? <CircularProgress /> : renderTable()}

            {/* Modals */}
            {openAddCategory && (
                <AddCategoryModal
                    isOpen={openAddCategory}
                    setIsOpen={setOpenAddCategory}
                    fetchCategory={fetchCategories}
                />
            )}

            {openEditCategory && (
                <EditCategoryModal
                    isOpen={openEditCategory}
                    setIsOpen={setOpenEditCategory}
                    category={currentCategory}
                    fetchCategory={fetchCategories}
                />
            )}
        </div>
    );
};

export default CategoriesManagement;
