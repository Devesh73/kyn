import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const InteractionTrends = ({ isDarkTheme }) => {
  const [trends, setTrends] = useState([]);
  const [aggregatedTrends, setAggregatedTrends] = useState([]);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch("/api/interaction-trends");
        const data = await response.json();

        if (data.interaction_trends) {
          // Process data for aggregation
          const aggregated = aggregateDataByWeek(data.interaction_trends);
          setAggregatedTrends(aggregated);
        }
      } catch (error) {
        console.error("Error fetching interaction trends:", error);
      }
    };

    fetchTrends();
  }, []);

  // Function to aggregate data by week
  const aggregateDataByWeek = (interactionTrends) => {
    const weeklyData = {};

    interactionTrends.forEach((trend) => {
      const date = new Date(trend.date);
      const weekStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - date.getDay() // Start of the week (Sunday)
      );

      const weekKey = weekStart.toISOString().split("T")[0]; // Use ISO date string for key
      weeklyData[weekKey] = (weeklyData[weekKey] || 0) + trend.interaction_count;
    });

    // Convert object to array sorted by week
    return Object.entries(weeklyData)
      .map(([week, count]) => ({ week, count }))
      .sort((a, b) => new Date(a.week) - new Date(b.week));
  };

  // Memoize chart data and options to prevent re-calculation on every render
  const chartData = useMemo(() => ({
    labels: aggregatedTrends.map((item) => item.week),
    datasets: [
      {
        label: "Interactions Per Week",
        data: aggregatedTrends.map((item) => item.count),
        backgroundColor: isDarkTheme ? "rgba(99, 102, 241, 0.7)" : "rgba(79, 70, 229, 0.8)", // indigo-500 for dark, indigo-600 for light
        borderColor: isDarkTheme ? "rgba(129, 140, 248, 1)" : "rgba(67, 56, 202, 1)", // indigo-400 for dark, indigo-700 for light
        borderWidth: 1,
        borderRadius: 2,
      },
    ],
  }), [aggregatedTrends, isDarkTheme]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkTheme ? "#9ca3af" : "#475569", // gray-400 for dark, slate-600 for light
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
      tooltip: {
        backgroundColor: isDarkTheme ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.95)", // gray-900 for dark, white for light
        titleColor: isDarkTheme ? "#f3f4f6" : "#1e293b", // gray-100 for dark, slate-800 for light
        bodyColor: isDarkTheme ? "#d1d5db" : "#475569", // gray-300 for dark, slate-600 for light
        borderColor: isDarkTheme ? '#374151' : '#e2e8f0', // gray-700 for dark, slate-200 for light
        borderWidth: 1,
        padding: 10,
        titleFont: { weight: 'bold' },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkTheme ? "#9ca3af" : "#64748b", // gray-400 for dark, slate-500 for light
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
        },
        grid: {
          color: isDarkTheme ? "#374151" : "#e2e8f0", // gray-700 for dark, slate-200 for light
        },
      },
      y: {
        ticks: {
          color: isDarkTheme ? "#9ca3af" : "#64748b", // gray-400 for dark, slate-500 for light
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
        },
        grid: {
          color: isDarkTheme ? "#374151" : "#e2e8f0", // gray-700 for dark, slate-200 for light
        },
        beginAtZero: true,
      },
    },
  }), [isDarkTheme]);

  return (
    <div className={`${isDarkTheme ? 'bg-black' : 'bg-white'} rounded shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col h-[420px]`}>
        {/* Title */}
        <div className={`p-3 border-b ${isDarkTheme ? 'border-neutral-800/80' : 'border-purple-100/80'}`}>
            <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isDarkTheme ? 'bg-purple-900/50 border-purple-800/80' : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200/80'} border shadow-sm`}>
                    <svg className={`w-4 h-4 ${isDarkTheme ? 'text-purple-400' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                </div>
                <h2 className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-slate-800'}`}>Interaction Trends</h2>
            </div>
        </div>
        {/* Chart */}
        <div className="flex-1 p-3 overflow-hidden">
            {aggregatedTrends.length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
            ) : (
                <div className="h-full flex items-center justify-center">
                    <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>Loading trends...</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default React.memo(InteractionTrends);
