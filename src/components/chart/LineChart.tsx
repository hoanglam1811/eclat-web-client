import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import lineChart from "./configs/lineChart";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllOrders } from "../../services/ApiServices/orderService";
import { ApexOptions } from "apexcharts";

function LineChart({ }) {
  const { Title } = Typography;
  const [chartData, setChartData] = useState<any>({ dates: [], vnpayData: [], cashData: [] });
  const token = useSelector((state: RootState) => state.token.token);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const orders = await getAllOrders(token);
        const processedData = processChartData(orders);
        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token]);

  const options: ApexOptions = {
    chart: {
      width: "100%",
      height: 350,
      type: "area", // Sửa lỗi bằng cách dùng đúng kiểu
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 600,
          colors: ["#8c8c8c"],
        },
      },
    },
    xaxis: {
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 600,
          colors: Array(9).fill("#8c8c8c"),
        },
      },
      // categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      categories: chartData?.dates,
    },
    tooltip: {
      y: {
        formatter: (val: any) => val.toLocaleString(),
      },
    },
  };

  const series = [
    { name: "VNPAY", data: chartData.vnpayData, offsetY: 0 },
    { name: "Tiền mặt", data: chartData.cashData, offsetY: 0 },
  ];

  const processChartData = (orders: any) => {
    const revenueByDate: any = {};

    orders.forEach((order: any) => {
      const date = new Date(order.createAt).toLocaleDateString("vi-VN");
      
      const revenue = order.orderDetails.reduce((sum: any, detail: any) => sum + detail.price * detail.quantity * 1, 0);
      console.log("revenue", revenue);

      if (!revenueByDate[date]) {
        revenueByDate[date] = { vnpay: 0, cash: 0 };
      }

      if (order.paymentMethod.toLowerCase() === "vnpay") {
        revenueByDate[date].vnpay += revenue;
      } else if (order.paymentMethod.toLowerCase() === "cash") {
        revenueByDate[date].cash += revenue;
      }
    });
    console.log("revenueByDate", revenueByDate);
    

    const dates = Object.keys(revenueByDate).sort();
    const vnpayData = dates.map((date) => revenueByDate[date].vnpay);
    const cashData = dates.map((date) => revenueByDate[date].cash);

    return { dates, vnpayData, cashData };
  };


  return (
    <>
      <div className="linechart">
        <Title level={5}>Doanh thu</Title>
        <div className="sales">
          <ul>
            <li><MinusOutlined /> VNPAY</li>
            <li><MinusOutlined /> Tiền mặt</li>
          </ul>
        </div>
      </div>
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </>
  );
}

export default LineChart;
