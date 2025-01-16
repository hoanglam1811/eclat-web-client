import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import { Link } from "react-router-dom";
import RouteNames from "../../../constants/routeNames";
import { KeyOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";

const Account = () => {

    const user = {
        name: "Lam Nguyen",
        email: "nguyenhoanglam18112003@gmail.com",
        phone_number: "0902601297"
    };

    return (
        <>
            <section className="bg-gray-100 p-6">
                <div className="bg-gray-100 top-0 left-0 items-start ml-8 z-10 ">
                    <div>
                        <Breadcrumb className="">
                            <BreadcrumbList className="text-[#000]">
                                <BreadcrumbItem>
                                    <Link to="/" className="md:text-xl text-lg">
                                        Trang chủ
                                    </Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <p className="text-[#000] font-medium md:text-xl text-lg">
                                        Hồ sơ khách hàng
                                    </p>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <p className="text-[#000] font-medium md:text-xl text-lg">
                                        Thông tin tài khoản
                                    </p>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            </section>

            {/* <div className="flex items-center justify-center max-w-full bg-gray-100"> */}
            <div className="bg-gray-100">

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-6">
                    {/* Sidebar */}
                    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 col-start-2 col-end-5">
                        <h2 className="text-lg font-bold text-gray-800">Trang Tài Khoản</h2>
                        <h2 className="text-md font-semibold text-gray-800 mb-4">Xin chào,<span className="text-blue-600"> {user.name}!</span></h2>
                        <ul className="space-y-4 mt-10">
                            <li>
                                <Link
                                    to={RouteNames.ACCOUNT}
                                    className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition"
                                >
                                    <UserOutlined className="text-green-600" />
                                    <span>Thông tin tài khoản</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={RouteNames.ACCOUNT_ORDERS}
                                    className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition"
                                >
                                    <ShoppingCartOutlined className="text-green-600" />
                                    <span>Đơn hàng của bạn</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={RouteNames.ACCOUNT_CHANGE_PASSWORD}
                                    className="flex items-center gap-3 text-gray-700 hover:text-teal-600 transition"
                                >
                                    <KeyOutlined className="text-green-600" />
                                    <span>Đổi mật khẩu</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Profile Details */}
                    <section className=" bg-white shadow-md rounded-lg p-6 border border-gray-200 col-start-5 col-end-12">
                        <h2 className="text-lg font-bold text-gray-800 mb-6">Thông Tin Tài Khoản</h2>
                        <div className="space-y-6">
                            {/* Name */}
                            <div className="flex justify-between items-center border-b pb-4">
                                <span className="text-black font-bold">Họ tên:</span>
                                <span className="font-medium text-black">{user.name}</span>
                            </div>

                            {/* Email */}
                            <div className="flex justify-between items-center border-b pb-4">
                                <span className="text-black font-bold">Email:</span>
                                <span className="font-medium text-black">{user.email}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-black font-bold">Số điện thoại:</span>
                                <span className="font-medium text-black">{user.phone_number || "N/a"}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Account;