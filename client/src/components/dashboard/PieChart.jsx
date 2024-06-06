import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import userAtom from "../../atoms/userAtom";
import { useRecoilValue } from "recoil";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = () => {
  const user = useRecoilValue(userAtom);
  const [chartData, setChartData] = useState({
    labels: ["Verified Followers", "Normal Followers"],
    datasets: [
      {
        data: [10, 10],
        backgroundColor: ["rgba(53, 162, 235, 0.5)", "rgba(255, 99, 132, 0.5)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  });

  const getData = async () => {
    try {
      const {data} = await axios.get(`/api/v1/dashboard/user/followers/count/${user._id}`);
     const count  = data.data;
      setChartData(
        {
          labels: ["Verified Followers", "Normal Followers"],
          datasets: [
            {
              data: [count.verifiedCount, count.normalCount],
              backgroundColor: ["rgba(53, 162, 235, 0.5)", "rgba(255, 99, 132, 0.5)"],
              borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
              borderWidth: 1,
            },
          ],
        }
      )
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
      <Box width={"100%"} maxWidth={"400px"}>
        <Pie data={chartData} options={options} />
      </Box>
    </Flex>
  );
};

export default PieChart;
