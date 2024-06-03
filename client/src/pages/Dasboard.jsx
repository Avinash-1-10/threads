import React from "react";
import LineGraph from "../components/dashboard/LineGraph";
import UserCard from "../components/dashboard/UserCard";
import BarChart from "../components/dashboard/BarChart";
import PieChart from "../components/dashboard/PieChart";

const Dasboard = () => {
  return (
    <div>
      <UserCard />
      <LineGraph />
      <BarChart/>
      <PieChart/>
    </div>
  );
};

export default Dasboard;
