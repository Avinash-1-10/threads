import React from "react";
import LineGraph from "../components/dashboard/LineGraph";
import UserCard from "../components/dashboard/UserCard";

const Dasboard = () => {
  return (
    <div>
      <UserCard />
      <LineGraph />
    </div>
  );
};

export default Dasboard;
