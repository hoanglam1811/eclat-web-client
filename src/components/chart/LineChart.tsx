import ReactApexChart from "react-apexcharts";
import { Button, notification, Select, Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import lineChart from "./configs/lineChart";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllOrders } from "../../services/ApiServices/orderService";
import { ApexOptions } from "apexcharts";

function LineChart({ }) {
  const { Title } = Typography;
  const [chartData, setChartData] = useState<any>({ dates: [], vnpayData: [], cashData: [], totalRevenue: 0 });
  const [selectedYear, setSelectedYear] = useState<any>(null);

  const handleYearChange = (selectedOption: any) => {
    if(selectedOption == 0) {
      setSelectedYear(null)
      return;
    }
    setSelectedYear(selectedOption);
  };  
  const [selectedMonth, setSelectedMonth] = useState<any>(null);

  const handleMonthChange = (selectedOption: any) => {
    if(selectedOption == 0) {
      setSelectedMonth(null)
      return;
    }
    setSelectedMonth(selectedOption);
  };

  const yearOptions = [
    { value: 0, label: "Xóa lựa chọn" },
      ...Array.from({ length: 30 }, (_, i) => ({
          value: new Date().getFullYear() - i,
          label: (new Date().getFullYear() - i).toString(),
      }))
  ];

  
  const monthOptions = [
    { value: 0, label: "Xóa lựa chọn" },
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" },
  ];

  const handleSubmitLineChart = async () => {
    if (!token) return;
    if(selectedMonth && !selectedYear) {
      notification.error({ message: "Vui lòng chọn năm!" })
      return
    }
    if(!selectedMonth && !selectedYear) {
      await fetchOrders();
      return
    }
    
    let totalRevenue = 0;
    try{
      const orders = await getAllOrders(token);
      const revenueByDate: any = {};

      orders.forEach((order: any) => {
          const orderDate = new Date(order.createAt);
          const year = orderDate.getFullYear();
          const month = orderDate.getMonth() + 1;
          const date = orderDate.getDate();
 
          // Format based on selection
          let key = `${date}/${month}/${year}`; // Default (day/month/year)
          if (selectedYear && !selectedMonth) key = `${month}/${year}`; // Month/Year if only year is selected
          // if (!selectedYear && !selectedMonth) key = `${year}`; // Group by year if no filter
          
          const revenue = order.orderDetails.reduce((sum: any, detail: any) => sum + detail.price * detail.quantity, 0);
          totalRevenue += revenue;

          if (!revenueByDate[key]) {
              revenueByDate[key] = { vnpay: 0, cash: 0 };
          }

          if (order.paymentMethod.toLowerCase() === "vnpay") {
              revenueByDate[key].vnpay += revenue;
          } else if (order.paymentMethod.toLowerCase() === "cash") {
              revenueByDate[key].cash += revenue;
          }
      });

      let dates: string[] = [];
      if (selectedYear && !selectedMonth) {
          // Nếu chỉ chọn năm, tạo đủ 12 tháng
          dates = Array.from({ length: 12 }, (_, i) => `${i + 1}/${selectedYear}`);
      } else if (selectedYear && selectedMonth) {
          // Nếu chọn cả năm và tháng, tạo đủ ngày trong tháng
          const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
          dates = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}/${selectedMonth}/${selectedYear}`);
      }

      // Điền giá trị 0 nếu không có dữ liệu
      const vnpayData = dates.map((date) => revenueByDate[date]?.vnpay || 0);
      const cashData = dates.map((date) => revenueByDate[date]?.cash || 0);      
      //Thay đổi lại tên 
      if (selectedYear && !selectedMonth) {
          // Nếu chỉ chọn năm, tạo đủ 12 tháng
          dates = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
      }
      setChartData({ dates, vnpayData, cashData, totalRevenue });
    } catch (error) {
      console.error("Error fetching orders:", error);
      notification.error({ message: "Đã có lỗi xảy ra!" })
    }
  };

  const token = useSelector((state: RootState) => state.token.token);

  const fetchOrders = async () => {
      if (!token) return;
      try {
        const orders = await getAllOrders(token);
        const processedData = processChartData(orders);
        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching orders:", error);
        notification.error({ message: "Đã có lỗi xảy ra!" })
      }
    };

  useEffect(() => {
    

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
    let totalRevenue = 0;

    orders.forEach((order: any) => {
      const date = new Date(order.createAt).toLocaleDateString("vi-VN");

      const revenue = order.orderDetails.reduce((sum: any, detail: any) => sum + detail.price * detail.quantity, 0);
      console.log("revenue", revenue);

      totalRevenue += revenue;

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


    const dates = Object.keys(revenueByDate).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/").map(Number);
      const [dayB, monthB, yearB] = b.split("/").map(Number);

      return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
    });
    const vnpayData = dates.map((date) => revenueByDate[date].vnpay);
    const cashData = dates.map((date) => revenueByDate[date].cash);

    return { dates, vnpayData, cashData, totalRevenue };
  };


  return (
    <>
      <div className="linechart">
        <Title level={5}>
          Doanh thu: {chartData.totalRevenue.toLocaleString("vi-VN")} VNĐ
        </Title>
        <div className="sales">
          <ul>
            <li><MinusOutlined /> VNPAY</li>
            <li><MinusOutlined /> Tiền mặt</li>
          </ul>
        </div>
      </div>
      <div className="w-full flex gap-2 justify-end items-center">
        <Select
            options={monthOptions}
            value={selectedMonth}
            onChange={handleMonthChange}
            style={{ width: '20%' }}
            placeholder="Chọn tháng"
        />
        <Select
            options={yearOptions}
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: '20%' }}
            placeholder="Chọn năm"
        />
        
        <Button type="primary" onClick={handleSubmitLineChart}>Tìm kiếm</Button>

      </div>
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </>
  );
}

export default LineChart;
