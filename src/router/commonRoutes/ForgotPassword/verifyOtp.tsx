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
import { Button, Carousel } from "antd";
import { DeleteOutlined, EditOutlined, LeftOutlined, RightOutlined, UploadOutlined } from "@ant-design/icons";


const schema = z.object({
  imageUrl: z.string().optional(),
});

const VerifyOtpStep = ({
  formData,
  onSave,
}: {
  formData: any;
  onSave: (data: any) => void;
  onBack: (data: any) => void;
}) => {

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

  const handleNext = async () => {
    const isValid = await trigger();
    if (!isValid) {
      console.error("Validation failed", errors);
      return;
    }
    const data = getValues();
    console.log("Form data: ", data);
    onSave(data);
  };

  return (
    <>
      <div>
        <div>
          <form className="bg-gray-50 p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
            {/* Tiêu đề */}
            <h2 className="text-3xl font-bold text-blue-700 mb-8 border-b-2 pb-4">
              Xác thực OTP
            </h2>

            <div className="grid grid-cols-4 gap-6">


              {/* Phần thông tin sản phẩm (chiếm 3 cột) */}
              <div className="col-span-3 space-y-8">
                {/* Thông tin cơ bản */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Tên sản phẩm */}
                  <div className="col-span-2">
                    <Label htmlFor="scholarshipName" className="block text-sm font-medium text-gray-700 text-left">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("scholarshipName")}
                      placeholder="Nhập tên sản phẩm"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.scholarshipName?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.scholarshipName?.message)}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="educationalLevel" className="block text-sm font-medium text-gray-700 text-left">
                      Nguồn gốc xuất xứ <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      isSearchable
                      placeholder="Chọn nguồn gốc xuất xứ"
                      className="mt-1"
                    />
                    {errors.educationalLevel?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.educationalLevel?.message)}</p>
                    )}
                  </div>
                </div>

                {/* Các thông tin khác */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <Label htmlFor="educationalLevel" className="block text-sm font-medium text-gray-700 text-left">
                      Loại da <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      isSearchable
                      placeholder="Chọn loại da"
                      className="mt-1"
                    />
                    {errors.educationalLevel?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.educationalLevel?.message)}</p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="category" className="block text-sm font-medium text-gray-700 text-left">
                      Thương hiệu <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      isSearchable
                      placeholder="Chọn thương hiệu"
                      className="mt-1"
                    />
                    {errors.deadline?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.deadline?.message)}</p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="productType" className="block text-sm font-medium text-gray-700 text-left">
                      Loại sản phẩm <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      isSearchable
                      placeholder="Chọn loại sản phẩm"
                      className="mt-1"
                    />
                    {errors.scholarshipType?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.scholarshipType.message)}</p>
                    )}
                  </div>
                </div>

                {/* Mô tả sản phẩm */}
                <div className="mt-6">
                  <Label htmlFor="description" className="block text-sm font-medium text-gray-700 text-left">
                    Mô tả sản phẩm <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    {...register("description")}
                    rows={4}
                    placeholder="Nhập mô tả sản phẩm"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.description?.message && (
                    <p className="text-sm text-red-500 mt-1">{String(errors.description.message)}</p>
                  )}
                </div>
                <div className="mt-6">
                  <Label htmlFor="usageInstructions" className="block text-sm font-medium text-gray-700 text-left">
                    Hướng dẫn sử dụng <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    {...register("usageInstructions")}
                    rows={4}
                    placeholder="Nhập hướng dẫn sử dụng"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.usageInstructions?.message && (
                    <p className="text-sm text-red-500 mt-1">{String(errors.usageInstructions.message)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end mt-6">
              <Button onClick={handleNext} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Tiếp theo
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default VerifyOtpStep;
