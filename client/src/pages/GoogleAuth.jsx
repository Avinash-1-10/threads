import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const GOOGLE_SUCCESS_URL = import.meta.env.GOOGLE_SUCCESS_URL;

const GoogleAuth = () => {
  const showToast = useShowToast();
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const { data } = await axios.get(GOOGLE_SUCCESS_URL, {
        withCredentials: true,
      });
      localStorage.setItem("threads-user", JSON.stringify(data?.data?.user));
      localStorage.setItem("threadsToken", data.data.threadsToken);
      showToast("Success", data.message, "success");
      navigate("/");
      window.location.reload();
    } catch (error) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "An error occurred";
      showToast("Error", errorMessage, "error");
      navigate("/auth");
      window.location.reload();
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return <div></div>;
};

export default GoogleAuth;
