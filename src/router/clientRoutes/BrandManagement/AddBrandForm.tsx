import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { z } from "zod";

import { useNavigate, useParams } from "react-router-dom";
import { FaTimes, FaPen, FaCheckCircle, FaBuilding, FaImage } from 'react-icons/fa';
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Modal, notification, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { addBrand } from "../../../services/ApiServices/brandService";


interface AddBrandModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fetchBrand: () => void;
}

const AddBrandModal = ({ isOpen, setIsOpen, fetchBrand }: AddBrandModalProps) => {
  const { id } = useParams<{ id: string }>();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>();
  const [fileList, setFileList] = useState<any[]>([]);
  const token = useSelector((state: RootState) => state.token.token);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const brandFormSchema = z.object({
    brandName: z.string().min(1, "Vui lòng nhập tên"),
    // logo: z.array(
    //   z.object({
    //     name: z.string(),
    //     url: z.string().optional(),
    //     thumbUrl: z.string().optional(),
    //   })
    // ).min(1, "Please upload a logo"),
    imgUrl: z.string().url("Vui lòng tải lên logo"),
  });

  const form = useForm<z.infer<typeof brandFormSchema>>({
    resolver: zodResolver(brandFormSchema),
  });

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: any) => {
    setPreviewImage(file.thumbUrl || file.url);
    setPreviewVisible(true);
  };

  const handleChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const handleSubmit = async (values: z.infer<typeof brandFormSchema>) => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }
      setLoading(true); // Bắt đầu trạng thái loading
      await addBrand(values, token);
      notification.success({
        message: "Tạo thương hiệu thành công 🎉",
        description: "Thương hiệu mới đã được thêm vào hệ thống.",
      });

      form.reset();
      setIsOpen(false);
      fetchBrand();
    } catch (error) {
      notification.error({
        message: "Tạo thất bại ❌",
        description: "Vui lòng thử lại hoặc kiểm tra lại thông tin nhập vào.",
      });
      console.error("Error creating brand:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {

  }, [isOpen, id, form]);

  // const handleSubmit = async (values: z.infer<typeof milestoneFormSchema>) => {
  //     try {
  //         //console.log(values);
  //         if(!token){
  //             navigate("/login");
  //             return;
  //         }
  //         await addBrand(values, token);
  //         form.reset();
  //         //console.log("Service created successfully:", response.data);
  //         setIsOpen(false);
  //         fetchBrand();
  //     } catch (error) {
  //         console.error("Error creating service:", error);
  //     }
  // };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-8 rounded-lg shadow-xl w-11/12 sm:w-1/2 lg:w-1/3"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
                <FaPen className="text-sky-500" />
                Thêm thương hiệu mới
              </h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  form.reset();
                }}
                className="text-3xl text-gray-700 hover:text-sky-500 transition-all"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-6"
            >
              {/* Name Field */}
              <div className="flex flex-col">
                <Label className="mb-3 text-left">Tên thương hiệu</Label>
                <div className="relative">
                  <Input
                    {...form.register("brandName")}
                    placeholder="Nhập tên"
                    type="text"
                    className="p-3 pl-10 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <FaBuilding className="absolute left-3 top-3 text-gray-500" />
                </div>
                {form.formState.errors.brandName && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.brandName.message}
                  </p>
                )}
              </div>

              {/* Logo Upload Field */}
              {/* <div className="flex flex-col">
                <Label className="mb-3 text-left">Logo</Label>
                <Upload
                  accept="image/*"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  beforeUpload={() => false} // Disable auto-upload
                >
                  {fileList.length < 1 && (
                    <div className="flex flex-col items-center">
                      <UploadOutlined className="text-2xl" />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
                {form.formState.errors.logo && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.logo.message}
                  </p>
                )}
              </div> */}

              <div className="flex flex-col">
                <Label className="mb-3 text-left">Logo URL</Label>
                <div className="relative">
                  <Input
                    {...form.register("imgUrl")}
                    placeholder="Nhập URL"
                    type="url"
                    className="p-3 pl-10 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <FaImage className="absolute left-3 top-3 text-gray-500" />
                </div>
                {form.formState.errors.imgUrl && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.imgUrl.message}
                  </p>
                )}
              </div>

              {/* Preview Modal */}
              {/* <Modal
                visible={previewVisible}
                footer={null}
                onCancel={handleCancel}
                className="rounded-lg"
              >
                <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
              </Modal> */}
              {form.watch("imgUrl") && (
                <div className="mt-4">
                  <Label className="text-left">Xem trước</Label>
                  <img
                    src={form.watch("imgUrl")}
                    alt="Logo Preview"
                    className="w-full h-40 object-cover border rounded-md mt-2"
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg shadow-md hover:shadow-xl transition-all flex items-center gap-3 w-[40%]"
                >
                  {loading ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    <FaCheckCircle className="text-white text-xl" />
                  )}
                  <div className="text-white">
                    {loading ? "Đang tạo.." : "Tạo"}
                  </div>
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddBrandModal;
