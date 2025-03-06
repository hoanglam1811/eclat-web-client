import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Button,
  Avatar,
  Typography,
  notification,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { getAllUsers } from "../../services/ApiServices/userService";

const { Title } = Typography;

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Tên người dùng",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Email",
    key: "email",
    dataIndex: "email",
  },
  {
    title: "Số điện thoại",
    key: "phone",
    dataIndex: "phone",
  },
  {
    title: "Trạng thái",
    key: "status",
    dataIndex: "status",
  }
];

function CustomerManagement() {
  const onChange = (e: any) => {
    if (e.target.value == "b") {
      setCustomers(users.filter((user: any) => user.role.includes("Customer") && user.status))
    }
    else if (e.target.value == "c") {
      setCustomers(users.filter((user: any) => user.role.includes("Customer") && !user.status))
    }
    else {
      setCustomers(users.filter((user: any) => user.role.includes("Customer")))
    }
  }

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const token = useSelector((state: RootState) => state.token.token);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(customers?.length / ITEMS_PER_PAGE);
  const paginatedCustomers = customers?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchUsers = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const response = await getAllUsers(token);
      setUsers(response.result);
      setCustomers(response.result.filter((user: any) => user.role.includes("Customer")));
      console.log(response)
    }
    catch (err: any) {
      notification.error({
        message: "Lỗi lấy người dùng không thành công",
      })
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="tabled w-full">
        <Row gutter={[24, 0]} className="w-full">
          <Col xs="24" xl={24} className="w-full">
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Tài khoản Staff"
              extra={
                <>
                  <Radio.Group onChange={onChange} defaultValue="a">
                    <Radio.Button value="a">Tất cả</Radio.Button>
                    <Radio.Button value="b">Hoạt động</Radio.Button>
                    <Radio.Button value="c">Không hoạt động</Radio.Button>
                  </Radio.Group>
                </>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={paginatedCustomers.map((user: any, index: number) => (
                    {
                      key: index,
                      id: (
                        <>
                          <Avatar.Group>
                            <div className="avatar-info">
                              <Title level={5}>{user.id}</Title>
                            </div>
                          </Avatar.Group>{" "}
                        </>
                      ),
                      username: (
                        <>
                          <div className="author-info">
                            <Title level={5}>{user.username ?? "N/A"}</Title>
                          </div>
                        </>
                      ),
                      email: (
                        <>
                          <div className="author-info">
                            <Title level={5}>{user.email ?? "N/A"}</Title>
                          </div>
                        </>
                      ),
                      phone: (
                        <>
                          <div className="author-info">
                            <Title level={5}>{user.phone ?? "N/A"}</Title>
                          </div>
                        </>
                      ),
                      status: (
                        <>
                          <Button className={`${user.status ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-500 text-white"}`}>
                            {user.status ? "Hoạt động" : "Không hoạt động"}
                          </Button>
                        </>
                      )
                    }
                  ))}
                  pagination={false}
                  className="ant-border-space"
                />
              </div>
              <div style={{ marginTop: "20px", marginRight: "10px", marginBottom: '10px', textAlign: 'right' }}>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    style={{
                      margin: "0 5px",
                      padding: "5px 10px",
                      backgroundColor: currentPage === index + 1 ? "#419f97" : "#f1f1f1",
                      color: currentPage === index + 1 ? "white" : "black",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default CustomerManagement;
