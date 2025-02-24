import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { GetAllDistrictsByProvince, GetAllProvinces, GetAllWardsByDistrict, GetDistrictByCode, GetProvinceByCode, GetWardByCode } from "../../../services/AddressService";
import { Button, Card, Checkbox, Input, List, Radio, Typography, Upload } from "antd";
import { Button as ShadButton } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

function Payment() {

  //const {id} = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  //let { products } = location.state || { products: [] };
  //const { setProducts } = location.state || { setProducts: () => {} };

  const [addAddress, setAddAddress] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);

  const [deliveryFee, setDeliveryFee] = useState(0);

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
  const handleOptionChange = (e: any) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = () => {

  }

  // const openAddressForm = () => setAddAddress(!addAddress);
  // const uid = token ? parseJwt(token).id : null

  // const handleButtonClick = () => {
  //   setIsDialogOpen(true);
  // };

  // const handleYes = async () => {
  //   const result = await saveUserInfo();
  //   if (result) {
  //     setSelectedProducts([]);
  //   }
  //   setIsDialogOpen(false);
  // };

  // const handleNo = () => {
  //   setIsDialogOpen(false);
  // };

  // const handleOpenTerms = () => {
  //   setIsTermsDialogOpen(true);
  // };

  // const [imageFile, setImageFile] = useState("");
  // const handleImageChange = (event: any) => {
  //   setImageFile(event.target.files[0]);
  //   //setBrandImageFileName(event.target.files[0].name);
  // };

  // const handleCloseTerms = () => {
  //   setIsTermsDialogOpen(false);
  // };

  // const fetchUserInfos = async () => {
  //   let userInfos = null;
  //   try {
  //     userInfos = await GetUserInfoById(uid);
  //     let addressInfos = userInfos.addressInfo.split(", ");
  //     let p = await GetProvinceByName(addressInfos[0]);
  //     let d = await GetDistrictByName(addressInfos[1]);
  //     let w = await GetWardByName(addressInfos[2]);

  //     setDeliveryFee(calculateExpectedShippingFee(p.name_with_type));

  //     setProvince(p);
  //     setDistrict(d);
  //     setWard(w);
  //     //console.log(p)
  //     //console.log(d);
  //     //console.log(w);

  //     setUserInfo(userInfos);
  //   } catch (error: any) {
  //     if (error.response && error.response.data && error.response.data.message) {
  //       // If the error response contains a message, set it as the error message
  //       setErrorMessage(error.response.data.message);
  //     } else {
  //       // If the error is something else, set a generic error message
  //       setErrorMessage('An error occurred. Please try again later.');
  //     }
  //     return;
  //   }
  // }

  // const calculateExpectedShippingDate = (address: string) => {
  //   if (address.includes("Thành phố Hồ Chí Minh")) {
  //     return moment().add(3, 'days').format('YYYY-MM-DDT00:00:00');
  //   } else {
  //     return moment().add(7, 'days').format('YYYY-MM-DDT00:00:00');
  //   }
  // };

  // const calculateExpectedShippingFee = (address: string) => {
  //   if (address.includes("Thành phố Hồ Chí Minh")) {
  //     return 0;
  //   } else {
  //     return 30000;
  //   }
  // };

  const fetchProvinces = async () => {
    let provinces = null;
    try {
      provinces = await GetAllProvinces();
      setProvinces(provinces);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        // If the error response contains a message, set it as the error message
        setErrorMessage(error.response.data.message);
      } else {
        // If the error is something else, set a generic error message
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
        // If the error response contains a message, set it as the error message
        setErrorMessage(error.response.data.message);
      } else {
        // If the error is something else, set a generic error message
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
        // If the error response contains a message, set it as the error message
        setErrorMessage(error.response.data.message);
      } else {
        // If the error is something else, set a generic error message
        setErrorMessage('An error occurred. Please try again later.');
      }
      return;
    }
  }

  // useEffect(() => {
  //   fetchUserInfos();
  // }, [])

  useEffect(() => {
    fetchProvinces();
    if (province) {
      fetchDistricts(province.code);
      if (district) {
        fetchWards(district.code);
      }
    }
  }, [userInfo])

  // if (!uid || selectedProducts.length === 0) {
  //   return (
  //     <NotFound />
  //   )
  // }

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
        <div className="flex flex-wrap px-5 w-full bg-gray-100 pt-6 pb-6 pl-30 gap-6">
          <div className="w-full lg:w-8/12">
            <div className="address-form-wrapper bg-white shadow-md p-5 mb-5">
              <h2 className="text-xl font-bold mb-4 text-left">Địa chỉ giao hàng</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-full lg:w-1/2">
                    <input
                      placeholder="Họ và tên"
                      {...form.register("receiverName")}
                      className="w-full border rounded-md px-3 py-2"
                    />
                    {form.formState.errors.receiverName && <p className="text-red-500 text-sm">{form.formState.errors.receiverName.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="w-full lg:w-1/2">
                    <input
                      placeholder="Email"
                      // value={userInfo?.email}
                      {...form.register("email")}
                      // onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      className="w-full border rounded-md px-3 py-2"
                    />
                    {form.formState.errors.email && <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>}
                  </div>
                </div>

                <div className="flex gap-3">
                  {/* Địa chỉ */}
                  <div className="w-full lg:w-1/2">
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
                  <div className="w-full lg:w-1/2">
                    <input
                      placeholder="Số Điện Thoại"
                      // value={userInfo?.phoneNumber}
                      {...form.register("phoneNumber")}
                      // onChange={(e) => setUserInfo({ ...userInfo, phoneNumber: e.target.value })}
                      className="w-full border rounded-md px-3 py-2"
                    />
                    {form.formState.errors.phoneNumber && <p className="text-red-500 text-sm">{form.formState.errors.phoneNumber.message}</p>}
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-full lg:w-1/3">
                    <select
                      className="w-full border rounded-md px-3 py-2 bg-white text-gray-700"
                      onChange={async (e) => {
                        fetchDistricts(e.currentTarget.value);
                        const selectedProvince = await GetProvinceByCode(e.currentTarget.value);
                        setProvince(selectedProvince);
                        setDistrict("")
                        setWard("")
                        form.setValue("province", selectedProvince.name)
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
                  <div className="w-full lg:w-1/3">
                    <select
                      className="w-full border rounded-md px-3 py-2 bg-white text-gray-700"
                      onChange={async (e) => {
                        fetchWards(e.currentTarget.value);
                        const selectedDistrict = await GetDistrictByCode(e.currentTarget.value);
                        setDistrict(selectedDistrict);
                        setWard("")
                        form.setValue("district", selectedDistrict.name)
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
                  <div className="w-full lg:w-1/3">
                    <select
                      className="w-full border rounded-md px-3 py-2 bg-white text-gray-700"
                      onChange={async (e) => {
                        const selectedWard = await GetWardByCode(e.currentTarget.value);
                        setWard(selectedWard);
                        form.setValue("ward", selectedWard.name)
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

                <Textarea
                  placeholder="Ghi chú"
                  // value={userInfo?.additionalInfo}
                  {...form.register("additionalInfo")}
                  // onChange={(e) => setUserInfo({ ...userInfo, additionalInfo: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
                {form.formState.errors.additionalInfo && <p className="text-red-500 text-sm">{form.formState.errors.additionalInfo.message}</p>}
              </div>
            </div>

            <div className="bg-white shadow-md p-5">
              <h2 className="text-xl font-bold mb-4 text-left">Phương thức thanh toán</h2>
              <div className="flex flex-wrap">
                {/* Bên trái: Ship COD */}
                <div className="w-full lg:w-1/2 flex items-center">
                  <Radio.Group>
                    <Radio value="Cash" style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src="/COD.png"
                        alt="Thanh toán khi nhận hàng (COD)"
                        className="w-12 h-12 mr-4 rounded-md"
                      />
                      <Typography.Text>Thanh toán khi nhận hàng (COD)</Typography.Text>
                    </Radio>
                  </Radio.Group>
                </div>

                {/* Bên phải: VNPAY */}
                <div className="w-full lg:w-1/2 flex items-center">
                  <Radio.Group>
                    <Radio value="BankTransfer" style={{ display: 'flex', alignItems: 'center' }}>
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

              {selectedOption === 'BankTransfer' && (
                <Upload
                  id="imageinput"
                  style={{ marginTop: 16 }}
                  beforeUpload={() => false}
                >
                  <Button type="primary">Upload Payment Proof</Button>
                </Upload>
              )}
            </div>

          </div>

          <div className="order-summary w-full lg:w-3/12 bg-white shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Tổng hóa đơn</h2>

            <div className="order-info space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng tiền</span>
                <span className="font-semibold text-gray-800">1,000,000₫</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Giảm giá</span>
                <span className="font-semibold text-red-600">-50,000₫</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-semibold text-gray-800">30,000₫</span>
              </div>
            </div>

            <hr className="my-4 border-gray-300" />

            <div className="flex justify-between text-lg font-semibold">
              <span className="text-gray-700">Tổng cộng:</span>
              <span className="text-black">980,000₫</span>
            </div>

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
                        {/* <FaPen className="text-sky-500" /> */}
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
                        onClick={() => {
                          // handle confirm logic here
                          setIsDialogOpen(false);
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

            {/*<Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
            <DialogTitle className="font-bold">Xác nhận đặt hàng</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Khi bấm "Đồng ý", bạn phải tuân thủ
                <span
                  className="ml-1 text-blue-500 underline cursor-pointer"
                  onClick={() => setIsTermsDialogOpen(true)}
                >
                  Điều khoản đặt hàng.
                </span>
                <p className="mt-4">Bạn đồng ý chứ?</p>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="dashed"
                color="primary"
                onClick={() => {
                  // handle confirm logic here
                  setIsDialogOpen(false);
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
            </DialogActions>
          </Dialog>*/}

            {/* Dialog Điều khoản */}
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
