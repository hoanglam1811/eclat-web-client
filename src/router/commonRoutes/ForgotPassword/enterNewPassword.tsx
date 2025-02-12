import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "antd/lib";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notification } from "antd";
import { resetPassword } from "../../../services/ApiServices/userService";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLock } from "react-icons/ai";

const schema = z.object({
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp.",
  path: ["confirmPassword"],
});

const EnterNewPasswordStep = ({
  formData,
  setStep,
}: {
  formData: any;
  setStep: (step: number) => void;
}) => {
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...formData,
      password: "",
      confirmPassword: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);


  const handleSubmit = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    try {
      setLoading(true);
      const { password, confirmPassword } = getValues();
      const email = formData.email;
      const otp = formData.otp;

      if (!email || !otp) {
        notification.error({ message: "Thiếu email hoặc mã OTP." });
        return;
      }

      if (password !== confirmPassword) {
        notification.error({ message: "Mật khẩu xác nhận không khớp." });
        return;
      }
      notification.success({ message: "Mật khẩu đã được cập nhật thành công!" });
      await resetPassword(email, otp, password);

      navigate("/");
    } catch (error: any) {
      notification.error({
        message: "Cập nhật mật khẩu thất bại",
        description: error.response?.data?.message || "Hãy thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white p-10 rounded-2xl shadow-xl max-w-lg mx-auto space-y-6">
      <h3 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
        <AiOutlineLock className="text-blue-600 text-3xl" />
        Đặt mật khẩu mới
      </h3>

      {/* Nhập mật khẩu */}
      <div className="space-y-2 text-left">
        <div className="flex items-center border p-3 rounded-xl border-gray-300 bg-gray-100">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Nhập mật khẩu mới"
            className="w-full bg-transparent text-gray-800 focus:outline-none"
          />
          <button type="button" onClick={togglePasswordVisibility} className="ml-2 text-gray-600">
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm">{String(errors.password.message)}</p>}
      </div>

      {/* Nhập lại mật khẩu */}
      <div className="space-y-2 text-left">
        <div className="flex items-center border p-3 rounded-xl border-gray-300 bg-gray-100">
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Xác nhận mật khẩu"
            className="w-full bg-transparent text-gray-800 focus:outline-none"
          />
          <button type="button" onClick={toggleConfirmPasswordVisibility} className="ml-2 text-gray-600">
            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm">{String(errors.confirmPassword.message)}</p>}
      </div>

      {/* Nút "Cập nhật mật khẩu" */}
      <div className="flex justify-between mt-6">
        <Button
          className="bg-gray-500 text-white py-2 px-5 rounded-xl transition-all hover:bg-gray-600"
          onClick={() => setStep(2)}
        >
          Quay lại
        </Button>
        <Button
          className="flex items-center gap-2 bg-blue-600 text-white py-2 px-5 rounded-xl transition-all hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
        </Button>
      </div>
    </form>
  );
};

export default EnterNewPasswordStep;