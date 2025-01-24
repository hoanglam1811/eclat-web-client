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
import { Textarea } from "../../../components/ui/textarea";
import { DeleteOutlined } from "@ant-design/icons";

interface OptionType {
  value: string;
  label: string;
}

const schema = z.object({
  university: z.string().min(1, "Please choose a university"),
  certificate: z
    .array(z.string())
    .min(1, "Please choose at least one certificate"),
  major: z.string().min(1, "Please choose a major"),
  documents: z.array(z.number().or(z.object({}))).min(1, "At least one document is required"),
  criteria: z
    .array(
      z.object({
        name: z.string().min(1, "Criteria name is required"),
        description: z.string().min(1, "Criteria description is required"),
        percentage: z.string().min(1, "Percentage of score is required"),
      })
    )
    .min(1, "Please add at least one criteria")
    .refine(
      (data) =>
        data.every((criterion) => criterion.name && criterion.description),
      {
        message: "Each criteria must have both name and description",
      }
    )
    .refine(
      (data: any) =>
        data && data.reduce((sum: any, criterion: any) => sum + Number(criterion.percentage), 0) == 100,
      {
        message: "The total percentage of all criteria must equal 100",
      }
    ),
});

const UcmStep = ({
  formData,
  onSave,
  onBack,
  handleUploadFile,
}: {
  formData: any;
  onSave: (data: any) => void;
  onBack: (data: any) => void;
  handleUploadFile: any;
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
    resolver: zodResolver(schema),
    defaultValues: {
      ...formData,
      university: formData.university || "",
      certificate: formData.certificate || [],
      major: formData.major || "",
      documents: formData.documents || [],
      criteria: formData.criteria || [{ name: "", description: "", percentage: "" }],
    },
  });

  const handleNext = async () => {
    const isValid = await trigger();
    if (!isValid) {
      console.error("Validation failed", errors);
      return;
    }


    const data = getValues();
    if (data) {

      const selectedDocuments = [...documentOptions].filter((doc) => (watch("documents") || []).includes(doc.id)).map((doc) => { return { type: doc.type, isRequired: true } })
      data.documents = selectedDocuments
      console.log("beforeSave", data);

      onSave(data);
    }
  };

  const [totalQuantity, setTotalQuantity] = useState(0);

  const updateTotalQuantity = () => {
    const quantities = watch("criteria")?.map((item: any) => item.quantity || 0) || [];
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
      setValue("university", formData.university || "");
      setValue("certificate", formData.certificate || []);
      setValue("major", formData.major || "");
      setValue("documents", formData.documents || []);
      setValue(
        "criteria",
        formData.criteria || [{ name: "", description: "", percentage: "" }]
      );
    }
  }, [formData, setValue]);
  return (
    <>
      <div>
        <div>
          <form className="bg-gray-50 p-8 rounded-lg shadow-lg max-w-5xl mx-auto space-y-10">
            <h2 className="text-3xl font-bold text-blue-700 mb-8 border-b-2 pb-4">
              Thông tin chi tiết
            </h2>
            {/* Eligibility Criteria */}
            <Label htmlFor="quantity" className="block text-sm font-medium text-gray-700 text-left">
              Nhập tên cho tuỳ chọn <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("quantity")}
              placeholder="Ví dụ: Phân loại, Size,.."
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.quantity?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.quantity.message)}</p>
            )}
            <Label htmlFor="quantity" className="block text-sm font-medium text-gray-700 text-left">
              Thêm chi tiết tuỳ chọn <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-4">
              {watch("criteria")?.map((_criteria: any, index: any) => (
                <div
                  key={index}
                  className="relative p-4 border rounded-md bg-white shadow-sm"
                >
                  {watch("criteria").length > 1 && (
                    <Button
                      onClick={() =>
                        setValue(
                          "criteria",
                          watch("criteria").filter((_: any, i: any) => i !== index),
                          { shouldValidate: true }
                        )
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow"
                    >
                      <DeleteOutlined className="w-4 h-4" />
                    </Button>
                  )}
                  {/* Dòng đầu tiên */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Input
                        {...register(`criteria.${index}.name`)}
                        placeholder="Ví dụ: Da dầu, Da khô, 216ml, 348ml.."
                        className="w-full"
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        {...register(`criteria.${index}.quantity`, {
                          valueAsNumber: true,
                          onChange: () => updateTotalQuantity(),
                        })}
                        placeholder="Nhập số lượng"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Dòng thứ hai */}
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <Input
                      {...register(`criteria.${index}.description`)}
                      placeholder="Nhập giá gốc"
                      className="w-full"
                    />
                    <Input
                      {...register(`criteria.${index}.description`)}
                      placeholder="Nhập giá khuyến mãi"
                      className="w-full"
                    />
                    <Input
                      type="file"
                      id="imageUrl"
                      onChange={handleUploadFile}
                      accept="image/*"
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
              {errors.criteria && errors.criteria.root && <p className="text-red-500 text-sm">{String(errors.criteria.root.message)}</p>}
              <Button
                onClick={() =>
                  setValue("criteria", [...watch("criteria"), { name: "", description: "", percentage: "" }])
                }
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition flex items-center space-x-2"
              >
                <FaPlus />
                <span>Thêm mới</span>
              </Button>
            </div>

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

export default UcmStep;
