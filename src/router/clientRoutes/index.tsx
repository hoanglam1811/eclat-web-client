import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import Login from "../commonRoutes/Login/index.tsx";
import Register from "../commonRoutes/Register/index.tsx";
import Home from "./Home/index.tsx";
import ProductDetails from "./ProductDetails/index.tsx";
import Cart from "./Cart/index.tsx";

const publicRoutes: RouteObject[] = [
  {
    path: RouteNames.LOGIN,
    element: <Login />,
  },
  {
    path: RouteNames.REGISTER,
    element: <Register />,
  },
  {
    path: RouteNames.HOME,
    element: <Home />,
  },
  {
    path: RouteNames.PRODUCT_DETAIL,
    element: <ProductDetails />,
  },
  {
    path: RouteNames.CART,
    element: <Cart />,
  }
];

const privateRoutes: RouteObject[] = [
  // {
  //   path: RouteNames.ACCOUNT_INFO,
  //   element: <AccountInfo />,
  // },
];

const clientRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to={RouteNames.HOME} replace />,
  },
  ...publicRoutes,
];

export default clientRoutes;
