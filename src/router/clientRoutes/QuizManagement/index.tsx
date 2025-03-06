import React, { useState, useEffect } from "react";
import { Button, Card, Input, Modal, notification } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { createQuiz, deleteQuiz, getAllQuiz, submitQuiz } from "../../../services/ApiServices/quizQuestionService";
import { useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Tooltip } from "@mui/material";
import { CloseCircleOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { IoMdAddCircle } from "react-icons/io";
import { DeleteIcon, EditIcon } from "lucide-react";
import AddQuizModal from "./AddBrandForm";
import EditQuizForm from "./EditBrandForm";
import { getAllSkinTypes } from "../../../services/ApiServices/skinTypeService";

const ITEMS_PER_PAGE = 5;
const SkincareQuiz = ({ }) => {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const token = useSelector((state: RootState) => state.token.token);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [openAddQuiz, setOpenAddQuiz] = useState<boolean>(false);
    const [openEditQuiz, setOpenEditQuiz] = useState<boolean>(false);
    const [currentQuiz, setCurrentQuiz] = useState<any | null>(null);
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const filteredQuizzes = quizzes.filter(quiz =>
        quiz.question_text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages = Math.ceil(quizzes?.length / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const [selectedImage, setSelectedImage] = useState("");
    const [skinTypes, setSkinTypes] = useState<any>([]);

    const handleOpenImage = (imageUrl: any) => {
        setSelectedImage(imageUrl);
        setOpenImageModal(true);
    };

    const handleCloseImage = () => {
        setOpenImageModal(false);
    };

    const handleOpenDeleteDialog = (quiz: any) => {
        setQuizToDelete(quiz);
        setOpenConfirmDelete(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenConfirmDelete(false);
        setQuizToDelete(null);
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            if (!token) {
                navigate("/login");
                return;
            }
            const data = await getAllQuiz(token);
            setQuizzes(data.result);
            const skinTypesData = await getAllSkinTypes();
            setSkinTypes(skinTypesData.result);
            console.log(data)
        } catch (error) {
            notification.error({ message: "Failed to fetch quizzes" });
        }
    };

    const handleConfirmDelete = async () => {
        if (quizToDelete) {
            try {
                await deleteQuiz(quizToDelete.id, token);
                fetchQuizzes();
                notification.success({ message: "Quiz đã được xoá thành công" });
            } catch (error) {
                notification.error({ message: "Xoá Quiz thất bại" });
            }
            handleCloseDeleteDialog();
        }
    };

    const renderTable = () => (
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, backgroundColor: "#fff" }}>
            {/* Thanh tìm kiếm và nút hành động */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Input
                        placeholder="Tìm kiếm câu hỏi"
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
                    type="primary"
                    onClick={() => setOpenAddQuiz(true)}
                    style={{
                        // backgroundColor: '#419f97',
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
                    Thêm câu hỏi
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
                <div style={{ flex: 2 }}>Câu hỏi</div>
                <div style={{ flex: 2, textAlign: "center" }}>Ảnh</div>
                <div style={{ flex: 1, textAlign: "center" }}>Hành động</div>
            </div>

            {/* Hàng dữ liệu */}
            {filteredQuizzes?.slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE
            ).map((quiz: any) => (
                <div
                    key={quiz.id}
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
                    <div style={{ flex: 0.5, textAlign: "center" }}>{quiz.id}</div>
                    <div style={{ flex: 2 }}>{quiz.question_text}</div>
                    <div style={{ flex: 2, textAlign: "center" }}>
                        <img
                            src={quiz.img_url || "https://github.com/shadcn.png"}
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
                            onClick={() => handleOpenImage(quiz.img_url)}
                        />
                    </div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                        <Tooltip title="Chỉnh sửa câu hỏi">
                            <IconButton
                                onClick={(e: any) => {
                                    e.stopPropagation();
                                    setCurrentQuiz(quiz);
                                    setOpenEditQuiz(true);
                                }}
                                sx={{
                                    color: "#1976d2",
                                    "&:hover": { color: "#0d47a1", backgroundColor: "#e3f2fd" }
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Xoá câu hỏi">
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDeleteDialog(quiz);
                                }}
                                sx={{
                                    color: "#d32f2f",
                                    "&:hover": { color: "#b71c1c", backgroundColor: "#ffebee" }
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            ))}

            <Dialog open={openConfirmDelete} onClose={handleCloseDeleteDialog}>
                <DialogTitle style={{ fontWeight: "bold", color: "#d32f2f" }}>
                    Xác nhận xoá Quiz
                </DialogTitle>
                <DialogContent>
                    <p>Bạn có chắc muốn xoá không?</p>
                    <p style={{ fontSize: "14px", color: "#757575" }}>
                        Nếu xoá Quiz sẽ đồng nghĩa với việc xoá cả câu trả lời. Nếu có hãy bấm "OK".
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} style={{ color: "#1976d2" }}>
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmDelete} style={{ color: "#d32f2f" }}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

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
        <div className="bg-gray-100 pt-5 pb-5 pl-5 pr-5">
            <div className="flex justify-between mb-5 mt-1">
                <h2 className="text-xl" style={{ marginLeft: "16px", color: "#3f51b5", fontWeight: "bold" }}>
                    QUẢN LÝ CÂU HỎI VỀ DA
                </h2>
            </div>

            {loading ? <CircularProgress /> : renderTable()}

            {quizzes && (
                <AddQuizModal
                    isOpen={openAddQuiz}
                    setIsOpen={(open) => setOpenAddQuiz(open)}
                    skinTypes={skinTypes}
                    fetchQuiz={async () => {
                        fetchQuizzes();
                    }}
                />
            )}

            {quizzes && (
                <EditQuizForm
                    isOpen={openEditQuiz}
                    setIsOpen={(open) => setOpenEditQuiz(open)}
                    quiz={currentQuiz}
                    skinTypes={skinTypes}
                    fetchQuiz={async () => {
                        fetchQuizzes();
                    }}
                />
            )}
        </div>
    );
};

export default SkincareQuiz;
