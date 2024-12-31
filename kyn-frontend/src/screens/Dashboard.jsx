import React from "react";
import VisualizationCard from "../components/VisualizationCard"; // Import the VisualizationCard component
import Card from "../components/Card"; // Import the Card component
import ChatBotContainer from "../components/ChatBotContainer";
import GraphVisualization from "../components/GraphVisualization"; // Import the Neo4j Graph component

const Dashboard = () => {
  const lineChartData = [
    { name: "Page A", uv: 4000, pv: 2400 },
    { name: "Page B", uv: 3000, pv: 1398 },
    { name: "Page C", uv: 2000, pv: 9800 },
    { name: "Page D", uv: 2780, pv: 3908 },
    { name: "Page E", uv: 1890, pv: 4800 },
    { name: "Page F", uv: 2390, pv: 3800 },
    { name: "Page G", uv: 3490, pv: 4300 },
  ];

  return (
    <div className="min-h-screen bg-purple-50 text-purple-900">
      {/* Main Content */}
      <div className="container mx-auto p-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Neo4j Graph Visualization */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <GraphVisualization />
          </div>

          {/* ChatBot Container */}
          <div className="bg-white shadow-md rounded-lg flex flex-col h-[535px]"> {/* Fixed height for chatbot */}
            <ChatBotContainer />
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Behavioral Insights Section */}
          <section className="col-span-1 lg:col-span-2 bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Behavioral Insights</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card title="Active Users" value="1,245" percentageChange="10" />
              <Card title="Engagement Rate" value="87%" percentageChange="5" />
              <Card title="Post Frequency" value="32/day" percentageChange="-3" />
              <Card title="Sentiment Score" value="76%" percentageChange="2" />
            </div>
          </section>

          {/* User Engagement Graph */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <VisualizationCard title="User Engagement Over Time" data={lineChartData} />
          </div>
        </div>

        {/* Bottom Section: Line Chart and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Detailed Analytics or Other Content */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
