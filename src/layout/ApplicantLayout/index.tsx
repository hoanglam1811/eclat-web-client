import { Outlet } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";

const ClientLayout = () => {
  return (
    <>
      <div className="flex flex-col gap-8 h-screen">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default ClientLayout;
