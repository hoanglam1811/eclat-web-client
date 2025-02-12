import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";
import { FaTimes, FaPen, FaCheckCircle } from 'react-icons/fa';
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateTag } from "../../../services/ApiServices/tagService";
import { notification } from "antd";
import { getAllCategories } from "../../../services/ApiServices/categoryService";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";


interface EditTagModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tag: any;
  fetchTag: () => void;
}

const EditTagModal = ({ isOpen, setIsOpen, tag, fetchTag }: EditTagModalProps) => {

  const tagFormSchema = z.object({
    id: z.number(),
    tagName: z.string().min(1, "Vui lòng nhập tên thẻ"),
    description: z.string().min(1, "Vui lòng nhập mô tả"),
    categoryId: z.number(),
  });

  const token = useSelector((state: RootState) => state.token.token)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const options = categories.map(category => ({
    value: category.categoryId,
    label: category.categoryName,
  }));

  const form = useForm<z.infer<typeof tagFormSchema>>({
    resolver: zodResolver(tagFormSchema),
  });

  useEffect(() => {
    if (isOpen) {
      const loadCategories = async () => {
        try {
          if (!token) {
            console.error("Token is missing");
            return;
          }
          const categoriesData = await getAllCategories(token);
          setCategories(categoriesData);
        } catch (error) {
          console.error("Không thể lấy danh sách categories", error);
        }
      };
      loadCategories();

      form.setValue("id", Number(tag.id));
      form.setValue("tagName", tag.tagName);
      form.setValue("description", tag.description);
      form.setValue("categoryId", Number(tag.categoryId));
    }
  }, [isOpen, form, tag]);

  const handleSubmit = async (values: z.infer<typeof tagFormSchema>) => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }
      setLoading(true);
      await updateTag(values.id, values, token);
      form.reset();
      notification.success({ message: "Cập nhật thẻ thành công! 🎉" })
      setIsOpen(false);
      fetchTag();
    } catch (error) {
      console.error("Lỗi cập nhật tag:", error);
      notification.error({ message: "Cập nhật thẻ thất bại! ❌" })
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
                Chỉnh sửa thẻ
              </h3>
              <button onClick={() => { setIsOpen(false); form.reset() }} className="text-3xl text-gray-700 hover:text-sky-500 transition-all">
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-6">
              <div className="flex flex-col">
                <Label className="mb-3 text-left">Tên thẻ</Label>
                <div className="relative">
                  <Input
                    {...form.register("tagName")}
                    placeholder="Nhập tên thẻ"
                    type="text"
                    className="p-3 pl-10 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <FaPen className="absolute left-3 top-3 text-gray-500" />
                </div>
                {form.formState.errors.tagName && <p className="text-red-500 text-sm">{form.formState.errors.tagName.message}</p>}
              </div>

              <div className="flex flex-col">
                <Label className="mb-3 text-left">Loại sản phẩm</Label>
                <div className="relative">
                  <Controller
                    name="categoryId"
                    control={form.control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!form.formState.errors.categoryId}>
                        <InputLabel>Chọn loại sản phẩm</InputLabel>
                        <Select
                          {...field}
                          label="Loại sản phẩm"
                          sx={{ width: '100%' }}
                        >
                          {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {form.formState.errors.categoryId && (
                          <FormHelperText>{form.formState.errors.categoryId.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <Label className="mb-3 text-left">Mô tả</Label>
                <div className="relative">
                  <Textarea
                    {...form.register("description")}
                    placeholder="Nhập mô tả"
                    className="p-3 pl-10 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <FaPen className="absolute left-3 top-3 text-gray-500" />
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

export default EditTagModal;
