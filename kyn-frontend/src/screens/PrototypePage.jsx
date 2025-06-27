import React, { useState } from 'react';
import ResizableSidebar from '../components/ResizableSidebar';
import DashboardTab from '../components/Tabs/DashboardTab';
import UsersTab from '../components/Tabs/UsersTab';
import { FiLayout, FiUsers } from 'react-icons/fi';

const PrototypePage = () => {
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 flex p-2 gap-2">
      {/* Main Content Block */}
      <main 
        className="rounded-lg bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm flex-1 flex flex-col overflow-hidden"
      >
        <div className="p-3 border-b border-slate-200/80 sticky top-0 z-10 bg-white/80 backdrop-blur-md">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1">
              <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-indigo-50 font-semibold text-indigo-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}
              >
                  <FiLayout className="w-4 h-4" />
                  Dashboard
              </button>
              <button 
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${activeTab === 'users' ? 'bg-indigo-50 font-semibold text-indigo-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}
              >
                  <FiUsers className="w-4 h-4" />
                  Users
              </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
            <div className={activeTab === 'dashboard' ? 'block' : 'hidden'}>
                <DashboardTab />
            </div>
            <div className={activeTab === 'users' ? 'block' : 'hidden'}>
                <UsersTab />
            </div>
        </div>
      </main>
      
      {/* Resizable Sidebar */}
      <ResizableSidebar 
        width={sidebarWidth}
        setWidth={setSidebarWidth}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
    </div>
  );
};

export default PrototypePage; 