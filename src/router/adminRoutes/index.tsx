import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import Home from "./Home";
import StaffManagement from "./StaffManagement";
import SkincareQuiz from "../clientRoutes/QuizManagement";
import SkincareBlogManagement from "../clientRoutes/BlogManagement";
import CustomerManagement from "./CustomerManagement";

const publicRoutes: RouteObject[] = [
  {
    path: RouteNames.ADMIN_HOME,
    element: <Home />,
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
    path: RouteNames.ADMIN_CUSTOMER_MANAGEMENT,
    element: <CustomerManagement />,
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
