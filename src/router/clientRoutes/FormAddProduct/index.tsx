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

const FormCreateProduct = () => {
    const [step, setStep] = useState(1);
    const [imageFile, setImageFile] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);

  const [skinTypes, setSkinTypes] = useState([]);

  const [brands, setBrands] = useState([]);
  // const [categories, setCategories] = useState([]);
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
    if(!token) {
      navigate("/login");
      return;
    }
    try{
      setLoading(true);
      const [skinTypes, brands , tags] = await Promise.all([
        getAllSkinTypes(token),
        getAllBrands(token),
        //getAllCategories(token),
        getAllTags(token)
      ]);
      if(skinTypes.code == 0)
        setSkinTypes(skinTypes.result.map((skinType: any) => ({
          value: skinType.id, 
          label: skinType.skinName
        })));
      setBrands(brands.map((brand: any) => ({
        value: brand.brandId, 
        label: brand.brandName
      })));
      // setCategories(categories.map((category: any) => ({
      //   value: category.categoryId, 
      //   label: category.categoryName
      // })))
      setTagFull(tags);
      setTags(tags.map((tag: any) => ({
        value: tag.tagId,
        label: tag.tagName
      })))
    } catch (error:any) {
      setError(error.toString());
      console.error("Error fetching skin types", error);
    }
  };


    const handleNext = (data: any) => {
        setFormData({ ...formData, ...data });
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
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

    const handleAddNewProduct = async () => {
        setIsLoading(true);
        try {
            // const imageUrl = await uploadFile(imageFile);
            // if (!imageUrl) {
            //     notification.error({
            //         message: "Error",
            //         description: "Failed to upload image. Please try again.",
            //     });
            //     setIsLoading(false);
            //     return;

            // }
            if(!token) {
              navigate("/login");
              return;
            }

            const response = await addProduct(formData, token)
            console.log("DATA", response);
            setIsLoading(false);

            if (response.status == "ok" || response.status === 201) {
                notification.success({
                    message: "Tạo thành công",
                    description: "Sản phẩm đã được tạo thành công",
                });
                navigate(RouteNames.PRODUCTS_MANAGEMENT);
            }
        } catch (error: any) {
            console.error("Error creating scholarship program", error);
            console.error("Error response:", error.response.data);

            setIsLoading(false);
            notification.error({
                message: "Error",
                description:
                    "Không thể tạo sản phẩm. Vui lòng thử lại",
            });
        }
    };

    useEffect(() => {
      fetchOptions()
    }, [])

    return (
        <>
            <div className="bg-white p-[50px] ">
                <p className="text-4xl font-semibold text-sky-600 flex items-center gap-2">
                    <ShoppingOutlined className="text-4xl text-sky-500" />
                    Tạo sản phẩm mới
                </p>
                <div className="block bg-sky-500 w-[24px] h-[6px] rounded-[8px] mt-[4px] ml-12 mb-5"></div>

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
                                handleUploadFile={handleFileChange}
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
                            />
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <ViewDataCreated formData={formData}
                              skinTypes={skinTypes}
                              brands={brands}
                              tags={tags}
                              tagFull={tagFull}
                            />
                            <div className="flex justify-between">
                                <Button onClick={() => setStep(2)}>Trở về</Button>
                                <Button onClick={handleAddNewProduct}>
                                    Tạo sản phẩm
                                </Button>
                            </div>
                        </>
                    )}
                </form>
                {isLoading && <ScreenSpinner />}
            </div>
        </>
    );
};

export default FormCreateProduct;
