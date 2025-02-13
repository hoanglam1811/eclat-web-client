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
import { getAllSkinTypes } from "../../../services/ApiServices/skinTypeService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { getAllBrands } from "../../../services/ApiServices/brandService";
import { getAllTags } from "../../../services/ApiServices/tagService";
import { originCountries } from "./originCountries";


interface OptionType {
  value: string;
  label: string;
}

const schema = z.object({
  imageUrl: z.string().optional(),
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
  handleUploadFile,
  skinTypes,
  brands,
  tags,
  tagFull
}: {
  formData: any;
  onSave: (data: any) => void;
  handleUploadFile: any;
  skinTypes: any;
  brands: any;
  tags: any;
  tagFull: any;
}) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      if (index !== undefined) {
        // Nếu index được truyền vào, thay thế ảnh tại vị trí đó
        setImages((prev) => {
          const updatedImages = [...prev];
          updatedImages[index] = newPreviews[0]; // Thay thế ảnh tại vị trí index
          return updatedImages;
        });
        setImageFiles((prev) => {
          const updatedFiles = [...prev];
          updatedFiles[index] = newFiles[0]; // Thay thế file tại vị trí index
          return updatedFiles;
        });
      } else {
        // Nếu không có index (thêm ảnh mới)
        setImageFiles((prev) => [...prev, ...newFiles]); // Thêm ảnh mới vào cuối
        setImages((prev) => [...prev, ...newPreviews]); // Thêm ảnh preview mới vào cuối
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index)); // Xóa file thực tế tại vị trí index
    setImages((prev) => prev.filter((_, i) => i !== index)); // Xóa URL preview tại vị trí index
  };

  const handleReplaceImage = (index: number) => {
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    fileInput.click();
    fileInput.onchange = (e: any) => handleFileChange(e, index); // Đảm bảo chỉ thay thế ảnh tại index
  };


  const handleNextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Hàm để chuyển về ảnh trước
  const handlePreviousImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  
  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image));
    };
  }, [images]);

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
              Thông tin chung
            </h2>

            <div className="grid grid-cols-4 gap-6">
              {/* Phần hiển thị ảnh (chiếm 1 cột) */}
              <div className="col-span-1">
                <div className="mb-6 relative group">
                  <label className="block text-sm font-medium text-gray-700 text-left">
                    Hình ảnh sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1 h-72 w-full">
                    {images.length > 0 ? (
                      <div className="relative h-full w-full">
                        {images.length > 1 && (
                          <div className="absolute top-1/2 left-0 z-10 transform -translate-y-1/2 flex items-center">
                            <Button
                              type="primary"
                              shape="circle"
                              icon={<LeftOutlined />}
                              onClick={handlePreviousImage}
                              className="text-white bg-black opacity-50 hover:opacity-100"
                              style={{ padding: '10px' }}
                            />
                          </div>
                        )}
                        <img
                          src={images[currentIndex]}
                          alt={`Product Preview ${currentIndex + 1}`}
                          className="h-full w-full object-cover rounded-md"
                        />
                        {images.length > 1 && (
                          <div className="absolute top-1/2 right-0 z-10 transform -translate-y-1/2 flex items-center">
                            <Button
                              type="primary"
                              shape="circle"
                              icon={<RightOutlined />}
                              onClick={handleNextImage}
                              className="text-white bg-black opacity-50 hover:opacity-100"
                              style={{ padding: '10px' }}
                            />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                          <button
                            type="button"
                            onClick={() => handleReplaceImage(currentIndex)}
                            className="text-white text-2xl mx-2"
                          >
                            <EditOutlined />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(currentIndex)}
                            className="text-white text-2xl mx-2"
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-md">
                        <span className="text-gray-500">Hiện tại trống, hãy thêm ảnh vào</span>
                      </div>
                    )}

                    {/* Biểu tượng tải ảnh chỉ hiển thị khi không có ảnh */}
                    {images.length === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                        <button
                          type="button"
                          onClick={() => document.getElementById('imageUpload')?.click()}
                          className="text-white text-2xl"
                        >
                          <UploadOutlined />
                        </button>
                      </div>
                    )}

                    {/* Input file ẩn */}
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e)} // Thêm ảnh mới hoặc thay thế ảnh
                      className="hidden"
                      multiple
                    />
                  </div>

                </div>
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
                      options={originCountries.map((country:any) => ({ value: country, label: country }))}
                      onChange={(value:any) => setValue("originCountry", value.value)}
                      value={originCountries.map((country:any) => ({ value: country, label: country }))
                        .find((country:any) => country.value == watch("originCountry"))}
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
                      value={skinTypes.find((type:any) => type.value === watch("skinTypeId"))}
                      onChange={(selected:any) => setValue("skinTypeId", selected?.value)}
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
                      value={brands.find((brand:any) => brand.value === watch("brandId"))}
                      onChange={(selected:any) => setValue("brandId", selected?.value)}
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
                      value={tags.find((tag:any) => tag.value === watch("tagId"))}
                      onChange={(selected:any) => setValue("tagId", selected?.value)}
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
                      value={tagFull.find((tag:any) => tag.tagId == watch("tagId")) &&
                        tagFull.filter((tag:any) => tag.tagId == watch("tagId")).map((tag:any) => {
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
