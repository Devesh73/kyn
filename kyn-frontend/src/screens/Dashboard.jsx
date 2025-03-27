import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatBotContainer from "../components/ChatBotContainer";
import InteractionTrends from "../components/Dashboard/InteractionTrends";
import MisinformationHeatmap from "../components/Dashboard/MisinformationHeatmap";
import CommunityGraphComponent from "../components/Dashboard/CommunityGraphComponent";
import HorizontalNavigation from "../components/Layout/HorizontalNavigation";
import VerticalTabsComponent from "../components/VerticalTabsComponent";
import { TrendingUp, Users, User } from "lucide-react";
import MisinformationTrendsChart from "../components/Dashboard/MisinformationTrendsChart";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Define tabs for the vertical tab component within Influencer Insights section
  const insightTabs = [
    { id: "trending", label: "Trending Interests" },
    { id: "communities", label: "Active Communities" },
    { id: "influence", label: "Influence Analysis" },
  ]

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

  // Render the content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Top Row - InteractionTrends and MisinformationTrendsChart side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InteractionTrends />
              <MisinformationTrendsChart />
            </div>
            
            {/* Misinformation Heatmap */}
            <div>
              <MisinformationHeatmap />
            </div>
          </div>
        );
      
      case "community":
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Community Health</h2>
            <CommunityGraphComponent />
          </div>
        );
        
      case "misinformation":
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Misinformation Tracker</h2>
            <MisinformationHeatmap />
          </div>
        );
        
      case "influencer":
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Influencer Insights</h2>
            {/* Moved VerticalTabsComponent here from Overview tab */}
            <VerticalTabsComponent tabs={insightTabs} defaultTab="trending">
              <VerticalTabsComponent.TabContent tabId="trending">
                <div className="w-full">
                  <h3 className="text-xl font-bold text-white mb-4">Trending Interests</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <TrendingInterestsTiles />
                  </div>
                </div>
              </VerticalTabsComponent.TabContent>
              
              <VerticalTabsComponent.TabContent tabId="communities">
                <div className="w-full">
                  <h3 className="text-xl font-bold text-white mb-4">Active Communities</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <ActiveCommunitiesTiles />
                  </div>
                </div>
              </VerticalTabsComponent.TabContent>
              
              <VerticalTabsComponent.TabContent tabId="influence">
                <div className="w-full">
                  <h3 className="text-xl font-bold text-white mb-4">Influence Analysis</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <InfluenceAnalysisTiles />
                  </div>
                </div>
              </VerticalTabsComponent.TabContent>
            </VerticalTabsComponent>
          </div>
        );
        
      case "regional":
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Regional Focus</h2>
            <GeographicInsights />
          </div>
        );
        
      case "chat":
        return (
          <div className="h-full flex items-center justify-center">
            <p className="text-white text-xl">The chatbot is available in the bottom right corner</p>
          </div>
        );
        
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Page Not Found</h2>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-800 flex flex-col">
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

      {/* Main Layout with Horizontal Navigation and Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <HorizontalNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-black">
          {renderContent()}
        </div>
      </div>

      {/* Chatbot */}
      <ChatBotContainer />
    </div>
  );
};

// Helper components for rendering tile layouts
const TrendingInterestsTiles = () => {
  const [trendingInterests, setTrendingInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingInterests = async () => {
      try {
        const response = await axios.get("/api/trending-interests");
        setTrendingInterests(response.data.trending_interests || []);
      } catch (error) {
        console.error("Error fetching trending interests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingInterests();
  }, []);

  if (loading) {
    return <div className="text-white">Loading trending interests...</div>;
  }

  if (trendingInterests.length === 0) {
    return <div className="text-white">No trending interests available.</div>;
  }

  return trendingInterests.map((item, index) => (
    <div 
      key={index} 
      className="bg-black rounded-lg p-3 shadow-lg mb-1 border border-gray-800 transition-all duration-200 hover:border-emerald-500"
    >
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-white font-medium">{item.interest}</h4>
          <p className="text-emerald-500">{item.count} mentions</p>
        </div>
        <div className="bg-slate-800 p-2 rounded-full">
          <TrendingUp size={16} className="text-emerald-500" />
        </div>
      </div>
    </div>
  ));
};

const ActiveCommunitiesTiles = () => {
  const [activeCommunities, setActiveCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveCommunities = async () => {
      try {
        const response = await axios.get("/api/active-communities");
        setActiveCommunities(response.data.active_communities || []);
      } catch (error) {
        console.error("Error fetching active communities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveCommunities();
  }, []);

  if (loading) {
    return <div className="text-white">Loading active communities...</div>;
  }

  if (activeCommunities.length === 0) {
    return <div className="text-white">No active communities available.</div>;
  }

  return activeCommunities.map((community, index) => (
    <div 
      key={index} 
      className="bg-black rounded-lg p-3 shadow-lg mb-1 border border-gray-800 transition-all duration-200 hover:border-cyan-500"
    >
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-white font-medium">Community {community.community_id}</h4>
          <p className="text-cyan-500">Activity: {(community.activity_score)/10}%</p>
          <p className="text-indigo-400">Size: {community.size} members</p>
        </div>
        <div className="bg-slate-800 p-2 rounded-full">
          <Users size={16} className="text-cyan-500" />
        </div>
      </div>
    </div>
  ));
};

const InfluenceAnalysisTiles = () => {
  const [topInfluencers, setTopInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopInfluencers = async () => {
      try {
        const response = await axios.get("/api/influence-analysis");
        setTopInfluencers(response.data.top_influencers || []);
      } catch (error) {
        console.error("Error fetching top influencers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopInfluencers();
  }, []);

  if (loading) {
    return <div className="text-white">Loading top influencers...</div>;
  }

  if (topInfluencers.length === 0) {
    return <div className="text-white">No top influencers available.</div>;
  }

  return topInfluencers.map(([userId, centrality], index) => (
    <div 
      key={index} 
      className="bg-black rounded-lg p-3 shadow-lg mb-1 border border-gray-800 transition-all duration-200 hover:border-purple-500"
    >
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-white font-medium">User {userId}</h4>
          <p className="text-purple-500">Influence: {(centrality*100).toFixed(2)}%</p>
        </div>
        <div className="bg-slate-800 p-2 rounded-full">
          <User size={16} className="text-purple-500" />
        </div>
      </div>
    </div>
  ));
};

export default Dashboard;

