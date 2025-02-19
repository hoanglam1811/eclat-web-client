import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RouteNames from "../../../constants/routeNames";
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { useNavigate } from "react-router-dom";


const Cart = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const navigate = useNavigate();

    const handlePayment = () => {
        navigate("/cart/payment/");
    };

    const handleGoBackToLastProduct = () => {
        const lastAddedProduct = JSON.parse(sessionStorage.getItem("lastAddedProduct") || "{}");
        if (lastAddedProduct?.id && lastAddedProduct?.optionId) {
            navigate(`/product/${lastAddedProduct.id}`);
        } else {
            navigate(RouteNames.PRODUCTS);
        }
    };

    useEffect(() => {
        const storedCart = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
        console.log(storedCart)
        setCartItems(storedCart);
    }, []);

    const handleQuantityChange = (optionId: any, change: number) => {
        const updatedCart = cartItems.map((item) =>
            item.optionId === optionId
                ? { ...item, quantity: Math.max(1, item.quantity + change) }
                : item
        );
        setCartItems(updatedCart);
        sessionStorage.setItem("cartItems", JSON.stringify(updatedCart));
    };

    const handleRemoveItem = (optionId: any) => {
        const updatedCart = cartItems.filter((item) => item.optionId !== optionId);
        setCartItems(updatedCart);
        sessionStorage.setItem("cartItems", JSON.stringify(updatedCart));
    };

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.quantity * (item.discountPrice || item.price),
        0
    );

    return (
        <>
            {/* Nội dung */}
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
                                        Giỏ hàng
                                    </p>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            </section>

            <div className=" bg-gray-100 pt-5 pl-20 pr-20 pb-10">
                <div className="flex space-x-2">
                    {/* Phần giỏ hàng */}
                    <div className="w-4/5 bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin sản phẩm</h2>
                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-bold text-gray-700 w-1/2">SẢN PHẨM</th>
                                        <th className="text-right p-4 text-sm font-bold text-gray-700 w-1/6">ĐƠN GIÁ</th>
                                        <th className="text-center p-4 text-sm font-bold text-gray-700 w-1/6">SỐ LƯỢNG</th>
                                        <th className="text-right p-4 text-sm font-bold text-gray-700 w-1/6">THÀNH TIỀN</th>
                                        <th className="text-right p-4 text-sm font-bold text-gray-700 w-1/6"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item: any) => (
                                        <tr key={item.optionId} className="border-b">
                                            {/* Tên sản phẩm */}
                                            <td className="p-4 flex items-start space-x-4">
                                                <img src={item.imageUrl} alt={item.optionValue} className="w-16 h-16 rounded object-cover" />
                                                <div className="mt-5">
                                                    <span className="text-sm font-medium text-blue-600 hover:underline">
                                                        {item.optionValue}
                                                    </span>
                                                </div>
                                            </td>
                                            {/* Giá */}
                                            <td className="text-right p-4 text-sm text-gray-800">
                                                <>
                                                    <span className="text-red-600 font-bold">
                                                        {item?.discountPrice?.toLocaleString("vi-VN")}đ
                                                    </span>
                                                </>
                                            </td>
                                            {/* Số lượng */}
                                            <td className="text-center p-4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button onClick={() => handleQuantityChange(item.optionId, -1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                                                    <span className="text-sm font-medium">{item.quantity}</span>
                                                    <button onClick={() => handleQuantityChange(item.optionId, 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                                                </div>
                                            </td>
                                            {/* Thành tiền */}
                                            <td className="text-right p-4 text-sm text-red-600 font-bold">
                                                {((item.discountPrice || item.price) * item.quantity).toLocaleString("vi-VN")}đ
                                            </td>
                                            {/* Xóa */}
                                            <td className="p-4">
                                                <button onClick={() => handleRemoveItem(item.optionId)} className="text-sm text-red-500 hover:underline">Xoá</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>
                        <div className="flex justify-between items-center mt-6">
                            <button onClick={handleGoBackToLastProduct} className="text-blue-600 hover:underline">
                                Trở về sản phẩm vừa thêm
                            </button>
                            <p className="text-sm text-gray-700 font-semibold">
                                Tổng tiền:{" "}
                                <span className="text-red-600 text-lg font-bold">
                                    {totalPrice.toLocaleString("vi-VN")}đ
                                </span>
                            </p>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button onClick={handlePayment} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Thanh toán
                            </button>
                        </div>
                    </div>

                    {/* Phần voucher */}
                    <div className="w-1/4 bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Mã giảm giá</h2>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Nhập mã giảm giá"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button className="mt-2 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                                Áp dụng
                            </button>
                        </div>
                        <h3 className="text-md font-semibold text-gray-700 mb-2">Khuyến mãi:</h3>
                        <ul className="space-y-2">
                            <li className="text-sm text-gray-600 bg-gray-100 p-2 rounded-lg flex items-center">
                                <span className="mr-2 text-blue-500">🎉</span> Giảm 50.000đ cho đơn hàng từ 500.000đ
                            </li>
                            <li className="text-sm text-gray-600 bg-gray-100 p-2 rounded-lg flex items-center">
                                <span className="mr-2 text-blue-500">🚚</span> Miễn phí vận chuyển cho đơn hàng từ
                                1.000.000đ
                            </li>
                        </ul>
                    </div>

                </div>

            </div>
        </>
    );
};

export default Cart;
