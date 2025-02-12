import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, notification } from "antd";
import { verifyOtp } from "../../../services/ApiServices/userService";
import { useState } from "react";


const schema = z.object({
  otp: z
    .string()
    .min(6, { message: "Mã OTP phải có 6 ký tự." })
    .max(6, { message: "Mã OTP phải có 6 ký tự." }),
});

const VerifyOtpStep = ({ formData, setStep, onSave }: { formData: any; setStep: (step: number) => void; onBack: (data: any) => void; onSave: (data: any) => void; }) => {
  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData,
  });

  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    const isValid = await trigger();
    if (!isValid) return;
    setLoading(true);
    try {
      const otp = getValues("otp");
      const email = formData.email;
      console.log(formData)

      if (!email || !otp) {
        notification.error({ message: "Thiếu email hoặc mã OTP." });
        return;
      }
      notification.success({ message: "Xác thực thành công! Vui lòng đợi giây lát" });
      await verifyOtp(email, otp);
      onSave({ ...formData, otp });

      setStep(3);
    } catch (error: any) {
      notification.error({
        message: "Xác thực thất bại",
        description: error.response?.data?.message || "Mã OTP không hợp lệ.",
      });
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
                  Nhập mã OTP
                  <span className="text-red-500 text-sm font-medium">(*)</span>
                </span>
              </h3>

              <div className="flex justify-center">
                <div className="space-y-1 w-3/4">
                  <div className="flex items-center border p-3 rounded-md border-gray-400">
                    <input
                      {...register("otp")}
                      placeholder="Nhập mã OTP"
                      className="w-full text-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                    />
                  </div>
                  {errors.otp && <p className="text-red-500 text-sm">{String(errors.otp.message)}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                className="bg-gray-500 text-white p-2 rounded"
                onClick={() => setStep(1)}
              >
                Quay lại
              </Button>
              <Button
                className="bg-blue-600 text-white p-2 rounded"
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Xác nhận OTP"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default VerifyOtpStep;
