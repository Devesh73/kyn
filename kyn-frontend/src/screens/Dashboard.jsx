import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import ChatBotContainer from '../components/Dashboard/ChatBotContainer';
import InfluenceAnalysisCard from '../components/Dashboard/InfluenceAnalysisCard';
import TrendingInterestsCard from '../components/Dashboard/TrendingInterestsCard';
import InteractionTrends from '../components/Dashboard/InteractionTrends';
import ActiveCommunities from '../components/Dashboard/ActiveCommunities';
import GeographicInsights from '../components/Dashboard/GeographicInsights';
import CommunityGraph from '../components/Dashboard/CommunityGraph';
import FullGraphComponent from '../components/Dashboard/FullGraph';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [apiData, setApiData] = useState(null);

  const fetchData = async () => {
    try {
      const [loadDataRes, graphMetricsRes, communityInsightsRes] = await Promise.all([
        fetch('/api/load-data'),
        fetch('/api/graph-metrics'),
        fetch('/api/community-insights'),
      ]);

      const [loadData, graphMetrics, communityInsights] = await Promise.all([
        loadDataRes.json(),
        graphMetricsRes.json(),
        communityInsightsRes.json(),
      ]);

      setApiData({ loadData, graphMetrics, communityInsights });
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold">Loading Data...</h2>
            <p>Please wait while we load the dashboard data.</p>
          </div>
        </div>
      )}

      {/* Success Overlay */}
      {dataLoaded && !loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-green-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-green-600 text-lg font-bold">Data Loaded Successfully!</h2>
          </div>
        </div>
      )}

      <div className="container mx-auto p-6">
        {/* Section: Influence Analysis */}
        <div className="mb-6">
          <InfluenceAnalysisCard />
        </div>

        {/* Section: Trending Interests */}
        <div className="mb-6">
          <TrendingInterestsCard />
        </div>

        {/* Section: Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-4">
            <CommunityGraph />
          </div>
          <div className="bg-white shadow rounded-lg flex h-[535px]">
            <ChatBotContainer />
          </div>
        </div>

        {/* Section: Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="col-span-2 bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Behavioral Insights</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card title="Active Users" value={apiData?.loadData?.activeUsers || 'N/A'} />
              <Card title="Engagement Rate" value={apiData?.graphMetrics?.engagementRate || 'N/A'} />
              <Card title="Post Frequency" value={apiData?.communityInsights?.postFrequency || 'N/A'} />
              <Card title="Sentiment Score" value={apiData?.communityInsights?.sentimentScore || 'N/A'} />
            </div>
          </div>
        </div>

        {/* Section: Trends and Communities */}
        <div className="mt-6 space-y-6">
          <InteractionTrends />
          <ActiveCommunities />
          <GeographicInsights />
          <FullGraphComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
