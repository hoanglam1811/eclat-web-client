import { useEffect, useState } from "react";
import {
    CircularProgress,
    IconButton,
    Paper,

} from "@mui/material";

import { Edit as EditIcon } from "@mui/icons-material";
import { Button, Input, Tooltip, Typography } from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { IoMdAddCircle } from "react-icons/io";
import { getAllSkinTypes } from "../../../services/ApiServices/skinTypeService";
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddTagModal from "./AddTagForm";
import EditTagModal from "./EditTagForm";
import { getAllTags } from "../../../services/ApiServices/tagService";

const ITEMS_PER_PAGE = 5;
const TagsManagement = () => {
    const [tags, setTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentTags, setCurrentTags] = useState<any | null>(null);
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.token.token)

    const [openAddTag, setOpenAddTag] = useState<boolean>(false);
    const [openEditTag, setOpenEditTag] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const filteredTags = tags.filter(tag =>
        tag.tagName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages = Math.ceil(filteredTags?.length / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const fetchTags = async () => {
        try {
            if (!token) {
                navigate("/login");
                return;
            }
            setLoading(true);

            const data = await getAllTags(token);
            console.log("Raw data:", data);

            const formattedTags = data.map((tag: any) => ({
                id: tag.tagId,
                tagName: tag.tagName,
                description: tag.description,
                categoryId: tag.category?.categoryId ?? null,
                categoryName: tag.category?.categoryName ?? "Không có loại",
            }));

            console.log("Formatted tags:", formattedTags);
            setTags(formattedTags);
        } catch (error) {
            console.error("Failed to fetch tags:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTags();
    }, []);

    const renderTable = () => (
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, backgroundColor: "#fff" }}>
            {/* Thanh tìm kiếm và nút hành động */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Input
                        placeholder="Tìm kiếm theo thẻ tên"
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
                    onClick={() => setOpenAddTag(true)}
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
                    Thêm thẻ mới
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
                <div style={{ flex: 2 }}>Tên thẻ</div>
                <div style={{ flex: 2 }}>Loại sản phẩm</div>
                <div style={{ flex: 2 }}>Mô tả</div>
                <div style={{ flex: 1, textAlign: "center" }}>Hành động</div>
            </div>

            {/* Data Rows */}
            {filteredTags?.slice(
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
                    <div style={{ flex: 2 }}>{account.tagName}</div>
                    <div style={{ flex: 2 }}>{account.categoryName}</div>
                    <Tooltip title={account.description}>
                        <Typography style={{ flex: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {account.description}
                        </Typography>
                    </Tooltip>
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <Tooltip title="Edit Skin Type">
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentTags(account);
                                    setOpenEditTag(true);
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
                        QUẢN LÝ THẺ TÊN
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
                {openAddTag && (
                    <AddTagModal
                        isOpen={openAddTag}
                        setIsOpen={setOpenAddTag}
                        fetchTag={fetchTags}
                    />
                )}

                {openEditTag && (
                    <EditTagModal
                        isOpen={openEditTag}
                        setIsOpen={setOpenEditTag}
                        tag={currentTags}
                        fetchTag={fetchTags}
                    />
                )}
            </div>
        </>
    );
};

export default TagsManagement;
