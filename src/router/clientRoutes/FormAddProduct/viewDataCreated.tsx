import {
  FaAward,
  FaBook,
  FaCalendarAlt,
  FaCertificate,
  FaClipboardList,
  FaCreditCard,
  FaDollarSign,
  FaExclamationCircle,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaRegListAlt,
  FaTag,
  FaUniversity,
  FaUserAlt,
} from "react-icons/fa";
import { format } from "date-fns";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { List, Paper } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../constants/api";
import { Label } from "../../../components/ui/label";
import Select from "react-select";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";
import { originCountries } from "./originCountries";

const ViewDataCreated = ({ formData, skinTypes, brands, tags, tagFull }: { formData: any;
  skinTypes:any; brands:any; tags:any; tagFull:any}) => {
  const user = useSelector((state: any) => state.token.user);
  const isApplicant = user?.role;
  
  useEffect(() => {
    // fetchCategories(formData.scholarshipType);
    // fetchMajors(formData.major);
    // fetchUniversities(formData.university);
    // fetchCertificates(formData.certificate);
  }, []);
  return (
    <>
            <div className="bg-white p-[50px]">
                <div>
                    <form className="bg-gray-50 p-8 rounded-lg shadow-lg max-w-6xl mx-auto space-y-10">
                        {/* Tiêu đề */}
                        <h2 className="text-3xl font-bold text-blue-700 mb-8 border-b-2 pb-4">
                            Thông tin sản phẩm {formData.productName}
                        </h2>

                        <div className="grid grid-cols-4 gap-6">
                            {/* Phần hiển thị ảnh (chiếm 1 cột) */}
                            <div className="col-span-1">
                                <div className="mb-6 relative group">
                                    <label className="block text-sm font-medium text-gray-700 text-left">
                                        Hình ảnh sản phẩm <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative mt-1 h-72 w-full">
                                </div>
                            </div>
                        </div>


                            {/* Phần thông tin sản phẩm (chiếm 3 cột) */}
                            <div className="col-span-3 space-y-8">
                                {/* Thông tin cơ bản */}
                                <div className="grid grid-cols-3 gap-6">
                                    {/* Tên sản phẩm */}
                                    <div className="col-span-2">
                                        <Label htmlFor="" className="block text-sm font-bold text-gray-700 text-left">
                                            Tên sản phẩm <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            defaultValue={formData.productName} // Gán giá trị mặc định từ product
                                            disabled
                                            placeholder="Nhập tên sản phẩm"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="origin_country" className="block text-sm font-bold text-gray-700 text-left">
                                            Nguồn gốc xuất xứ <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={originCountries.map((country:any) => ({ value: country, label: country }))
                                               .find((country:any) => country.value == formData.originCountry)}
                                            isDisabled
                                            isSearchable
                                            placeholder="Chọn nguồn gốc xuất xứ"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Các thông tin khác */}
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-1">
                                        <Label htmlFor="skinTypeId" className="block text-sm font-bold text-gray-700 text-left">
                                            Loại da <span className="text-red-500">*</span>
                                        </Label>
                                            <>
                                                <Select
                                                    value={skinTypes.find((type:any) => type.value === formData.skinTypeId)}
                                                    isSearchable
                                                    isDisabled
                                                    placeholder="Chọn loại da"
                                                    className="mt-1"
                                                />
                                            </>
                                    </div>

                                    <div className="col-span-1">
                                        <Label htmlFor="brandId" className="block text-sm font-bold text-gray-700 text-left">
                                            Thương hiệu <span className="text-red-500">*</span>
                                        </Label>
                                        <>
                                                <Select
                                                    value={brands.find((type:any) => type.value === formData.brandId)}
                                                    isSearchable
                                                    isDisabled
                                                    placeholder="Chọn thương hiệu"
                                                    className="mt-1"
                                                />
                                            </>
                                    </div>

                                    <div className="col-span-1">
                                        <Label htmlFor="productType" className="block text-sm font-bold text-gray-700 text-left">
                                            Loại sản phẩm <span className="text-red-500">*</span>
                                        </Label>
                                            <>
                                                <Select
                                                    value={tags.find((type:any) => type.value === formData.tagId)}
                                                    isSearchable
                                                    isDisabled
                                                    placeholder="Chọn loại sản phẩm"
                                                    className="mt-1"
                                                />
                                            </>
                                    </div>
                                </div>

                                {/* Mô tả sản phẩm */}
                                <div className="mt-6">
                                    <Label htmlFor="description" className="block text-sm font-bold text-gray-700 text-left">
                                        Mô tả sản phẩm <span className="text-red-500">*</span>
                                    </Label>
                                        <>
                                            <Textarea
                                                defaultValue={formData.description}
                                                rows={4}
                                                disabled
                                                placeholder="Nhập mô tả sản phẩm"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </>
                                </div>

                                <div className="mt-6">
                                    <Label htmlFor="usageInstructions" className="block text-sm font-bold text-gray-700 text-left">
                                        Hướng dẫn sử dụng <span className="text-red-500">*</span>
                                    </Label>
                                        <>
                                            <Textarea
                                                defaultValue={formData.usageInstruct} // Gán giá trị mặc định
                                                rows={4}
                                                disabled
                                                placeholder="Nhập hướng dẫn sử dụng"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </>
                                </div>

                                <div className="mt-6">
                                    <Label htmlFor="quantity" className="block text-sm font-bold text-gray-700 text-left">
                                        Tên tuỳ chọn <span className="text-red-500">*</span>
                                    </Label>
                                        <Input
                                            defaultValue={formData?.attribute || "N/A"}
                                            disabled
                                            placeholder="Ví dụ: Phân loại, Size,.."
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                </div>

                                <div className="mt-6">
                                    <Label htmlFor="quantity" className="block text-sm font-bold text-gray-700 text-left">
                                        Chi tiết tuỳ chọn <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="space-y-4">
                                        {formData.options.map((_option: any, index: any) => (
                                            <div
                                                key={index}
                                                className="relative p-4 border rounded-md bg-white shadow-sm"
                                            >
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="col-span-2">
                                                        <Input
                                                            defaultValue={_option.optionValue || "N/A"}
                                                            disabled
                                                            placeholder="Ví dụ: Da dầu, Da khô, 216ml, 348ml.."
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <Input
                                                            type="number"
                                                            disabled
                                                            defaultValue={_option.quantity || "N/A"}
                                                            placeholder="Nhập số lượng"
                                                            className="w-full"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4 mt-3">
                                                    <Input
                                                        defaultValue={_option.optionPrice|| "N/A"}
                                                        placeholder="Nhập giá gốc"
                                                        disabled
                                                        className="w-full"
                                                    />
                                                    <Input
                                                        defaultValue={_option.discPrice || "N/A"}
                                                        placeholder="Nhập giá khuyến mãi"
                                                        disabled
                                                        className="w-full"
                                                    />
                                                    <img src={_option.imageUrl} className="w-12 h-12 rounded-md" alt="" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            
                        </div>

                    </form>
                </div>
            </div>
        </>
  );
};

export default ViewDataCreated;
