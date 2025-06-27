import React from 'react';
import TrendingInterestsCard from '../Dashboard/TrendingInterestsCard';
import ActiveCommunities from '../Dashboard/ActiveCommunities';
import InfluenceAnalysisCard from '../Dashboard/InfluenceAnalysisCard';
import InteractionTrends from '../Dashboard/InteractionTrends';
import GeographicInsights from '../Dashboard/GeographicInsights';
import CommunityGraphComponent from '../Dashboard/CommunityGraphComponent';

const DashboardTab = () => {
  return (
    <div className="space-y-4">
        {/* Top: Interaction Trends */}
        <div className="p-1">
            <InteractionTrends />
        </div>

        {/* Divider */}
        <div className="border-b border-slate-200/60"></div>

        {/* Middle: Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
            <TrendingInterestsCard />
            <ActiveCommunities />
            <InfluenceAnalysisCard />
        </div>
        
        {/* Divider */}
        <div className="border-b border-slate-200/60"></div>

        {/* Bottom: Visualizations */}
        <div className="space-y-4 p-1">
            <GeographicInsights />
            <CommunityGraphComponent />
        </div>
    </div>
  );
};

export default DashboardTab; 