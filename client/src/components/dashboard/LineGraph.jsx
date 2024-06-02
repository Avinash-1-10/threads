import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button, Flex } from "@chakra-ui/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const generateData = (interval) => {
  const labels = {
    daily: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    weekly: ["Week 1", "Week 2", "Week 3", "Week 4"],
    monthly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    yearly: ["2018", "2019", "2020", "2021", "2022", "2023"],
  };

  const data = {
    daily: {
      followers: [20, 30, 40, 50, 60, 70, 80],
      following: [10, 15, 25, 35, 45, 55, 65],
    },
    weekly: {
      followers: [150, 200, 250, 300],
      following: [100, 150, 200, 250],
    },
    monthly: {
      followers: [300, 350, 400, 450, 500, 550, 600],
      following: [200, 250, 300, 350, 400, 450, 500],
    },
    yearly: {
      followers: [1000, 1200, 1400, 1600, 1800, 2000],
      following: [800, 1000, 1200, 1400, 1600, 1800],
    },
  };

  return {
    labels: labels[interval],
    datasets: [
      {
        label: "Followers",
        data: data[interval].followers,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Following",
        data: data[interval].following,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
};

const LineGraph = () => {
  const [interval, setInterval] = useState("daily");
  const [chartData, setChartData] = useState(generateData(interval));

  const handleIntervalChange = (newInterval) => {
    setInterval(newInterval);
    setChartData(generateData(newInterval));
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Follower and Following Data (${interval})`,
      },
    },
  };

  return (
    <div>
      <Line options={options} data={chartData} />

      <Flex gap={5} mt={5} justifyContent={"space-between"}>
        <Button
          onClick={() => handleIntervalChange("daily")}
          className={interval === "daily" ? "active" : ""}
        >
          Daily
        </Button>
        <Button
          onClick={() => handleIntervalChange("weekly")}
          className={interval === "weekly" ? "active" : ""}
        >
          Weekly
        </Button>
        <Button
          onClick={() => handleIntervalChange("monthly")}
          className={interval === "monthly" ? "active" : ""}
        >
          Monthly
        </Button>
        <Button
          onClick={() => handleIntervalChange("yearly")}
          className={interval === "yearly" ? "active" : ""}
        >
          Yearly
        </Button>
      </Flex>
    </div>
  );
};

export default LineGraph;
