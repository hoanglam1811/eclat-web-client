import { Button, notification } from "antd";
import { useEffect, useState } from "react";
import { FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ScreenSpinner from "../../../components/ScreenSpinner";
import RouteNames from "../../../constants/routeNames";
import axios from "axios";
import { BASE_URL } from "../../../constants/api";
import { uploadFile } from "../../../services/ApiServices/fileUploadService";
import InformationStep from "./generalInformationStep";
import UcmStep from "./detailsInformationStep";
import ViewDataCreated from "./viewDataCreated";
import { ShoppingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { getAllBrands } from "../../../services/ApiServices/brandService";
import { getAllSkinTypes } from "../../../services/ApiServices/skinTypeService";
import { getAllTags } from "../../../services/ApiServices/tagService";
import { addProduct } from "../../../services/ApiServices/productService";
import { getAllCategories } from "../../../services/ApiServices/categoryService";

const FormCreateProduct = () => {
    const [step, setStep] = useState(1);
    const [imageFile, setImageFile] = useState<File[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const [optionImageFiles, setOptionImageFiles] = useState<File[]>([]);
    const [optionImages, setOptionImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [skinTypes, setSkinTypes] = useState([]);

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagFull, setTagFull] = useState<any>([]);

    const token = useSelector((state: RootState) => state.token.token);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        "productName": "",
        "description": "",
        "usageInstruct": "",
        "originCountry": "",
        "attribute": "",
        "tagId": 0,
        "brandId": 0,
        "skinTypeId": 0,
        "options": [
            {
                // "productId": 0,
                "optionValue": "",
                "quantity": "",
                "optionPrice": "",
                "discPrice": ""
            }
        ]
    });

    const fetchOptions = async () => {
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            setLoading(true);
            const [skinTypes, brands, categories, tags] = await Promise.all([
                getAllSkinTypes(),
                getAllBrands(),
                getAllCategories(token),
                getAllTags(token)
            ]);
            if (skinTypes.code == 0)
                setSkinTypes(skinTypes.result.map((skinType: any) => ({
                    value: skinType.id,
                    label: skinType.skinName
                })));
            setBrands(brands.map((brand: any) => ({
                value: brand.brandId,
                label: brand.brandName
            })));
            setCategories(categories.map((category: any) => ({
              value: category.categoryId, 
              label: category.categoryName
            })))
            setTagFull(tags);
            setTags(tags.map((tag: any) => ({
                value: tag.tagId,
                label: tag.tagName
            })))
        } catch (error: any) {
            setError(error.toString());
            console.error("Error fetching skin types", error);
        }
    };

    const handleNext = (data: any) => {
        setFormData({ ...formData, ...data });
        setStep(step + 1);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setStep(step - 1);
        window.scrollTo(0, 0);
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            if (!file.type.startsWith("image/")) {
                notification.error({
                    message: "Invalid File",
                    description: "Please upload an image file.",
                });
                return;
            }
            setImageFile([file]);
        }
    };

    useEffect(() => {
        fetchOptions()
    }, [])

    return (
        <>
            <div className="relative bg-gradient-to-br from-sky-100 to-white min-h-screen flex justify-center items-center px-4">
                {/* Các họa tiết trang trí */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 opacity-20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-16 right-10 w-24 h-24 bg-teal-300 opacity-20 rounded-full blur-2xl"></div>
                <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-pink-300 opacity-30 rounded-full blur-xl"></div>

                {/* Card chính */}
                <div className="bg-white p-12 rounded-2xl shadow-xl w-full max-w-6xl relative z-10 mt-10 mb-10">
                    <p className="text-4xl font-bold text-sky-600 flex items-center gap-3">
                        <ShoppingOutlined className="text-5xl text-sky-400" />
                        Tạo sản phẩm mới
                    </p>
                    <div className="bg-gradient-to-r from-sky-400 to-teal-300 w-28 h-1 rounded-full mt-2 ml-14 mb-6"></div>
                    <form className="space-y-6 ">
                        <div className="flex items-center justify-center">
                            <div
                                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${step === 1 ? "bg-blue-600" : "bg-gray-300"
                                    }`}
                            >
                                1
                            </div>
                            <div className="h-1 w-20 bg-gray-300 mx-2"></div>
                            <div
                                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${step === 2 ? "bg-blue-600" : "bg-gray-300"
                                    }`}
                            >
                                2
                            </div>
                            <div className="h-1 w-20 bg-gray-300 mx-2"></div>
                            <div
                                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${step === 3 ? "bg-blue-600" : "bg-gray-300"
                                    }`}
                            >
                                3
                            </div>
                        </div>
                        <div className="flex justify-center gap-5">
                            <div className="text-center w-30">
                                <p
                                    className={`text-sm font-medium ${step === 1 ? "text-blue-600" : "text-gray-500"
                                        }`}
                                >
                                    Thông tin chung
                                </p>
                            </div>
                            <div className="text-center w-32">
                                <p
                                    className={`text-sm font-medium ${step === 2 ? "text-blue-600" : "text-gray-500"
                                        }`}
                                >
                                    {" "}
                                    Thông tin chi tiết
                                </p>
                            </div>
                            <div className="text-center w-32">
                                <p
                                    className={`text-sm font-medium ${step === 3 ? "text-blue-600" : "text-gray-500"
                                        }`}
                                >
                                    {" "}
                                    Xem trước
                                </p>
                            </div>
                        </div>

                        {step === 1 && (
                            <>
                                <InformationStep
                                    formData={formData}
                                    onSave={handleNext}
                                    imageFiles={imageFiles}
                                    setImageFiles={setImageFiles}
                                    // handleUploadFile={handleFileChange}
                                    categories={categories}
                                    skinTypes={skinTypes}
                                    brands={brands}
                                    tags={tags}
                                    tagFull={tagFull}
                                />
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <UcmStep
                                    formData={formData}
                                    onSave={handleNext}
                                    onBack={handleBack}
                                    handleUploadFile={handleFileChange}
                                    imageFiles={optionImageFiles}
                                    setImageFiles={setOptionImageFiles}
                                    images={optionImages}
                                    setImages={setOptionImages}
                                  />
                              </>
                        )}

                        {step === 3 && (
                            <>
                                <ViewDataCreated
                                    formData={formData}
                                    onBack={handleBack}
                                    imageFiles={imageFiles}
                                    skinTypes={skinTypes}
                                    brands={brands}
                                    tags={tags}
                                    tagFull={tagFull}
                                    optionImages={optionImages}
                                    optionImageFiles={optionImageFiles}
                                />
                            </>
                        )}
                    </form>
                    {isLoading && <ScreenSpinner />}
                </div>
            </div>
        </>
    );
};

export default FormCreateProduct;
