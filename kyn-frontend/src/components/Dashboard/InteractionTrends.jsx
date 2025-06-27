import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const InteractionTrends = () => {
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
        backgroundColor: "rgba(99, 102, 241, 0.7)", // indigo-500
        borderColor: "rgba(99, 102, 241, 1)", // indigo-500
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }), [aggregatedTrends]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: "#475569", // slate-600
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1e293b", // slate-800
        bodyColor: "#475569", // slate-600
        borderColor: '#e2e8f0', // slate-200
        borderWidth: 1,
        padding: 10,
        titleFont: { weight: 'bold' },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#64748b", // slate-500
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
        },
        grid: {
          color: "#f1f5f9", // slate-100
        },
      },
      y: {
        ticks: {
          color: "#64748b", // slate-500
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
        },
        grid: {
          color: "#f1f5f9", // slate-100
        },
        beginAtZero: true,
      },
    },
  }), []);

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-lg border border-slate-200/80 shadow-lg shadow-indigo-500/10 flex flex-col h-[420px]">
        {/* Title */}
        <div className="p-3 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200/80">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                </div>
                <h2 className="text-sm font-medium text-slate-800">Interaction Trends</h2>
            </div>
        </div>
        {/* Chart */}
        <div className="flex-1 p-3 overflow-hidden">
            {aggregatedTrends.length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
            ) : (
                <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-slate-500">Loading trends...</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default React.memo(InteractionTrends);
