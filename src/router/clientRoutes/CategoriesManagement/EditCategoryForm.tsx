import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { z } from "zod";

import { FaTimes, FaPen, FaCheckCircle, FaEdit, FaTag } from 'react-icons/fa';
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { updateCategory } from "../../../services/ApiServices/categoryService";


interface EditCategoryModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  category: any;
  fetchCategory: () => void;
}

const EditCategoryModal = ({ isOpen, setIsOpen, category, fetchCategory }: EditCategoryModalProps) => {

  const categoryFormSchema = z.object({
    id: z.number(),
    categoryName: z.string().min(1, "Vui lòng nhập tên"),
    description: z.string().min(1, "Vui lòng nhập mô tả"),
  });

  const token = useSelector((state: RootState) => state.token.token)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
  });

  useEffect(() => {
    if (isOpen) {
      form.setValue("id", Number(category.id));
      form.setValue("categoryName", category.categoryName);
      form.setValue("description", category.description);
    }
  }, [isOpen, form]);

  const handleSubmit = async (values: z.infer<typeof categoryFormSchema>) => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }
      setLoading(true);
      await updateCategory(values.id, values, token);
      form.reset();
      setIsOpen(false);
      notification.success({ message: "Chỉnh sửa loại sản phẩm thành công! 🎉" });
      fetchCategory();
    } catch (error) {
      console.error("Error editing skin type:", error);
      notification.error({ message: "Chỉnh sửa loại sản phẩm thất bại! ❌" });
    } finally {
      setLoading(false);
    }
  };

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
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
                <FaPen className="text-sky-500" />
                Chỉnh sửa loại sản phẩm
              </h3>
              <button onClick={() => { setIsOpen(false); form.reset() }} className="text-3xl text-gray-700 hover:text-sky-500 transition-all">
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-6">
              <div className="flex flex-col">
                <Label className="mb-3 text-left">Tên loại sản phẩm</Label>
                <div className="relative">
                  <Input
                    {...form.register("categoryName")}
                    placeholder="Nhập tên loại sản phẩm"
                    type="text"
                    className="p-3 pl-10 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <FaTag className="absolute left-3 top-3 text-gray-500" />
                </div>
                {form.formState.errors.categoryName && <p className="text-red-500 text-sm">{form.formState.errors.categoryName.message}</p>}
              </div>
              <div className="flex flex-col">
                <Label className="mb-3 text-left">Mô tả</Label>
                <div className="relative">
                  <Textarea
                    {...form.register("description")}
                    placeholder="Nhập mô tả sản phẩm"
                    className="p-3 pl-10 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <FaEdit className="absolute left-3 top-4 text-gray-500" />
                </div>
                {form.formState.errors.description && <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>}
              </div>

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
                    {loading ? "Đang lưu.." : "Lưu"}
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

export default EditCategoryModal;
