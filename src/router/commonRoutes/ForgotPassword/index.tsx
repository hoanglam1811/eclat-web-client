import { Button } from "antd";
import { useState } from "react";
import { FaTrophy } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ScreenSpinner from "../../../components/ScreenSpinner";
import RouteNames from "../../../constants/routeNames";
import axios from "axios";
import { BASE_URL } from "../../../constants/api";
import { ArrowLeftOutlined, ShoppingOutlined } from "@ant-design/icons";
import EnterEmailStep from "./enterEmail";
import VerifyOtpStep from "./verifyOtp";
import EnterNewPasswordStep from "./enterNewPassword";
import LoginImage from "../../../assets/Login.png";
import LoginnImage from "../../../assets/Loginn.png";
import { KeyRoundIcon } from "lucide-react";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [LoginImage, LoginnImage];

    const navigate = useNavigate();

    const [formData, setFormData] = useState({});

    const handleNext = (data: any) => {
        setFormData({ ...formData, ...data });
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    return (
        <>
            <div style={{ display: "flex", height: "100vh" }}>
                <Link
                    to={RouteNames.LOGIN}
                    className="absolute top-[20px] left-[20px] bg-white/30 backdrop-blur-md text-black font-semibold px-4 py-2 rounded-lg border border-white/50 hover:bg-white/40"
                >
                    <ArrowLeftOutlined className="mr-2" />
                    Trở về trang đăng nhập
                </Link>
                <div
                    style={{
                        width: "70%",
                        height: "100vh",
                        backgroundImage: `url(${images[currentImageIndex]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transition: "background-image 1s ease-in-out",
                        boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.3)",
                    }}
                ></div>
                <div className="bg-white p-[50px] ">
                    <p className="mt-6 text-4xl font-semibold text-sky-600 flex items-center gap-2 mb-5">
                        <KeyRoundIcon className="text-3xl text-sky-500" />
                        Quên mật khẩu
                    </p>

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
                                    Nhập email
                                </p>
                            </div>
                            <div className="text-center w-32">
                                <p
                                    className={`text-sm font-medium ${step === 2 ? "text-blue-600" : "text-gray-500"
                                        }`}
                                >
                                    {" "}
                                    Xác thực OTP
                                </p>
                            </div>
                            <div className="text-center w-32">
                                <p
                                    className={`text-sm font-medium ${step === 3 ? "text-blue-600" : "text-gray-500"
                                        }`}
                                >
                                    {" "}
                                    Mật khẩu mới
                                </p>
                            </div>
                        </div>
                        {step === 1 && (
                            <>
                                <EnterEmailStep
                                    formData={formData}
                                    setStep={setStep}
                                    onSave={(data) => setFormData(data)}
                                />
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <VerifyOtpStep
                                    formData={formData}
                                    setStep={setStep}
                                    onSave={(data) => setFormData(data)}
                                    onBack={handleBack}
                                />
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <EnterNewPasswordStep
                                    formData={formData}
                                    setStep={setStep}
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

export default ForgotPassword;
