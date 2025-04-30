import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, ExternalLink, Activity } from 'lucide-react';

const UserInsights = ({ selectedRegion, selectedInsight, setSelectedInsight }) => {
  // State to store insights data for the selected region
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample engagement insights data mapped to regions
  const regionEngagementMap = {
    "Delhi": [
      {
        id: 1,
        title: "Tech Content Engagement Surge",
        date: "2025-01-15",
        engagementLevel: "high",
        summary: "Record engagement with AI and startup content in Delhi region",
        content: `
## Delhi Tech Engagement Analysis

### Summary
Delhi NCR has shown exceptional engagement with technology-related content, particularly around AI and startup ecosystems.

### Key Metrics
- 78% increase in tech content consumption
- Average session duration: 4.2 minutes (above national average)
- 45% of users engage with multiple pieces of content

### Top Performing Content
1. **AI Career Opportunities** - 1.2M views
2. **Startup Funding Guide** - 950K views
3. **Tech Skill Development** - 820K views

### Demographic Breakdown
- Age 18-24: 42%
- Age 25-34: 38%
- Age 35-44: 15%
- Age 45+: 5%

### Recommended Actions
* Increase tech-related content production
* Partner with local tech communities
* Develop Delhi-specific tech case studies
`
      },
      {
        id: 2,
        title: "Financial Literacy Content Growth",
        date: "2025-01-10",
        engagementLevel: "high",
        summary: "Strong engagement with personal finance and investment content",
        content: `
## Delhi Financial Content Engagement

### Summary
Delhi users are showing increased interest in financial literacy and investment content.

### Engagement Highlights
- 65% increase in finance content consumption
- High sharing rate (32% of viewers share content)
- 28% follow-up engagement with related content

### Popular Topics
* Stock market basics
* Mutual fund investments
* Tax saving strategies

### User Feedback
"Really appreciate the clear explanations of complex financial topics" - Rohan, 28
"Helped me make better investment decisions" - Priya, 34

### Opportunities
* Expand content on advanced investment strategies
* Create interactive financial tools
* Partner with financial institutions for expert content
`
      }
    ],
    "Mumbai": [
      {
        id: 3,
        title: "Entertainment Content Dominance",
        date: "2025-01-18",
        engagementLevel: "high",
        summary: "Exceptional engagement with Bollywood and entertainment content",
        content: `
## Mumbai Entertainment Engagement

### Summary
Mumbai shows the highest engagement with entertainment content in the country.

### Key Metrics
- 82% of users engage with entertainment content weekly
- Average watch time: 6.1 minutes per video
- 52% conversion rate to related content

### Top Content
1. **Bollywood News Updates** - 2.1M views
2. **Celebrity Interviews** - 1.8M views
3. **Film Analysis** - 1.5M views

### User Behavior
- Peak engagement: 7-11 PM
- 68% mobile consumption
- High social sharing (41%)

### Recommendations
* Increase behind-the-scenes content
* Create Mumbai-specific entertainment guides
* Develop interactive fan engagement features
`
      }
    ],
    "Bangalore": [
      {
        id: 4,
        title: "Startup Ecosystem Engagement",
        date: "2025-01-18",
        engagementLevel: "high",
        summary: "Exceptional engagement with startup and entrepreneurship content",
        content: `
## Bangalore Startup Content Analysis

### Summary
Bangalore continues to lead in engagement with startup-related content, solidifying its position as India's startup capital.

### Engagement Metrics
- 92% of tech professionals in Bangalore engage with startup content
- Average 5.1 minutes spent per session
- 38% conversion rate to related services

### Top Content
1. **How to Pitch to Investors** - 1.8M views
2. **Building MVP Guide** - 1.5M views
3. **Startup Founder Interviews** - 1.2M views

### User Demographics
- Founders: 28%
- Employees: 45%
- Aspiring Entrepreneurs: 27%

### Recommendations
* Expand founder success stories
* Create Bangalore-specific startup resources
* Develop mentorship program content
`
      }
    ],
    "Hyderabad": [
      {
        id: 5,
        title: "Tech & Food Content Popularity",
        date: "2025-01-12",
        engagementLevel: "medium",
        summary: "Strong engagement with both tech and local food content",
        content: `
## Hyderabad Content Preferences

### Summary
Hyderabad shows a unique blend of tech and culinary content engagement.

### Engagement Highlights
- Tech content: 58% engagement rate
- Food content: 62% engagement rate
- 41% of users engage with both categories

### Top Performing Content
1. **Tech Park Developments** - 850K views
2. **Hyderabadi Biryani Guide** - 920K views
3. **Local Startup Stories** - 720K views

### User Insights
- Tech content preferred during work hours
- Food content peaks during evenings/weekends
- High engagement with "hybrid" content (tech + food)

### Opportunities
* Create content blending tech and local culture
* Develop food-tech startup stories
* Partner with local culinary influencers
`
      }
    ],
    "Chennai": [
      {
        id: 6,
        title: "Education Content Engagement",
        date: "2025-01-14",
        engagementLevel: "medium",
        summary: "Strong performance of educational and career guidance content",
        content: `
## Chennai Education Content

### Summary
Chennai leads in engagement with educational content and career guidance.

### Key Metrics
- 75% of users engage with education content
- Average watch time: 5.3 minutes
- 62% completion rate for long-form content

### Popular Categories
1. **Competitive Exam Preparation** - 1.1M views
2. **Career Guidance** - 980K views
3. **Skill Development** - 850K views

### User Demographics
- Students: 58%
- Working Professionals: 32%
- Others: 10%

### Recommendations
* Expand test preparation resources
* Create local success stories
* Develop interactive learning tools
`
      }
    ]
  };

  // Effect to load insights when region changes
  useEffect(() => {
    if (selectedRegion) {
      setLoading(true);
      
      // Simulate API call with setTimeout
      setTimeout(() => {
        const regionName = selectedRegion.name;
        const regionData = regionEngagementMap[regionName] || [];
        setInsights(regionData);
        setLoading(false);
        
        // Reset selected insight when region changes
        setSelectedInsight(null);
      }, 500);
    } else {
      setInsights([]);
    }
  }, [selectedRegion, setSelectedInsight]);

  if (!selectedRegion) {
    return (
      <div className="bg-black bg-opacity-40 rounded-xl p-4 border border-gray-800 h-[500px] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Users className="mx-auto mb-2 text-blue-500" size={36} />
          <p className="text-lg">Select a region on the map to view user engagement insights</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-black bg-opacity-40 rounded-xl p-4 border border-gray-800 h-[500px] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="loader-small mx-auto mb-2"></div>
          <p>Loading insights for {selectedRegion.name}...</p>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="bg-black bg-opacity-40 rounded-xl p-4 border border-gray-800 h-[500px] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Activity className="mx-auto mb-2" size={32} />
          <p className="text-lg">No engagement data available for {selectedRegion.name}</p>
          <p className="text-sm mt-2">Try selecting a different region</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black bg-opacity-40 rounded-xl p-4 border border-gray-800 h-[500px] overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">
          {selectedRegion.name} Engagement Insights
        </h3>
        <div className={`text-xs font-medium px-2 py-1 rounded-full ${
          selectedRegion.engagementLevel === 'high' ? 'bg-green-900/30 text-green-400' :
          selectedRegion.engagementLevel === 'medium' ? 'bg-blue-900/30 text-blue-400' :
          'bg-amber-900/30 text-amber-400'
        }`}>
          {selectedRegion.engagementLevel.toUpperCase()} ENGAGEMENT
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedInsight(item)}
            className={`p-3 rounded-lg border transition-all cursor-pointer
                      ${selectedInsight && selectedInsight.id === item.id 
                        ? 'bg-blue-900/30 border-blue-500' 
                        : 'bg-gray-900/50 border-gray-800 hover:border-blue-800'}
                     `}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <TrendingUp 
                    size={14} 
                    className={`mr-2 ${
                      item.engagementLevel === 'high' ? 'text-green-500' : 
                      item.engagementLevel === 'medium' ? 'text-blue-500' : 
                      'text-amber-500'
                    }`} 
                  />
                  <h4 className="text-white font-medium">{item.title}</h4>
                </div>
                <p className="text-gray-300 text-sm mt-1">{item.summary}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-white">{item.date}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    item.engagementLevel === 'high' ? 'bg-green-900/30 text-green-400' : 
                    item.engagementLevel === 'medium' ? 'bg-blue-900/30 text-blue-400' : 
                    'bg-amber-900/30 text-amber-400'
                  }`}>
                    {item.engagementLevel.charAt(0).toUpperCase() + item.engagementLevel.slice(1)} Engagement
                  </span>
                </div>
              </div>
              <div className="bg-slate-800 p-1.5 rounded-full">
                <ExternalLink size={14} className="text-blue-300" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserInsights;