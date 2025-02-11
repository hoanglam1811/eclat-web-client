import { RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";

const publicRoutes: RouteObject[] = [
  {
    // path: RouteNames.HOME,
    // element: <Home />,
  },
  {
    path: RouteNames.LOGIN,
    element: <Login />,
  },
  {
    path: RouteNames.REGISTER,
    element: <Register />,
  },
  {
    path: RouteNames.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
];

const privateRoutes: RouteObject[] = [
  // {
  //   path: RouteNames.ACCOUNT_INFO,
  //   element: <AccountInfo />,
  // },
];

const commonRoutes: RouteObject[] = [
  {
    // path: "/",
    // element: <Navigate to={RouteNames.HOME} replace />,
  },
  ...publicRoutes,
];

export default commonRoutes;
