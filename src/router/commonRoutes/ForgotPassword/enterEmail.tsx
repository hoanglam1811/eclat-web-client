import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, notification } from "antd";
import { forgotPassword } from "../../../services/ApiServices/userService";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email không được để trống." })
    .email("Email không hợp lệ."),
});

const EnterEmailStep = ({ formData, setStep, onSave, }: { formData: any; setStep: (step: number) => void; onSave: (data: any) => void; }) => {
  const {
    formState: { errors }, getValues, register,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...formData,
      email: formData.email || "",
    },
  });
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    const email = getValues("email");
    if (!email) return notification.error({ message: "Vui lòng nhập email hợp lệ" });
    console.log(formData)
    setLoading(true);
    try {
      notification.success({ message: "Mã OTP đang được gửi đến email của bạn. Vui lòng đợi giây lát" });
      await forgotPassword(email);
      onSave({ ...formData, email });
      setStep(2);
    } catch (error: any) {
      notification.error({
        message: "Gửi OTP thất bại",
        description: error.response?.data?.message || "Hãy thử lại",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div>
          <form className="bg-gray-50 p-10 rounded-2xl shadow-xl max-w-lg mx-auto space-y-6">
            <div className="space-y-6 overflow-y-auto max-h-[270px]">
              <h3 className="flex items-center justify-between mb-4">
                <span className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  Nhập email của bạn
                  <span className="text-red-500 text-sm font-medium">
                    (*)
                  </span>
                </span>
              </h3>

              <div className="flex justify-center">
                <div className="space-y-1 w-3/4">
                  <div className="flex items-center border p-3 rounded-md border-gray-400">
                    <input
                      {...register("email")}
                      placeholder="Hãy nhập email"
                      className="w-full text-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm">{String(errors.email.message)}</p>}
                </div>
                <Button className="bg-blue-600 text-white p-2 rounded ml-5 mt-3" onClick={handleSendOtp} disabled={loading}>
                  {loading ? "Đang xử lý.." : "Gửi OTP"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EnterEmailStep;
