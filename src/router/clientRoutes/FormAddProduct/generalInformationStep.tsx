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
import { Button } from "antd";
import { originCountries } from "./originCountries";
import { UploadOutlined } from "@ant-design/icons";

const schema = z.object({
  imageUrl: z
    .string()
    .min(1, "Ảnh là bắt buộc"),
  productName: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  description: z.string().min(1, "Mô tả sản phẩm là bắt buộc"),
  usageInstruct: z.string().min(1, "Hướng dẫn sử dụng là bắt buộc"),
  originCountry: z.string().min(1, "Nguồn gốc xuất xứ là bắt buộc"),
  tagId: z.number().min(1, "Tên thẻ là bắt buộc"),
  brandId: z.number().min(1, "Thương hiệu là bắt buộc"),
  skinTypeId: z.number().min(1, "Loại da là bắt buộc"),
});

const GeneralInformationStep = ({
  formData,
  onSave,
  imageFiles,
  setImageFiles,
  skinTypes,
  brands,
  tags,
  tagFull
}: {
  formData: any;
  onSave: (data: any) => void;
  imageFiles: any;
  setImageFiles: any;
  skinTypes: any;
  brands: any;
  tags: any;
  tagFull: any;
}) => {
  // const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    register,
    formState: { errors },
    trigger,
    watch,
    setValue,
    getValues,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: formData,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).slice(0, 4);
      setImageFiles(newFiles);
      setCurrentImage(newFiles[0] || null);
      setValue("imageUrl", URL.createObjectURL(newFiles[0]));
    } else {
      setValue("imageUrl", "");
    }
  };

  useEffect(() => {
  }, [imageFiles]);

  const handleNext = async () => {
    if (!getValues("imageUrl")) {
      setValue("imageUrl", "");
    }

    const isValid = await trigger();
    if (!isValid) {
      console.error("Validation failed", errors);
      return;
    }
    const data = getValues();
    console.log("Form data: ", data);
    console.log(imageFiles)
    onSave(data);
  };

  return (
    <>
      <div>
        <div>
          <form className="bg-gray-50 p-8 rounded-lg shadow-md max-w-6xl mx-auto">
            {/* Tiêu đề */}
            <h2 className="text-3xl font-bold text-blue-700 mb-8 border-b-2 pb-4">
              Thông tin chung
            </h2>

            <div className="grid grid-cols-5 gap-6">
              {/* Phần hiển thị ảnh (chiếm 2 cột) */}
              <div className="col-span-2 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình ảnh sản phẩm <span className="text-red-500">*</span>
                </label>

                {/* Hiển thị ảnh lớn */}
                {currentImage ? (
                  <img
                    src={URL.createObjectURL(currentImage)}
                    alt="Ảnh chính"
                    className="w-full h-[350px] object-cover rounded-lg shadow-md border-2 border-gray-300"
                  />
                ) : (imageFiles.length > 0 ? (
                  <img
                    src={URL.createObjectURL(imageFiles[0])}
                    alt="Ảnh chính"
                    className="w-full h-[350px] object-cover rounded-lg shadow-md border-2 border-gray-300"
                  />
                ) :
                  <div className="w-full h-72 flex items-center justify-center bg-gray-200 rounded-lg border-2 border-dashed border-gray-300">
                    <span className="text-gray-500">Chưa có ảnh</span>
                  </div>
                )}

                {/* Danh sách ảnh nhỏ */}
                <div className="flex mt-4 space-x-2 ml-[18px]">
                  {imageFiles.map((file: any, index: any) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Ảnh ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${file === currentImage ? "border-blue-500 shadow-lg" : "border-gray-300"}`}
                      onClick={() => setCurrentImage(file)}
                    />
                  ))}
                </div>

                {/* Nút upload ảnh */}
                <div className="mt-4">
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("imageUpload")?.click()}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center shadow-md hover:bg-blue-700"
                  >
                    <UploadOutlined className="mr-2" />
                    Tải ảnh lên (Tối đa 4 ảnh)
                  </button>
                </div>

                {/* Hiển thị thông báo lỗi nếu không có ảnh */}
                {errors.imageUrl?.message && (
                  <p className="text-sm text-red-500 mt-1">{String(errors.imageUrl?.message)}</p>
                )}

              </div>

              {/* Phần thông tin sản phẩm (chiếm 3 cột) */}
              <div className="col-span-3 space-y-8">
                {/* Thông tin cơ bản */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Tên sản phẩm */}
                  <div className="col-span-2">
                    <Label htmlFor="productName" className="block text-sm font-medium text-gray-700 text-left">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("productName")}
                      placeholder="Nhập tên sản phẩm"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.productName?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.productName?.message)}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="educationalLevel" className="block text-sm font-medium text-gray-700 text-left">
                      Nguồn gốc xuất xứ <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      isSearchable
                      options={originCountries.map((country: any) => ({ value: country, label: country }))}
                      onChange={(value: any) => setValue("originCountry", value.value)}
                      value={originCountries.map((country: any) => ({ value: country, label: country }))
                        .find((country: any) => country.value == watch("originCountry"))}
                      placeholder="Chọn nguồn gốc xuất xứ"
                      className="mt-1"
                    />
                    {errors.originCountry?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.originCountry?.message)}</p>
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
                    {...register("usageInstruct")}
                    rows={4}
                    placeholder="Nhập hướng dẫn sử dụng"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.usageInstruct?.message && (
                    <p className="text-sm text-red-500 mt-1">{String(errors.usageInstruct.message)}</p>
                  )}
                </div>

                {/* Các thông tin khác */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <Label htmlFor="educationalLevel" className="block text-sm font-medium text-gray-700 text-left">
                      Loại da <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      isSearchable
                      placeholder="Chọn loại da"
                      options={skinTypes}
                      value={skinTypes.find((type: any) => type.value === watch("skinTypeId"))}
                      onChange={(selected: any) => setValue("skinTypeId", selected?.value)}
                      className="mt-1"
                    />
                    {errors.skinTypeId?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.skinTypeId?.message)}</p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="category" className="block text-sm font-medium text-gray-700 text-left">
                      Thương hiệu <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      isSearchable
                      placeholder="Chọn thương hiệu"
                      options={brands}
                      value={brands.find((brand: any) => brand.value === watch("brandId"))}
                      onChange={(selected: any) => setValue("brandId", selected?.value)}
                      className="mt-1"
                    />
                    {errors.brandId?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.brandId?.message)}</p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="productType" className="block text-sm font-medium text-gray-700 text-left">
                      Tên thẻ <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      isSearchable
                      placeholder="Chọn tên thẻ"
                      options={tags}
                      value={tags.find((tag: any) => tag.value === watch("tagId"))}
                      onChange={(selected: any) => setValue("tagId", selected?.value)}
                      className="mt-1"
                    />
                    {errors.tagId?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.tagId.message)}</p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="productType" className="block text-sm font-medium text-gray-700 text-left">
                      Loại sản phẩm <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      isSearchable
                      placeholder="Chọn loại sản phẩm"
                      value={tagFull.find((tag: any) => tag.tagId == watch("tagId")) &&
                        tagFull.filter((tag: any) => tag.tagId == watch("tagId")).map((tag: any) => {
                          return { label: tag.category.categoryName, value: tag.category.categoryId };
                        })}
                      isDisabled
                      className="mt-1"
                    />
                    {errors.scholarshipType?.message && (
                      <p className="text-sm text-red-500 mt-1">{String(errors.scholarshipType.message)}</p>
                    )}
                  </div>
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

export default GeneralInformationStep;
