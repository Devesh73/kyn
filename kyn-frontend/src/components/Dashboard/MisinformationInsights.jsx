import React, { useEffect, useState } from 'react';
import { AlertCircle, TrendingUp, ExternalLink } from 'lucide-react';

const MisinformationInsights = ({ selectedRegion, selectedNews, setSelectedNews }) => {
  // State to store insights data for the selected region
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample insights data mapped to regions
  const regionInsightsMap = {
    "Delhi": [
      {
        id: 1,
        title: "Delhi Election Misinformation",
        date: "2025-01-15",
        urgency: "high",
        summary: "False claims about electoral irregularities spreading on social media",
        content: `
## Delhi Election Misinformation Analysis

### Summary
Multiple social media platforms have been flooded with false claims about electoral irregularities in Delhi's recent assembly elections.

### Misinterpreted Content
The primary misinformation narrative suggests that:
- Electronic Voting Machines (EVMs) were tampered with
- Certain demographics were prevented from voting
- Vote counts were manipulated during transmission

### Source Analysis
* **Original Source**: A video showing a malfunctioning EVM during a routine test
* **Initial Spread**: The clip was shared by @DelhiTruthSeeker with misleading context
* **Amplification**: The clip reached 2.5 million views after being shared by three political figures
* **Debunking**: Election Commission clarified that the video was from a training session

### Impact Assessment
This misinformation has led to:
1. Public demonstrations in 3 constituencies
2. Decrease in voter trust according to post-election surveys
3. International media questioning the integrity of the electoral process

### Recommended Action
* Immediate fact-checking distribution through official channels
* Targeted communication to affected constituencies
* Engagement with community leaders to rebuild trust
`
      },
      {
        id: 2,
        title: "COVID-19 Vaccine Rumors",
        date: "2025-01-10",
        urgency: "critical",
        summary: "Dangerous health misinformation regarding vaccine side effects",
        content: `
## COVID-19 Vaccine Misinformation Analysis

### Summary
A coordinated campaign spreading dangerous misinformation about supposed severe side effects of the latest COVID-19 booster vaccines.

### Misinterpreted Content
The misinformation claims:
- The vaccine causes a new variant of the virus
- Vaccinated individuals are experiencing severe neurological side effects
- Government is covering up "thousands" of vaccine-related deaths

### Source Analysis
* **Original Source**: An edited video combining out-of-context clips from a medical conference
* **Initial Spread**: First appeared on alternative video platforms before migrating to mainstream social media
* **Amplification**: Several influential health and wellness accounts with combined following of 7.3M shared the content
* **Debunking**: Multiple fact-checking organizations and the Health Ministry have issued comprehensive rebuttals

### Impact Assessment
This misinformation has resulted in:
1. 35% drop in vaccine appointment bookings in Delhi NCR
2. Reports of people seeking dangerous "detox" treatments
3. Increased hostility toward healthcare workers

### Recommended Action
* Immediate public health messaging campaign
* Engagement with community medical professionals
* Request removal of content from platforms under harmful health misinformation policies
`
      },
      {
        id: 3,
        title: "Infrastructure Project Controversy",
        date: "2024-12-22",
        urgency: "medium",
        summary: "Misleading claims about Central Vista project funding and timeline",
        content: `
## Infrastructure Project Misinformation Analysis

### Summary
Misleading narratives about the Central Vista redevelopment project have been circulating, particularly regarding its budget and environmental impact.

### Misinterpreted Content
The misinformation includes:
- Claims that project budgets have increased by 500%
- Allegations that historical buildings are being demolished without approval
- Assertions that environmental clearances were bypassed

### Source Analysis
* **Original Source**: Misinterpreted government budget documents shared on WhatsApp
* **Initial Spread**: Several opposition political accounts posted the misinterpreted figures
* **Amplification**: Coverage by two major news outlets without proper verification
* **Debunking**: Ministry of Housing and Urban Affairs issued clarifications with correct figures

### Impact Assessment
This misinformation has led to:
1. Public protests at the construction sites
2. Legal petitions filed based on incorrect information
3. International coverage questioning the project's legitimacy

### Recommended Action
* Publish transparent project timelines and budgets
* Host media tours of the construction sites
* Release official documentation regarding environmental and heritage approvals
`
      }
    ],
    "Mumbai": [
      {
        id: 4,
        title: "Financial Scam Warnings",
        date: "2025-01-18",
        urgency: "medium",
        summary: "Emerging misinformation trend on financial scams targeting urban professionals",
        content: `
## Financial Scam Misinformation Analysis

### Summary
Recent social media trends indicate a rise in misinformation regarding financial scams, specifically targeting urban professionals in Mumbai.

### Misinterpreted Content
The misinformation includes:
- False alerts about specific banks facing imminent collapse
- Fabricated investment schemes claiming government backing
- Misleading information about tax policies affecting salaried employees

### Source Analysis
* **Original Source**: Anonymous Telegram channels posing as financial insiders
* **Initial Spread**: WhatsApp groups of corporate employees
* **Amplification**: Several financial "influencers" with followings of 100K+ shared the claims
* **Debunking**: Reserve Bank of India and SEBI issued clarifications

### Impact Assessment
This misinformation has resulted in:
1. Multiple reported cases of fraud as people seek alternative investments
2. Temporary disruption to banking services due to panic withdrawals
3. Unnecessary financial anxiety among middle-class professionals

### Recommended Action
* Coordinate with financial institutions for clear communication
* Targeted social media campaign with accurate financial guidance
* Publish case studies of how these scams operate
`
      },
      {
        id: 5,
        title: "Housing Market Collapse Rumors",
        date: "2025-01-05",
        urgency: "high",
        summary: "False claims about imminent real estate market crash affecting property investments",
        content: `
## Housing Market Misinformation Analysis

### Summary
Coordinated spread of misinformation suggesting an imminent collapse of Mumbai's housing market, causing unnecessary panic among homeowners and investors.

### Misinterpreted Content
The misinformation claims:
- Property values will drop by 60% within months
- Several major developers are secretly bankrupt
- Government will seize properties in certain areas for infrastructure

### Source Analysis
* **Original Source**: Manipulated charts and data from real estate analytics
* **Initial Spread**: Real estate "guru" accounts on Instagram and YouTube
* **Amplification**: Coverage by financial news sites without proper verification
* **Debunking**: Real Estate Regulatory Authority and economic experts provided corrective data

### Impact Assessment
This misinformation has led to:
1. Panic selling of properties at below-market rates
2. Construction projects facing financing difficulties
3. Genuine homebuyers delaying purchases unnecessarily

### Recommended Action
* Publish accurate market data from authoritative sources
* Collaborate with real estate associations for unified messaging
* Create educational content on how to verify market claims
`
      }
    ],
    "Lucknow": [
      {
        id: 6,
        title: "Maha Kumbh Mela Misinformation",
        date: "2025-01-22",
        urgency: "high", 
        summary: "False claims about event safety and logistics affecting religious gathering",
        content: `
## Maha Kumbh Mela Misinformation Analysis

### Summary
In January 2025, posts on X and mainstream media spread false claims about the Maha Kumbh Mela in Prayagraj, near Lucknow, causing confusion and safety concerns.

### Misinterpreted Content
The misinformation includes:
- False claims of bridge collapses at the venue
- Fabricated reports of severe water contamination
- Misleading information about stampedes and casualties
- Exaggerated crowd size estimates causing panic

### Source Analysis
* **Original Source**: Edited images from previous years' events shared as current
* **Initial Spread**: Several unverified news accounts on social media platforms
* **Amplification**: The false information was shared by both domestic and international media
* **Debunking**: Uttar Pradesh government took action against 101 social media accounts

### Impact Assessment
This misinformation resulted in:
1. Significant reduction in pilgrim attendance
2. Unnecessary panic among attendees and their families
3. Diversion of administrative resources to counter false narratives
4. Economic impact on local businesses dependent on the event

### Recommended Action
* Establish real-time information verification center at the event
* Deploy official photographers to share authentic current images
* Coordinate with media houses for responsible reporting
* Issue regular situation updates through official channels
`
      }
    ],
    "Srinagar": [
      {
        id: 7,
        title: "India-Canada Diplomatic Row",
        date: "2023-09-18",
        urgency: "critical",
        summary: "False claims of violence during diplomatic tensions affecting community relations",
        content: `
## India-Canada Diplomatic Row Misinformation Analysis

### Summary
During the India-Canada diplomatic tensions over the Nijjar case, Indian media outlets pushed false claims of violence in Jammu and Kashmir, including misleading reports about Canada's travel advisory.

### Misinterpreted Content
The misinformation primarily consisted of:
- Fabricated incidents of communal violence
- Misleading interpretations of diplomatic statements
- False attribution of quotes to Canadian officials
- Manipulated images from unrelated events

### Source Analysis
* **Original Source**: Several mainstream news channels aired out-of-context footage
* **Initial Spread**: WhatsApp groups with nationalist focus amplified the content
* **Amplification**: Content reached Srinagar where historical conflicts made the region vulnerable
* **Debunking**: International observers and diplomatic channels clarified the actual situation

### Impact Assessment
This misinformation campaign resulted in:
1. Heightened community tensions in sensitive areas
2. Erosion of trust in mainstream media reporting
3. Diplomatic complications requiring official clarifications
4. Increased security deployments based on false threats

### Recommended Action
* Promote media literacy specifically around diplomatic reporting
* Engage community leaders to dispel false narratives
* Create dedicated fact-checking channels for sensitive regions
* Document the spread pattern to prevent future similar campaigns
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
        const regionData = regionInsightsMap[regionName] || [];
        setInsights(regionData);
        setLoading(false);
        
        // Reset selected news when region changes
        setSelectedNews(null);
      }, 500);
    } else {
      setInsights([]);
    }
  }, [selectedRegion, setSelectedNews]);

  if (!selectedRegion) {
    return (
      <div className="bg-black bg-opacity-40 rounded-xl p-4 border border-gray-800 h-[500px] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <AlertCircle className="mx-auto mb-2 text-violet-500" size={36} />
          <p className="text-lg">Select a region on the map to view misinformation insights</p>
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
          <AlertCircle className="mx-auto mb-2" size={32} />
          <p className="text-lg">No insights available for {selectedRegion.name}</p>
          <p className="text-sm mt-2">Try selecting a different region</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black bg-opacity-40 rounded-xl p-4 border border-gray-800 h-[500px] overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">
          {selectedRegion.name} Insights
        </h3>
        <div className="text-emerald-500 text-xs font-medium px-2 py-1 bg-emerald-900/30 rounded-full">
          {insights.length} issues found
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedNews(item)}
            className={`p-3 rounded-lg border transition-all cursor-pointer
                      ${selectedNews && selectedNews.id === item.id 
                        ? 'bg-violet-900/30 border-violet-500' 
                        : 'bg-gray-900/50 border-gray-800 hover:border-violet-800'}
                     `}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <AlertCircle 
                    size={14} 
                    className={`mr-2 ${
                      item.urgency === 'critical' ? 'text-red-500' : 
                      item.urgency === 'high' ? 'text-amber-500' : 
                      'text-emerald-500'
                    }`} 
                  />
                  <h4 className="text-white font-medium">{item.title}</h4>
                </div>
                <p className="text-gray-300 text-sm mt-1">{item.summary}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-white">{item.date}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    item.urgency === 'critical' ? 'bg-red-900/30 text-red-400' : 
                    item.urgency === 'high' ? 'bg-amber-900/30 text-amber-400' : 
                    'bg-emerald-900/30 text-emerald-400'
                  }`}>
                    {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)} Priority
                  </span>
                </div>
              </div>
              <div className="bg-slate-800 p-1.5 rounded-full">
                <ExternalLink size={14} className="text-violet-300" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisinformationInsights;
