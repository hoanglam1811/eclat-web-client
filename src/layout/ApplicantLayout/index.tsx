import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";

const ClientLayout = () => {
  return (
    <>
      <div className="flex flex-col justify-between h-screen">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default ClientLayout;
