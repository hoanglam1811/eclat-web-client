import { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Radio, Modal } from "antd";
import { FaShoppingCart, FaUserCircle, FaPhone, FaIdBadge, FaCheckCircle } from "react-icons/fa";
import { MdDateRange, MdOutlinePayment } from "react-icons/md";
import LineChart from "../../components/chart/LineChart";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { getAllPayments } from "../../services/ApiServices/vnpayService";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { getAllOrders } from "../../services/ApiServices/orderService";
import { getAllUsers } from "../../services/ApiServices/userService";


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

  const orders = [
    {
      orderId: "DH001",
      product: "Serum Vitamin C",
      quantity: 5,
      status: "Thành công",
      paymentMethod: "VNPAY",
      purchaseDate: "2025-02-26",
      customer: {
        id: "KH001",
        username: "Nguyễn Văn A",
        phone: "0987654321",
        status: "Active",
      },
      productDetails: {
        productName: "Serum Vitamin C",
        brand: "Skincare Pro",
        origin: "Hàn Quốc",
        category: "Serum",
        skinType: "Mọi loại da",
        description: "Serum dưỡng da giúp làm sáng và đều màu da, giàu vitamin C.",
        images: [
          "https://example.com/serum-vitamin-c-1.jpg",
          "https://example.com/serum-vitamin-c-2.jpg",
        ],
        options: [
          {
            optionValue: "30ml",
            quantity: 10,
            optionPrice: 500000,
            discPrice: 450000,
            images: ["https://example.com/serum-vitamin-c-30ml.jpg"],
          },
          {
            optionValue: "50ml",
            quantity: 5,
            optionPrice: 700000,
            discPrice: 650000,
            images: ["https://example.com/serum-vitamin-c-50ml.jpg"],
          },
        ],
      },
    },
    {
      orderId: "DH002",
      product: "Kem dưỡng ẩm",
      purchaseDate: "2025-02-26",
      quantity: 3,
      status: "Thành công",
      paymentMethod: "Tiền mặt",
      customer: {
        id: "KH002",
        username: "Trần Thị B",
        phone: "0978123456",
        status: "Pending",
      },
      productDetails: {
        productName: "Kem dưỡng ẩm",
        brand: "AquaSkin",
        origin: "Nhật Bản",
        category: "Kem dưỡng",
        skinType: "Da khô",
        description: "Kem dưỡng ẩm giúp cấp nước và giữ ẩm cho da trong 24h.",
        images: [
          "https://example.com/kem-duong-am-1.jpg",
          "https://example.com/kem-duong-am-2.jpg",
        ],
        options: [
          {
            optionValue: "50g",
            quantity: 8,
            optionPrice: 350000,
            discPrice: 320000,
            images: ["https://example.com/kem-duong-am-50g.jpg"],
          },
          {
            optionValue: "100g",
            quantity: 4,
            optionPrice: 600000,
            discPrice: 550000,
            images: ["https://example.com/kem-duong-am-100g.jpg"],
          },
        ],
      },
    },
    {
      orderId: "DH003",
      product: "Toner Hoa Hồng",
      purchaseDate: "2025-02-26",
      quantity: 2,
      status: "Thành công",
      paymentMethod: "VNPAY",
      customer: {
        id: "KH003",
        username: "Lê Quốc C",
        phone: "0912345678",
        status: "Inactive",
      },
      productDetails: {
        productName: "Toner Hoa Hồng",
        brand: "NatureCare",
        origin: "Pháp",
        category: "Toner",
        skinType: "Da nhạy cảm",
        description: "Toner chiết xuất từ hoa hồng giúp cân bằng độ pH và làm dịu da.",
        images: [
          "https://example.com/toner-hoa-hong-1.jpg",
          "https://example.com/toner-hoa-hong-2.jpg",
        ],
        options: [
          {
            optionValue: "150ml",
            quantity: 6,
            optionPrice: 250000,
            discPrice: 220000,
            images: ["https://example.com/toner-hoa-hong-150ml.jpg"],
          },
        ],
      },
    },
    {
      orderId: "DH004",
      product: "Sữa rửa mặt dịu nhẹ",
      purchaseDate: "2025-02-26",
      quantity: 6,
      status: "Thành công",
      paymentMethod: "Tiền mặt",
      customer: {
        id: "KH004",
        username: "Phạm Minh D",
        phone: "0901234567",
        status: "Active",
      },
      productDetails: {
        productName: "Sữa rửa mặt dịu nhẹ",
        brand: "FreshSkin",
        origin: "Mỹ",
        category: "Sữa rửa mặt",
        skinType: "Da dầu",
        description: "Sữa rửa mặt giúp làm sạch bụi bẩn và kiểm soát dầu nhờn.",
        images: [
          "https://example.com/sua-rua-mat-1.jpg",
          "https://example.com/sua-rua-mat-2.jpg",
        ],
        options: [
          {
            optionValue: "100ml",
            quantity: 15,
            optionPrice: 300000,
            discPrice: 270000,
            images: ["https://example.com/sua-rua-mat-100ml.jpg"],
          },
          {
            optionValue: "200ml",
            quantity: 8,
            optionPrice: 500000,
            discPrice: 450000,
            images: ["https://example.com/sua-rua-mat-200ml.jpg"],
          },
        ],
      },
    },
    {
      orderId: "DH005",
      product: "Mặt nạ dưỡng da",
      purchaseDate: "2025-02-26",
      quantity: 4,
      status: "Thành công",
      paymentMethod: "VNPAY",
      customer: {
        id: "KH005",
        username: "Ngô Thị E",
        phone: "0967123456",
        status: "Active",
      },
      productDetails: {
        productName: "Mặt nạ dưỡng da",
        brand: "GlowUp",
        origin: "Hàn Quốc",
        category: "Mặt nạ",
        skinType: "Da thường",
        description: "Mặt nạ cấp ẩm sâu, giúp da căng bóng và mịn màng.",
        images: [
          "https://example.com/mat-na-1.jpg",
          "https://example.com/mat-na-2.jpg",
        ],
        options: [
          {
            optionValue: "Hộp 5 miếng",
            quantity: 12,
            optionPrice: 150000,
            discPrice: 130000,
            images: ["https://example.com/mat-na-5-mieng.jpg"],
          },
          {
            optionValue: "Hộp 10 miếng",
            quantity: 6,
            optionPrice: 280000,
            discPrice: 250000,
            images: ["https://example.com/mat-na-10-mieng.jpg"],
          },
        ],
      },
    },
  ];

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [order, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const token = useSelector((state: RootState) => state.token.token);
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
    filter === "all" ? order : order.filter((order) => order.paymentMethod === filter);

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
      console.log("users",users);
      setUsers(users.result);
      setOrders(response);
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
      <Row className="w-full">
        <Col xs={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <LineChart />
          </Card>
        </Col>
      </Row>

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
            <div className="ant-list-box table-responsive px-2">
              <table className="width-100">
                <thead >
                  <tr>
                    <th>Mã đơn</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng mua</th>
                    <th>Khách hàng</th>
                    <th>Trạng thái đơn</th>
                    <th>Ngày mua</th>
                    <th>Hình thức thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr key={index}>
                      <td><h6>{order.orderId}</h6></td>
                      <td
                        style={{ maxWidth: "1000px", display: "block", wordWrap: "break-word", whiteSpace: "normal" }}
                      >
                        {order.orderDetails.map((item: any, index: number) => (
                          <span key={index}
                            className="cursor-pointer text-blue-500 hover:underline whitespace-normal"
                            onClick={() => showProductModal(item.optionResponse[0].product)}
                          >
                            {item.optionResponse[0].product.productName + " "
                              + item.optionResponse[0].optionValue +
                              (index < order.orderDetails.length - 1 ? ", " : "")}
                          </span>
                        ))}

                      </td>
                      <td><span className="text-xs font-weight-bold">{order.orderDetails
                        .reduce((sum: number, item: any) => sum + item.quantity, 0)}</span></td>
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
                          className={`px-2 py-1 rounded font-semibold ${order.status === "PAID" || "SUCCESS"
                            ? "bg-green-500 text-white"
                            : order.status === "Đã hủy"
                              ? "bg-red-500 text-white"
                              : "bg-gray-300 text-black"
                            }`}
                        >
                          {order.status === "PAID" || "SUCCESS" ? "Thành công" : "Đã huỷ"}
                        </span>
                      </td>

                      <td >
                        <div className="flex items-center gap-2">
                          <MdDateRange style={{ fontSize: "16px", color: "#1890ff" }} />
                          {order.createAt.split(" ")[0]}
                        </div>

                      </td>

                      <td >
                        <div className="flex items-center gap-2">
                          <MdOutlinePayment style={{ fontSize: "16px" }} />
                          {order.paymentMethod === "Cash" ? "Tiền mặt" : order.paymentMethod === "vnpay" ? "VNPay" : "Khác"}
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
              <b>Username:</b> {selectedCustomer.username}
            </p>
            <p className="flex items-center gap-2">
              <FaPhone className="text-blue-500" />
              <b>Phone:</b> {selectedCustomer.phone}
            </p>
            <p className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <b>Status:</b> {selectedCustomer.status ? "Hoạt động" : "Không hoạt động"}
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
                      <p className="w-full">{_option.optionPrice}</p>
                    </div>
                    <div className="col-span-1">
                      <Label className="block text-sm font-bold text-blue-500 text-left mb-1">
                        Giá khuyến mãi
                      </Label>
                      <p className="w-full">{_option.discPrice}</p>
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
