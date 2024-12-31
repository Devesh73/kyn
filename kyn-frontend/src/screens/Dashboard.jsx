import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-purple-50 text-purple-900">

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Behavioral Insights Section */}
          <section className="col-span-1 lg:col-span-2 bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Behavioral Insights</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <p className="text-sm font-medium">Active Users</p>
                <h3 className="text-2xl font-bold">1,245</h3>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <p className="text-sm font-medium">Engagement Rate</p>
                <h3 className="text-2xl font-bold">87%</h3>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <p className="text-sm font-medium">Post Frequency</p>
                <h3 className="text-2xl font-bold">32/day</h3>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <p className="text-sm font-medium">Sentiment Score</p>
                <h3 className="text-2xl font-bold">76%</h3>
              </div>
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
