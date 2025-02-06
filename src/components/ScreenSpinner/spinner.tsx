import { Spin } from "antd";

const Spinner = ({ tip = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="p-6 bg-white rounded-full shadow-lg">
        <Spin size={"large"} tip={tip} />
      </div>
    </div>
  );
};

export default Spinner;
