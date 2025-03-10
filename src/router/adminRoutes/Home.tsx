import { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Radio, Modal, Tooltip, Statistic } from "antd";
import { FaShoppingCart, FaUserCircle, FaPhone, FaIdBadge, FaCheckCircle, FaUsers, FaUserTie } from "react-icons/fa";
import { MdDateRange, MdOutlinePayment } from "react-icons/md";
import LineChart from "../../components/chart/LineChart";
import { Label } from "../../components/ui/label";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { getAllOrders } from "../../services/ApiServices/orderService";
import { getAllUsers } from "../../services/ApiServices/userService";
import { PieChart, Pie, Cell, Legend } from "recharts";

interface Customer {
  id: string;
  username: string;
  phone: string;
  status: string;
}

interface ProductOption {
  optionValue: string;
  quantity: number;
  optionPrice: number;
  discPrice: number;
  images: string[];
}

interface Product {
  productName: string;
  brand: string;
  origin: string;
  category: string;
  description: string;
  skinType: string;
  images: string[];
  options: ProductOption[];
}


function Home() {
  const { Title } = Typography;
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [order, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const token = useSelector((state: RootState) => state.token.token);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const paymentData = [
    { name: "VNPAY", value: order.filter(o => o.paymentMethod.toLowerCase() === "vnpay").length },
    { name: "Tiền mặt", value: order.filter(o => o.paymentMethod.toLowerCase() === "cash").length }
  ];
  console.log(paymentData)

  const COLORS = ["#0088FE", "#FFBB28"];
  const renderCustomLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };
  console.log(selectedProduct)

  const totalQuantity = selectedProduct?.options
    ? selectedProduct.options.reduce((total: any, option: any) => total + (option.quantity || 0), 0)
    : 0;

  const showProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const filteredOrders =
    filter === "all" ? order : order.filter((order) => order.paymentMethod.toUpperCase() === filter.toUpperCase());

  const sortedOrders = [...filteredOrders].sort((a, b) =>
    new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
  );

  const showModal = (customer: any) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const fetchOrders = async () => {
    try {
      if (!token) {
        return;
      }
      const [response, users] = await Promise.all([
        getAllOrders(token),
        getAllUsers(token)
      ]);

      console.log(response);
      console.log("users", users);

      if (users && users.result) {
        setUsers(users.result);

        const totalCustomers = users.result.filter((user: any) =>
          Array.isArray(user.role) && user.role.some((r: string) => r === "Customer")
        ).length;

        const totalEmployees = users.result.filter((user: any) =>
          Array.isArray(user.role) && user.role.some((r: string) => r === "Staff")
        ).length;

        setTotalCustomers(totalCustomers);
        setTotalEmployees(totalEmployees);

        console.log(`Tổng khách hàng: ${totalCustomers}, Tổng nhân viên: ${totalEmployees}`);
      }

      if (response) {
        setOrders(response);
        setTotalOrders(response.length);
      }
      console.log(response);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [])

  return (
    <div className="w-full">
      <div>
        {/* Biểu đồ đường */}
        <Row className="w-full">
          <Col xs={24} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart />
            </Card>
          </Col>
        </Row>
        <div>
          <Row gutter={[16, 16]} className="mb-6 flex">
            {/* Biểu đồ Tỷ lệ phương thức thanh toán (Chiếm 3 hàng, 1 cột) */}
            <Col span={15} className="flex">
              <Card bordered={false} className="shadow-md rounded-lg w-full flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-4">Tỷ lệ phương thức thanh toán</h3>
                  <PieChart width={350} height={300}>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={renderCustomLabel}
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </div>
              </Card>
            </Col>

            {/* Ba thẻ chỉ số (Mỗi cái chiếm 1 hàng, 1 cột, cách đều nhau) */}
            <Col span={9} className="flex flex-col gap-4">
              <Card bordered={false} className="shadow-md rounded-lg flex-1 flex items-center">
                <div className="flex items-center gap-4">
                  <FaShoppingCart className="text-blue-500 text-3xl" />
                  <Statistic title="Tổng Đơn Hàng" value={totalOrders} />
                </div>
              </Card>

              <Card bordered={false} className="shadow-md rounded-lg flex-1 flex items-center">
                <div className="flex items-center gap-4">
                  <FaUsers className="text-green-500 text-3xl" />
                  <Statistic title="Tổng Khách Hàng" value={totalCustomers} />
                </div>
              </Card>

              <Card bordered={false} className="shadow-md rounded-lg flex-1 flex items-center">
                <div className="flex items-center gap-4">
                  <FaUserTie className="text-purple-500 text-3xl" />
                  <Statistic title="Tổng Nhân Viên" value={totalEmployees} />
                </div>
              </Card>
            </Col>
          </Row>
        </div>



      </div>

      <Row className="w-full">
        <Col xs={24} className="mb-24">
          <Card bordered={false} className="criclebox cardbody h-full">
            <div className="project-ant">
              <div className="flex items-center gap-2 mb-4">
                <FaShoppingCart style={{ fontSize: "20px", color: "#1890ff" }} />
                <Title level={5} style={{ margin: 0 }}>DANH SÁCH ĐƠN HÀNG</Title>
              </div>
              <div className="ant-filtertabs">
                <div className="antd-pro-pages-dashboard-analysis-style-salesExtra">
                  <Radio.Group onChange={(e) => setFilter(e.target.value)} defaultValue="all">
                    <Radio.Button value="all">Tất cả</Radio.Button>
                    <Radio.Button value="vnpay">VNPAY</Radio.Button>
                    <Radio.Button value="Cash">Tiền mặt</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
            </div>
            <div className="ant-list-box table-responsive px-2 overflow-x-auto max-h-[370px]">
              <table className="width-100">
                <thead >
                  <tr>
                    <th>Mã đơn</th>
                    <th>Sản phẩm</th>
                    <th>Khách hàng</th>
                    <th>Trạng thái đơn</th>
                    <th>Ngày mua</th>
                    <th>Tổng đơn</th>
                    <th>Hình thức thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((order, index) => (
                    <tr key={index}>
                      <td><h6>{order.orderId}</h6></td>

                      <td style={{ maxWidth: "1000px", wordWrap: "break-word", whiteSpace: "normal" }}>
                        {order.orderDetails.map((item: any, index: number) => {
                          const productName = `${item.optionResponse[0].product.productName} ${item.optionResponse[0].optionValue}`;

                          return (
                            <div key={index}>
                              <span>{item.quantity} x </span>
                              {productName.length > 50 ? (
                                <Tooltip title={productName}>
                                  <span
                                    className="cursor-pointer text-blue-500 hover:underline whitespace-normal"
                                    onClick={() => showProductModal(item.optionResponse[0].product)}
                                  >
                                    {productName.slice(0, 50) + "..."}
                                  </span>
                                </Tooltip>
                              ) : (
                                <span
                                  className="cursor-pointer text-blue-500 hover:underline whitespace-normal"
                                  onClick={() => showProductModal(item.optionResponse[0].product)}
                                >
                                  {productName}
                                </span>
                              )}
                              {index < order.orderDetails.length - 1 ? ", " : ""}
                            </div>
                          );
                        })}
                      </td>


                      <td>
                        <span
                          className="cursor-pointer text-blue-500 font-semibold flex items-center gap-1 hover:underline"
                          onClick={() => showModal(users.find((user: any) => user.id === order.userId))}
                        >
                          {users.find((user: any) => user.id === order.userId)?.username || order.userId}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded font-semibold ${order.status === "PAID" || order.status === "SUCCESS" || order.status === "success"
                            ? "bg-green-500 text-white"
                            : order.status === "Đã hủy"
                              ? "bg-red-500 text-white"
                              : "bg-gray-300 text-black"
                            }`}
                        >
                          {order.status === "PAID" || order.status === "success" || order.status === "SUCCESS" ? "Thành công" : "Đã huỷ"}
                        </span>

                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <MdDateRange style={{ fontSize: "16px", color: "#1890ff" }} />
                          {new Date(order.createAt).toLocaleDateString("vi-VN")}
                        </div>
                      </td>


                      <td>
                        <Tooltip
                          title={
                            <div>
                              {order.orderDetails.map((item: any, index: number) => (
                                <div key={index}>
                                  {`${item.optionResponse[0].optionValue} x ${item.quantity}: `}
                                  <strong>
                                    {(item.price * item.quantity).toLocaleString("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    })}
                                  </strong>
                                </div>
                              ))}
                            </div>
                          }
                        >
                          <span className="cursor-pointer text-blue-500 font-semibold flex items-center gap-1 hover:underline">
                            {order.totalPrices.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                          </span>
                        </Tooltip>
                      </td>

                      <td >
                        <div className="flex items-center gap-2">
                          <MdOutlinePayment style={{ fontSize: "16px" }} />
                          {(order.paymentMethod === "Cash" || order.paymentMethod === "CASH")
                            ? "Tiền mặt" :
                            (order.paymentMethod === "VNPAY" || order.paymentMethod === "vnpay")
                              ? "VNPay" : "Khác"}
                        </div>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Thông Tin Khách Hàng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {selectedCustomer && (
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-2">
              <FaIdBadge className="text-blue-500" />
              <b>ID:</b> {selectedCustomer.id}
            </p>
            <p className="flex items-center gap-2">
              <FaUserCircle className="text-blue-500" />
              <b>Tên người dùng:</b> {selectedCustomer.username}
            </p>
            <p className="flex items-center gap-2">
              <FaPhone className="text-blue-500" />
              <b>SĐT:</b> {selectedCustomer.phone}
            </p>
            <p className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <b>Trạng thái:</b> {selectedCustomer.status ? "Hoạt động" : "Không hoạt động"}
            </p>
          </div>
        )}
      </Modal>

      <Modal open={isProductModalOpen} onCancel={closeProductModal} footer={null}>
        {selectedProduct && (
          <div className="max-h-[70vh] overflow-y-auto p-2">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Chi tiết sản phẩm {selectedProduct.productName}</h2>

            {/* Hiển thị nhiều hình ảnh sản phẩm */}
            <div className="flex gap-2 overflow-x-auto mb-4">
              {selectedProduct.images.map((img: any, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt="Sản phẩm"
                  className="w-24 h-24 object-cover rounded-lg border shadow-md"
                />
              ))}
            </div>

            {/* Thông tin chi tiết */}
            <div className="grid grid-cols-2 gap-4">
              <p><b>Thương hiệu:</b> {selectedProduct.brand.brandName}</p>
              <p><b>Xuất xứ:</b> {selectedProduct.originCountry}</p>
              <p><b>Loại sản phẩm:</b> {selectedProduct.tag?.category?.categoryName}</p>
              <p><b>Loại da:</b> {selectedProduct.skinType.skinName}</p>
            </div>

            {/* Mô tả sản phẩm */}
            <div className="mt-4">
              <b>Mô tả:</b>
              <p className="text-gray-600">{selectedProduct.description}</p>
            </div>

            <div className="mt-4">
              <b>Tổng số lượng sản phẩm:</b>
              <p className="text-gray-600">{totalQuantity}</p>
            </div>

            {/* Tùy chọn sản phẩm */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-700">Tùy chọn sản phẩm:</h3>
              {selectedProduct.options.map((_option: any, index: number) => (
                <div key={index} className="border p-4 rounded-lg shadow-sm mt-2">

                  <div className="grid grid-cols-2 gap-4 ml-12">
                    <div className="col-span-1">
                      <Label className="block text-sm font-bold text-blue-500 text-left mb-1">
                        Tên tùy chọn
                      </Label>
                      <p className="w-full">{_option.optionValue}</p>
                    </div>
                    <div className="col-span-1">
                      <Label className="block text-sm font-bold text-blue-500 text-left mb-1">
                        Số lượng
                      </Label>
                      <p className="w-full">{_option.quantity}</p>
                    </div>
                  </div>


                  <div className="grid grid-cols-2 gap-4 mt-3 ml-12">
                    <div className="col-span-1">
                      <Label className="block text-sm font-bold text-blue-500 text-left mb-1">
                        Giá gốc
                      </Label>
                      <p className="w-full">{_option.optionPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}</p>
                    </div>
                    <div className="col-span-1">
                      <Label className="block text-sm font-bold text-blue-500 text-left mb-1">
                        Giá khuyến mãi
                      </Label>
                      <p className="w-full">{_option.discPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}</p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-2 mt-6">
                    {_option.optionImages.map((img: any, idx: number) => (
                      <img key={idx} src={img} alt="Hình ảnh" className="w-16 h-16 rounded-lg" />
                    ))}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>

  );
}

export default Home;
