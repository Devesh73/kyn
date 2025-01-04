import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const UserInteractionsCard = ({ userId }) => {
  const [interactions, setInteractions] = useState([]);
  const [aggregatedInteractions, setAggregatedInteractions] = useState([]);
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
      fetchUserInteractions();
    }
  }, [userId]);

  // Aggregating interaction data by target user and interaction type
  useEffect(() => {
    if (interactions.length > 0) {
      const aggregated = aggregateInteractions(interactions);
      setAggregatedInteractions(aggregated);
    }
  }, [interactions]);

  // Aggregate interactions by target user and interaction type
  const aggregateInteractions = (interactions) => {
    const interactionData = {};

    interactions.forEach((interaction) => {
      const { target, attributes } = interaction;
      const interactionType = attributes.interaction_type;

      if (!interactionData[target]) {
        interactionData[target] = { follow: 0, like: 0, message: 0, comment: 0 };
      }

      interactionData[target][interactionType] += 1;
    });

    return interactionData;
  };

  // Prepare chart data
  const chartData = {
    labels: Object.keys(aggregatedInteractions), // Target user IDs
    datasets: [
      {
        label: 'Follow',
        data: Object.values(aggregatedInteractions).map((data) => data.follow),
        backgroundColor: "rgba(30, 144, 255, 0.8)", // Follow color
        borderColor: "rgba(30, 144, 255, 1)",
        borderWidth: 1,
      },
      {
        label: 'Like',
        data: Object.values(aggregatedInteractions).map((data) => data.like),
        backgroundColor: "rgba(255, 99, 132, 0.8)", // Like color
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: 'Message',
        data: Object.values(aggregatedInteractions).map((data) => data.message),
        backgroundColor: "rgba(75, 192, 192, 0.8)", // Message color
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: 'Comment',
        data: Object.values(aggregatedInteractions).map((data) => data.comment),
        backgroundColor: "rgba(255, 159, 64, 0.8)", // Comment color
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options for improved interactivity and visual appeal
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
        callbacks: {
          label: function (tooltipItem) {
            const interactionType = tooltipItem.dataset.label;
            const count = tooltipItem.raw;
            return `${interactionType}: ${count}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: "white", // Match dark theme
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Subtle grid lines
        },
      },
      y: {
        stacked: true,
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

  if (loading) {
    return <p className="text-white">Loading interactions...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="relative flex flex-col rounded-xl bg-slate-950 p-4 shadow-2xl h-[500px]">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-white mb-4">User Interactions</h2>
      <h3 className="text-sm font-semibold text-white mb-4">Interactions for User: {userId}</h3>

      {/* Bar Chart Display */}
      {aggregatedInteractions && Object.keys(aggregatedInteractions).length > 0 ? (
        <div className="flex-1">
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p className="text-white">No interactions available for this user.</p>
      )}
    </div>
  );
};

export default UserInteractionsCard;