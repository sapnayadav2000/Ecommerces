import React, { useEffect, useState } from "react";
import Pagetitle from "./pagetitle";
import useAsync from "../../Hooks/useAsync";
import AdminServices from "../../services/adminServices";
import ReactApexChart from "react-apexcharts";

function Dashboard() {
  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
  });

  const [monthlyChart, setMonthlyChart] = useState({ series: [], options: {} });
  const [weeklyChart, setWeeklyChart] = useState({ series: [], options: {} });

  const { data, error, isLoading } = useAsync(AdminServices.dashboard);
  console.log("dashboard", data);

  useEffect(() => {
    if (data && data.data) {
      const {
        totalUsers = 0,
        totalProducts = 0,
        totalOrders = 0,
        OrderPending = 0,
        OrderCancelled = 0,
        CompleteOrder = 0,
        totalAmount = 0,
        OrderReturn = 0,
        COD = 0,
        razorPay = 0,
        monthlyOrders = [],
        monthlyLabels = [],
        weeklyOrders = [],
        weeklyLabels = [],
      } = data.data;

      // Dashboard Summary Data
      setChartData({
        categories: [
          "Users",
          "Products",
          "Orders",
          "OrderPending",
          "CompleteOrder",
          "TotalAmount",
          "COD",
          "OrderCancelled",
          "razorPay",
          "OrderReturn",
        ],
        series: [
          {
            name: "Dashboard Counts",
            data: [
              totalUsers,
              totalProducts,
              totalOrders,
              OrderPending,
              CompleteOrder,
              totalAmount,
              COD,
              OrderCancelled,
              razorPay,
              OrderReturn,
            ],
          },
        ],
      });

      // Monthly Orders Chart
      setMonthlyChart({
        series: [{ name: "Orders", data: monthlyOrders }],
        options: {
          chart: {
            type: "bar",
            height: 350,
            toolbar: { show: false },
            animations: {
              enabled: true,
              easing: "easeinout",
              speed: 800,
              animateGradually: { enabled: true, delay: 150 },
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "50%",
              borderRadius: 8,
              endingShape: "rounded",
            },
          },
          dataLabels: { enabled: false },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
          },
          fill: {
            type: "gradient",
            gradient: {
              shade: "light",
              type: "vertical",
              shadeIntensity: 0.5,
              gradientToColors: ["#FF9068"],
              inverseColors: false,
              opacityFrom: 0.9,
              opacityTo: 0.7,
              stops: [0, 100],
            },
          },
          xaxis: {
            categories: monthlyLabels,
            labels: { style: { fontSize: "12px", fontWeight: 600 } },
          },
          yaxis: {
            title: { text: "Orders" },
            labels: { style: { fontSize: "12px", fontWeight: 600 } },
          },
          tooltip: {
            y: {
              formatter: (val) => `${val} orders`,
            },
          },
          title: {
            text: "📅 Monthly Orders Overview",
            align: "center",
            style: { fontSize: "18px", fontWeight: "bold", color: "#333" },
          },
        },
      });

      // Weekly Orders Chart
      setWeeklyChart({
        series: [{ name: "Orders", data: weeklyOrders }],
        options: {
          chart: {
            type: "area",
            height: 350,
            toolbar: { show: false },
            zoom: { enabled: false },
            animations: {
              enabled: true,
              easing: "easeinout",
              speed: 800,
            },
          },
          stroke: {
            curve: "smooth",
            width: 3,
            colors: ["#42A5F5"],
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 0.4,
              opacityFrom: 0.6,
              opacityTo: 0.2,
              stops: [0, 100],
            },
          },
          markers: {
            size: 6,
            colors: ["#fff"],
            strokeColors: "#42A5F5",
            strokeWidth: 3,
            hover: { size: 8 },
          },
          xaxis: {
            categories: weeklyLabels,
            labels: { style: { fontSize: "12px", fontWeight: 600 } },
          },
          yaxis: {
            title: { text: "Orders" },
            labels: { style: { fontSize: "12px", fontWeight: 600 } },
          },
          tooltip: {
            y: {
              formatter: (val) => `${val} orders`,
            },
          },
          title: {
            text: "📈 Weekly Orders Trend",
            align: "center",
            style: { fontSize: "18px", fontWeight: "bold", color: "#333" },
          },
        },
      });
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main_container">
      <div className="right_col" role="main">
        <div className="top-sec-heading">
          <Pagetitle />
        </div>

        <div className="container-box-inner">
          <div className="row g-4">
            {/* Dashboard Cards */}
            <div className="col-xl-4 col-sm-6">
              <div
                className="g-box g-box1"
                style={{ borderLeft: "4px solid red" }}
              >
                <div className="g-box-inner">
                  <h4>{data?.data?.totalUsers}</h4>
                  <img src="/admin/img/total-user.svg" alt="Total Users" />
                </div>
                <p>Total Users</p>
              </div>
            </div>

            <div className="col-xl-4 col-sm-6">
              <div
                className="g-box g-box1"
                style={{ borderLeft: "4px solid red" }}
              >
                <div className="g-box-inner">
                  <h4>{data?.data?.OrderPending}</h4>
                  <img
                    src="/admin/img/category-img.svg"
                    alt="Total Order Pending"
                  />
                </div>
                <p>Total Order Pending</p>
              </div>
            </div>
            <div className="col-xl-4 col-sm-6">
              <div
                className="g-box g-box1"
                style={{ borderLeft: "4px solid red" }}
              >
                <div className="g-box-inner">
                  <h4>{data?.data?.OrderCancelled}</h4>
                  <img
                    src="/admin/img/category-img.svg"
                    alt="Total Order Pending"
                  />
                </div>
                <p>Total Order Cancel</p>
              </div>
            </div>

            <div className="col-xl-4 col-sm-6">
              <div
                className="g-box g-box1 mt-3"
                style={{ borderLeft: "4px solid red" }}
              >
                <div className="g-box-inner">
                  <h4>{data?.data?.totalAmount}</h4>
                  <img src="/admin/img/total-brand.svg" alt="Total Amount" />
                </div>
                <p>Total Amount</p>
              </div>
            </div>

            <div className="col-xl-4 col-sm-6">
              <div
                className="g-box g-box1 mt-3"
                style={{ borderLeft: "4px solid red" }}
              >
                <div className="g-box-inner">
                  <h4>{data?.data?.COD}</h4>
                  <img src="/admin/img/total-product.svg" alt="Total COD" />
                </div>
                <p>Total Cash On Delivery</p>
              </div>
            </div>

            <div className="col-xl-4 col-sm-6">
              <div
                className="g-box g-box1 mt-3"
                style={{ borderLeft: "4px solid red" }}
              >
                <div className="g-box-inner">
                  <h4>{data?.data?.OrderReturn}</h4>
                  <img src="/admin/img/total-banner.svg" alt="Total Payment" />
                </div>
                <p>Total Order Return</p>
              </div>
            </div>
            <div className="col-xl-4 col-sm-6">
              <div
                className="g-box g-box1 mt-3"
                style={{ borderLeft: "4px solid red" }}
              >
                <div className="g-box-inner">
                  <h4>{data?.data?.razorPay}</h4>
                  <img src="/admin/img/total-banner.svg" alt="Total Payment" />
                </div>
                <p>Total RazorPay</p>
              </div>
            </div>

            <div className="col-xl-4 col-sm-6">
              <div
                className="g-box g-box1 mt-3"
                style={{ borderLeft: "4px solid red" }}
              >
                <div className="g-box-inner">
                  <h4>{data?.data?.totalOrders}</h4>
                  <img src="/admin/img/total-order.svg" alt="Total Orders" />
                </div>
                <p>Total Orders</p>
              </div>
            </div>
          </div>

          {/* Monthly and Weekly Graphs */}
          <div className="row mt-5">
            <div className="col-md-12 bg-white rounded shadow-sm p-4">
              <ReactApexChart
                options={monthlyChart.options}
                series={monthlyChart.series}
                type="bar"
                height={350}
              />
            </div>
            <div className="col-md-12 mt-4 bg-white rounded shadow-sm p-4">
              <ReactApexChart
                options={weeklyChart.options}
                series={weeklyChart.series}
                type="area"
                height={350}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
