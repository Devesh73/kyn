import React, { useEffect, useState } from "react";
import axios from "axios";
import VisualizationCard from "../components/VisualizationCard";
import Card from "../components/Card";
import ChatBotContainer from "../components/ChatBotContainer";
import GraphVisualization from "../components/GraphVisualization";
import GraphMetricsCard from "../components/Dashboard/GraphMetricsCard";
import CommunityInsightsCard from "../components/Dashboard/CommunityInsightsCard";
import UserInteractionsCard from "../components/Dashboard/UserInteractionsCard";
import InfluenceAnalysisCard from "../components/InfluenceAnalysisCard";
import TrendingInterestsCard from "../components/TrendingInterestsCard";
import InteractionTrends from "../components/InteractionTrends";
import ActiveCommunities from "../components/ActiveCommunities";
import GeographicInsights from "../components/GeographicInsights";
import FullGraphComponent from "../components/FullGraphComponent";
import SearchBar from "../components/Dashboard/SearchBar";
import UsersList from "../components/UserList";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [userId, setUserId] = useState("");
  const [userInteractions, setUserInteractions] = useState(null);
  const [interactionsLoading, setInteractionsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      fetchUserInteractions(searchQuery);
    }
  };

  const loadDataFromApi = async () => {
    try {
      const [loadDataResponse, graphMetricsResponse, communityInsightsResponse] = await Promise.all([
        axios.get("/api/load-data"),
        axios.get("/api/graph-metrics"),
        axios.get("/api/community-insights"),
      ]);

      const apiData = {
        loadData: loadDataResponse.data,
        graphMetrics: graphMetricsResponse.data,
        communityInsights: communityInsightsResponse.data,
      };

      localStorage.setItem("dashboardData", JSON.stringify(apiData));
      setApiData(apiData);
    } catch (error) {
      console.error("Error loading data from API:", error);
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem("dashboardData");
    if (cachedData) {
      setApiData(JSON.parse(cachedData));
      setLoading(false);
    } else {
      loadDataFromApi().finally(() => setLoading(false));
    }
  }, []);

  return (
    <div className="min-h-screen bg-purple-50 text-purple-900">
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2>Loading Data...</h2>
            <p>Please wait while we load the data.</p>
          </div>
        </div>
      )}

      {dataLoaded && !loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-green-500 bg-opacity-75 z-10">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-green-700">Data Loaded Successfully!</h2>
            <p>The data has been loaded and is now available on the dashboard.</p>
          </div>
        </div>
      )}

      <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-lg overflow-y-auto p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Users List</h2>
        <form onSubmit={handleSearch} className="mb-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="Search by User ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="mt-2 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        <UsersList users={[]} onSelectUser={() => {}} />
      </div>

      <div className="container mx-auto p-6">
        <div className="mb-6">
          <SearchBar
            userId={userId}
            onUserIdChange={handleUserIdChange}
            onSearch={handleSearch}
          />
        </div>

        {userInteractions && (
          <div className="mb-6">
            <UserInteractionsCard userId={userId} interactions={userInteractions} loading={interactionsLoading} />
          </div>
        )}

        <div className="mb-6">
          <InfluenceAnalysisCard />
        </div>
        <div className="mb-6">
          <TrendingInterestsCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white shadow-md rounded-lg p-4">
            <GraphVisualization />
          </div>
          <div className="bg-white shadow-md rounded-lg flex flex-col h-[535px]">
            <ChatBotContainer />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <section className="col-span-1 lg:col-span-2 bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Behavioral Insights</h2>
            <div className="grid grid-cols-2 gap-4">
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
