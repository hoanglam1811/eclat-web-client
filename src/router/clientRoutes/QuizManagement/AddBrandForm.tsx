import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { z } from "zod";

import { useNavigate, useParams } from "react-router-dom";
import { FaTimes, FaPen, FaCheckCircle } from 'react-icons/fa';
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Modal, notification, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { addBrand } from "../../../services/ApiServices/brandService";
import { createQuiz } from "../../../services/ApiServices/quizQuestionService";


interface AddQuizModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fetchQuiz: () => void;
}

const AddQuizModal = ({ isOpen, setIsOpen, fetchQuiz }: AddQuizModalProps) => {
  const { id } = useParams<{ id: string }>();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const token = useSelector((state: RootState) => state.token.token);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const quizFormSchema = z.object({
    question_text: z.string().min(1, "Vui lòng nhập câu hỏi"),
    imageUrl: z.string().url("Vui lòng tải lên hình ảnh"),
  });

  const form = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).slice(0, 4);
      setImageFiles(newFiles);
      setCurrentImage(newFiles[0] || null);
    }
  };

  const handleSubmit = async (values: z.infer<typeof quizFormSchema>) => {
    try {
      if (!token) {
        notification.error({ message: "Bạn cần đăng nhập để thêm quiz" });
        return;
      }
      setLoading(true);

      const formData = new FormData();
      formData.append("question_text", values.question_text);
      if (imageFiles.length > 0) {
        formData.append("file", imageFiles[0]);
      }

      await createQuiz(values.question_text, imageFiles[0] || null, token);

      notification.success({
        message: "Tạo quiz thành công 🎉",
        description: "Quiz mới đã được thêm vào hệ thống.",
      });

      form.reset();
      setImageFiles([]);
      setCurrentImage(null);
      setIsOpen(false);
      fetchQuiz();
    } catch (error) {
      notification.error({
        message: "Tạo thất bại ❌",
        description: "Vui lòng thử lại hoặc kiểm tra lại thông tin nhập vào.",
      });
      console.error("Error creating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

  }, [isOpen, id, form]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div className="bg-white p-8 rounded-lg shadow-xl w-11/12 sm:w-1/2 lg:w-1/3">
            <h3 className="text-2xl font-semibold text-gray-700">Thêm Quiz</h3>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
              <div className="flex flex-col text-left">
                <Label className="mb-1">Câu hỏi</Label>
                <Input
                  {...form.register("question_text")}
                  placeholder="Nhập câu hỏi"
                  type="text"
                  className="p-3 border-2 border-gray-300 rounded-md"
                />
                {form.formState.errors.question_text && (
                  <p className="text-red-500 text-sm">{form.formState.errors.question_text.message}</p>
                )}
              </div>

              <div className="flex flex-col text-left">
                <Label className="mb-1">Tải lên hình ảnh</Label>
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="p-3 border-2 border-gray-300 rounded-md" />
              </div>

              {currentImage && (
                <div className="mt-4">
                  <Label>Xem trước</Label>
                  <img src={URL.createObjectURL(currentImage)} alt="Quiz Preview" className="w-full h-40 object-cover border rounded-md mt-2" />
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg">
                  {loading ? "Đang tạo..." : "Tạo"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddQuizModal;
