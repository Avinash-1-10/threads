import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Box, Flex } from "@chakra-ui/react";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = () => {
  const data = {
    labels: ["Verified Followers", "Normal Followers"],
    datasets: [
      {
        data: [120, 380],
        backgroundColor: ["rgba(53, 162, 235, 0.5)", "rgba(255, 99, 132, 0.5)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Verified vs Normal Followers",
      },
    },
  };

  return (
    <Flex
      maxHeight={"400px"}
      justifyContent={"center"}
      pt={5}
      borderTop={"1px solid"}
      borderColor={"gray.dark"}
      mt={5}
    >
      <Pie data={data} options={options} />
    </Flex>
  );
};

export default PieChart;
