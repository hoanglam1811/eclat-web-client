import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { z } from "zod";

import { useNavigate, useParams } from "react-router-dom";
import { FaTimes, FaPen, FaCheckCircle, FaUser, FaLockOpen, FaEnvelope, FaPhone } from 'react-icons/fa';
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { addSkinType } from "../../../services/ApiServices/skinTypeService";
import { notification } from "antd";
import { createStaff } from "../../../services/ApiServices/userService";


interface AddStaffModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  fetchStaffs: () => void;
}

const AddStaffModal = ({ isOpen, setIsOpen, fetchStaffs }: AddStaffModalProps) => {
  const { id } = useParams<{ id: string }>();
  const token = useSelector((state: RootState) => state.token.token)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const milestoneFormSchema = z.object({
    username: z.string().min(1, "Vui lòng nhập tên Staff"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt, không có khoảng trắng"),
    email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
    phone: z
      .string()
      .length(10, "Số điện thoại phải có đúng 10 chữ số")
      .regex(/^\d+$/, "Số điện thoại chỉ được chứa số"),
    create_at: z.string(),
    update_at: z.string(),
  });

  const form = useForm<z.infer<typeof milestoneFormSchema>>({
    resolver: zodResolver(milestoneFormSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      phone: "",
      create_at: new Date().toISOString().split('T')[0],
      update_at: new Date().toISOString().split('T')[0],
    }
  });

  useEffect(() => {

  }, [isOpen, id, form]);

  const handleSubmit = async (values: z.infer<typeof milestoneFormSchema>) => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }
      setLoading(true);
      await createStaff(values, token);
      form.reset();
      setIsOpen(false);
      notification.success({ message: "Thêm Staff thành công! 🎉" });
      fetchStaffs();
    } catch (error:any) {
      console.error("Error creating staff:", error);
      notification.error({ message: "Thêm Staff thất bại! ❌",
        description: error?.response?.data?.message == "User Existed" &&
          "Tên người dùng đã tồn tại!!"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed z-99 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                {"Thêm Staff"}
              </h3>
              <button onClick={() => { setIsOpen(false); form.reset() }} className="text-3xl text-gray-700 hover:text-sky-500 transition-all">
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-6">
              <div className="flex flex-col">
                <Label className="mb-3 text-left">Tên Staff</Label>
                <div className="relative">
                  <Input
                    {...form.register("username")}
                    placeholder="Nhập tên Staff"
                    type="text"
                    className="p-3 pl-10 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <FaUser className="absolute left-3 top-3 text-gray-500" />
                </div>
                {form.formState.errors.username && <p className="text-red-500 text-sm">{form.formState.errors.username.message}</p>}
              </div>
              <div className="flex flex-col">
                <Label className="mb-3 text-left">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    {...form.register("password")}
                    placeholder="Nhập mật khẩu"
                    type="text"
                    className="p-3 pl-10 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <FaLockOpen className="absolute left-3 top-3 text-gray-500" />
                </div>
                {form.formState.errors.password && <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>}
              </div>

              <div className="flex flex-col">
                <Label className="mb-3 text-left">Email</Label>
                <div className="relative">
                  <Input
                    {...form.register("email")}
                    placeholder="Nhập email"
                    type="text"
                    className="p-3 pl-10 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
                </div>
                {form.formState.errors.email && <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>}
              </div>

              <div className="flex flex-col">
                <Label className="mb-3 text-left">Số điện thoại</Label>
                <div className="relative">
                  <Input
                    {...form.register("phone")}
                    placeholder="Nhập số điện thoại"
                    type="text"
                    className="p-3 pl-10 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <FaPhone className="absolute left-3 top-3 text-gray-500" />
                </div>
                {form.formState.errors.phone && <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>}
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

export default AddStaffModal;
