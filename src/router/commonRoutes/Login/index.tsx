import React, { useState, useEffect } from 'react';
import LoginImage from "../../../assets/Login.png";
import LoginnImage from "../../../assets/Loginn.png";
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../services/ApiServices/authenticationService';
import { notification } from 'antd';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../../reducers/tokenSlice';
import parseJwt from '../../../services/parseJwt';
import RouteNames from '../../../constants/routeNames';
import { ArrowLeftOutlined } from '@ant-design/icons';

const Login = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [LoginImage, LoginnImage];
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleLoginSubmit = async () => {
        setIsLoading(true);
        setError("");
        try {
            const user = await login(username, password);
            setIsLoading(false);
            dispatch(setToken(user.result.token));
            const userInfo = parseJwt(user.result.token);
            dispatch(setUser(userInfo));
            notification.success({ message: "Đăng nhập thành công!" });

            if (user.role === "ADMIN") {
                navigate("/admin");
            } if (user.role === "STAFF") {
                navigate("/staff/products-management")
            }
            else {
                navigate("/");
            }

        } catch (error: any) {
            setIsLoading(false);
            if (error.response?.data?.message) {
                if (error.response.data.message === "Email not found") {
                    notification.error({ message: "Email không tồn tại!" });
                } else if (error.response.data.message === "Wrong password") {
                    notification.error({ message: "Sai mật khẩu!" });
                } else if (error.response.data.message === "User Not Existed") {
                    notification.error({ message: "Người dùng không tồn tại!" });
                } else {
                    notification.error({ message: "Có lỗi xảy ra. Vui lòng thử lại sau!" });
                }
            } else {
                setError("Lỗi kết nối! Hãy kiểm tra lại đường truyền.");
            }
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
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
                    width: "30%",
                    minWidth: "500px",
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
                        CHÀO MỪNG ĐẾN VỚI ÉCLAT
                    </h2>

                    <input
                        type="email"
                        placeholder="Nhập tên người dùng"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                            fontFamily: "Raleway, sans-serif",
                            fontWeight: "600",
                            transition: "background-color 0.3s ease",
                            marginBottom: "15px",
                        }}
                        onClick={handleLoginSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>

                    <p className='font-bold' style={{ fontFamily: "Montserrat, sans-serif", fontSize: "14px", color: "#555" }}>
                        Bạn chưa có tài khoản?{" "}
                        <Link
                            to="/register"
                            style={{
                                color: "#578a3f",
                                textDecoration: "none",
                                transition: "color 0.3s ease",
                            }}
                            onMouseOver={(e: any) => (e.target.style.color = "#21618c")}
                            onMouseOut={(e: any) => (e.target.style.color = "#578a3f")}
                        >
                            Đăng ký ngay
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

export default Login;
