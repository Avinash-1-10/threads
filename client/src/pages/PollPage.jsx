import React, { useEffect, useState } from "react";
import Poll from "../components/poll";
import { useParams } from "react-router-dom";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";

const PollPage = () => {
  const [pollData, setPollData] = useState({});
  const [loading, setLoading] = useState(false)
  const { pid } = useParams();
  const showToast = useShowToast();

  const getPoll = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`/api/v1/poll/${pid}`);
      setPollData(data.data);

    } catch (error) {
      showToast("Error", error.response.data.message || error.message, "error");
    } finally{
      setLoading(false)
    }
  };

  useEffect(()=>{
    getPoll()

  },[])

  if(loading){
    return <div>
     <h1>Loading</h1>
    </div>
  }

  return <div>
    <Poll pollData={pollData}/>
  </div>;
};

export default PollPage;
