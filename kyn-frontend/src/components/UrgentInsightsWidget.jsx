import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AlertCircle, ExternalLink, MessageCircle, X } from 'lucide-react';

const UrgentInsightsWidget = ({ setChatbotCollapsed, setInputValue }) => {
	// New state for selected insight
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedInsight, setSelectedInsight] = useState(null);

	// Define three urgent insights using provided content
	const urgentInsights = [
		{
			id: 1,
			title: "Lucknow Cluster",
			summary: "Misinformation Surrounding Maha Kumbh Mela",
			content: `
**Location**: Lucknow (26.8467, 80.9462, intensity 0.9)

**Misinformation**: In January 2025, posts on X and mainstream media spread false claims about the Maha Kumbh Mela in Prayagraj, near Lucknow. These included misleading information about event logistics and safety, leading the Uttar Pradesh government to take action against 101 social media accounts for posting deceptive content, as reported by ANI in February 2025.

**Impact**: The misinformation caused confusion among attendees, potentially affecting public safety during the massive religious gathering. It also strained local administrative resources in Uttar Pradesh, a politically significant state, as authorities had to divert efforts to counter false narratives during a high-stakes event.

**Relevance to SocialSage**: Lucknow’s high misinformation intensity reflects its proximity to Prayagraj and its role in Uttar Pradesh’s political and cultural landscape. This example highlights the need for real-time monitoring of event-specific misinformation in regions hosting large gatherings, especially in politically charged areas.
			`,
			query: "Show me details about the Lucknow misinformation data.",
			urgency: "high"
		},
		{
			id: 2,
			title: "Srinagar Cluster",
			summary: "False Claims of Violence During Canada-India Diplomatic Row",
			content: `
**Location**: Srinagar (34.0837, 74.7973, intensity 0.85)

**Misinformation**: In 2023, during the India-Canada diplomatic row over the Nijjar case, Indian media outlets pushed false claims of violence in Jammu and Kashmir, including misleading reports about Canada’s travel advisory. These narratives often painted a communal picture, targeting Muslims, and were amplified in Srinagar, a sensitive region, to stoke unrest.

**Impact**: The misinformation heightened tensions in Srinagar, where historical conflicts make the region vulnerable to communal narratives. It risked inciting violence and further eroding trust in media, especially among local communities already skeptical of mainstream narratives.

**Relevance to SocialSage**: Srinagar’s high misinformation intensity reflects its geopolitical sensitivity. This example emphasizes the need for targeted fact-checking in conflict-prone areas to prevent misinformation from fueling unrest.
			`,
			query: "Show me details about the Srinagar misinformation data.",
			urgency: "critical"
		},
		{
			id: 3,
			title: "Mumbai Cluster",
			summary: "Emerging Misinformation Trend on Financial Scams",
			content: `
**Location**: Mumbai (19.0760, 72.8777, intensity 0.7)\n

**Misinformation**: Recent social media trends indicate a rise in misinformation regarding financial scams, targeting urban professionals. Fake alerts about investment opportunities have been circulating widely.

**Impact**: The false information has resulted in financial losses among unassuming investors and has prompted warnings from local regulatory bodies.

\n**Relevance to SocialSage**: The trend underscores the necessity for vigilant monitoring of financial misinformation to safeguard consumers in metropolitan regions.
			`,
			query: "Show me details about the Mumbai misinformation data.",
			urgency: "medium"
		}
	];

	return (
		<>
			{/* Grid of three smaller widget cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				{urgentInsights.map((item) => (
					<div key={item.id} className="bg-gradient-to-br from-black to-violet-950/80 rounded-lg overflow-hidden shadow-lg border border-violet-900/50 p-2">
						<div className="flex items-center justify-between bg-black/80 p-2">
							<div className="flex items-center space-x-2">
								<AlertCircle size={14} className={`${item.urgency === 'critical' ? 'text-red-500' : 'text-amber-500'} animate-pulse`} />
								<h3 className="text-white text-xs font-medium">{item.title}</h3>
							</div>
							<div className="flex items-center space-x-1">
								<button 
									onClick={() => {
										setChatbotCollapsed(false);
										setInputValue(item.query);
									}} 
									className="p-1 hover:bg-violet-900/30 rounded-full transition-colors"
									title="Discuss with AI Assistant"
								>
									<MessageCircle size={12} className="text-violet-300" />
								</button>
								<button 
									onClick={() => {
										setSelectedInsight(item);
										setIsModalOpen(true);
									}} 
									className="p-1 hover:bg-violet-900/30 rounded-full transition-colors"
									title="View Details"
								>
									<ExternalLink size={12} className="text-violet-300" />
								</button>
							</div>
						</div>
						<div className="p-2 border-t border-violet-900/20">
							<p className="text-gray-300 text-sm">{item.summary}</p>
						</div>
					</div>
				))}
			</div>

			{/* Improved Modal for detailed insight */}
			{isModalOpen && selectedInsight && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
					<div className="bg-slate-900 rounded-lg w-full max-w-xl max-h-[90vh] overflow-auto relative p-4 shadow-2xl">
						<div className="sticky top-0 bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
							<h3 className="text-lg font-bold text-white flex items-center">
								<AlertCircle size={18} className={`${selectedInsight.urgency === 'critical' ? 'text-red-500' : 'text-amber-500'} mr-2`} />
								{selectedInsight.title}
							</h3>
							<button 
								onClick={() => setIsModalOpen(false)}
								className="text-gray-300 hover:text-white transition-colors"
							>
								<X size={20} />
							</button>
						</div>
						<div className="p-6 text-white">
							<ReactMarkdown className="prose prose-invert prose-sm max-w-none">
								{selectedInsight.content}
							</ReactMarkdown>
							<div className="mt-6 flex justify-end">
								<button
									onClick={() => {
										setChatbotCollapsed(false);
										setInputValue(selectedInsight.query);
										setIsModalOpen(false);
									}}
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
