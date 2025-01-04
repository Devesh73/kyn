import React, { useState, useEffect } from "react";
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

  // Chart data
  const chartData = {
    labels: aggregatedTrends.map((item) => item.week),
    datasets: [
      {
        label: "Interactions Per Week",
        data: aggregatedTrends.map((item) => item.count),
        backgroundColor: "rgba(30, 144, 255, 0.8)", // Stylish blue
        borderColor: "rgba(30, 144, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white", // Match dark theme
        },
      },
      tooltip: {
        backgroundColor: "rgba(30, 30, 30, 0.8)",
        titleColor: "white",
        bodyColor: "white",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white", // Match dark theme
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Subtle grid lines
        },
      },
      y: {
        ticks: {
          color: "white", // Match dark theme
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Subtle grid lines
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="relative flex flex-col rounded-xl bg-slate-950 p-4 shadow-2xl h-[500px]">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-white mb-4">Interaction Trends</h2>
      {aggregatedTrends.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p className="text-white">Loading trends...</p>
      )}
    </div>
  );
};

export default InteractionTrends;
