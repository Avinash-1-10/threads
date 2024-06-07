import React from "react";
import LineGraph from "../components/dashboard/LineGraph";
import UserCard from "../components/dashboard/UserCard";
import BarChart from "../components/dashboard/BarChart";
import PieChart from "../components/dashboard/PieChart";
import { Box } from "@chakra-ui/react";

const Dasboard = () => {
  return (
    <Box mb={20}>
      <UserCard />
      <LineGraph />
      {/* <BarChart/> */}
      <PieChart/>
    </Box>
  );
};

export default Dasboard;
