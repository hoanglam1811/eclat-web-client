import { createBrowserRouter } from "react-router-dom";
import ClientLayout from "../layout/ApplicantLayout/index";
import NoLayout from "../layout/NoLayout/index";
import NotFound from "./commonRoutes/404";
import clientRoutes from "./clientRoutes";
import adminRoutes from "./adminRoutes";
import commonRoutes from "./commonRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [...clientRoutes],
    errorElement: <NotFound />,
  },
  {
    path: "/admin",
    // element: <DefaultLayout />,
    children: [...adminRoutes],
    errorElement: <NotFound />,
  },
  {
    element: <NoLayout />,
    children: [...commonRoutes],
    errorElement: <NotFound />,
  },
]);

export default router;
