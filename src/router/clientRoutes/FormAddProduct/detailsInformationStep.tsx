import Select, { MultiValue } from "react-select";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaPlus, FaTrash } from "react-icons/fa";
import { BASE_URL } from "../../../constants/api";
import { Label } from "../../../components/ui/label";
import { Button } from "antd";
import { Input } from "../../../components/ui/input";
import { DeleteOutlined } from "@ant-design/icons";

interface OptionType {
  value: string;
  label: string;
}

const schema = z.object({
  attribute: z.string().min(1, "Thuộc tính này là bắt buộc"),
  options: z
    .array(
      z.object({
        optionValue: z.string().min(1, "Tên tùy chọn là bắt buộc"),
        quantity: z.preprocess((value) => (!value ? 0 : value),
          z.number().min(1, "Số lượng là bắt buộc")),
        optionPrice: z.preprocess((value) => (!value ? 0 : value),
          z.number().min(1, "Giá gốc là bắt buộc")),
        discPrice: z.preprocess((value) => (!value ? 0 : value),
          z.number().min(1, "Giá khuyến mãi là bắt buộc")),
      })
    )
    .min(1, "Please add at least one option")
});

const DetailsInformationStep = ({
  formData,
  onSave,
  onBack,
  handleUploadFile,
  images,
  setImages,
  imageFiles,
  setImageFiles
}: {
  formData: any;
  onSave: (data: any) => void;
  onBack: (data: any) => void;
  handleUploadFile: any;
  images: any;
  setImages: any;
  imageFiles: any;
  setImageFiles: any
}) => {

  const documentOptions = [
    { id: 1, type: "Resume/CV" },
    { id: 2, type: "Reference Letter/Letter of Recommendation" },
    { id: 3, type: "Academic Transcript" },
    { id: 4, type: "Personal Statement" },
    { id: 5, type: "Portfolio" },
    { id: 6, type: "Medical Report" },
    { id: 7, type: "Financial Information" },
    { id: 8, type: "Scholarship Application" },
  ];

  const fetchData = async (
    endpoint: string,
    setData: (data: OptionType[]) => void
  ) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/${endpoint}`);
      const options = response.data.data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      setData(options);
    } catch (error) {
      console.error(`Error fetching ${endpoint}`, error);
    }
  };

  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    getValues,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      ...formData,
      // university: formData.university || "",
      // certificate: formData.certificate || [],
      // major: formData.major || "",
      // documents: formData.documents || [],
      // criteria: formData.criteria || [{ name: "", description: "", percentage: "" }],
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
            // console.log("newFiles", newFiles);
            // console.log("newPreviews", newPreviews);
            console.log("images", images);

            if (index !== undefined) {
                setImages((prev:any) => {
                    const updatedImages = [...prev];
                    updatedImages[index] = newPreviews[0];
                    return updatedImages;
                });
                setImageFiles((prev:any) => {
                    const updatedFiles = [...prev];
                    updatedFiles[index] = newFiles[0];
                    return updatedFiles;
                });
            } else {
                setImageFiles((prev:any) => [...prev, ...newFiles]);
                setImages((prev:any) => [...prev, ...newPreviews]);
            }
        }
    };

  const handleNext = async () => {
    const isValid = await trigger();
    console.log("values", getValues());
    if (!isValid) {
      console.error("Validation failed", errors);
      return;
    }

    const data = getValues();
    if (data) {

      // const selectedDocuments = [...documentOptions].filter((doc) => (watch("documents") || []).includes(doc.id)).map((doc) => { return { type: doc.type, isRequired: true } })
      // data.documents = selectedDocuments
      console.log("beforeSave", data);

      onSave(data);
    }
  };

  const [totalQuantity, setTotalQuantity] = useState(0);

  const updateTotalQuantity = () => {
    const quantities = watch("options")?.map((item: any) => item.quantity || 0) || [];
    setTotalQuantity(quantities.reduce((sum: any, val: any) => sum + val, 0));
  };

  const handleSelectChange = (
    selectedOption: OptionType | null,
    fieldName: "university" | "major"
  ) => {
    setValue(fieldName, selectedOption ? selectedOption.value : "");
  };

  const handleMultiSelectChange = (
    selectedOptions: MultiValue<OptionType>,
    fieldName: "certificate"
  ) => {
    const values = selectedOptions.map((option) => option.value);
    setValue(fieldName, values || [], { shouldValidate: true });
  };

  const handleCheckboxChange = (id: number) => {
    const currentDocuments: number[] = watch("documents") || [];
    console.log("Before update:", currentDocuments);

    const validDocuments = currentDocuments.filter((doc) => typeof doc === "number");
    console.log("Valid documents:", validDocuments);

    const updatedDocuments = validDocuments.includes(id)
      ? validDocuments.filter((doc) => doc !== id)
      : [...validDocuments, id];



    console.log("After update:", updatedDocuments);
    setValue("documents", updatedDocuments, { shouldValidate: true });
  };

  useEffect(() => {
    if (formData) {
      // setValue("university", formData.university || "");
      // setValue("certificate", formData.certificate || []);
      // setValue("major", formData.major || "");
      // setValue("documents", formData.documents || []);
      // setValue(
      //   "criteria",
      //   formData.criteria || [{ name: "", description: "", percentage: "" }]
      // );
    }
  }, [formData, setValue]);
  return (
    <>
      <div>
        <div>
          <form className="bg-gray-50 p-8 rounded-lg shadow-md max-w-5xl mx-auto space-y-10">
            <h2 className="text-3xl font-bold text-blue-700 mb-8 border-b-2 pb-4">
              Thông tin chi tiết
            </h2>
            {/* Eligibility Criteria */}
            <Label htmlFor="quantity" className="block text-sm font-medium text-gray-700 text-left">
              Nhập tên cho tuỳ chọn <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("attribute")}
              placeholder="Ví dụ: Phân loại, Size,.."
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.attribute?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.attribute.message)}</p>
            )}
            <Label htmlFor="quantity" className="block text-sm font-medium text-gray-700 text-left">
              Thêm chi tiết tuỳ chọn <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-4">
              {watch("options")?.map((_criteria: any, index: any) => (
                <div
                  key={index}
                  className="relative p-4 border rounded-md bg-white shadow-sm"
                >
                  {watch("options").length > 1 && (
                    <Button
                      onClick={() => {
                        setValue(
                          "options",
                          watch("options").filter((_: any, i: any) => i !== index),
                          { shouldValidate: true }
                        )
                        setImageFiles((prevFiles:any) => prevFiles.filter((_: any, i: any) => i !== index))
                        setImages((prevFiles:any) => prevFiles.filter((_: any, i: any) => i !== index))
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow"
                    >
                      <DeleteOutlined className="w-4 h-4" />
                    </Button>
                  )}
                  {/* Dòng đầu tiên */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="brandId" className="block text-sm font-bold text-blue-500 text-left mb-1">
                          Ví dụ: Da dầu, Da khô, 216ml, 348ml.. <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register(`options.${index}.optionValue`)}
                        placeholder="Ví dụ: Da dầu, Da khô, 216ml, 348ml.."
                        className="w-full"
                      />
                      {
                        (errors.options as any) && (errors.options as any)[index]?.optionValue?.message && (
                          <p className="text-sm text-red-500 mt-1">
                            {String((errors.options as any)[index].optionValue?.message)}
                          </p>
                        )}
                    </div>
                    <div className="col-span-1">
                      <Label htmlFor="brandId" className="block text-sm font-bold text-blue-500 text-left mb-1">
                          Số lượng <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        {...register(`options.${index}.quantity`, {
                          valueAsNumber: true,
                          onChange: () => updateTotalQuantity(),
                        })}
                        placeholder="Nhập số lượng"
                        className="w-full"
                      />
                      {
                        (errors.options as any) && (errors.options as any)[index]?.quantity?.message && (
                          <p className="text-sm text-red-500 mt-1">
                            {String((errors.options as any)[index].quantity?.message)}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Dòng thứ hai */}
                  <div className="grid grid-cols-3 gap-4 mt-3">

                    <div className="col-span-1">
                      <Label htmlFor="brandId" className="block text-sm font-bold text-blue-500 text-left mb-1">
                        Giá gốc <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register(`options.${index}.optionPrice`, {
                          valueAsNumber: true,
                        })}
                        placeholder="Nhập giá gốc"
                        type="number"
                        className="w-full"
                      />
                      {
                        (errors.options as any) && (errors.options as any)[index]?.optionPrice?.message && (
                          <p className="text-sm text-red-500 mt-1">
                            {String((errors.options as any)[index].optionPrice?.message)}
                          </p>
                        )}
                    </div>
                    <div className="col-span-1">
                      <Label htmlFor="brandId" className="block text-sm font-bold text-blue-500 text-left mb-1">
                        Giá khuyến mãi <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register(`options.${index}.discPrice`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        placeholder="Nhập giá khuyến mãi"
                        className="w-full"
                      />
                      {
                        (errors.options as any) && (errors.options as any)[index]?.discPrice?.message && (
                          <p className="text-sm text-red-500 mt-1">
                            {String((errors.options as any)[index].discPrice?.message)}
                          </p>
                        )}
                    </div>
                    <div className="col-span-1">
                      <Label htmlFor="brandId" className="block text-sm font-bold text-blue-500 text-left mb-1">
                          Hình ảnh <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="file"
                        // value={watch(`options.${index}.imgUrl`)}
                        accept="image/*"
                        //{...register("imgUrl")}
                        // onChange={(e: any) => setValue(`options.${index}.imgUrl`, e.target.value)}
                        onChange={(e) => handleFileChange(e, index)}
                        placeholder="Upload hình ảnh"
                        className="p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                    <div className="mt-3 flex justify-center col-span-3">
                        {images[index] && (
                            <div className="mt-4">
                                <Label className="text-left">Xem trước</Label>
                                <img
                                    src={images[index]}
                                    alt="Logo Preview"
                                    className="w-full h-40 object-cover border rounded-md mt-2"
                                />
                            </div>
                        )}
                    </div>
                    {/*<Input
                      type="file"
                      id="imageUrl"
                      onChange={handleUploadFile}
                      accept="image/*"
                      className="w-full"
                    />*/}
                  </div>
                </div>
              ))}
              {errors.options && errors.options.root && <p className="text-red-500 text-sm">{String(errors.options.root.message)}</p>}
              <Button
                onClick={() =>
                  setValue("options", [...watch("options"), { optionValue: "", quantity: "", optionPrice: "", discPrice: "" }])
                }
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition flex items-center space-x-2"
              >
                <FaPlus />
                <span>Thêm mới</span>
              </Button>
            </div>
            {/* {JSON.stringify(getValues())} */}

            <div className="mt-6 flex items-center justify-between bg-gray-100 border border-gray-300 rounded-md p-4 shadow">
              <h3 className="text-sm font-medium text-gray-700">
                Tổng số lượng:
              </h3>
              <span className="text-xl font-bold text-gray-600">
                {totalQuantity}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-8">
              <Button onClick={onBack} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                Về trước
              </Button>
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

export default DetailsInformationStep;
