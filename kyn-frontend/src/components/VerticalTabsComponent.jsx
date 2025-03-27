import React, { useState } from "react";

const VerticalTabsComponent = ({ tabs, defaultTab, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs.length > 0 ? tabs[0].id : ""));

  // Render the content for the active tab
  const renderTabContent = () => {
    // Find the child component that corresponds to the active tab
    const activeContent = React.Children.toArray(children).find(
      (child) => child.props.tabId === activeTab
    );
    
    return activeContent || <div className="text-gray-400 p-4">No content available</div>;
  };

  return (
    <div className="flex bg-transparent rounded-xl shadow-2xl overflow-hidden">
      {/* Left sidebar with vertical tabs */}
      <div className="w-48 bg-transparent p-2 flex flex-col border-r border-slate-800">
        <div className="flex flex-col space-y-2 mt-2">
          {tabs.map((tab) => (
            <div key={tab.id} className="relative">
              {activeTab === tab.id && 
                <div className="absolute left-0 top-0 w-0.5 h-full bg-white"></div>
              }
              <button
                className={`py-2 px-4 text-left w-full transition-colors ${
                  activeTab === tab.id 
                    ? "text-white font-medium" 
                    : "text-gray-500 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right content area */}
      <div className="flex-1 p-4 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
};

// Tab Content component with updated scrollbar styling
const TabContent = ({ tabId, children }) => {
  return (
    <div 
      className="h-[600px] px-1 overflow-y-auto custom-scrollbar"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(100, 116, 139, 0.3) transparent'
      }}
    >
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          background-color: transparent;
          opacity: 0;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(100, 116, 139, 0.3);
          border-radius: 4px;
        }
        
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(100, 116, 139, 0.5);
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
      {children}
    </div>
  );
};

VerticalTabsComponent.TabContent = TabContent;

export default VerticalTabsComponent;
