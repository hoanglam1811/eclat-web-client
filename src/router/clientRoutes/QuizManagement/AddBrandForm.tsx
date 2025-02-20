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
import { Card, Modal, notification, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { addBrand } from "../../../services/ApiServices/brandService";
import { createQuiz } from "../../../services/ApiServices/quizQuestionService";
import { IoMdAddCircle } from "react-icons/io";
import { getAllSkinTypes } from "../../../services/ApiServices/skinTypeService";
import { createQuizAnswer } from "../../../services/ApiServices/quizAnswerService";


interface AddQuizModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fetchQuiz: () => void;
}

const AddQuizModal = ({ isOpen, setIsOpen, fetchQuiz }: AddQuizModalProps) => {
  const { id } = useParams<{ id: string }>();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const token = useSelector((state: RootState) => state.token.token);
  const navigate = useNavigate();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const quizFormSchema = z.object({
    question_text: z.string().min(1, "Vui lòng nhập câu hỏi"),
    imageUrl: z.string().min(1, "Vui lòng tải lên hình ảnh").url("Vui lòng tải lên hình ảnh"),
    answers: z.array(
      z.object({
        answerText: z.string().min(1, 'Vui lòng nhập câu trả lời'), 
        skinTypeId: z.number().min(1, 'Vui lòng chọn loại da') 
      })
    )
    .length(4, 'Vui lòng nhập đủ 4 câu trả lời')
  });

  const [skinTypes, setSkinTypes] = useState<any>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<any>([]);
  const handleSkinTypeChange = (selectedValues: any) => {
      setSelectedSkinTypes(selectedValues);
  };
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
        skinTypeId: 0
      })
    }
  });

  const handleChange = ({ fileList: newFileList }: any) => {
    // console.log(newFileList)
    setFileList(newFileList);
    if (newFileList && newFileList.length > 0) {
      const newFiles = newFileList.map((file: any) => file.originFileObj)
      setImageFiles(newFiles);
      setCurrentImage(newFiles[0] || null);
      form.setValue("imageUrl", URL.createObjectURL(newFiles[0]));
    }
  };
  
  const handleCancel = () => setPreviewVisible(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).slice(0, 4);
      setImageFiles(newFiles);
      setCurrentImage(newFiles[0] || null);
      form.setValue("imageUrl", URL.createObjectURL(newFiles[0]));
    }
  };

  const fetchSkinTypes = async () => {
    try {
      if(!token) {
        navigate("/login");
        return;
      }
      const data = await getAllSkinTypes(token);
      setSkinTypes(data.result);
    }
    catch(err: any){
      console.log(err);
      notification.error({ message: "Failed to fetch skin types"})
    }
    finally{

    }
  }

  const handleSubmit = async (values: z.infer<typeof quizFormSchema>) => {
    try {
      console.log("Hello")
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

      const response = await createQuiz(values.question_text, imageFiles[0] || null, token);
      const quiz = response.result;

      await Promise.all(values.answers.map((answer: any) => createQuizAnswer({ ...answer, quizQuestionId: quiz.id }, token)));

      notification.success({
        message: "Tạo quiz thành công 🎉",
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

  }, [isOpen, id, form]);

  useEffect(() => {
    fetchSkinTypes();
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
          <motion.div className="bg-white p-8 rounded-lg shadow-xl w-11/12 sm:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-700">Thêm Quiz</h3>
              <button onClick={() => { setIsOpen(false); form.reset() }} className="text-3xl text-gray-700 hover:text-sky-500 transition-all">
                <FaTimes />
              </button>
            </div>
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

              <div className="flex flex-col">
                <Label className="mb-3 text-left">Logo</Label>
                <Upload
                  accept="image/*"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  onRemove={() => {
                    form.setValue("imageUrl", "")
                    setImageFiles([]);
                  }}
                  beforeUpload={() => false} // Disable auto-upload
                >
                  {fileList.length < 1 && (
                    <div className="flex flex-col items-center">
                      <UploadOutlined className="text-2xl" />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
                {form.formState.errors.imageUrl && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.imageUrl.message}
                  </p>
                )}
              </div>

              {/* Preview Modal */}
              <Modal
                visible={previewVisible}
                footer={null}
                onCancel={handleCancel}
                className="rounded-lg"
              >
                <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
              </Modal>

              {/* {form.formState.errors.imageUrl && <p className="text-red-500 text-sm">{form.formState.errors.imageUrl.message}</p>} */}
              
              {/*<Button type="button" className="bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg">
                <IoMdAddCircle className="mr-2"/>
                Thêm câu trả lời
              </Button>*/}
              <Card>
                {Array(4).fill(0).map((_, index) => (
                  <div key={index} className="grid grid-cols-3 gap-5 items-center mb-3">
                    <div className="flex col-span-2 flex-col text-left">
                      <Label className="mb-1">Câu trả lời</Label>
                      <Textarea
                        {...form.register(`answers.${index}.answerText`)}
                        placeholder="Nhập câu trả lời"
                        className="p-3 border-2 border-gray-300 rounded-md"
                      />
                      {form.formState.errors.answers?.[index]?.answerText && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.answers[index]?.answerText?.message}
                        </p>
                      )}
                    </div>
                    <div className="flex col-span-1 flex-col text-left">
                        <Label className="mb-1">Loại da</Label>
                        <Select
                            options={skinTypes.map((skinType:any) => ({ label: skinType.skinName, value: skinType.id }))}
                            value={form.watch(`answers.${index}.skinTypeId`)==0 ? null : 
                              form.watch(`answers.${index}.skinTypeId`) }
                            onChange={(e) => form.setValue(`answers.${index}.skinTypeId`, e)}
                            style={{ width: '100%' }}
                            placeholder="Chọn loại da"
                        />
                        {form.formState.errors.answers?.[index]?.skinTypeId && (
                          <p className="text-red-500 text-sm">
                            {form.formState.errors.answers[index]?.skinTypeId?.message}
                          </p>
                        )}
                    </div>
                  </div>
                ))}
              </Card>
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
