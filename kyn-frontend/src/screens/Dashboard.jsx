import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatBotContainer from "../components/ChatBotContainer";
import InfluenceAnalysisCard from "../components/Dashboard/InfluenceAnalysisCard";
import TrendingInterestsCard from "../components/Dashboard/TrendingInterestsCard";
import InteractionTrends from "../components/Dashboard/InteractionTrends";
import ActiveCommunities from "../components/Dashboard/ActiveCommunities";
import GeographicInsights from "../components/Dashboard/GeographicInsights";
import CommunityGraphComponent from "../components/Dashboard/CommunityGraphComponent";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [apiData, setApiData] = useState(null);

  const fetchData = async () => {
    try {
      const cachedData = localStorage.getItem("dashboardData");

      if (cachedData) {
        setApiData(JSON.parse(cachedData));
        setDataLoaded(true);
        return;
      }

      const [loadDataRes, graphMetricsRes, communityInsightsRes] = await Promise.all([
        axios.get("/api/load-data"),
        axios.get("/api/graph-metrics"),
        axios.get("/api/community-insights"),
      ]);

      const loadData = loadDataRes.data;
      const graphMetrics = graphMetricsRes.data;
      const communityInsights = communityInsightsRes.data;

      const newApiData = { loadData, graphMetrics, communityInsights };

      setApiData(newApiData);
      localStorage.setItem("dashboardData", JSON.stringify(newApiData));
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-800 relative">
      {/* Loading Pop-Up */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg text-center animate-fade-in-out">
            <div className="loader"></div>
            <h2 className="text-xl font-bold mt-2">Loading Data...</h2>
          </div>
        </div>
      )}

      {!loading && dataLoaded && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          style={{ animation: "fade-out 1s forwards" }}
          onAnimationEnd={() => setDataLoaded(false)}
        >
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="line"></span>
                <span className="line-tip"></span>
                <span className="line-long"></span>
              </div>
            </div>
            <h2 className="text-green-600 text-lg font-bold mt-2">Data Loaded!</h2>
          </div>
        </div>
      )}

      {/* Dashboard Layout */}
      <div className="container mx-auto p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <TrendingInterestsCard />
          <ActiveCommunities />
          <InfluenceAnalysisCard />
        </div>

        {/* Right Column */}
        <div className="col-span-2 grid grid-rows-2 gap-6">
            <InteractionTrends />
            <GeographicInsights />
        </div>  

        {/* Bottom Row */}
        <div className="col-span-3 gap-6">
            <CommunityGraphComponent />
        </div>
      </div>

    {/* Collapsible Chatbot */}
      <div className="min-h-scree relative">
        <ChatBotContainer />
      </div>
    </div>
  );
};
export default Dashboard;

