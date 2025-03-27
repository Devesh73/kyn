import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AlertCircle, ExternalLink, MessageCircle, X } from 'lucide-react';

const UrgentInsightsWidget = ({ setChatbotCollapsed, setInputValue }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Sample urgent insights - in a real application, these would come from your LLM chatbot API
  const urgentInsights = [
    {
      id: 1,
      title: "Rising COVID Misinformation",
      summary: "Detected 128% increase in false COVID treatment claims in Delhi region",
      content: `
## COVID Misinformation Alert

Our system has detected a **128% increase** in false claims about COVID-19 treatments in the Delhi region over the past 24 hours.

### Key Findings:
- Primary source appears to be 3 influential accounts with >50k followers
- Claims focus on unverified herbal remedies and conspiracy theories
- Spreading rapidly among 18-25 demographic
- Regional correlation with recent policy announcements

### Recommended Actions:
1. Deploy targeted fact-checking resources to the Delhi region
2. Engage health authority partners for rapid response
3. Monitor for spillover into neighboring regions
4. Prepare counter-messaging campaign

*This insight was generated automatically based on pattern detection from our monitoring systems.*
      `,
      query: "Show me the latest COVID misinformation patterns in Delhi and recommend response strategies.",
      urgency: "high"
    },
    {
      id: 2,
      title: "Election Manipulation Attempt",
      summary: "Coordinated network spreading vote manipulation claims",
      content: `
## Election Integrity Alert

A coordinated network of accounts has been identified spreading false information about vote manipulation.

### Key Findings:
- Network consists of 18 primary accounts with shared posting patterns
- Claims focus on non-existent "secret voting instructions"
- Targeted at first-time voters in rural districts
- Uses sophisticated deepfake videos of election officials

### Recommended Actions:
1. Notify election commission immediately
2. Issue official clarifications through verified channels
3. Identify and monitor network expansion attempts
4. Document evidence for potential legal action

*This alert has been verified by two independent analysts.*
      `,
      query: "Analyze the network spreading election misinformation and suggest immediate countermeasures.",
      urgency: "critical"
    }
  ];

  // Current insight - would cycle through urgent insights in a real application
  const currentInsight = urgentInsights[0];

  const handleChatbotQuery = () => {
    setChatbotCollapsed(false);
    setInputValue(currentInsight.query);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-24 right-6 w-64 bg-gradient-to-br from-black to-violet-950/80 rounded-lg overflow-hidden shadow-lg border border-violet-900/50">
        <div className="p-3 flex items-center justify-between bg-black/80">
          <div className="flex items-center space-x-2">
            <AlertCircle size={16} className={`${currentInsight.urgency === 'critical' ? 'text-red-500' : 'text-amber-500'} animate-pulse`} />
            <h3 className="text-white text-sm font-medium">Urgent Insight</h3>
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={handleChatbotQuery} 
              className="p-1 hover:bg-violet-900/30 rounded-full transition-colors"
              title="Discuss with AI Assistant"
            >
              <MessageCircle size={14} className="text-violet-300" />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="p-1 hover:bg-violet-900/30 rounded-full transition-colors"
              title="View Details"
            >
              <ExternalLink size={14} className="text-violet-300" />
            </button>
          </div>
        </div>
        <div className="p-3 border-t border-violet-900/20">
          <h4 className="text-violet-100 font-medium text-sm mb-1">{currentInsight.title}</h4>
          <p className="text-gray-400 text-xs">{currentInsight.summary}</p>
        </div>
      </div>

      {/* Modal for detailed insight */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-slate-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto relative">
            <div className="sticky top-0 bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
              <h3 className="text-lg font-medium text-white flex items-center">
                <AlertCircle size={18} className={`${currentInsight.urgency === 'critical' ? 'text-red-500' : 'text-amber-500'} mr-2`} />
                {currentInsight.title}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                {currentInsight.content}
              </ReactMarkdown>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleChatbotQuery}
                  className="px-4 py-2 bg-violet-700 text-white rounded-md hover:bg-violet-600 transition-colors flex items-center"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Discuss with AI Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UrgentInsightsWidget;
