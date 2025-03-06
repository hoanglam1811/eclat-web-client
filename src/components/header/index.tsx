import RouteNames from "../../constants/routeNames";
import navigation from "../../constants/multilingual/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import LogoImage from "@/assets/Éclat.png";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ArrowUpOutlined, LoginOutlined, ShoppingCartOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from "react";
import { removeToken, removeUser } from "../../reducers/tokenSlice";
import RoleNames from "../../constants/roleNames";
import { CgProfile } from "react-icons/cg";
import { AlertDialog, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { LogOut } from "lucide-react";
import { ChatOutlined } from "@mui/icons-material";
import { Button, Input, Modal, notification, Popover } from "antd";
import { GEMINI_CONTEXT_PROMPT } from "../../constants/gemini";
import { gemini } from "../../services/ApiServices/geminiService";
import ReactMarkdown from "react-markdown";

const Header = () => {
  const user = useSelector((state: RootState) => state.token.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const aiChatRef = useRef<any>(null);

  const [isOpen, setIsOpen] = useState(false);
  // const [userMessage, setUserMessage] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState<any>(GEMINI_CONTEXT_PROMPT);
  const [aiInput, setAiInput] = useState<string>("");
  const [visible, setVisible] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setVisible(false); // Ẩn navbar khi cuộn xuống
      } else {
        setVisible(true); // Hiện navbar khi cuộn lên
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAiInput = async () => {
    try {
      //When first open
      if (aiChatHistory == GEMINI_CONTEXT_PROMPT) {
        const response = await gemini(aiChatHistory);
        // console.log(response)
        setAiChatHistory({
          ...aiChatHistory,
          contents: [
            ...aiChatHistory.contents,
            response?.candidates?.[0]?.content,
          ]
        })
        return
      }
      if (aiInput == "") {
        notification.error({ message: "Bạn cần nhập vào trước khi gửi!!" })
        return;
      }
      setAiInput("");
      const updatedHistory = {
        ...aiChatHistory,
        contents: [
          ...aiChatHistory.contents,
          { role: "user", parts: [{ text: aiInput }] }
        ]
      };
      // console.log(updatedHistory);

      setAiChatHistory(updatedHistory);
      const response = await gemini(updatedHistory);
      // console.log(response)
      setAiChatHistory({
        ...updatedHistory,
        contents: [
          ...updatedHistory.contents,
          response?.candidates?.[0]?.content,
        ]
      })

    } catch (error: any) {
      // setError(error.toString());
      console.error("Error fetching skin types", error);
    }
    finally {
      setIsLoading(false);
    }
  }


  const updateCartCount = () => {
    const storedCart = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
    const totalItems = storedCart.reduce((total: any, item: any) => total + item.quantity, 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    updateCartCount();

    const handleCartChange = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartChange);
    handleAiInput()

    return () => {
      window.removeEventListener("cartUpdated", handleCartChange);
    };
  }, []);

  useEffect(() => {
    if (aiChatRef.current) {
      aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
    }
  }, [aiChatHistory])

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
  console.log(user)
  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#f8f7da",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          position: "fixed",
          top: visible ? "0" : "-100px",
          transition: "top 0.3s",
          width: "100%",
          zIndex: 1000,
        }}
      >
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            style={{
              position: "fixed",
              bottom: "42px",
              right: "100px",
              backgroundColor: "#ff9aa2",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            <ArrowUpOutlined />
          </button>
        )}
        <img
          src={LogoImage}
          alt="Éclat Skincare Logo"
          style={{ height: "80px" }}
          onClick={() => navigate("/")}
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
            }}
          >

            {user?.role !== RoleNames.STAFF && (
              <>

                <li
                  className="mr-5"
                  style={{ position: "relative", cursor: "pointer" }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link to={RouteNames.PRODUCTS}>{navigation.PRODUCTS}</Link>
                </li>
                <li><Link to={RouteNames.BRANDS}>{navigation.BRANDS}</Link></li>
                <li><Link to={RouteNames.BEAUTY_BLOG}>{navigation.BEAUTY_BLOG}</Link></li>
                <li><Link to={RouteNames.SKIN_QUIZ}>{navigation.SKIN_QUIZ}</Link></li>
                <li>
                  <Link
                    to={RouteNames.CART}
                    className="relative flex items-center text-gray-700 hover:text-blue-600 transition"
                  >
                    <ShoppingCartOutlined style={{ fontSize: "22px" }} className="mr-2" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
              </>
            )}
            {user?.role === RoleNames.STAFF && (
              <>
                <li><Link to={RouteNames.PRODUCTS_MANAGEMENT}>{navigation.PRODUCTS_MANAGEMENT}</Link></li>
                <li><Link to={RouteNames.TAGS_MANAGEMENT}>{navigation.TAGS_MANAGEMENT}</Link></li>
                <li><Link to={RouteNames.CATEGORIES_MANAGEMENT}>{navigation.CATEGORIES_MANAGEMENT}</Link></li>
                <li><Link to={RouteNames.BRANDS_MANAGEMENT}>{navigation.BRANDS_MANAGEMENT}</Link></li>
                <li><Link to={RouteNames.SKIN_TYPES_MANAGEMENT}>{navigation.SKIN_TYPES_MANAGEMENT}</Link></li>
              </>
            )}
            {user && <li className="mr-5">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <UserOutlined style={{ fontSize: "22px" }} />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="bg-white shadow-lg rounded-xl w-48 p-3 z-99">
                  <DropdownMenuLabel className="font-semibold text-lg text-gray-700">
                    Tài khoản
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Profile */}
                  <DropdownMenuItem
                    onClick={handleProfileClick}
                    className="flex items-center p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <CgProfile className="mr-3 text-xl text-gray-600" />
                    <span className="text-gray-700">Hồ sơ</span>
                  </DropdownMenuItem>

                  {/* Log out */}
                  <AlertDialog>
                    {/* Wrap DropdownMenuItem with AlertDialogTrigger */}
                    <AlertDialogTrigger onClick={handleLogout} asChild>
                      <div className="flex items-center p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors cursor-pointer">
                        <LogOut className="mr-3 text-xl" />
                        <span>Đăng xuất</span>
                      </div>
                    </AlertDialogTrigger>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>}
            {!user && <li className="mr-5 flex gap-3">
              <Link to={RouteNames.LOGIN} className="flex items-center text-gray-700 hover:text-blue-600 transition">
                <span className="text-gray-700">Đăng nhập</span>
              </Link>
              <span className="text-gray-700">|</span>
              <Link to={RouteNames.REGISTER} className="flex items-center text-gray-700 hover:text-blue-600 transition">
                <span className="text-gray-700">Đăng ký</span>
              </Link>
            </li>}
          </ul>
        </nav>
      </header>

      <div className="flex justify-center items-center">
        <Popover
          content={
            <div className="w-[324px] h-[455px] p-2">
              <h3 className="text-sm font-bold text-center">Trợ lý AI Eclat</h3>

              {/* Chat Messages (Placeholder) */}
              <div className="h-[85%] overflow-y-auto p-2" ref={aiChatRef}>
                <div>
                  {aiChatHistory?.contents.map((chat: any, index: number) => (
                    <>
                      {index ?
                        chat.role == "user" ? (
                          <div className="flex justify-end mt-2" key={index}>
                            <p className="max-w-[200px] p-[10px] border bg-[#0084FF] text-white rounded-[18px]">{chat?.parts?.[0]?.text}</p>
                          </div>
                        ) : (
                          <div className="flex justify-start mt-2" key={index}>
                            <p className="max-w-[200px] p-[10px] border bg-[#E4E6EB] text-black rounded-[18px]" >
                              <ReactMarkdown>{chat?.parts?.[0]?.text}</ReactMarkdown>
                            </p>
                          </div>
                        )
                        : <></>}
                    </>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <form className="h-[15%] mt-2 flex" onSubmit={(e) => {
                e.preventDefault();
                handleAiInput();
              }}>
                <Input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Hãy nhập tin nhắn..."
                />
                <Button htmlType="submit" type="primary" className="ml-2">
                  Gửi
                </Button>
              </form>
            </div>
          }
          title={null}
          trigger="click"
          placement="topLeft"
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <div className="setting-drwer flex justify-center items-center">
            <ChatOutlined style={{ fontSize: "22px", cursor: "pointer" }} />
          </div>
        </Popover>
      </div>
    </>
  );
};

export default Header;

