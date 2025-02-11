import { Link } from "react-router-dom";
import { useSelector } from "react-redux"; import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../constants/api";
import { Button } from "antd/lib";

const EnterNewPasswordStep = ({ formData }: { formData: any }) => {
  const user = useSelector((state: any) => state.token.user);

  return (
    <>
      <div>
        <div>
          <form className="bg-gray-50 p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
            {/* Tiêu đề */}
            <h2 className="text-3xl font-bold text-blue-700 mb-8 border-b-2 pb-4">
              Nhập mật khẩu mới
            </h2>

            {/* Submit */}
            <div className="flex justify-end mt-6">
              <Button
                //onClick={handleNext} 
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Tiếp theo
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EnterNewPasswordStep;
