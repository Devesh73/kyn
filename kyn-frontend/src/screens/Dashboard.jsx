import React, { useEffect, useState } from "react";
import axios from "axios";
import VisualizationCard from "../components/VisualizationCard";
import Card from "../components/Card";
import ChatBotContainer from "../components/ChatBotContainer";
import GraphVisualization from "../components/GraphVisualization";
import GraphMetricsCard from "../components/Dashboard/GraphMetricsCard";
import CommunityInsightsCard from "../components/Dashboard/CommunityInsightsCard";
import UserInteractionsCard from "../components/Dashboard/UserInteractionsCard"; // Assuming you've already created this component
import InfluenceAnalysisCard from "../components/InfluenceAnalysisCard"; // Make sure to import the new card
import TrendingInterestsCard from "../components/TrendingInterestsCard";
import InteractionTrends from "../components/InteractionTrends";
import ActiveCommunities from "../components/ActiveCommunities";
import GeographicInsights from "../components/GeographicInsights";
import FullGraphComponent from "../components/FullGraphComponent";
import GraphVisualizationComponent from "../components/GraphVisualizationComponent";
const Dashboard = () => {
  const [loading, setLoading] = useState(true); 
  const [dataLoaded, setDataLoaded] = useState(false); 
  const [apiData, setApiData] = useState(null); 
  const [userId, setUserId] = useState(""); // State for user ID input
  const [userInteractions, setUserInteractions] = useState(null); // Store user interactions data
  const [interactionsLoading, setInteractionsLoading] = useState(false); // Loading state for interactions

  // Sample line chart data
  const lineChartData = [
    { name: "Page A", uv: 4000, pv: 2400 },
    { name: "Page B", uv: 3000, pv: 1398 },
    { name: "Page C", uv: 2000, pv: 9800 },
    { name: "Page D", uv: 2780, pv: 3908 },
    { name: "Page E", uv: 1890, pv: 4800 },
    { name: "Page F", uv: 2390, pv: 3800 },
    { name: "Page G", uv: 3490, pv: 4300 },
  ];

  const fetchUserInteractions = async (userId) => {
    setInteractionsLoading(true);
    try {
      const response = await axios.get(`/api/user-interactions/${userId}`);
      setUserInteractions(response.data.interactions);
    } catch (error) {
      console.error("Error fetching user interactions:", error);
      setUserInteractions(null);
    } finally {
      setInteractionsLoading(false);
    }
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleSearch = () => {
    if (userId) {
      fetchUserInteractions(userId);
    }
  };

  useEffect(() => {
    // Function to load all data
    const loadData = async () => {
      try {
        const loadDataResponse = await fetch("/api/load-data");
        if (!loadDataResponse.ok) {
          throw new Error(`Error: ${loadDataResponse.statusText}`);
        }
        const graphMetricsResponse = await fetch("/api/graph-metrics");
        if (!graphMetricsResponse.ok) {
          throw new Error(`Error: ${graphMetricsResponse.statusText}`);
        }
        const communityInsightsResponse = await fetch("/api/community-insights");
        if (!communityInsightsResponse.ok) {
          throw new Error(`Error: ${communityInsightsResponse.statusText}`);
        }
    
        const loadData = await loadDataResponse.json();
        const graphMetrics = await graphMetricsResponse.json();
        const communityInsights = await communityInsightsResponse.json();
    
        setApiData({ loadData, graphMetrics, communityInsights });
        setLoading(false);
        setDataLoaded(true);

        setTimeout(() => setDataLoaded(false), 5000);
        const handleClick = () => setDataLoaded(false);
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-purple-50 text-purple-900">
      {/* Loading Popup */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2>Loading Data...</h2>
            <p>Please wait while we load the data.</p>
          </div>
        </div>
      )}

      {/* Data Loaded Popup */}
      {dataLoaded && !loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-green-500 bg-opacity-75 z-10">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-green-700">Data Loaded Successfully!</h2>
            <p>The data has been loaded and is now available on the dashboard.</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {/* Search Section */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={userId}
              onChange={handleUserIdChange}
              placeholder="Enter User ID for userinteraction"
              className="p-2 border rounded-lg w-60"
            />
            <button
              onClick={handleSearch}
              className="bg-purple-600 text-white p-2 rounded-lg"
            >
              Search
            </button>
          </div>
        </div>

        {/* User Interactions Section */}
        {userInteractions && (
          <div className="mb-6">
            <UserInteractionsCard userId={userId} interactions={userInteractions} loading={interactionsLoading} />
          </div>
        )}

        {/* Influence Analysis Section */}
        <div className="mb-6">
          <InfluenceAnalysisCard /> {/* Adding InfluenceAnalysisCard below user interactions */}
        </div>
        
        <div className="mb-6">
          <TrendingInterestsCard /> {/* Add the TrendingInterestsCard here */}
        </div>

        {/* Other Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white shadow-md rounded-lg p-4">
            <GraphVisualization />
          </div>
          <div className="bg-white shadow-md rounded-lg flex flex-col h-[535px]">
            <ChatBotContainer />
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <section className="col-span-1 lg:col-span-2 bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Behavioral Insights</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Add dynamic data here if available */}
              <Card title="Active Users" value={apiData?.loadData?.activeUsers || "N/A"} />
              <Card title="Engagement Rate" value={apiData?.graphMetrics?.engagementRate || "N/A"} />
              <Card title="Post Frequency" value={apiData?.communityInsights?.postFrequency || "N/A"} />
              <Card title="Sentiment Score" value={apiData?.communityInsights?.sentimentScore || "N/A"} />
            </div>
          </section>
          <div className="bg-white shadow-md rounded-lg p-4">
            <VisualizationCard title="User Engagement Over Time" data={lineChartData} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-6 space-y-6">
          <GraphMetricsCard />
        </div>
        <div className="p-6">
          <CommunityInsightsCard />
        </div>
        <div className="p-6">
          <InteractionTrends />
        </div>
        <div className="p-6">
          <ActiveCommunities />
        </div>
        <div className="p-6">
          <GeographicInsights />
        </div>
        <div className="p-6">
          <FullGraphComponent />
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
