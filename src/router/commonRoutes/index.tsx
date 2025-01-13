import { Navigate, RouteObject } from "react-router-dom";

const publicRoutes: RouteObject[] = [
  {
    // path: RouteNames.HOME,
    // element: <Home />,
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
