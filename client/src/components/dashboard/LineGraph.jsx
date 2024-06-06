import React, { useEffect, useState } from "react";
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
import axios from "axios";
import userAtom from "../../atoms/userAtom";
import { useRecoilValue } from "recoil";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineGraph = () => {
  const [chartData, setChartData] = useState(null);
  const [interval, setInterval] = useState("daily");
  const user = useRecoilValue(userAtom);

  const getFollowData = async (interval) => {
    try {
      const response = await axios.get(
        `/api/v1/dashboard/user/${user._id}/${interval}`
      );
      const data = response.data;

      const formattedData = {
        labels: data.labels,
        datasets: [
          {
            label: "Followers",
            data: data.data.followers || 0,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "Following",
            data: data.data.following || 0,
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      };

      setChartData(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFollowData(interval);
  }, [interval]);

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
      {chartData ? (
        <Line options={options} data={chartData} />
      ) : (
        <p>Loading data...</p>
      )}

      <Flex gap={5} mt={5} justifyContent={"space-between"}>
        <Button
          onClick={() => setInterval("daily")}
          className={interval === "daily" ? "active" : ""}
        >
          Daily
        </Button>
        <Button
          onClick={() => setInterval("weekly")}
          className={interval === "weekly" ? "active" : ""}
        >
          Weekly
        </Button>
        <Button
          onClick={() => setInterval("monthly")}
          className={interval === "monthly" ? "active" : ""}
        >
          Monthly
        </Button>
        <Button
          onClick={() => setInterval("yearly")}
          className={interval === "yearly" ? "active" : ""}
        >
          Yearly
        </Button>
      </Flex>
    </div>
  );
};

export default LineGraph;
