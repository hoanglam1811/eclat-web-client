import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import { Link } from "react-router-dom";
import RouteNames from "../../../constants/routeNames";
import { KeyOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";

const Account = () => {

    const user = {
        name: "Lam Nguyen",
        email: "nguyenhoanglam18112003@gmail.com",
        addresses: "430 Điện Biên Phủ",
    };

    return (
        <>
            <section>
                <div className="top-0 left-0 items-start ml-8 z-10">
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
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl ml-50 p-8 rounded-lg mb-12">
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Trang Tài Khoản</h2>
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
                    <section className="col-span-2 bg-white shadow-md rounded-lg p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6">Thông Tin Tài Khoản</h2>
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

                            {/* Address Count */}
                            <div className="flex justify-between items-center">
                                <span className="text-black font-bold">Số địa chỉ:</span>
                                <span className="font-medium text-black">{user.addresses || "N/a"}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Account;