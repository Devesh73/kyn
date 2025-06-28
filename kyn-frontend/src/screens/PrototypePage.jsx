import React, { useState, Suspense } from 'react';
import ResizableSidebar from '../components/ResizableSidebar';
import { FiLayout, FiUsers, FiMoon, FiSun } from 'react-icons/fi';

// Lazy load tab components for better performance
const DashboardTab = React.lazy(() => import('../components/Tabs/DashboardTab'));
const UsersTab = React.lazy(() => import('../components/Tabs/UsersTab'));

const PrototypePage = () => {
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  return (
    <div className={`h-screen ${isDarkTheme ? 'bg-neutral-950' : 'bg-neutral-100'} text-slate-800 flex p-1 gap-1`}>
      {/* Main Content Block */}
      <main 
        className={`rounded ${isDarkTheme ? 'bg-neutral-900' : 'bg-neutral-200/80'} backdrop-blur-sm shadow-sm flex-1 flex flex-col overflow-hidden`}
      >
        <div className={`p-2 border-b ${isDarkTheme ? 'border-purple-800/30' : 'border-purple-200/80'} sticky top-0 z-10 ${isDarkTheme ? 'bg-purple-900/20' : 'bg-purple-100/20'} backdrop-blur-md`}>
          {/* Tab Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'dashboard' 
                          ? `${isDarkTheme ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}` 
                          : `${isDarkTheme ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white' : 'text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-900'}`
                  }`}
              >
                  <FiLayout className="w-3.5 h-3.5" />
                  Dashboard
              </button>
              <button 
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'users' 
                          ? `${isDarkTheme ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}` 
                          : `${isDarkTheme ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white' : 'text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-900'}`
                  }`}
              >
                  <FiUsers className="w-3.5 h-3.5" />
                  Users
              </button>
            </div>
            
            {/* Theme Toggle */}
            <button 
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={`p-1.5 rounded-full transition-all duration-200 ${isDarkTheme ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white' : 'text-neutral-500 hover:bg-neutral-200/50'}`}
              aria-label="Toggle theme"
            >
              {isDarkTheme ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
            <Suspense fallback={
              <div className="flex items-center justify-center h-96">
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                  <span className="text-lg">Loading Content...</span>
                </div>
              </div>
            }>
              <div className={activeTab === 'dashboard' ? 'block' : 'hidden'}>
                <DashboardTab isDarkTheme={isDarkTheme} />
              </div>
              <div className={activeTab === 'users' ? 'block' : 'hidden'}>
                <UsersTab isDarkTheme={isDarkTheme} />
              </div>
            </Suspense>
        </div>
      </main>
      
      {/* Resizable Sidebar */}
      <ResizableSidebar 
        width={sidebarWidth}
        setWidth={setSidebarWidth}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        isDarkTheme={isDarkTheme}
      />
    </div>
  );
};

export default PrototypePage; 