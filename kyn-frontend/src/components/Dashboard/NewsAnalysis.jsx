import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  BarChart2, 
  Hash, 
  Users, 
  Clock, 
  MapPin, 
  Activity 
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TrendAnalysis = () => {
  // State for filters
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTrendId, setExpandedTrendId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h'); // 24h, 7d, 30d
  const [regionFilter, setRegionFilter] = useState('all');
  const [trends, setTrends] = useState([]);
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await fetch('/trends.json');
        const data = await response.json();
        setTrends(data.trends);
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrends();
  }, []);

  // Filter options
  const availableYears = [2023, 2024, 2025];
  const availableMonths = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];
  
  const timeRanges = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' }
  ];
  
  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'National', label: 'National' }
  ];
  
  // Calculate days in the selected month
  const daysInMonth = useMemo(() => {
    return new Date(year, month, 0).getDate();
  }, [year, month]);

  const toggleExpand = (id) => {
    setExpandedTrendId(expandedTrendId === id ? null : id);
  };

  // Filter trends based on search query and filters
  const filteredTrends = useMemo(() => {
    if (loading || !trends.length) return [];
    
    let result = [...trends];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(trend => 
        trend.name.toLowerCase().includes(query) || 
        trend.relatedTags.some(tag => tag.toLowerCase().includes(query)) || 
        trend.topRegions.some(region => region.name.toLowerCase().includes(query)) ||
        trend.influencers.some(influencer => influencer.name.toLowerCase().includes(query)) ||
        trend.relatedBrands.some(brand => brand.toLowerCase().includes(query))
      );
    }
    
    // Apply region filter
    if (regionFilter !== 'all') {
      result = result.filter(trend => 
        trend.topRegions.some(region => region.name === regionFilter)
      );
    }
    
    // Sort by growth or mentions based on time range
    if (timeRange === '24h') {
      result.sort((a, b) => b.growth - a.growth);
    } else if (timeRange === '7d') {
      result.sort((a, b) => {
        const a7dGrowth = ((a.currentMentions - a.historicalData["2025-01-08"]?.mentions || a.currentMentions) / 
                         (a.historicalData["2025-01-08"]?.mentions || 1)) * 100;
        const b7dGrowth = ((b.currentMentions - b.historicalData["2025-01-08"]?.mentions || b.currentMentions) / 
                         (b.historicalData["2025-01-08"]?.mentions || 1)) * 100;
        return b7dGrowth - a7dGrowth;
      });
    } else {
      result.sort((a, b) => b.currentMentions - a.currentMentions);
    }
    
    return result;
  }, [trends, searchQuery, timeRange, regionFilter, loading]);

  // Function to get growth color
  const getGrowthColor = (growth) => {
    if (growth > 20) return 'text-emerald-400';
    if (growth > 15) return 'text-green-400';
    if (growth > 10) return 'text-yellow-400';
    return 'text-gray-400';
  };

  // Function to render demographic bar
  const renderDemographicBar = (data) => {
    return (
      <div className="flex h-4 w-full bg-gray-800 rounded overflow-hidden">
        {Object.entries(data).map(([key, value]) => (
          <div 
            key={key}
            style={{ width: `${value}%` }}
            className={`h-full ${
              key === 'male' ? 'bg-blue-500' : 
              key === 'female' ? 'bg-pink-500' : 
              key === '18-24' ? 'bg-purple-500' :
              key === '25-34' ? 'bg-indigo-500' :
              key === '35-44' ? 'bg-teal-500' :
              'bg-gray-500'
            }`}
          />
        ))}
      </div>
    );
  };

  // Function to render sentiment indicator
  const renderSentimentIndicator = (sentiment) => {
    return (
      <div className="flex items-center">
        <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-green-500" 
            style={{ width: `${sentiment.positive}%` }}
          />
          <div 
            className="h-full bg-yellow-500" 
            style={{ width: `${sentiment.neutral}%`, marginLeft: '-1px' }}
          />
          <div 
            className="h-full bg-red-500" 
            style={{ width: `${sentiment.negative}%`, marginLeft: '-1px' }}
          />
        </div>
        <div className="ml-2 text-xs text-gray-400">
          {sentiment.positive}% 👍
        </div>
      </div>
    );
  };

  // Prepare data for the trend growth chart
  const prepareChartData = () => {
    if (filteredTrends.length === 0) return null;

    const labels = filteredTrends.map(trend => trend.name);
    const growthData = filteredTrends.map(trend => trend.growth);
    const mentionData = filteredTrends.map(trend => trend.currentMentions / 1000); // Scale down for chart

    return {
      labels,
      datasets: [
        {
          label: 'Growth Rate (%)',
          data: growthData,
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          yAxisID: 'y',
          tension: 0.4,
          fill: false,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Mentions (thousands)',
          data: mentionData,
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          yAxisID: 'y1',
          tension: 0.4,
          fill: false,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 12,
            weight: 'bold'
          },
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 6,
        displayColors: true,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            weight: 'bold'
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value) {
            return value + '%';
          }
        },
        title: {
          display: true,
          text: 'Growth Rate (%)',
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            weight: 'bold',
            size: 12
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value) {
            return value + 'k';
          }
        },
        title: {
          display: true,
          text: 'Mentions (thousands)',
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            weight: 'bold',
            size: 12
          }
        }
      }
    }
  };

  const chartData = prepareChartData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Trend Analysis Dashboard</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Updated: Today, 15:42 IST</span>
        </div>
      </div>
      
      {/* Filters section */}
      <div className="bg-black bg-opacity-40 rounded-xl p-4 border border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Time range selector */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Time Range</label>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
          
          {/* Region filter */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Region</label>
            <select 
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              {regions.map(region => (
                <option key={region.value} value={region.value}>{region.label}</option>
              ))}
            </select>
          </div>
          
          {/* Date selector */}
          <div className="md:col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Date</label>
            <div className="flex items-center gap-4">
              <select 
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="flex-1 bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {availableYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              
              <select 
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="flex-1 bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {availableMonths.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              
              <input
                type="number"
                min={1}
                max={daysInMonth}
                value={day}
                onChange={(e) => setDay(Math.min(Math.max(1, Number(e.target.value)), daysInMonth))}
                className="w-16 bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>
          
          {/* Search bar full width */}
          <div className="md:col-span-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search trends by name, tags, regions, or influencers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Trends</p>
              <p className="text-2xl font-bold text-white">{filteredTrends.length}</p>
            </div>
            <div className="p-2 bg-blue-900/30 rounded-full">
              <Hash className="text-blue-400" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg. Growth</p>
              <p className="text-2xl font-bold text-white">
                {filteredTrends.length > 0 
                  ? (filteredTrends.reduce((sum, trend) => sum + trend.growth, 0) / filteredTrends.length).toFixed(1)
                  : 0}%
              </p>
            </div>
            <div className="p-2 bg-green-900/30 rounded-full">
              <TrendingUp className="text-green-400" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Mentions</p>
              <p className="text-2xl font-bold text-white">
                {filteredTrends.reduce((sum, trend) => sum + trend.currentMentions, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-purple-900/30 rounded-full">
              <BarChart2 className="text-purple-400" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Top Region</p>
              <p className="text-2xl font-bold text-white">
                {filteredTrends.length > 0 
                  ? filteredTrends[0]?.topRegions[0]?.name || 'N/A'
                  : 'N/A'}
              </p>
            </div>
            <div className="p-2 bg-amber-900/30 rounded-full">
              <MapPin className="text-amber-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Trend Growth Chart */}
      {filteredTrends.length > 0 && (
        <div className="bg-black bg-opacity-40 rounded-xl p-4 border border-gray-800">
          <div className="h-80">
            <Line options={chartOptions} data={chartData} />
          </div>
          <div className="mt-2 text-xs text-gray-500 italic text-center">
            Current trends growth rate vs. mentions volume
          </div>
        </div>
      )}
      
      {/* Trends table with scrolling */}
      <div className="bg-black bg-opacity-40 rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10">
          <h3 className="text-lg font-bold text-white">
            Trending Topics <span className="text-sm font-normal text-gray-400">({filteredTrends.length} trends)</span>
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2 py-0.5 bg-violet-900/30 text-violet-400 rounded-full flex items-center">
              <TrendingUp size={12} className="mr-1" /> Growth
            </span>
            <span className="text-xs px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded-full flex items-center">
              <BarChart2 size={12} className="mr-1" /> Mentions
            </span>
            <span className="text-xs px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full flex items-center">
              <Users size={12} className="mr-1" /> Demographics
            </span>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[600px]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
              <span className="ml-3 text-gray-300">Loading trends...</span>
            </div>
          ) : filteredTrends.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No trends found matching your criteria
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {filteredTrends.map(trend => (
                <div key={trend.id} className="transition-all duration-200">
                  {/* Trend item header - always visible */}
                  <div 
                    onClick={() => toggleExpand(trend.id)} 
                    className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-900/50
                      ${expandedTrendId === trend.id ? 'bg-violet-900/20 border-violet-700' : ''}`
                    }
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        <Hash size={16} className="text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-white">{trend.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${getGrowthColor(trend.growth)}`}>
                            {trend.growth}% growth
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="text-gray-400 flex items-center">
                              <BarChart2 size={12} className="mr-1" /> {trend.currentMentions.toLocaleString()} mentions
                            </span>
                            <span className="text-gray-400 flex items-center">
                              <Users size={12} className="mr-1" /> {Object.entries(trend.demographics.gender).sort((a, b) => b[1] - a[1])[0][0]} {Math.round(Object.entries(trend.demographics.gender).sort((a, b) => b[1] - a[1])[0][1])}%
                            </span>
                            <span className="text-gray-400 flex items-center">
                              <MapPin size={12} className="mr-1" /> {trend.topRegions[0]?.name || 'N/A'} ({trend.topRegions[0]?.share || 0}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      {expandedTrendId === trend.id ? (
                        <ChevronUp size={16} className="text-violet-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded content */}
                  {expandedTrendId === trend.id && (
                    <div className="px-4 py-3 bg-gray-900/30 border-t border-gray-800">
                      <div className="pl-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left column */}
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Related Tags</h5>
                            <div className="flex flex-wrap gap-2">
                              {trend.relatedTags.map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Top Regions</h5>
                            <div className="space-y-2">
                              {trend.topRegions.map(region => (
                                <div key={region.name} className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">{region.name}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-white">{region.share}%</span>
                                    <span className={`text-xs ${region.growth > 15 ? 'text-green-400' : region.growth > 10 ? 'text-yellow-400' : 'text-gray-400'}`}>
                                      ({region.growth}%)
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Peak Activity Hours</h5>
                            <div className="flex flex-wrap gap-2">
                              {trend.peakHours.map(hour => (
                                <span key={hour} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
                                  {hour}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Middle column */}
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Demographics</h5>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                  <span>Age Groups</span>
                                  <span>Distribution</span>
                                </div>
                                {renderDemographicBar(trend.demographics.age)}
                                <div className="flex justify-between mt-1">
                                  {Object.entries(trend.demographics.age).map(([age, percent]) => (
                                    <span key={age} className="text-xs text-gray-400">{age}: {percent}%</span>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                  <span>Gender</span>
                                  <span>Distribution</span>
                                </div>
                                {renderDemographicBar(trend.demographics.gender)}
                                <div className="flex justify-between mt-1">
                                  {Object.entries(trend.demographics.gender).map(([gender, percent]) => (
                                    <span key={gender} className="text-xs text-gray-400">
                                      {gender.charAt(0).toUpperCase() + gender.slice(1)}: {percent}%
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Sentiment Analysis</h5>
                            {renderSentimentIndicator(trend.sentiment)}
                          </div>
                        </div>
                        
                        {/* Right column */}
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Key Influencers</h5>
                            <div className="space-y-2">
                              {trend.influencers.map(influencer => (
                                <div key={influencer.name} className="flex items-center justify-between">
                                  <span className="text-xs text-white">{influencer.name}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-400">{influencer.followers}</span>
                                    <span className="text-xs text-green-400">{influencer.engagement}% engagement</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Related Brands</h5>
                            <div className="flex flex-wrap gap-2">
                              {trend.relatedBrands.map(brand => (
                                <span key={brand} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
                                  {brand}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-2">Historical Trend</h5>
                            <div className="space-y-2">
                              {Object.entries(trend.historicalData).map(([date, data]) => (
                                <div key={date} className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">{new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-white">{data.mentions}</span>
                                    <span className={`text-xs ${data.growth > 15 ? 'text-green-400' : data.growth > 10 ? 'text-yellow-400' : 'text-gray-400'}`}>
                                      ({data.growth}%)
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;