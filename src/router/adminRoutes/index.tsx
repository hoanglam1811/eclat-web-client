import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import Billing from "./Billing";
import Home from "./Home";
import Profile from "./Profile";
import Rtl from "./Rtl";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Tables from "./Tables";
import StaffManagement from "./StaffManagement";
import SkincareQuiz from "../clientRoutes/QuizManagement";
import SkincareBlogManagement from "../clientRoutes/BlogManagement";

const publicRoutes: RouteObject[] = [
  {
    path: RouteNames.BILLING,
    element: <Billing/>,
  },
  {
    path: RouteNames.ADMIN_HOME,
    element: <Home />,
  },
  {
    path: RouteNames.ADMIN_PROFILE,
    element: <Profile/>,
  },
  {
    path: RouteNames.ADMIN_RTL,
    element: <Rtl />,
  },
  {
    path: RouteNames.ADMIN_SIGNIN,
    element: <SignIn />,
  },
  {
    path: RouteNames.ADMIN_SIGNUP,
    element: <SignUp />,
  },
  {
    path: RouteNames.STAFF_MANAGEMENT,
    element: <StaffManagement />,
  },
  {
    path: RouteNames.SKINCARE_QUIZ_MANAGEMENT,
    element: <SkincareQuiz />,
  },
  {
    path: RouteNames.BLOG_MANAGEMENT,
    element: <SkincareBlogManagement />,
  },
  {
    path: RouteNames.ADMIN_TABLES,
    element: <Tables/>,
  }
];

const privateRoutes: RouteObject[] = [
  // {
  //   path: RouteNames.ACCOUNT_INFO,
  //   element: <AccountInfo />,
  // },
];

const adminRoutes: RouteObject[] = [
  {
     path: "/admin",
     element: <Navigate to={RouteNames.ADMIN_HOME} replace />,
  },
  ...publicRoutes,
];

export default adminRoutes;
