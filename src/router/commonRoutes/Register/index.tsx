import React, { useState, useEffect } from 'react';
import LoginImage from "../../../assets/Login.png";
import LoginnImage from "../../../assets/Loginn.png";
import { Link } from 'react-router-dom';
import { register } from '../../../services/ApiServices/authenticationService';
import RegisterType from './data';
import EmailVerify from './emailVerify';
import { Button } from 'antd';
import RouteNames from '../../../constants/routeNames';
import { ArrowLeftOutlined } from '@ant-design/icons';

const Register = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [registerData, setRegisterData] = useState<RegisterType>(
      { username: "", email: "", password: "", phoneNum: "" }
    );
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailVerify, setIsEmailVerify] = useState(false);
    const [error, setError] = useState("");
    const images = [LoginImage, LoginnImage];

    const handleRegisterSubmit = async () => {
        setIsLoading(true);
        setError("");
        try {
            const user = await register(
              registerData.username,
              registerData.email, 
              registerData.password, 
              registerData.phoneNum
            );
            setIsLoading(false);
            if(user.code == 0){
              setIsEmailVerify(true);
            }
        } catch (error: any) {
            setIsLoading(false);
            if (error.response?.data?.message) {
                if (error.response.data.message === "User Existed") {
                    setError("Email không tồn tại!");
                } else if (error.response.data.message === "Invalid key") {
                    setError("Mật khẩu phải dài hơn 8 ký tự!");
                } else {
                    setError("Có lỗi xảy ra. Vui lòng thử lại sau!");
                }
            } else {
                setError("Lỗi kết nối! Hãy kiểm tra lại đường truyền.");
            }
        }
    };



    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <Link
              to={RouteNames.HOME}
              className="absolute top-[20px] left-[20px] bg-white/30 backdrop-blur-md text-black font-semibold px-4 py-2 rounded-lg border border-white/50 hover:bg-white/40"
            >
              <ArrowLeftOutlined className="mr-2" />
              Trở về trang chủ
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

            <div
                style={{
                    minWidth: "500px",
                    width: "30%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f9f9f9",
                    padding: "20px",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "380px",
                        borderRadius: "12px",
                        padding: "40px",
                        textAlign: "center",
                        position: "relative",
                        animation: "fadeIn 1s ease-in-out",
                    }}
                >
                    <h2 className='font-bold' style={{ fontFamily: "Montserrat, sans-serif", color: "#578a3f", marginBottom: "30px" }}>
                        ĐĂNG KÍ VỚI ÉCLAT 
                    </h2>

                    {!isEmailVerify && <><input
                        type="text"
                        placeholder="Nhập tên người dùng"
                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        style={{
                            width: "80%",
                            padding: "12px 20px",
                            marginBottom: "20px",
                            borderRadius: "10px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                            transition: "all 0.3s",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#578a3f")}
                        onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                    />

                    <input
                        type="email"
                        placeholder="Nhập email"
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        style={{
                            width: "80%",
                            padding: "12px 20px",
                            marginBottom: "20px",
                            borderRadius: "10px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                            transition: "all 0.3s",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#578a3f")}
                        onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                    />

                    <input
                        type="text"
                        placeholder="Nhập số điện thoại"
                        onChange={(e) => setRegisterData({ ...registerData, phoneNum: e.target.value })}
                        style={{
                            width: "80%",
                            padding: "12px 20px",
                            marginBottom: "20px",
                            borderRadius: "10px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                            transition: "all 0.3s",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#578a3f")}
                        onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                    />

                    <input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        style={{
                            width: "80%",
                            padding: "12px 20px",
                            marginBottom: "20px",
                            borderRadius: "10px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                            transition: "all 0.3s",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#578a3f")}
                        onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                    />
                    <div className="text-red-500">{error}</div>

                    <button
                        style={{
                            width: "60%",
                            padding: "12px 20px",
                            backgroundColor: "#578a3f",
                            color: "#fff",
                            borderRadius: "10px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: "600",
                            transition: "background-color 0.3s ease",
                            marginBottom: "15px",
                        }}
                        onClick={handleRegisterSubmit}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#21618c")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#578a3f")}
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>
          </>
        }

                    {isEmailVerify && <EmailVerify email={registerData.email}/>}
                    <p className='font-bold' style={{ fontFamily: "Montserrat, sans-serif", fontSize: "14px", color: "#555" }}>
                        Bạn đã có tài khoản?{" "}
                        <Link
                            to="/login"
                            style={{ color: "#578a3f", textDecoration: "none" }}
                        >
                            Đăng nhập
                        </Link>
                    </p>
          

                    <div
                        style={{
                            position: "absolute",
                            top: "15px",
                            left: "15px",
                            width: "50px",
                            height: "50px",
                            backgroundColor: "#f39c12",
                            borderRadius: "50%",
                            opacity: 0.2,
                        }}
                    ></div>
                    <div
                        style={{
                            position: "absolute",
                            bottom: "15px",
                            right: "15px",
                            width: "50px",
                            height: "50px",
                            backgroundColor: "#3498db",
                            borderRadius: "50%",
                            opacity: 0.2,
                        }}
                    ></div>
        
                </div>
            </div>
        </div>
    );
};


export default Register;
