import React, { Suspense } from 'react';

// Lazy load all heavy components for better performance
const TrendingInterestsCard = React.lazy(() => import('../Dashboard/TrendingInterestsCard'));
const ActiveCommunities = React.lazy(() => import('../Dashboard/ActiveCommunities'));
const InfluenceAnalysisCard = React.lazy(() => import('../Dashboard/InfluenceAnalysisCard'));
const InteractionTrends = React.lazy(() => import('../Dashboard/InteractionTrends'));
const GeographicInsights = React.lazy(() => import('../Dashboard/GeographicInsights'));
const CommunityGraphComponent = React.lazy(() => import('../Dashboard/CommunityGraphComponent'));

// Loading fallback component
const ComponentLoader = ({ height = "h-96", isDarkTheme }) => (
  <div className={`${isDarkTheme ? 'bg-neutral-900' : 'bg-white'} rounded shadow-sm ${height} flex items-center justify-center`}>
    <div className={`flex items-center gap-2 ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>
      <div className={`w-4 h-4 border-2 ${isDarkTheme ? 'border-neutral-700 border-t-neutral-400' : 'border-slate-300 border-t-slate-600'} rounded-full animate-spin`}></div>
      <span className="text-sm">Loading...</span>
    </div>
  </div>
);

const DashboardTab = ({ isDarkTheme }) => {
  return (
    <div className="space-y-1">
        {/* Top: Interaction Trends */}
        <div className="p-1">
            <Suspense fallback={<ComponentLoader height="h-[420px]" isDarkTheme={isDarkTheme} />}>
              <InteractionTrends isDarkTheme={isDarkTheme} />
            </Suspense>
        </div>

        {/* Divider */}
        <div className={`border-b-2 ${isDarkTheme ? 'border-purple-800/40' : 'border-purple-200/40'}`}></div>

        {/* Middle: Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 p-1">
            <Suspense fallback={<ComponentLoader isDarkTheme={isDarkTheme} />}>
              <TrendingInterestsCard isDarkTheme={isDarkTheme} />
            </Suspense>
            <Suspense fallback={<ComponentLoader isDarkTheme={isDarkTheme} />}>
              <ActiveCommunities isDarkTheme={isDarkTheme} />
            </Suspense>
            <Suspense fallback={<ComponentLoader isDarkTheme={isDarkTheme} />}>
              <InfluenceAnalysisCard isDarkTheme={isDarkTheme} />
            </Suspense>
        </div>
        
        {/* Divider */}
        <div className={`border-b-2 ${isDarkTheme ? 'border-purple-800/40' : 'border-purple-200/40'}`}></div>

        {/* Bottom: Visualizations */}
        <div className="space-y-1 p-1">
            <Suspense fallback={<ComponentLoader height="h-[590px]" isDarkTheme={isDarkTheme} />}>
              <GeographicInsights isDarkTheme={isDarkTheme} />
            </Suspense>
            <Suspense fallback={<ComponentLoader height="h-[600px]" isDarkTheme={isDarkTheme} />}>
              <CommunityGraphComponent isDarkTheme={isDarkTheme} />
            </Suspense>
        </div>
    </div>
  );
};

export default DashboardTab; 