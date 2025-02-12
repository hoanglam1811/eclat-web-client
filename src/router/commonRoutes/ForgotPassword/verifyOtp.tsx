import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";
import { BASE_URL } from "../../../constants/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import Select from "react-select";
import { Textarea } from "../../../components/ui/textarea";
import { Button, Carousel, notification } from "antd";
import { DeleteOutlined, EditOutlined, LeftOutlined, RightOutlined, UploadOutlined } from "@ant-design/icons";
import { verifyOtp } from "../../../services/ApiServices/userService";


const schema = z.object({
  otp: z
    .string()
    .min(6, { message: "Mã OTP phải có 6 ký tự." })
    .max(6, { message: "Mã OTP phải có 6 ký tự." }),
});

const VerifyOtpStep = ({ formData, setStep, }: { formData: any; setStep: (step: number) => void; onBack: (data: any) => void; }) => {
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

  const handleVerifyOtp = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    try {
      const otp = getValues("otp");
      const email = formData.email; // Lấy email từ formData (hoặc state nếu có)

      if (!email || !otp) {
        notification.error({ message: "Thiếu email hoặc mã OTP." });
        return;
      }
      await verifyOtp(email, otp);

      notification.success({ message: "Xác thực thành công!" });
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
              >
                Xác nhận OTP
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default VerifyOtpStep;
