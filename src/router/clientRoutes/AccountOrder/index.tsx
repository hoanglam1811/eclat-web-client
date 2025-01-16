import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import { Link } from "react-router-dom";
import RouteNames from "../../../constants/routeNames";
import { KeyOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Table, Tag } from "antd";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";

const AccountOrder = () => {
    const user = {
        name: "Lam Nguyen",
        email: "nguyenhoanglam18112003@gmail.com",
        phone_number: "0902601297"
    };

    const orders = [
        {
            id: "ORD12345",
            product: "Sản phẩm A",
            quantity: 2,
            date: "2023-12-25",
            status: "Đang giao",
            phone: "0902601297",
            name: "Lam Nguyen"
        },
        {
            id: "ORD12346",
            product: "Sản phẩm B",
            quantity: 1,
            date: "2023-12-20",
            status: "Hoàn thành",
            phone: "0902601297",
            name: "Lam Nguyen"
        },
        {
            id: "ORD12347",
            product: "Sản phẩm C",
            quantity: 3,
            date: "2023-12-15",
            status: "Đã hủy",
            phone: "0902601297",
            name: "Lam Nguyen"
        }
    ];

    const columns: any = [
        {
            title: "ID Đơn Hàng",
            dataIndex: "id",
            key: "id",
            render: (text: any) => <span className="font-medium">{text}</span>
        },
        {
            title: "Sản Phẩm",
            dataIndex: "product",
            key: "product"
        },
        {
            title: "Số Lượng",
            dataIndex: "quantity",
            key: "quantity",
            align: "center"
        },
        {
            title: "Ngày Mua",
            dataIndex: "date",
            key: "date"
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            render: (status: any) => {
                let color = "blue";
                if (status === "Hoàn thành") color = "green";
                else if (status === "Đã hủy") color = "red";
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: "Số Điện Thoại",
            dataIndex: "phone",
            key: "phone"
        },
        {
            title: "Tên Khách Hàng",
            dataIndex: "name",
            key: "name"
        }
    ];

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
                                        Đơn hàng của bạn
                                    </p>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            </section>

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

                    <section className="bg-white shadow-md rounded-lg p-6 border border-gray-200 col-start-5 col-end-12">
                        <h2 className="text-lg font-bold text-gray-800 mb-6">Đơn hàng của bạn</h2>
                        {/* Order Table */}
                        <Table
                            dataSource={orders}
                            columns={columns}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            bordered
                        />
                    </section>
                </div>
            </div>
        </>
    );
}

export default AccountOrder;