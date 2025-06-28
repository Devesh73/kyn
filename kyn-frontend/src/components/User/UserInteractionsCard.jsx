import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const UserInteractionsCard = ({ userId, isDarkTheme }) => {
  const [interactions, setInteractions] = useState([]);
  const [aggregatedWeights, setAggregatedWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInteractions = async () => {
      try {
        const response = await axios.get(`/api/user-interactions/${userId}`);
        setInteractions(response.data.interactions);
      } catch (error) {
        setError("Failed to load user interactions.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      setLoading(true);
      fetchUserInteractions();
    }
  }, [userId]);

  // Aggregating interaction weights by target user and interaction type
  useEffect(() => {
    if (interactions.length > 0) {
      const aggregated = aggregateInteractionWeights(interactions);
      setAggregatedWeights(aggregated);
    } else {
      setAggregatedWeights([]);
    }
  }, [interactions]);

  const aggregateInteractionWeights = (interactions) => {
    const weightData = {};

    interactions.forEach(({ target, attributes }) => {
      const { interaction_type, weight } = attributes;

      if (!weightData[target]) {
        weightData[target] = { follow: 0, like: 0, message: 0, comment: 0 };
      }

      weightData[target][interaction_type] += weight;
    });

    return weightData;
  };

  // Prepare chart data
  const chartData = useMemo(() => ({
    labels: Object.keys(aggregatedWeights), // Target user IDs
    datasets: [
      {
        label: "Follow",
        data: Object.values(aggregatedWeights).map((data) => data.follow),
        backgroundColor: isDarkTheme ? "rgba(129, 140, 248, 0.7)" : "rgba(99, 102, 241, 0.7)", // indigo-400 for dark
        borderColor: isDarkTheme ? "rgba(129, 140, 248, 1)" : "rgba(99, 102, 241, 1)",
        borderWidth: 1,
      },
      {
        label: "Like",
        data: Object.values(aggregatedWeights).map((data) => data.like),
        backgroundColor: isDarkTheme ? "rgba(99, 102, 241, 0.7)" : "rgba(129, 140, 248, 0.7)", // indigo-500 for dark
        borderColor: isDarkTheme ? "rgba(99, 102, 241, 1)" : "rgba(129, 140, 248, 1)",
        borderWidth: 1,
      },
      {
        label: "Message",
        data: Object.values(aggregatedWeights).map((data) => data.message),
        backgroundColor: isDarkTheme ? "rgba(79, 70, 229, 0.7)" : "rgba(79, 70, 229, 0.7)", // indigo-600
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 1,
      },
      {
        label: "Comment",
        data: Object.values(aggregatedWeights).map((data) => data.comment),
        backgroundColor: isDarkTheme ? "rgba(67, 56, 202, 0.7)" : "rgba(67, 56, 202, 0.7)", // indigo-700
        borderColor: "rgba(67, 56, 202, 1)",
        borderWidth: 1,
      },
    ],
  }), [aggregatedWeights, isDarkTheme]);

  // Chart options for improved interactivity and visual appeal
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDarkTheme ? "#9ca3af" : "#475569", // gray-400 for dark
        },
      },
      tooltip: {
        backgroundColor: isDarkTheme ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.95)",
        titleColor: isDarkTheme ? "#f3f4f6" : "#1e293b",
        bodyColor: isDarkTheme ? "#d1d5db" : "#475569",
        borderColor: isDarkTheme ? '#374151' : '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (tooltipItem) => {
            const interactionType = tooltipItem.dataset.label;
            const weight = tooltipItem.raw;
            return `${interactionType}: ${weight}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: isDarkTheme ? "#9ca3af" : "#64748b", // gray-400 for dark
        },
        grid: {
          color: isDarkTheme ? "#374151" : "#f1f5f9", // gray-700 for dark
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: isDarkTheme ? "#9ca3af" : "#64748b", // gray-400 for dark
        },
        grid: {
          color: isDarkTheme ? "#374151" : "#f1f5f9", // gray-700 for dark
        },
        beginAtZero: true,
      },
    },
  }), [isDarkTheme]);

  if (loading) {
    return (
        <div className={`${isDarkTheme ? 'bg-neutral-900' : 'bg-slate-50/60'} rounded-lg border ${isDarkTheme ? 'border-neutral-800' : 'border-slate-200/40'} shadow-sm p-4 h-96 flex items-center justify-center`}>
            <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>Loading interactions...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-red-50 rounded-lg border border-red-200 shadow-sm p-4 h-96 flex items-center justify-center">
            <p className="text-sm text-red-600">{error}</p>
        </div>
    );
  }

  return (
    <div className={`${isDarkTheme ? 'bg-neutral-900' : 'bg-white'} rounded-lg border ${isDarkTheme ? 'border-neutral-800' : 'border-slate-200/80'} shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col h-96`}>
      {/* Title */}
      <div className={`p-3 border-b ${isDarkTheme ? 'border-neutral-800' : 'border-slate-200/80'}`}>
        <div className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isDarkTheme ? 'bg-purple-800/30' : 'bg-indigo-50 border-indigo-200/80'} border ${isDarkTheme ? 'border-purple-700/50' : 'border-indigo-200/80'} shadow-sm`}>
                <svg className={`w-4 h-4 ${isDarkTheme ? 'text-purple-300' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </div>
            <h2 className={`text-sm font-medium ${isDarkTheme ? 'text-neutral-100' : 'text-slate-800'}`}>User Interactions</h2>
        </div>
      </div>
      

      {/* Bar Chart Display */}
        <div className="flex-1 p-3 overflow-hidden">
            {aggregatedWeights && Object.keys(aggregatedWeights).length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
            ) : (
                <div className="h-full flex items-center justify-center">
                    <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-slate-500'}`}>No interactions available for this user.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default UserInteractionsCard;
