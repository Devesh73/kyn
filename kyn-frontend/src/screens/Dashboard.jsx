import React from "react";
import VisualizationCard from "../components/VisualizationCard"; // Import the VisualizationCard component
import Card from "../components/Card"; // Import the Card component

const Dashboard = () => {
  const data = [
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Behavioral Insights Section */}
          <section className="col-span-1 lg:col-span-2 bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Behavioral Insights</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Reuse Card component */}
              <Card title="Active Users" value="1,245" percentageChange="10" />
              <Card title="Engagement Rate" value="87%" percentageChange="5" />
              <Card title="Post Frequency" value="32/day" percentageChange="-3" />
              <Card title="Sentiment Score" value="76%" percentageChange="2" />
            </div>
          </section>

          {/* Community Detection Section */}
          <section className="col-span-1 bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Community Detection</h2>
            <div className="bg-purple-100 p-4 rounded-lg flex items-center justify-center h-48">
              <p className="text-center text-sm font-medium">
                Community Graph will appear here.
              </p>
            </div>
          </section>
        </div>

        {/* Visualization Card for Graph */}
        <div className="mt-6">
          <VisualizationCard title="User Engagement Over Time" data={data} />
        </div>

        {/* Analytics Section */}
        <div className="mt-6 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Detailed Analytics</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="bg-purple-200">
                  <th className="p-2">Metric</th>
                  <th className="p-2">Value</th>
                  <th className="p-2">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2">Active Users</td>
                  <td className="p-2">1,245</td>
                  <td className="p-2 text-green-500">+10%</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">Engagement Rate</td>
                  <td className="p-2">87%</td>
                  <td className="p-2 text-green-500">+5%</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">Post Frequency</td>
                  <td className="p-2">32/day</td>
                  <td className="p-2 text-red-500">-3%</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">Sentiment Score</td>
                  <td className="p-2">76%</td>
                  <td className="p-2 text-green-500">+2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
