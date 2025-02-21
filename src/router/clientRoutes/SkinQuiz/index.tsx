import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../../../constants/api";
import { Card } from "../../../components/ui/card";
import { Button, Modal, notification } from "antd";
import { getAllQuiz, submitQuiz } from "../../../services/ApiServices/quizQuestionService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";

export default function SkinQuiz() {
    const token = useSelector((state: RootState) => state.token.token);
    const user = useSelector((state: RootState) => state.token.user);
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [skinType, setSkinType] = useState<string | null>(null);
    const questionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    useEffect(() => {
        async function fetchQuizzes() {
            try {
                if (!token) {
                    navigate("/login");
                    return;
                }
                const response = await getAllQuiz(token);
                setQuizzes(response.result);
            } catch (error) {
                console.error("Failed to fetch quizzes:", error);
            }
        }
        fetchQuizzes();
    }, []);

    const handleAnswerSelect = (questionId: any, answerId: any) => {
        setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
    };

    const validateAnswers = () => {
        for (let i = 0; i < quizzes.length; i++) {
            const quiz = quizzes[i];
            if (!selectedAnswers[quiz.id]) {
                notification.error({
                    message: `Bạn chưa trả lời câu hỏi ${i + 1}`,
                    description: "Vui lòng chọn một đáp án trước khi gửi!",
                });

                questionRefs.current[quiz.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateAnswers()) return;
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            console.log(selectedAnswers)
            const payload = {
                userId: user?.userId,
                answers: Object.entries(selectedAnswers).map(([_, answer]) => (answer)),
            };

            await submitQuiz(payload, token);

            setIsModalVisible(true);
        } catch (error) {
            console.error("Failed to submit quiz:", error);
            notification.error({ message: "Lỗi khi gửi đáp án", description: "Vui lòng thử lại sau!" });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200 p-6">
            <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-2xl">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Skincare Quiz</h1>
                {quizzes.map((quiz: any, index: number) => (
                    <motion.div
                        key={quiz.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        ref={(el) => (questionRefs.current[quiz.id] = el)}
                    >
                        <Card className="mb-8 p-6 shadow-lg border border-gray-200 rounded-xl bg-white">
                            <h2 className="text-xl font-bold text-gray-700 mb-2">Câu hỏi {index + 1}:</h2>
                            <img src={quiz.img_url} alt="Quiz" className="w-full h-48 object-cover rounded-xl mb-4" />
                            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{quiz.question_text}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {quiz.answers.map((answer: any, idx: number) => {
                                    const answerLabels = ["A", "B", "C", "D"];
                                    return (
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={answer.id}>
                                            <Button
                                                onClick={() => handleAnswerSelect(quiz.id, answer.id)}
                                                className={`w-full p-4 text-lg rounded-xl border shadow-md transition-all duration-300 ${selectedAnswers[quiz.id] === answer.id
                                                    ? "bg-blue-600 text-white border-blue-800"
                                                    : "bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {answerLabels[idx]}: {answer.answerText}
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </Card>
                    </motion.div>
                ))}

                <div className="flex justify-end mt-8">
                    <Button
                        onClick={() => setIsModalVisible(true)}
                        className="px-8 py-4 text-xl font-bold bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600 transition-all"
                    >
                        Gửi đáp án
                    </Button>
                </div>
            </div>

            {/* Hộp thoại xác nhận */}
            <Modal
                title="Xác nhận gửi đáp án"
                visible={isModalVisible}
                onOk={() => {
                    setIsModalVisible(false);
                    handleSubmit();
                }}
                onCancel={() => setIsModalVisible(false)}
                okText="Tiếp tục"
                cancelText="Tôi chưa chắc"
            >
                <p className="text-lg">Bạn có chắc sẽ gửi những câu trả lời này chứ?</p>
                <p className="text-gray-600">Nếu đồng ý hãy bấm "Tiếp tục"</p>
            </Modal>

            {skinType && (
                <Modal
                    title="Kết quả phân tích da"
                    visible={isModalVisible}
                    okText="Đến thử xem sao"
                    cancelText="Bỏ lỡ"
                    onOk={() => navigate(`/product?skinType=${skinType}`)}
                    onCancel={() => navigate("/home")}
                >
                    <p className="text-lg font-semibold mb-4">Dưới đây là câu trả lời bạn đã chọn:</p>
                    <ul className="mb-4">
                        {quizzes.map((quiz, index) => {
                            const selectedAnswer = quiz.answers.find((a: any) => a.id === selectedAnswers[quiz.id]);
                            console.log(selectedAnswer)
                            return (
                                <li key={quiz.id} className="mb-2">
                                    <strong>Câu {index + 1}: </strong> {quiz.question_text}
                                    <br />
                                    <span className="text-blue-600">
                                        ➜ Đáp án của bạn: {selectedAnswer?.answerText || "Chưa chọn"}
                                    </span>
                                    {selectedAnswer?.skinName && (
                                        <div className="text-gray-700 text-sm">
                                            🔹 Loại da liên quan: <strong className="text-green-600">{selectedAnswer.skinName}</strong>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                    <p className="text-lg">
                        Sau khi thu thập đáp án của bạn, chúng tôi nhận định rằng loại da của bạn là{" "}
                        <strong className="text-green-600">{skinType}</strong>.
                    </p>
                    <p>Bạn có muốn xem thử các sản phẩm phù hợp với loại da này không?</p>
                </Modal>
            )}


        </div>
    );
}
