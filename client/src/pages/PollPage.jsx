import React, { useEffect, useState } from "react";
import Poll from "../components/poll";
import { useParams } from "react-router-dom";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import NotFound from "../components/NotFound";
import PostPageSkeleton from "../skeletons/PostPageSkeleton";
import BackButton from "../components/BackButton";
import { Box } from "@chakra-ui/react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PollPage = () => {
  const [pollData, setPollData] = useState({});
  const [loading, setLoading] = useState(false);
  const { pid } = useParams();
  const showToast = useShowToast();

  const getPoll = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/poll/${pid}`);
      setPollData(data.data);
    } catch (error) {
      showToast("Error", error.response.data.message || error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPoll();
  }, []);

  if (loading) {
    return <PostPageSkeleton />;
  }

  if (!pollData._id) {
    return <NotFound text={"Poll"} />;
  }

  return (
    <div>
      <Box mb={6}>
        <BackButton />
      </Box>
      <Poll pollData={pollData} />
    </div>
  );
};

export default PollPage;
