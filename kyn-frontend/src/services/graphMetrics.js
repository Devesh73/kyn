import axios from "axios";

export const fetchGraphMetrics = async () => {
  try {
    const response = await axios.get("/api/graph-metrics");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch graph metrics.");
  }
};
