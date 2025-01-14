import RouteNames from "../../constants/routeNames";
import navigation from "../../constants/multilingual/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import LogoImage from "@/assets/Éclat.png";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from "react";
import { removeToken, removeUser } from "../../reducers/tokenSlice";
import RoleNames from "../../constants/roleNames";
import { CgProfile } from "react-icons/cg";
import { AlertDialog, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { LogOut } from "lucide-react";



const Header = () => {
  const user = useSelector((state: RootState) => state.token.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownVisible(false);
  };

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(removeToken());
      dispatch(removeUser());
      localStorage.removeItem("token");
      navigate(RouteNames.HOME);
      setIsLoading(false);
    }, 500);
  };

  const handleProfileClick = () => {
    // if (user) {
    //   if (user.role.toLowerCase() === RoleNames.ADMIN.toLowerCase()) {
    //     navigate(`${RouteNames.ACCOUNT}`);
    //   }

    //   if (user.role.toLowerCase() === RoleNames.CUSTOMER.toLowerCase()) {
    //     navigate(`${RouteNames.ACCOUNT}`);
    //   }

    //   if (user.role.toLowerCase() === RoleNames.STAFF.toLowerCase()) {
    navigate(`${RouteNames.ACCOUNT}`);
    //   }
    // }
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f8f7da",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <img
        src={LogoImage}
        alt="Éclat Skincare Logo"
        style={{ height: "80px" }}
      />
      <nav>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: "20px",
            margin: 0,
            padding: 0,
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          <li
            className="mr-5"
            style={{ position: "relative", cursor: "pointer" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link to={RouteNames.PRODUCTS}>{navigation.PRODUCTS}</Link>
            {isDropdownVisible && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "-500%", 
                  backgroundColor: "#fff",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
                  padding: "15px",
                  display: "flex",
                  flexDirection: "row",
                  gap: "30px",
                  zIndex: 1,
                  borderRadius: "8px", 
                  minWidth: "300px",
                  fontSize: "14px", 
                }}
              >
                {categories.map((category) => (
                  <div key={category.name} style={{ minWidth: "120px" }}>
                    <strong style={{ display: "block", marginBottom: "10px", fontSize: "14px" }}>
                      {category.name}
                    </strong>
                    <ul style={{ paddingLeft: "10px", margin: 0, fontSize: "12px" }}>
                      {category.items.map((item) => (
                        <li key={item} style={{ marginBottom: "5px" }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </li>
          <li className="mr-5">
            <Link to={RouteNames.SPECIAL_CARE}>{navigation.SPECIAL_CARE}</Link>
          </li>
          <li className="mr-5">
            <Link to={RouteNames.BRANDS}> {navigation.BRANDS}</Link>
          </li>
          <li className="mr-5">
            <Link to={RouteNames.BEAUTY_BLOG}>{navigation.BEAUTY_BLOG}</Link>
          </li>
          <li className="mr-5">
            <Link to={RouteNames.SKIN_QUIZ}>{navigation.SKIN_QUIZ}</Link>
          </li>
          <li className="mr-5">
            <Link to={RouteNames.CART} className="flex items-center text-gray-700 hover:text-blue-600 transition">
              <ShoppingCartOutlined style={{ fontSize: "22px" }} className="mr-2" />
            </Link>
          </li>
          <li className="mr-5">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <UserOutlined style={{ fontSize: "22px" }} />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-white shadow-lg rounded-xl w-48 p-3 z-99">
                <DropdownMenuLabel className="font-semibold text-lg text-gray-700">
                  Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Profile */}
                <DropdownMenuItem
                  onClick={handleProfileClick}
                  className="flex items-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CgProfile className="mr-3 text-xl text-gray-600" />
                  <span className="text-gray-700">Profile</span>
                </DropdownMenuItem>

                {/* Log out */}
                <AlertDialog>
                  {/* Wrap DropdownMenuItem with AlertDialogTrigger */}
                  <AlertDialogTrigger onClick={handleLogout} asChild>
                    <div className="flex items-center p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                      <LogOut className="mr-3 text-xl" />
                      <span>Log out</span>
                    </div>
                  </AlertDialogTrigger>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

const categories = [
  {
    name: "Làm Sạch Da",
    items: [
      "Tẩy Trang Mặt",
      "Sữa Rửa Mặt",
      "Tẩy Tế Bào Chết Da Mặt",
      "Toner / Nước Cân Bằng Da",
    ],
  },
  {
    name: "Đặc Trị",
    items: ["Serum / Tinh Chất", "Hỗ Trợ Trị Mụn"],
  },
  {
    name: "Dưỡng Ẩm",
    items: [
      "Xịt Khoáng",
      "Lotion / Sữa Dưỡng",
      "Kem / Gel / Dầu Dưỡng",
    ],
  },
  {
    name: "Chống Nắng",
    items: [],
  },
  {
    name: "Dưỡng Mắt",
    items: [],
  },
  {
    name: "Dưỡng Môi",
    items: [],
  },
  {
    name: "Mặt Nạ",
    items: [],
  },
  {
    name: "Dụng Cụ Chăm Sóc Da",
    items: [
      "Bông Tẩy Trang",
      "Dụng Cụ / Máy Rửa Mặt",
      "Máy Xông Mặt / Đẩy Tinh Chất",
    ],
  },
];

