import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { GetAllDistrictsByProvince, GetAllProvinces, GetAllWardsByDistrict, GetDistrictByCode, GetProvinceByCode, GetWardByCode } from "../../../services/AddressService";
import { Button, Card, Checkbox, Input, List, Radio, Typography, Upload } from "antd";
import { Textarea } from "../../../components/ui/textarea";
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";

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

  const [province, setProvince] = useState({} as any);
  const [district, setDistrict] = useState({} as any);
  const [ward, setWard] = useState({} as any);

  const [userInfo, setUserInfo] = useState({} as any);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentErrorMessage, setPaymentErrorMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const handleOptionChange = (e: any) => {
    setSelectedOption(e.target.value);
  };

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
                  <Input
                    placeholder="Họ và tên"
                    value={userInfo?.receiverName}
                    onChange={(e) => setUserInfo({ ...userInfo, receiverName: e.target.value })}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>

                {/* Email */}
                <div className="w-full lg:w-1/2">
                  <Input
                    placeholder="Email"
                    value={userInfo?.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                {/* Địa chỉ */}
                <div className="w-full lg:w-1/2">
                  <Input
                    placeholder="Địa chỉ, ví dụ: 151B Trần Quang Khải"
                    value={userInfo?.address}
                    onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>

                {/* Số Điện Thoại */}
                <div className="w-full lg:w-1/2">
                  <Input
                    placeholder="Số Điện Thoại"
                    value={userInfo?.phoneNumber}
                    onChange={(e) => setUserInfo({ ...userInfo, phoneNumber: e.target.value })}
                    className="w-full border rounded-md px-3 py-2"
                  />
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
                    }}
                    value={province.code}
                  >
                    {provinces.map((province) => (
                      <option key={province.code} value={province.code}>{province.name_with_type}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full lg:w-1/3">
                  <select
                    className="w-full border rounded-md px-3 py-2 bg-white text-gray-700"
                    onChange={async (e) => {
                      fetchWards(e.currentTarget.value);
                      const selectedDistrict = await GetDistrictByCode(e.currentTarget.value);
                      setDistrict(selectedDistrict);
                    }}
                    value={district.code}
                  >
                    {districts.map((district) => (
                      <option key={district.code} value={district.code}>{district.name_with_type}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full lg:w-1/3">
                  <select
                    className="w-full border rounded-md px-3 py-2 bg-white text-gray-700"
                    onChange={async (e) => {
                      const selectedWard = await GetWardByCode(e.currentTarget.value);
                      setWard(selectedWard);
                    }}
                    value={ward.code}
                  >
                    {wards.map((ward) => (
                      <option key={ward.code} value={ward.code}>{ward.name_with_type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Textarea
                placeholder="Ghi chú"
                value={userInfo?.additionalInfo}
                onChange={(e) => setUserInfo({ ...userInfo, additionalInfo: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              />
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
              onClick={() => setIsDialogOpen(true)}
            >
              Hoàn tất đơn
            </Button>
          </div>

          {/* Dialog Xác nhận */}
          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
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
          </Dialog>

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
