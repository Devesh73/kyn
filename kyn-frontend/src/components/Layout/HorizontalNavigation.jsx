import React from 'react';
import { BarChart3, AlertTriangle, UserCircle, Map, Newspaper } from 'lucide-react';

const navItems = [
  { id: "overview", label: "Overview", icon: <BarChart3 size={18} /> },
  { id: "news", label: "News Analysis", icon: <Newspaper size={18} /> },
  { id: "misinformation", label: "Misinformation Tracker", icon: <AlertTriangle size={18} /> },
  { id: "influencer", label: "Community Insights", icon: <UserCircle size={18} /> },
  { id: "regional", label: "Regional Focus", icon: <Map size={18} /> },
];

const HorizontalNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-black/60 backdrop-blur-sm w-full flex justify-center">
      <nav className="w-5/6 mx-5 my-2 px-4 rounded-2xl border border-gray-600">
        <ul className="flex justify-between">
          {navItems.map((item) => (
            <li key={item.id} className="flex-1 text-center py-2">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-center py-3 px-2 w-full transition-all duration-300 ${
                  activeTab === item.id
                    ? "bg-purple-900/40 text-white"
                    : "text-gray-400 hover:bg-purple-900/20 hover:text-white"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default HorizontalNavigation;
