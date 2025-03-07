import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { GetAllDistrictsByProvince, GetAllProvinces, GetAllWardsByDistrict, GetDistrictByCode, GetProvinceByCode, GetWardByCode } from "../../../services/AddressService";
import { Button, notification, Radio, Tooltip, Typography } from "antd";
import { Textarea } from "../../../components/ui/textarea";
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle, FaCity, FaEnvelope, FaHome, FaMapMarkerAlt, FaMoneyBillWave, FaPhone, FaPlusCircle, FaProductHunt, FaTimes, FaUser } from "react-icons/fa";
import { MdLocationCity } from "react-icons/md";
import { createOrder } from "../../../services/ApiServices/orderService";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { createVnPayPayment } from "../../../services/ApiServices/vnpayService";
import { getUserById } from "../../../services/ApiServices/userService";


function Payment() {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.token.token);
  const user = useSelector((state: RootState) => state.token.user);
  const [provinces, setProvinces] = useState([] as any[]);
  const [districts, setDistricts] = useState([] as any[]);
  const [wards, setWards] = useState([] as any[]);

  const [province, setProvince] = useState<any>("");
  const [district, setDistrict] = useState<any>("");
  const [ward, setWard] = useState<any>("");

  const [userInfo, setUserInfo] = useState({} as any);
  const [errors, setErrors] = useState<any>({
    receiverName: "",
    email: "",
    phoneNumber: "",
    address: "",
    additionalInfo: "",
    province: "",
    district: "",
    ward: "",
  });

  const formSchema = z.object({
    receiverName: z.string().min(1, "Vui lòng nhập họ tên"),
    email: z.string().min(1, "Vui lòng nhập email").email("Vui lòng nhập đúng định dạng email"),
    phoneNumber: z
      .string()
      .length(10, "Số điện thoại phải có đúng 10 chữ số")
      .regex(/^\d+$/, "Số điện thoại chỉ được chứa số"),
    address: z.string().min(1, "Vui lòng nhập địa chỉ"),
    additionalInfo: z.string(),
    province: z.string().min(1, "Vui lòng chọn Tỉnh Thành"),
    district: z.string().min(1, "Vui lòng chọn Quận Huyện"),
    ward: z.string().min(1, "Vui lòng chọn Phường Xã"),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiverName: "",
      email: "",
      phoneNumber: "",
      address: "",
      additionalInfo: "",
      province: "",
      district: "",
      ward: "",
    }
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [paymentErrorMessage, setPaymentErrorMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingFee, setShippingFee] = useState(30000);
  const [discount, setDiscount] = useState(0);
  const [recommendation, setRecommendation] = useState("");
  const [cartItems, setCartItems] = useState<any[]>([]);
  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
    console.log(storedCart)
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
    const calculatedTotal = storedCart.reduce(
      (total: any, item: any) => total + item.quantity * (item.discountPrice || item.price),
      0
    );
    setTotalPrice(calculatedTotal);

    let discountValue = 0;
    let shippingCost = 30000;
    let recommendationMessage = "";

    if (calculatedTotal >= 1000000) {
      discountValue = 100000;
      shippingCost = 0;
    } else if (calculatedTotal >= 500000) {
      discountValue = 50000;
    }

    if (calculatedTotal < 500000) {
      recommendationMessage = `Bạn chỉ cần mua thêm ${(500000 - calculatedTotal).toLocaleString()}₫ để được giảm 50.000₫`;
    } else if (calculatedTotal < 1000000) {
      recommendationMessage = `Bạn chỉ cần mua thêm ${(1000000 - calculatedTotal).toLocaleString()}₫ để được miễn phí vận chuyển và giảm 100.000₫`;
    }

    fetchUser()

    setDiscount(discountValue);
    setShippingFee(shippingCost);
    setRecommendation(recommendationMessage);
  }, []);

  const fetchUser = async () => {
    try {
      if (!token || !user) {
        return;
      }
      const response = await getUserById(user?.userId, token);
      console.log(response);
      form.setValue("receiverName", response.result.username);
      form.setValue("email", response.result.email);
      form.setValue("phoneNumber", response.result.phone);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
      return;
    }
  }

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!token) {
      navigate("/login");
      notification.error({ message: "Bạn cần đăng nhập để thực hiện thanh toán!" });
      return;
    }

    try {
      const cart = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
      const userInfo = user?.userId;

      if (!cart.length || !userInfo) {
        notification.error({ message: "Giỏ hàng hoặc thông tin người dùng không hợp lệ." });
        return;
      }

      if (!selectedOption) {
        notification.error({ message: "Vui lòng chọn phương thức thanh toán!" });
        return;
      }

      const totalPrices = totalPrice - discount + shippingFee;
      const fullAddress = `${data.address}, ${data.ward}, ${data.district}, ${data.province}`;

      const orderData = {
        userId: userInfo,
        totalPrices,
        address: fullAddress,
        status: selectedOption === "Cash" ? "SUCCESS" : "SUCCESS",
        paymentMethod: selectedOption.toUpperCase(),
        orderDetails: cart.map((item: any) => ({
          optionId: item.optionId,
          quantity: item.quantity,
          price: item.discountPrice,
        })),
      };

      console.log("Dữ liệu gửi lên API:", orderData);

      const orderResponse = await createOrder(orderData, token);
      console.log(orderResponse);

      if (selectedOption === "Cash") {
        notification.success({ message: "Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng." });
        sessionStorage.removeItem("cartItems");
        navigate("/account/orders");
        return;
      }

      if (selectedOption === "vnpay") {
        const orderId = orderResponse.orderId;
        const orderInfo = `Thanh toán đơn hàng #${orderId}`;

        const paymentResponse = await createVnPayPayment(totalPrices, orderInfo, orderId, token);
        notification.success({ message: "Tạo thành công đơn thanh toán VNPay" });

        if (paymentResponse?.paymentUrl) {
          sessionStorage.setItem("awaitingPayment", "true");
          window.location.href = paymentResponse.paymentUrl;
          sessionStorage.removeItem("cartItems");
        } else {
          notification.error({ message: "Lỗi khi tạo thanh toán VNPay." });
        }
      }
    } catch (error) {
      console.error("Lỗi:", error);
      notification.error({ message: "Có lỗi xảy ra, vui lòng thử lại." });
    }
  };


  const fetchProvinces = async () => {
    let provinces = null;
    try {
      provinces = await GetAllProvinces();
      setProvinces(provinces);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
      return;
    }
  }

  const fetchDistricts = async (e: any) => {
    let userInfos = null;
    try {
      userInfos = await GetAllDistrictsByProvince(e);
      setDistricts(userInfos);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
      return;
    }
  }

  const fetchWards = async (e: any) => {
    let userInfos = null;
    try {
      userInfos = await GetAllWardsByDistrict(e);
      setWards(userInfos);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
      return;
    }
  }

  useEffect(() => {
    console.log(province);
    if (province?.name_with_type === "Thành phố Hồ Chí Minh") {
      setShippingFee(0);
    }
    else {
      setShippingFee(30000);
    }
  }, [province]);


  useEffect(() => {
    fetchProvinces();
    if (province) {
      fetchDistricts(province.code);
      if (district) {
        fetchWards(district.code);
      }
    }
  }, [userInfo, province, district]);

  // if (!uid || selectedProducts.length === 0) {
  //   return (
  //     <NotFound />
  //   )
  // }

  return (
    <>
      <section className="bg-gray-100 p-6 pt-40">
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
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <p className="text-[#000] font-medium md:text-xl text-lg">
                    Thanh toán
                  </p>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap w-full bg-gray-100 pt-6 pb-6 pl-20 gap-6">
        <div className="w-full lg:w-8/12">
          <div className="address-form-wrapper bg-white shadow-md p-7 mb-5">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-500" /> Địa chỉ giao hàng
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex items-center w-full lg:w-1/2">
                  <FaUser className="text-gray-500 mr-2" />
                  <input
                    placeholder="Họ và tên"
                    value={form.watch("receiverName")}
                    disabled
                    //...form.register("receiverName")
                    className="w-full border rounded-md px-3 py-2 bg-gray-200"
                  />
                  {form.formState.errors.receiverName && <p className="text-red-500 text-sm">{form.formState.errors.receiverName.message}</p>}
                </div>

                {/* Email */}
                <div className="flex items-center w-full lg:w-1/2">
                  <FaEnvelope className="text-gray-500 mr-2" />
                  <input
                    placeholder="Email"
                    value={form.watch("email")}
                    disabled
                    // value={userInfo?.email}
                    //{...form.register("email")}
                    // onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 bg-gray-200"
                  />
                  {form.formState.errors.email && <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>}
                </div>
              </div>

              <div className="flex gap-3">
                {/* Địa chỉ */}
                <div className="flex items-center w-full lg:w-1/2">
                  <FaMapMarkerAlt className="text-gray-500 mr-2" />
                  <input
                    placeholder="Địa chỉ, ví dụ: 151B Trần Quang Khải"
                    // value={userInfo?.address}
                    {...form.register("address")}
                    // onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                    className="w-full border rounded-md px-3 py-2"
                  />
                  {form.formState.errors.address && <p className="text-red-500 text-sm">{form.formState.errors.address.message}</p>}
                </div>

                {/* Số Điện Thoại */}
                <div className="flex items-center w-full lg:w-1/2">
                  <FaPhone className="text-gray-500 mr-2" />
                  <input
                    placeholder="Số Điện Thoại"
                    disabled
                    value={form.watch("phoneNumber")}
                    //{...form.register("phoneNumber")}
                    // onChange={(e) => setUserInfo({ ...userInfo, phoneNumber: e.target.value })}
                    className="w-full border rounded-md px-3 py-2 bg-gray-200"
                  />
                  {form.formState.errors.phoneNumber && <p className="text-red-500 text-sm">{form.formState.errors.phoneNumber.message}</p>}
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-full lg:w-1/3 flex items-center">
                  <FaCity className="text-gray-500 mr-2" />
                  <select
                    className="w-full border rounded-md px-3 py-2 bg-white text-gray-700"
                    onChange={async (e) => {
                      fetchDistricts(e.currentTarget.value);
                      const selectedProvince = await GetProvinceByCode(e.currentTarget.value);
                      setProvince(selectedProvince);
                      setDistrict("")
                      setWard("")
                      form.setValue("province", selectedProvince.name_with_type)
                      form.setValue("district", "")
                      form.setValue("ward", "")
                    }}
                    value={province.code || ""}
                  >
                    <option value="" disabled hidden>
                      Vui lòng chọn Tỉnh Thành
                    </option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.code}>{province.name_with_type}</option>
                    ))}
                  </select>
                  {form.formState.errors.province && <p className="text-red-500 text-sm">{form.formState.errors.province.message}</p>}
                </div>

                <div className="w-full lg:w-1/3 flex items-center">
                  <MdLocationCity className="text-gray-500 mr-2" />
                  <select
                    className="w-full border rounded-md px-3 py-2 bg-white text-gray-700"
                    onChange={async (e) => {
                      fetchWards(e.currentTarget.value);
                      const selectedDistrict = await GetDistrictByCode(e.currentTarget.value);
                      setDistrict(selectedDistrict);
                      setWard("")
                      form.setValue("district", selectedDistrict.name_with_type)
                      form.setValue("ward", "")
                    }}
                    value={district.code || ""}
                  >
                    <option value="" disabled hidden>
                      Vui lòng chọn Quận Huyện
                    </option>
                    {districts.map((district) => (
                      <option key={district.code} value={district.code}>{district.name_with_type}</option>
                    ))}
                  </select>
                  {form.formState.errors.district && <p className="text-red-500 text-sm">{form.formState.errors.district.message}</p>}
                </div>

                <div className="w-full lg:w-1/3 flex items-center">
                  <FaHome className="text-gray-500 mr-2" />
                  <select
                    className="w-full border rounded-md px-3 py-2 bg-white text-gray-700"
                    onChange={async (e) => {
                      const selectedWard = await GetWardByCode(e.currentTarget.value);
                      setWard(selectedWard);
                      form.setValue("ward", selectedWard.name_with_type)
                    }}
                    value={ward.code || ""}
                  >
                    <option value="" disabled hidden>
                      Vui lòng chọn Phường Xã
                    </option>
                    {wards.map((ward) => (
                      <option key={ward.code} value={ward.code}>{ward.name_with_type}</option>
                    ))}
                  </select>
                  {form.formState.errors.ward && <p className="text-red-500 text-sm">{form.formState.errors.ward.message}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="address-form-wrapper bg-white shadow-md p-7 mb-5">
            <div className="flex space-x-2">
              {/* Phần giỏ hàng */}
              <div className="w-full">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaPlusCircle className="text-blue-500" /> Thông tin sản phẩm
                </h2>
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
                              <Tooltip title={item.optionValue}>
                                <span className="text-sm font-medium text-blue-600 hover:underline">
                                  {item.optionValue.length > 30 ? item.optionValue.substring(0, 45) + "..." : item.optionValue}
                                </span>
                              </Tooltip>
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
                              <span className="text-sm font-medium">{item.quantity}</span>
                            </div>
                          </td>
                          {/* Thành tiền */}
                          <td className="text-right p-4 text-sm text-red-600 font-bold">
                            {((item.discountPrice || item.price) * item.quantity).toLocaleString("vi-VN")}đ
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>

                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md p-7">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-green-500" /> Phương thức thanh toán
            </h2>
            <div className="flex flex-wrap mb-10 items-center ml-10 mt-5">
              <div className="w-full lg:w-1/3 flex items-center mr-20">
                <Radio.Group
                  onChange={(e) => setSelectedOption(e.target.value)}
                  value={selectedOption}
                >
                  <Radio value="Cash" style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src="/COD.png"
                      alt="Thanh toán khi nhận hàng (COD)"
                      className="w-12 h-12 mr-4 rounded-md"
                    />
                    <Typography.Text>Thanh toán khi nhận hàng (COD)</Typography.Text>
                  </Radio>
                </Radio.Group>
              </div>

              <div className="w-full lg:w-1/3 flex items-center">
                <Radio.Group
                  onChange={(e) => setSelectedOption(e.target.value)}
                  value={selectedOption}
                >
                  <Radio value="vnpay" style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src="/nganhang.png"
                      alt="Thanh toán qua VNPAY"
                      className="w-12 h-12 mr-4 rounded-md"
                    />
                    <Typography.Text>Thanh toán qua VNPAY</Typography.Text>
                  </Radio>
                </Radio.Group>
              </div>
            </div>
          </div>
        </div>

        <div className="order-summary w-full lg:w-3/12 bg-white shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" /> Tổng hóa đơn
          </h2>
          <div className="order-info space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tổng tiền</span>
              <span className="font-semibold text-gray-800">{totalPrice.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Giảm giá</span>
              <span className="font-semibold text-red-600">-{discount.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="font-semibold text-gray-800">{shippingFee.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between items-center border-t pt-4 mt-4">
              <span className="text-lg font-bold">Tổng thanh toán</span>
              <span className="text-lg font-bold text-green-600">
                {(totalPrice - discount + shippingFee).toLocaleString()}₫
              </span>
            </div>
          </div>
          {recommendation && (
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 text-sm rounded-lg">
              {recommendation}
            </div>
          )}

          <div className="mt-6">
            <Button
              type="primary"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md"
              onClick={async () => {
                const valid = await form.trigger();
                if (valid) setIsDialogOpen(true)
              }}
            >
              Hoàn tất đơn
            </Button>
          </div>

          {/* Dialog Xác nhận */}
          <AnimatePresence>
            {isDialogOpen && (
              <div className="fixed z-99 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-8 rounded-lg shadow-xl w-11/12 sm:w-1/2 lg:w-1/3"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
                      {"Xác nhận đặt hàng"}
                    </h3>
                    <button onClick={() => setIsDialogOpen(false)} className="text-3xl text-gray-700 hover:text-sky-500 transition-all">
                      <FaTimes />
                    </button>
                  </div>
                  <div>
                    Khi bấm "Đồng ý", bạn phải tuân thủ
                    <span
                      className="ml-1 text-blue-500 underline cursor-pointer"
                      onClick={() => setIsTermsDialogOpen(true)}
                    >
                      Điều khoản đặt hàng.
                    </span>
                    <p className="mt-4">Bạn đồng ý chứ?</p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="dashed"
                      color="primary"
                      onClick={async () => {
                        const valid = await form.trigger(); // Kiểm tra form hợp lệ
                        if (valid) {
                          const formData = form.getValues(); // Lấy dữ liệu từ form
                          await handleSubmit(formData); // Gọi handleSubmit với dữ liệu form
                          setIsDialogOpen(false);
                        }
                      }}
                    >
                      Tôi đồng ý
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Huỷ
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <Dialog open={isTermsDialogOpen} onClose={() => setIsTermsDialogOpen(false)}>
            <DialogTitle className="font-bold">Điều khoản đặt hàng</DialogTitle>
            <DialogContent>
              <DialogContentText className="text-gray-700 text-sm space-y-4">
                <p>1. CHẤP THUẬN: Đơn không ràng buộc cho đến khi Bên Cung Cấp chấp thuận.</p>
                <p>2. NGÀY GIAO HÀNG: Giao đúng hạn, nếu không, Bên Mua có quyền yêu cầu bồi thường.</p>
                <p>3. SỐ LƯỢNG: Bên Mua có quyền từ chối nếu số lượng không đúng.</p>
                <p>4. QUYỀN SỞ HỮU VÀ RỦI RO MẤT MÁT: Quyền sở hữu chuyển qua khi giao Hàng Hóa.</p>
                <p>5. ĐÓNG GÓI: Hàng hóa phải được đóng gói đảm bảo không tổn hại.</p>
                <p>6. BẢO HÀNH: Bảo đảm Hàng Hóa trong 18 tháng không lỗi, phù hợp thông số.</p>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="dashed"
                color="primary"
                onClick={() => setIsTermsDialogOpen(false)}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  )
}

export default Payment;
