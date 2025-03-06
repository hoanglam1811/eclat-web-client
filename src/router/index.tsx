import { createBrowserRouter } from "react-router-dom";
import ClientLayout from "../layout/ApplicantLayout/index";
import NoLayout from "../layout/NoLayout/index";
import NotFound from "./commonRoutes/404";
import clientRoutes from "./clientRoutes";
import adminRoutes from "./adminRoutes";
import commonRoutes from "./commonRoutes";
import Main from "../components/layout/Main";
import staffRoutes from "./clientRoutes/staff";
import StaffMain from "../components/staff-layout/StaffMain";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [...clientRoutes],
    errorElement: <NotFound />,
  },
  {
    path: "/staff",
    element: <StaffMain />,
    children: [...staffRoutes],
    errorElement: <NotFound />,
  },
  {
    path: "/admin",
    element: <Main/>,
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
