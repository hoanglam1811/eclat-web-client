import { LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ScreenSpinner from "../ScreenSpinner";
import { useDispatch, useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import RouteNames from "../../constants/routeNames";
import { removeToken, removeUser } from "../../reducers/tokenSlice";
import RoleNames from "../../constants/roleNames";
import { RootState } from "../../store/store";

const HeaderAvatar = () => {
  const avatar = useSelector((state: RootState) => state.token.avatar);
  const user = useSelector((state: RootState) => state.token.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

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
    if (user) {
      if (user.role.toLowerCase() === RoleNames.ADMIN.toLowerCase()) {
        navigate(`${RouteNames.PROFILE}`);
      }

      if (user.role.toLowerCase() === RoleNames.CUSTOMER.toLowerCase()) {
        navigate(`${RouteNames.PROFILE}`);
      }

      if (user.role.toLowerCase() === RoleNames.STAFF.toLowerCase()) {
        navigate(`${RouteNames.PROFILE}`);
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage
              src={avatar || "https://github.com/shadcn.png"}
              alt="@shadcn"
              className=""
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-white shadow-lg rounded-xl w-48 p-3">
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
            <AlertDialogTrigger asChild>
              <div className="flex items-center p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                <LogOut className="mr-3 text-xl" />
                <span>Log out</span>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-semibold text-gray-800">
                  Are you sure you want to log out?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  Logging out will redirect you to the homepage.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-200 rounded-md px-4 py-2">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-red-500 text-white rounded-md px-4 py-2"
                >
                  Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>

      {isLoading && <ScreenSpinner />}
    </>
  );
};

export default HeaderAvatar;
