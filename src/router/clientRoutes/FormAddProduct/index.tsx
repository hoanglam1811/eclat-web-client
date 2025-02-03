import { Button, notification } from "antd";
import { useState } from "react";
import { FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ScreenSpinner from "../../../components/ScreenSpinner";
import RouteNames from "../../../constants/routeNames";
import axios from "axios";
import { BASE_URL } from "../../../constants/api";
import { uploadFile } from "../../../services/ApiServices/fileUploadService";
import InformationStep from "./informationStep";
import UcmStep from "./ucmStep";
import ViewDataCreated from "./viewDataCreated";
import { ShoppingOutlined } from "@ant-design/icons";

const FormCreateProduct = () => {
    const [step, setStep] = useState(1);
    const [imageFile, setImageFile] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        scholarshipType: "",
        educationalLevel: "",
        scholarshipName: "",
        description: "",
        value: "",
        quantity: "",
        awardProgress: "",
        imageUrl: "",
        deadline: "",
        status: "Draft",
        university: "",
        certificate: [],
        major: "",
        documents: [
            {
                type: "",
                isRequired: true,
            },
        ],
    });

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

    const handleAddNewScholarshipProgram = async () => {
        setIsLoading(true);
        try {
            const imageUrl = await uploadFile(imageFile);
            if (!imageUrl) {
                notification.error({
                    message: "Error",
                    description: "Failed to upload image. Please try again.",
                });
                setIsLoading(false);
                return;
            }

            const postData = {
            };
            console.log("Post Data:", postData);
            const response = await axios.post(
                `${BASE_URL}/api/product`,
                postData
            );

            console.log("DATA", response.data);
            setIsLoading(false);

            if (response.status === 200 || response.status === 201) {
                notification.success({
                    message: "Scholarship Program Created",
                    description: "The program was successfully created.",
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
                    "Failed to create the scholarship program. Please try again.",
            });
        }
    };

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
                            <ViewDataCreated formData={formData} />
                            <div className="flex justify-between">
                                <Button onClick={() => setStep(4)}>Trở về</Button>
                                <Button onClick={handleAddNewScholarshipProgram}>
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
