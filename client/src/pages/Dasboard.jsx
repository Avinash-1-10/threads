import React from "react";
import LineGraph from "../components/dashboard/LineGraph";
import UserCard from "../components/dashboard/UserCard";
import BarChart from "../components/dashboard/BarChart";

const Dasboard = () => {
  return (
    <div>
      <UserCard />
      <LineGraph />
      <BarChart/>
    </div>
  );
};

export default Dasboard;
