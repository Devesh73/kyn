// VisualizationCard.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VisualizationCard = ({ title, data }) => {
  // Prepare chart data
  const chartData = {
    labels: data.map((item) => item.name), // X-axis labels (e.g., Page A, Page B)
    datasets: [
      {
        label: "UV",
        data: data.map((item) => item.uv), // Data for 'uv'
        borderColor: "#8884d8", // Line color for 'uv'
        fill: false,
        tension: 0.1,
      },
      {
        label: "PV",
        data: data.map((item) => item.pv), // Data for 'pv'
        borderColor: "#82ca9d", // Line color for 'pv'
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Pages",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-96">
      <h2 className="text-xl font-semibold text-purple-700 mb-4">{title}</h2>
      <div className="h-64">
        {/* Line Chart component from react-chartjs-2 */}
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default VisualizationCard;
