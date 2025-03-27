import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatBotContainer from "../components/ChatBotContainer";
import UrgentInsightsWidget from "../components/UrgentInsightsWidget";
import InteractionTrends from "../components/Dashboard/InteractionTrends";
import MisinformationHeatmap from "../components/Dashboard/MisinformationHeatmap";
import CommunityGraphComponent from "../components/Dashboard/CommunityGraphComponent";
import HorizontalNavigation from "../components/Layout/HorizontalNavigation";
import VerticalTabsComponent from "../components/VerticalTabsComponent";
import { TrendingUp, Users, User } from "lucide-react";
import MisinformationTrendsChart from "../components/Dashboard/MisinformationTrendsChart";
import MisinformationInsights from "../components/Dashboard/MisinformationInsights";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import NewsAnalysis from "../components/Dashboard/NewsAnalysis";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [chatbotCollapsed, setChatbotCollapsed] = useState(true);
  const [chatbotInput, setChatbotInput] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [trendingSummary, setTrendingSummary] = useState(null);
  const [communitySummary, setCommunitySummary] = useState(null);
  const [influencerSummary, setInfluencerSummary] = useState(null);

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

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const [trendingRes, communitiesRes, influencersRes] = await Promise.all([
          axios.get("/api/trending-interests"),
          axios.get("/api/active-communities"),
          axios.get("/api/influence-analysis"),
        ]);

        if (trendingRes.data.trending_interests?.length > 0) {
          setTrendingSummary(trendingRes.data.trending_interests[0]);
        }

        if (communitiesRes.data.active_communities?.length > 0) {
          setCommunitySummary(communitiesRes.data.active_communities[0]);
        }

        if (influencersRes.data.top_influencers?.length > 0) {
          setInfluencerSummary({
            userId: influencersRes.data.top_influencers[0][0],
            centrality: influencersRes.data.top_influencers[0][1]
          });
        }
      } catch (error) {
        console.error("Error fetching summary data:", error);
      }
    };

    fetchSummaryData();
  }, []);

  // Render the content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Urgent Insights Card */}
            <div className="mb-4">
              <UrgentInsightsWidget 
                setChatbotCollapsed={setChatbotCollapsed} 
                setInputValue={setChatbotInput}
              />
            </div>
            
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
      
      case "news": // New case for the News Analysis tab
        return <NewsAnalysis />;
        
      case "misinformation":
        return (
          <div>
            {/* <h2 className="text-2xl font-bold text-white mb-6">Misinformation Tracker</h2> */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Map takes up 3/5 of the width */}
              <div className="lg:col-span-3">
                <MisinformationHeatmap onRegionSelect={setSelectedRegion} />
              </div>
              
              {/* Insights panel takes up 2/5 of the width */}
              <div className="lg:col-span-2">
                <MisinformationInsights 
                  selectedRegion={selectedRegion} 
                  selectedNews={selectedNews}
                  setSelectedNews={setSelectedNews}
                />
              </div>
            </div>
            
            {/* News Analysis Section - Full width row below map and insights */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Wider news insights panel */}
              <div className="lg:col-span-3 bg-black bg-opacity-40 rounded-xl p-4 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">
                  {selectedNews ? selectedNews.title : "Select a news item to analyze"}
                </h3>
                {selectedNews ? (
                  <div className="markdown-content prose prose-invert prose-headings:text-white prose-headings:font-bold prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-p:text-gray-300 prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:my-0 max-w-none">
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        h2: ({node, ...props}) => <h2 className="text-xl font-bold text-white mt-6 mb-3" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-lg font-bold text-violet-300 mt-4 mb-2" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc ml-6 my-2 text-gray-300" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal ml-6 my-2 text-gray-300" {...props} />,
                        li: ({node, ...props}) => <li className="my-1" {...props} />,
                        p: ({node, ...props}) => <p className="my-2 text-gray-300" {...props} />
                      }}
                    >
                      {selectedNews.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-300">
                    <p>Click on a news item from the insights panel to view detailed analysis</p>
                  </div>
                )}
              </div>
              
              {/* Placeholder for future feature */}
              <div className="lg:col-span-1 bg-black bg-opacity-40 rounded-xl p-4 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4">Source Analysis</h3>
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <p>Additional analysis features coming soon</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "influencer":
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Community Insights</h2>
            
            {/* Summary Cards - styled like UrgentInsightsWidget */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Trending Interests Summary Card */}
              <div className="bg-gradient-to-br from-black to-emerald-950/80 rounded-lg overflow-hidden shadow-lg border border-emerald-900/50 p-2">
                <div className="flex items-center justify-between bg-black/80 p-2">
                  <h3 className="text-white text-xs font-medium">Top Trending Interest</h3>
                  <div className="bg-slate-800 p-1.5 rounded-full">
                    <TrendingUp size={14} className="text-emerald-500" />
                  </div>
                </div>
                <div className="p-2 border-t border-emerald-900/20">
                  {trendingSummary ? (
                    <>
                      <h4 className="text-white font-medium">{trendingSummary.interest}</h4>
                      <p className="text-emerald-500 text-sm">{trendingSummary.count} mentions</p>
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">Loading trending data...</p>
                  )}
                </div>
              </div>
              
              {/* Active Communities Summary Card */}
              <div className="bg-gradient-to-br from-black to-cyan-950/80 rounded-lg overflow-hidden shadow-lg border border-cyan-900/50 p-2">
                <div className="flex items-center justify-between bg-black/80 p-2">
                  <h3 className="text-white text-xs font-medium">Most Active Community</h3>
                  <div className="bg-slate-800 p-1.5 rounded-full">
                    <Users size={14} className="text-cyan-500" />
                  </div>
                </div>
                <div className="p-2 border-t border-cyan-900/20">
                  {communitySummary ? (
                    <>
                      <h4 className="text-white font-medium">Community {communitySummary.community_id}</h4>
                      <p className="text-cyan-500 text-sm">Activity: {(communitySummary.activity_score)/10}%</p>
                      <p className="text-indigo-400 text-sm">Size: {communitySummary.size} members</p>
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">Loading community data...</p>
                  )}
                </div>
              </div>
              
              {/* Top Influencer Summary Card */}
              <div className="bg-gradient-to-br from-black to-purple-950/80 rounded-lg overflow-hidden shadow-lg border border-purple-900/50 p-2">
                <div className="flex items-center justify-between bg-black/80 p-2">
                  <h3 className="text-white text-xs font-medium">Top Influencer</h3>
                  <div className="bg-slate-800 p-1.5 rounded-full">
                    <User size={14} className="text-purple-500" />
                  </div>
                </div>
                <div className="p-2 border-t border-purple-900/20">
                  {influencerSummary ? (
                    <>
                      <h4 className="text-white font-medium">User {influencerSummary.userId}</h4>
                      <p className="text-purple-500 text-sm">Influence: {(influencerSummary.centrality*100).toFixed(2)}%</p>
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">Loading influencer data...</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Vertical Tabs Component */}
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
            
            {/* Community Graph below vertical tabs */}
            <div className="mt-6">
              {/* <h3 className="text-xl font-bold text-white mb-4">Community Network Graph</h3> */}
              <CommunityGraphComponent />
            </div>
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
      <ChatBotContainer 
        collapsed={chatbotCollapsed}
        setCollapsed={setChatbotCollapsed}
        inputValue={chatbotInput}
        setInputValue={setChatbotInput}
      />
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

