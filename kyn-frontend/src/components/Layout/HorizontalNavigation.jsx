import React from 'react';
import { BarChart3, AlertTriangle, Users, UserCircle, Map } from 'lucide-react';

const navItems = [
  { id: "overview", label: "Overview", icon: <BarChart3 size={18} /> },
  { id: "misinformation", label: "Misinformation Tracker", icon: <AlertTriangle size={18} /> },
  { id: "community", label: "Community Health", icon: <Users size={18} /> },
  { id: "influencer", label: "Influencer Insights", icon: <UserCircle size={18} /> },
  { id: "regional", label: "Regional Focus", icon: <Map size={18} /> },
];

const HorizontalNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-black/60 backdrop-blur-sm w-full border-b border-gray-800">
      <nav className="container mx-auto flex justify-center">
        <ul className="flex space-x-2">
          {navItems.map((item) => (
            <li key={item.id} className="py-2">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center py-3 px-4 rounded-lg transition-all duration-300 ${
                  activeTab === item.id
                    ? "bg-purple-900/40 text-white"
                    : "text-gray-400 hover:bg-purple-900/20 hover:text-white"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default HorizontalNavigation;
