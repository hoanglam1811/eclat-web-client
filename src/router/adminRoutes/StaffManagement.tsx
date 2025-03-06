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
  Tooltip,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import face6 from "../../assets/images/face-6.jpeg";
import { useEffect, useState } from "react";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { deleteUser, getAllUsers } from "../../services/ApiServices/userService";
import AddStaffModal from "./StaffManagement/AddStaffForm";

const { Title } = Typography;

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: "32%",
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
    title: "Ngày tạo",
    key: "create_at",
    dataIndex: "create_at",
  },
  {
    title: "Trạng thái",
    key: "status",
    dataIndex: "status",
  },
  {
    title: "",
    key: "action",
    dataIndex: "action",
  },
];

function StaffManagement() {
  const onChange = (e: any) => {
    if (e.target.value == "b") {
      setStaffs(users.filter((user: any) => user.role.includes("Staff") && user.status))
    }
    else if (e.target.value == "c") {
      setStaffs(users.filter((user: any) => user.role.includes("Staff") && !user.status))
    }
    else {
      setStaffs(users.filter((user: any) => user.role.includes("Staff")))
    }
  }

  const [loading, setLoading] = useState(false);
  const [openAddStaff, setOpenAddStaff] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);
  const token = useSelector((state: RootState) => state.token.token);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(staffs?.length / ITEMS_PER_PAGE);
  const paginatedStaffs = staffs?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleInactiveStaff = async (userId: string) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const response = await deleteUser(userId, token);
      notification.success({ message: "Xóa người dùng thành công" })
      fetchUsers()
      console.log(response)
    }
    catch (err: any) {
      notification.error({
        message: "Lỗi xóa người dùng không thành công",
      })
    }
    finally {
      setLoading(false);
    }
  }

  const fetchUsers = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const response = await getAllUsers(token);
      setUsers(response.result);
      setStaffs(response.result.filter((user: any) => user.role.includes("Staff")));
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
                    <Radio.Button value="c">Ngừng hoạt động</Radio.Button>
                  </Radio.Group>
                  <Button type="primary" className="ml-7" onClick={() => setOpenAddStaff(true)}>
                    <PlusOutlined className="mr-1" />
                    Thêm Staff
                  </Button>
                </>
              }
            >
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={paginatedStaffs.map((user: any, index: number) => (
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
                            <Title level={5}>{user.username}</Title>
                          </div>
                        </>
                      ),
                      email: (
                        <>
                          <div className="author-info">
                            <Title level={5}>{user.email}</Title>
                          </div>
                        </>
                      ),
                      phone: (
                        <>
                          <div className="author-info">
                            <Title level={5}>{user.phone}</Title>
                          </div>
                        </>
                      ),
                      create_at: (
                        <>
                          <div className="ant-employed">
                            <span>{user.create_at}</span>
                          </div>
                        </>
                      ),
                      status: (
                        <>
                          <Button className={`${user.status ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-500 text-white"}`}>
                            {user.status ? "Hoạt động" : "Ngừng hoạt động"}
                          </Button>
                        </>
                      ),
                      action: (
                        <>
                          {user.status && <Tooltip title="Đổi trạng thái nhân viên">
                            <Button type="text" onClick={() => handleInactiveStaff(user.id)}>
                              <DeleteOutlined style={{ color: "red", fontSize: "15px" }} />
                            </Button>
                          </Tooltip>}
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
        {openAddStaff && (
          <AddStaffModal
            isOpen={openAddStaff}
            setIsOpen={setOpenAddStaff}
            fetchStaffs={fetchUsers}
          />
        )}
      </div>
    </>
  );
}

export default StaffManagement;
