import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, Filter, ChevronDown, ChevronUp, AlertTriangle, Check, Clock } from 'lucide-react';
import axios from 'axios';

const NewsAnalysis = () => {
  // State for filters
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNewsId, setExpandedNewsId] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter options
  const availableYears = [2023, 2024, 2025];
  const availableMonths = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];
  
  // Calculate days in the selected month
  const daysInMonth = useMemo(() => {
    return new Date(year, month, 0).getDate();
  }, [year, month]);
  
  // Sample news articles for the first 5 days
  const sampleNewsArticlesByDay = {
    // Day 1 news
    1: [
      {
        id: 101,
        title: "Government Announces New Cyber Security Framework",
        source: "National Tech News",
        timestamp: `2025-${month.toString().padStart(2, '0')}-01T10:15:00`,
        isMisinformation: false,
        category: "Technology",
        region: "National",
        summary: "The Ministry of Electronics and IT has announced a comprehensive cyber security framework focusing on critical infrastructure protection and data privacy enhancements."
      },
      {
        id: 102,
        title: "Hackers Steal Millions from Central Bank, Claims Report",
        source: "Financial Express Daily",
        timestamp: `2025-${month.toString().padStart(2, '0')}-01T14:30:00`,
        isMisinformation: true,
        category: "Finance",
        region: "National",
        summary: "An unverified report claiming hackers stole millions from the central bank has been circulating despite official denials. The central bank confirmed all systems are secure."
      },
    ],
    
    // Day 2 news
    2: [
      {
        id: 201,
        title: "Record-Breaking Climate Agreement Reached at UN Summit",
        source: "Global Environment Today",
        timestamp: `2025-${month.toString().padStart(2, '0')}-02T09:45:00`,
        isMisinformation: false,
        category: "Environment",
        region: "International",
        summary: "World leaders have reached a groundbreaking climate agreement that sets ambitious carbon reduction targets and establishes a $100 billion fund for developing nations."
      },
      {
        id: 202,
        title: "Scientists Warning of Imminent Climate Catastrophe",
        source: "Climate Truth Network",
        timestamp: `2025-${month.toString().padStart(2, '0')}-02T16:20:00`,
        isMisinformation: true,
        category: "Environment",
        region: "International",
        summary: "A report circulating online claims scientists predict catastrophic climate events within months, misrepresenting IPCC data which projects impacts over decades, not immediate disasters."
      },
    ],
    
    // Day 3 news
    3: [
      {
        id: 301,
        title: "New Cancer Treatment Shows 90% Success in Trials",
        source: "Medical Research Journal",
        timestamp: `2025-${month.toString().padStart(2, '0')}-03T11:05:00`,
        isMisinformation: false,
        category: "Health",
        region: "National",
        summary: "A breakthrough cancer treatment developed by researchers at AIIMS has shown a 90% success rate in early clinical trials, particularly effective against previously resistant forms."
      },
      {
        id: 302,
        title: "Natural Herb Cures All Cancers, Claims Viral Post",
        source: "Wellness Insights Blog",
        timestamp: `2025-${month.toString().padStart(2, '0')}-03T12:45:00`,
        isMisinformation: true,
        category: "Health",
        region: "Delhi",
        summary: "A viral social media post claiming a specific herb cures all forms of cancer has gained traction despite no scientific evidence supporting the claim. Medical experts have issued warnings."
      },
    ],
    
    // Day 4 news
    4: [
      {
        id: 401,
        title: "Supreme Court Issues Landmark Privacy Ruling",
        source: "Legal Affairs Daily",
        timestamp: `2025-${month.toString().padStart(2, '0')}-04T10:30:00`,
        isMisinformation: false,
        category: "Legal",
        region: "National",
        summary: "The Supreme Court has issued a landmark ruling strengthening digital privacy protections for citizens and establishing new guidelines for data collection by both government and private entities."
      },
      {
        id: 402,
        title: "Supreme Court Judge Resigns Over Corruption Scandal",
        source: "Citizens' Voice Network",
        timestamp: `2025-${month.toString().padStart(2, '0')}-04T15:15:00`,
        isMisinformation: true,
        category: "Legal",
        region: "National",
        summary: "False reports about a Supreme Court judge resigning over corruption allegations spread rapidly across social media platforms before being officially denied by court authorities."
      },
    ],
    
    // Day 5 news
    5: [
      {
        id: 501,
        title: "India and Japan Sign Major Defense Pact",
        source: "International Relations Monitor",
        timestamp: `2025-${month.toString().padStart(2, '0')}-05T14:00:00`,
        isMisinformation: false,
        category: "Defense",
        region: "National",
        summary: "India and Japan have signed a comprehensive defense agreement that includes joint military exercises, technology transfer, and strategic cooperation in the Indo-Pacific region."
      },
      {
        id: 502,
        title: "Border Conflict Escalates with Neighboring Country",
        source: "Patriot News Network",
        timestamp: `2025-${month.toString().padStart(2, '0')}-05T17:30:00`,
        isMisinformation: true,
        category: "Defense",
        region: "Border Regions",
        summary: "Unverified reports of border conflicts have been spreading online with doctored images and videos. Defense officials have confirmed no unusual activity in border areas."
      },
    ]
  };
  
  // Default news for other days
  const defaultDayNews = [
    {
      id: 1,
      title: "New EVM Technology to be Deployed in Delhi Elections",
      source: "Delhi Electoral Office",
      timestamp: `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T09:30:00`,
      isMisinformation: false,
      category: "Politics",
      region: "Delhi",
      summary: "The Delhi Electoral Office has announced the deployment of next-generation electronic voting machines featuring enhanced security measures for upcoming assembly elections."
    },
    {
      id: 2,
      title: "EVMs Hacked in Delhi Test Run, Claims Opposition",
      source: "Delhi Politics Today",
      timestamp: `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T14:45:00`,
      isMisinformation: true,
      category: "Politics",
      region: "Delhi",
      summary: "Opposition parties claim to have evidence that EVMs were manipulated during test runs, a claim refuted by election officials who clarified that the video showing malfunctions was from a training session."
    },
    {
      id: 3,
      title: "Health Ministry Announces COVID-19 Booster Campaign",
      source: "Ministry of Health",
      timestamp: `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T10:15:00`,
      isMisinformation: false,
      category: "Health",
      region: "National",
      summary: "The Health Ministry has launched a nationwide campaign for the latest COVID-19 booster shots, targeting vulnerable populations first."
    },
    {
      id: 4,
      title: "New Study Links COVID-19 Vaccine to Neurological Issues",
      source: "Health Freedom Network",
      timestamp: `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T16:20:00`,
      isMisinformation: true,
      category: "Health",
      region: "Delhi",
      summary: "An unverified report claiming to be a 'leaked study' suggests severe neurological side effects from COVID-19 boosters, contradicting extensive clinical trial data."
    }
  ];

  useEffect(() => {
    // Simulating API call to fetch news articles for selected date
    setLoading(true);
    setTimeout(() => {
      if (day <= 5) {
        // Use unique news for first 5 days
        setNewsArticles(sampleNewsArticlesByDay[day] || []);
      } else {
        // Use default news for other days
        setNewsArticles(defaultDayNews);
      }
      setLoading(false);
    }, 800);
  }, [year, month, day]);

  const toggleExpand = (id) => {
    setExpandedNewsId(expandedNewsId === id ? null : id);
  };

  // Filter articles based on search query
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return newsArticles;
    
    const query = searchQuery.toLowerCase();
    return newsArticles.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.region.toLowerCase().includes(query) || 
      article.category.toLowerCase().includes(query) ||
      article.source.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query)
    );
  }, [newsArticles, searchQuery]);

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">News Analysis</h2>
      
      {/* Filters section */}
      <div className="bg-black bg-opacity-40 rounded-xl p-4 border border-gray-800">
        <div className="flex flex-col space-y-4">
          {/* Year, Month, and Day selectors in one row */}
          <div className="flex items-center gap-6">
            {/* Year dropdown */}
            <div className="w-32">
              <label className="text-xs text-gray-400 mb-1 block">Year</label>
              <select 
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {availableYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            
            {/* Month dropdown */}
            <div className="w-40">
              <label className="text-xs text-gray-400 mb-1 block">Month</label>
              <select 
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {availableMonths.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            
            {/* Day slider */}
            <div className="flex-grow">
              <div className="flex justify-between mb-1">
                <label className="text-xs text-gray-400">Day: {day}</label>
                <span className="text-xs text-gray-400">{daysInMonth} days</span>
              </div>
              <input
                type="range"
                min={1}
                max={daysInMonth}
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full bg-gray-700 rounded-lg appearance-none cursor-pointer h-2 accent-violet-600"
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>1</span>
                <span>{Math.floor(daysInMonth / 2)}</span>
                <span>{daysInMonth}</span>
              </div>
            </div>
          </div>
          
          {/* Search bar as a separate row below */}
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="Search news by title, source, region, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>
        </div>
        
        {/* Current date display */}
        <div className="flex items-center mt-4 text-sm">
          <Calendar size={16} className="text-violet-400 mr-2" />
          <span className="text-white">Selected date: {day} {availableMonths.find(m => m.value === month)?.label} {year}</span>
        </div>
      </div>
      
      {/* News articles table with scrolling */}
      <div className="bg-black bg-opacity-40 rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center sticky top-0">
          <h3 className="text-lg font-bold text-white">
            News Articles <span className="text-sm font-normal text-gray-400">({filteredArticles.length} articles)</span>
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2 py-0.5 bg-amber-900/30 text-amber-400 rounded-full flex items-center">
              <AlertTriangle size={12} className="mr-1" /> Misinformation
            </span>
            <span className="text-xs px-2 py-0.5 bg-emerald-900/30 text-emerald-400 rounded-full flex items-center">
              <Check size={12} className="mr-1" /> Verified
            </span>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="loader-small"></div>
              <span className="ml-3 text-gray-300">Loading articles...</span>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No articles found for your search criteria
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {filteredArticles.map(article => (
                <div key={article.id} className="transition-all duration-200">
                  {/* News item header - always visible */}
                  <div 
                    onClick={() => toggleExpand(article.id)} 
                    className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-900/50
                      ${expandedNewsId === article.id ? 'bg-violet-900/20 border-violet-700' : ''}`
                    }
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        {article.isMisinformation ? (
                          <AlertTriangle size={16} className="text-amber-500" />
                        ) : (
                          <Check size={16} className="text-emerald-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{article.title}</h4>
                        <div className="flex items-center space-x-2 text-xs mt-1">
                          <span className="text-gray-400">{article.source}</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-400">{article.region}</span>
                          <span className="text-gray-600">•</span>
                          <div className="flex items-center text-gray-400">
                            <Clock size={12} className="mr-1" />
                            {formatTime(article.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      {expandedNewsId === article.id ? (
                        <ChevronUp size={16} className="text-violet-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded content */}
                  {expandedNewsId === article.id && (
                    <div className="px-4 py-3 bg-gray-900/30 border-t border-gray-800">
                      <div className="pl-8">
                        <p className="text-gray-300 text-sm">{article.summary}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`
                            text-xs px-2 py-1 rounded-full
                            ${article.isMisinformation 
                              ? 'bg-amber-900/30 text-amber-400' 
                              : 'bg-emerald-900/30 text-emerald-400'}
                          `}>
                            {article.isMisinformation ? 'Misinformation' : 'Verified Content'}
                          </span>
                          <span className="text-xs text-gray-500">Category: {article.category}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsAnalysis;
