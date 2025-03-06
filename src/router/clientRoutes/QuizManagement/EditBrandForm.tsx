import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { z } from "zod";

import { FaTimes, FaPen, FaCheckCircle } from 'react-icons/fa';
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Modal, notification, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { getAllSkinTypes } from "../../../services/ApiServices/skinTypeService";
import { createQuiz, updateQuiz } from "../../../services/ApiServices/quizQuestionService";
import { createQuizAnswer, updateQuizAnswer } from "../../../services/ApiServices/quizAnswerService";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { IoCloudUpload } from "react-icons/io5";
import { BiCommentDetail } from "react-icons/bi";


interface EditQuizModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  quiz: any;
  skinTypes:any;
  fetchQuiz: () => void;
}

const EditQuizForm = ({ isOpen, setIsOpen, quiz, skinTypes, fetchQuiz }: EditQuizModalProps) => {
  const { id } = useParams<{ id: string }>();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const token = useSelector((state: RootState) => state.token.token);
  const navigate = useNavigate();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const answerLabels = ["A", "B", "C", "D"];

  const quizFormSchema = z.object({
    question_text: z.string().min(1, "Vui lòng nhập câu hỏi"),
    imageUrl: z.string().min(1, "Vui lòng tải lên hình ảnh").url("Vui lòng tải lên hình ảnh"),
    answers: z.array(
      z.object({
        answerText: z.string().min(1, 'Vui lòng nhập câu trả lời'),
        skinTypeId: z.number().min(1, 'Vui lòng chọn loại da'),
        quizAnswerId: z.number()
      })
    )
      .length(4, 'Vui lòng nhập đủ 4 câu trả lời')
  });

  const handlePreview = async (file: any) => {
    setPreviewImage(file.thumbUrl || file.url);
    setPreviewVisible(true);
  };
  const form = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      question_text: "",
      imageUrl: "",
      answers: Array(4).fill({
        answerText: "",
        skinTypeId: 0,
        quizAnswerId: 0
      })
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    // console.log(files?.length)
    if (files && files.length > 0) {
      const newFiles = Array.from(files).slice(0, 4);
      console.log(newFiles)
      setImageFiles(newFiles);
      setCurrentImage(newFiles[0] || null);
      form.setValue("imageUrl", URL.createObjectURL(newFiles[0]));
    }
  };

  const handleSubmit = async (values: z.infer<typeof quizFormSchema>) => {
    try {
      if (!token) {
        notification.error({ message: "Bạn cần đăng nhập để thêm quiz" });
        return;
      }
      setLoading(true);

      await updateQuiz(quiz.id, values.question_text, imageFiles[0] || null, token);
      await Promise.all(values.answers.map((answer: any) => updateQuizAnswer(answer.quizAnswerId, answer, token)));

      notification.success({
        message: "Thay đổi quiz thành công 🎉",
        description: "Quiz mới đã được thêm vào hệ thống.",
      });

      form.reset();
      setImageFiles([]);
      setCurrentImage(null);
      setIsOpen(false);
      setFileList([]);
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
    if(!isOpen) return;
    form.setValue("question_text", quiz?.question_text);
    form.setValue("imageUrl", quiz?.img_url);
    setCurrentImage(quiz?.img_url);
    quiz?.answers.forEach((answer: any, index: number) => {
      form.setValue(`answers.${index}`, {
        answerText: answer.answerText,
        skinTypeId: answer.skinTypeId,
        quizAnswerId: answer.id
      })
    })
  }, [isOpen]);

  

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed z-99 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div className="bg-white p-8 rounded-lg shadow-xl w-11/12 sm:w-2/3 lg:w-3/4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
                <FaPen className="text-sky-500" /> Chỉnh sửa Quiz
              </h3>
              <button onClick={() => { setIsOpen(false); form.reset(); }} className="text-3xl text-gray-700 hover:text-sky-500 transition-all">
                <FaTimes />
              </button>
            </div>
            {/* {JSON.stringify(quiz)} */}

            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-2 gap-6">
              {/* Câu hỏi */}

            {/* {JSON.stringify(form.getValues("answers"))} */}
              <div className="flex flex-col gap-4 text-left">
                {/* Câu hỏi */}
                <label className="text-gray-700 mb-1 flex items-center gap-2 font-bold">
                  <AiOutlineQuestionCircle className="text-blue-500" />
                  Câu hỏi
                </label>
                <Input
                  {...form.register("question_text")}
                  placeholder="Nhập câu hỏi"
                  type="text"
                  className="p-3 border-2 border-gray-300 rounded-md w-full"
                />
                {form.formState.errors.question_text && (
                  <p className="text-red-500 text-sm">{form.formState.errors.question_text.message}</p>
                )}

                {/* Tải ảnh lên */}
                <label className="text-gray-700 mb-1 mt-2 flex items-center gap-2 font-bold">
                  <IoCloudUpload className="text-blue-500" />
                  Tải ảnh lên
                </label>
                <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center hover:bg-gray-50 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full hidden"
                    id="file-upload"
                    onChange={(e) => handleFileChange(e)}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer text-blue-500 hover:underline">
                    <IoCloudUpload className="text-2xl mx-auto text-gray-400 mb-2" />
                    Bấm để tải ảnh
                  </label>
                </div>

                {currentImage && (
                  <div className="flex justify-center items-center mt-4">
                    <img
                      src={typeof currentImage === "string" ? currentImage : URL.createObjectURL(currentImage)}
                      alt="Preview"
                      className="max-w-full max-h-[185px] rounded-lg shadow-md"
                    />
                  </div>
                )}

                {form.formState.errors.imageUrl && <p className="text-red-500 text-sm">{form.formState.errors.imageUrl.message}</p>}
              </div>

              <div className="flex flex-col gap-4 border-l-2 pl-6">
                {Array(4).fill(0).map((_, index) => (
                  <div key={index} className="grid grid-cols-3 gap-5 items-center">
                    <div className="col-span-2 flex flex-col text-left">
                      <label className="text-gray-700 mb-1 flex items-center gap-2 font-bold">
                        <BiCommentDetail className="text-blue-500" />
                        Câu trả lời {answerLabels[index]}
                      </label>
                      <Textarea {...form.register(`answers.${index}.answerText`)} placeholder="Nhập câu trả lời" className="p-3 border-2 border-gray-300 rounded-md" />
                      {form.formState.errors.answers?.[index]?.answerText && (
                        <p className="text-red-500 text-sm">{form.formState.errors.answers[index]?.answerText?.message}</p>
                      )}
                    </div>
                    <div className="col-span-1 flex flex-col text-left">
                      <Label className="mb-1">Loại da</Label>
                      <Select
                        options={skinTypes.map((skinType: any) => ({ label: skinType.skinName, value: skinType.id }))}
                        value={form.watch(`answers.${index}.skinTypeId`) || null}
                        onChange={(e) => form.setValue(`answers.${index}.skinTypeId`, e)}
                        placeholder="Chọn loại da"
                      />
                      {form.formState.errors.answers?.[index]?.skinTypeId && (
                        <p className="text-red-500 text-sm">{form.formState.errors.answers[index]?.skinTypeId?.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-span-2 flex justify-end mt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-4 px-8 rounded-xl w-25 shadow-lg"
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditQuizForm;
