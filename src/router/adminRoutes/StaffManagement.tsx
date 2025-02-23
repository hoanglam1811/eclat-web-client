import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Upload,
  message,
  Progress,
  Button,
  Avatar,
  Typography,
  notification,
} from "antd";

import { PlusOutlined, ToTopOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

// Images
import ava1 from "../../assets/images/logo-shopify.svg";
import ava2 from "../../assets/images/logo-atlassian.svg";
import ava3 from "../../assets/images/logo-slack.svg";
import ava5 from "../../assets/images/logo-jira.svg";
import ava6 from "../../assets/images/logo-invision.svg";
import face from "../../assets/images/face-1.jpg";
import face2 from "../../assets/images/face-2.jpg";
import face3 from "../../assets/images/face-3.jpg";
import face4 from "../../assets/images/face-4.jpg";
import face5 from "../../assets/images/face-5.jpeg";
import face6 from "../../assets/images/face-6.jpeg";
import pencil from "../../assets/images/pencil.svg";
import { useEffect, useState } from "react";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { getAllUsers } from "../../services/ApiServices/userService";
import AddStaffModal from "./StaffManagement/AddStaffForm";

const { Title } = Typography;

const formProps = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info:any) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
// table code start
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
    title: "Ngày chỉnh sửa",
    key: "update_at",
    dataIndex: "update_at",
  },
  {
    title: "Trạng thái",
    key: "status",
    dataIndex: "status",
  },
];

const data = [
  {
    key: "1",
    name: (
      <>
        <Avatar.Group>
          <Avatar
            className="shape-avatar"
            shape="square"
            size={40}
            src={face2}
          ></Avatar>
          <div className="avatar-info">
            <Title level={5}>Michael John</Title>
            <p>michael@mail.com</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          <Title level={5}>Manager</Title>
          <p>Organization</p>
        </div>
      </>
    ),

    status: (
      <>
        <Button type="primary" className="tag-primary">
          ONLINE
        </Button>
      </>
    ),
    employed: (
      <>
        <div className="ant-employed">
          <span>23/04/18</span>
          <a href="#pablo">Edit</a>
        </div>
      </>
    ),
  },

  {
    key: "2",
    name: (
      <>
        <Avatar.Group>
          <Avatar
            className="shape-avatar"
            shape="square"
            size={40}
            src={face3}
          ></Avatar>
          <div className="avatar-info">
            <Title level={5}>Alexa Liras</Title>
            <p>alexa@mail.com</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          <Title level={5}>Programator</Title>
          <p>Developer</p>
        </div>
      </>
    ),

    status: (
      <>
        <Button className="tag-badge">ONLINE</Button>
      </>
    ),
    employed: (
      <>
        <div className="ant-employed">
          <span>23/12/20</span>
          <a href="#pablo">Edit</a>
        </div>
      </>
    ),
  },

  {
    key: "3",
    name: (
      <>
        <Avatar.Group>
          <Avatar
            className="shape-avatar"
            shape="square"
            size={40}
            src={face}
          ></Avatar>
          <div className="avatar-info">
            <Title level={5}>Laure Perrier</Title>
            <p>laure@mail.com</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          <Title level={5}>Executive</Title>
          <p>Projects</p>
        </div>
      </>
    ),

    status: (
      <>
        <Button type="primary" className="tag-primary">
          ONLINE
        </Button>
      </>
    ),
    employed: (
      <>
        <div className="ant-employed">
          <span>03/04/21</span>
          <a href="#pablo">Edit</a>
        </div>
      </>
    ),
  },
  {
    key: "4",
    name: (
      <>
        <Avatar.Group>
          <Avatar
            className="shape-avatar"
            shape="square"
            size={40}
            src={face4}
          ></Avatar>
          <div className="avatar-info">
            <Title level={5}>Miriam Eric</Title>
            <p>miriam@mail.com</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          <Title level={5}>Marketing</Title>
          <p>Organization</p>
        </div>
      </>
    ),

    status: (
      <>
        <Button type="primary" className="tag-primary">
          ONLINE
        </Button>
      </>
    ),
    employed: (
      <>
        <div className="ant-employed">
          <span>03/04/21</span>
          <a href="#pablo">Edit</a>
        </div>
      </>
    ),
  },
  {
    key: "5",
    name: (
      <>
        <Avatar.Group>
          <Avatar
            className="shape-avatar"
            shape="square"
            size={40}
            src={face5}
          ></Avatar>
          <div className="avatar-info">
            <Title level={5}>Richard Gran</Title>
            <p>richard@mail.com</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          <Title level={5}>Manager</Title>
          <p>Organization</p>
        </div>
      </>
    ),

    status: (
      <>
        <Button className="tag-badge">ONLINE</Button>
      </>
    ),
    employed: (
      <>
        <div className="ant-employed">
          <span>23/03/20</span>
          <a href="#pablo">Edit</a>
        </div>
      </>
    ),
  },

  {
    key: "6",
    name: (
      <>
        <Avatar.Group>
          <Avatar
            className="shape-avatar"
            shape="square"
            size={40}
            src={face6}
          ></Avatar>
          <div className="avatar-info">
            <Title level={5}>John Levi</Title>
            <p>john@mail.com</p>
          </div>
        </Avatar.Group>{" "}
      </>
    ),
    function: (
      <>
        <div className="author-info">
          <Title level={5}>Tester</Title>
          <p>Developer</p>
        </div>
      </>
    ),

    status: (
      <>
        <Button className="tag-badge">ONLINE</Button>
      </>
    ),
    employed: (
      <>
        <div className="ant-employed">
          <span>14/04/17</span>
          <a href="#pablo">Edit</a>
        </div>
      </>
    ),
  },
];

function StaffManagement() {
  const onChange = (e:any) => console.log(`radio checked:${e.target.value}`);
  const [loading, setLoading] = useState(false);
  const [openAddStaff, setOpenAddStaff] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);
  const token = useSelector((state: RootState) => state.token.token);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    if(!token){
      navigate("/login");
      return;
    }
    try{
      setLoading(true);
      const response = await getAllUsers(token);
      setUsers(response.result);
      setStaffs(response.result.filter((user: any) => user.role.includes("Staff")));
      console.log(response)
    }
    catch(err: any){
      notification.error({
        message: "Lỗi lấy người dùng không thành công",
      })
    }
    finally{
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
                    <Radio.Button value="a">All</Radio.Button>
                    <Radio.Button value="b">ONLINE</Radio.Button>
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
                  dataSource={staffs.map((user:any, index:number) => (
                    {
                      key: index,
                      id: (
                        <>
                          <Avatar.Group>
                            <Avatar
                              className="shape-avatar"
                              shape="square"
                              size={40}
                              src={face6}
                            ></Avatar>
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
                      update_at: (
                        <>
                          <div className="ant-employed">
                            <span>{user.update_at}</span>
                          </div>
                        </>
                      ),
                      status: (
                        <>
                          <Button className={`${user.status ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-500"}`}>
                            {user.status ? "ACTIVE" : "INACTIVE"}
                          </Button>
                        </>
                      ),
                      
                    }
                  ))}
                  pagination={false}
                  className="ant-border-space"
                />
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
