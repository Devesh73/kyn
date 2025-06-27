import React, { useState } from 'react';
import ProcessingSteps from './ProcessingSteps';

const ChatDemo = () => {
  const [demoSteps, setDemoSteps] = useState([]);
  const [isRunningDemo, setIsRunningDemo] = useState(false);

  const runDemo = async () => {
    setIsRunningDemo(true);
    setDemoSteps([]);

    const steps = [
      {
        step: "analysis",
        message: "Analyzing your query to understand what information you need...",
        status: "processing",
        timestamp: Date.now()
      },
      {
        step: "analysis",
        message: "Identified 3 relevant data sources",
        status: "completed",
        timestamp: Date.now(),
        data: { apis: ["trending_interests", "active_communities", "influence_analysis"] }
      },
      {
        step: "user_extraction",
        message: "Extracting user IDs from your query...",
        status: "processing",
        timestamp: Date.now()
      },
      {
        step: "user_extraction", 
        message: "Found user IDs: U123, U456",
        status: "completed",
        timestamp: Date.now(),
        data: { user_ids: ["U123", "U456"] }
      },
      {
        step: "data_collection",
        message: "Fetching data from 3 sources...",
        status: "processing",
        timestamp: Date.now()
      },
      {
        step: "data_collection",
        message: "Successfully collected data from 3 sources",
        status: "completed",
        timestamp: Date.now()
      },
      {
        step: "ai_analysis",
        message: "Analyzing data with AI to generate comprehensive insights...",
        status: "processing",
        timestamp: Date.now()
      },
      {
        step: "ai_analysis",
        message: "AI analysis completed successfully",
        status: "completed",
        timestamp: Date.now()
      },
      {
        step: "completion",
        message: "Response ready!",
        status: "completed",
        timestamp: Date.now()
      }
    ];

    // Simulate step-by-step progress
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setDemoSteps(prev => {
        const existingIndex = prev.findIndex(s => s.step === steps[i].step);
        if (existingIndex >= 0) {
          const newSteps = [...prev];
          newSteps[existingIndex] = steps[i];
          return newSteps;
        } else {
          return [...prev, steps[i]];
        }
      });
    }

    setIsRunningDemo(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Chat Processing Demo
      </h3>
      
      <button
        onClick={runDemo}
        disabled={isRunningDemo}
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {isRunningDemo ? 'Running Demo...' : 'Run Processing Demo'}
      </button>

      {demoSteps.length > 0 && (
        <ProcessingSteps steps={demoSteps} />
      )}
    </div>
  );
};

export default ChatDemo; 