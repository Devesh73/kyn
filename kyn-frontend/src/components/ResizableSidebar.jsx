import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageSquare, FiChevronRight, FiPaperclip, FiAtSign, FiPlus, FiMail, FiHash,FiBarChart2 } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import ProcessingSteps from './ProcessingSteps';
import CollapsibleProcessingSteps from './CollapsibleProcessingSteps';

const ResizableSidebar = ({ width, setWidth, collapsed, setCollapsed }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSteps, setCurrentSteps] = useState([]);
  const [showSteps, setShowSteps] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const minWidth = 280;
  const maxWidth = 500;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; // Max height before scrolling (about 5-6 lines)
      const minHeight = 22; // Base height for a single line
      
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
    }
  }, [input]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentSteps]);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    
    const newWidth = window.innerWidth - e.clientX - 8;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim()) {
        const userMessage = input;
        const newUserMessage = { text: userMessage, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);
        setInput("");
        setIsLoading(true);
        setCurrentSteps([]);
        setShowSteps(true);

  
        try {
          // First, try the streaming approach
          const supportsStreaming = 'ReadableStream' in window && 'getReader' in ReadableStream.prototype;
          
          if (supportsStreaming) {
            // Use fetch with streaming for real-time updates
            const response = await fetch("http://127.0.0.1:5000/api/chat-stream", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            const readStream = async () => {
              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;

                  const chunk = decoder.decode(value);
                  const lines = chunk.split('\n');

                  for (const line of lines) {
                    if (line.startsWith('data: ')) {
                      try {
                        const data = JSON.parse(line.slice(6));
                        
                        if (data.is_final) {
                          // Final response received
                          
                          setMessages((prevMessages) => [
                            ...prevMessages,
                            { 
                              text: data.message, 
                              sender: "bot", 
                              hasSteps: currentSteps.length > 0,
                              steps: currentSteps.length > 0 ? [...currentSteps] : []
                            },
                          ]);
                          setIsLoading(false);
                          setShowSteps(false);
                        } else {
                          // Step update
                          setCurrentSteps((prevSteps) => {
                            const existingStepIndex = prevSteps.findIndex(step => step.step === data.step);
                            if (existingStepIndex >= 0) {
                              // Update existing step
                              const newSteps = [...prevSteps];
                              newSteps[existingStepIndex] = data;
                              return newSteps;
                            } else {
                              // Add new step
                              return [...prevSteps, data];
                            }
                          });
                        }
                      } catch (parseError) {
                        console.error("Error parsing step data:", parseError);
                      }
                    }
                  }
                }
              } catch (streamError) {
                console.error("Error reading stream:", streamError);
                // Fallback to simple endpoint
                await handleFallbackRequest(userMessage);
              }
            };

            await readStream();
          } else {
            // Fallback for browsers without streaming support
            await handleFallbackRequest(userMessage);
          }

        } catch (error) {
          console.error("Error communicating with chatbot API:", error);
          // Try fallback method
          await handleFallbackRequest(userMessage);
        }
    }
  };

  const handleFallbackRequest = async (userMessage) => {
    try {
      // Simulate steps manually for fallback
      const steps = [
        { step: "analysis", message: "Analyzing your query...", status: "processing" },
        { step: "data_collection", message: "Collecting relevant data...", status: "processing" },
        { step: "ai_analysis", message: "Generating insights...", status: "processing" }
      ];

      // Show steps with delays
      for (let i = 0; i < steps.length; i++) {
        setCurrentSteps(steps.slice(0, i + 1));
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Make the actual API call
      const response = await fetch("http://127.0.0.1:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      
      // Mark steps as completed
      const completedStepsList = steps.map(step => ({ ...step, status: "completed" }));
      setCurrentSteps(completedStepsList);
      
      // Handle both successful responses and error responses
      if (data.error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { 
            text: `Error: ${data.error}`, 
            sender: "bot", 
            hasSteps: completedStepsList.length > 0,
            steps: completedStepsList 
          },
        ]);
      } else if (data.response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { 
            text: data.response, 
            sender: "bot", 
            hasSteps: completedStepsList.length > 0,
            steps: completedStepsList 
          },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { 
            text: "Received an unexpected response format.", 
            sender: "bot", 
            hasSteps: completedStepsList.length > 0,
            steps: completedStepsList 
          },
        ]);
      }
      
      setIsLoading(false);
      setShowSteps(false);
    } catch (fallbackError) {
      console.error("Fallback request also failed:", fallbackError);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, something went wrong with the connection.", sender: "bot", hasSteps: false },
      ]);
      setIsLoading(false);
      setShowSteps(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        handleSend(e);
      }
    }
  };

  if (collapsed) {
    return (
      <div 
        className="w-8 bg-white rounded-lg border border-slate-200/80 flex flex-col items-center justify-start py-2 cursor-pointer hover:bg-slate-50 transition-all duration-200"
        onClick={() => setCollapsed(false)}
      >
        <div className="p-1 hover:bg-slate-100 rounded-md transition-all duration-200 group">
          <FiMessageSquare className="w-3 h-3 text-slate-500 group-hover:text-slate-600" />
        </div>
      </div>
    );
  }

  const recentChats = [
    { title: "Q1 Customer Acquisition Strategy", time: "4m ago" },
    { title: "Churn prevention goals", time: "17m ago" },
    { title: "Sales manager prep", time: "21m ago" },
    { title: "ASCII Art of Coffee Cup", time: "47m ago" },
  ];

  const showRecentChats = input.trim() === "" && messages.length === 0;

  return (
    <div 
      ref={sidebarRef}
      className="bg-gradient-to-br from-white to-slate-50 rounded-lg border border-slate-200/80 shadow-lg shadow-indigo-500/10 flex overflow-hidden"
      style={{ width: `${width}px` }}
    >
      {/* Resize Handle */}
      <div 
        className="w-0.5 hover:w-1 bg-slate-300/40 hover:bg-indigo-300 cursor-col-resize transition-all duration-200 flex-shrink-0"
        onMouseDown={handleMouseDown}
      />
      
      {/* Sidebar Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm font-semibold text-slate-800">KYN AI</span>
          </div>
          <button 
            onClick={() => setCollapsed(true)}
            className="p-1 hover:bg-slate-100 rounded-sm transition-all duration-200"
          >
            <FiChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300/50 scrollbar-track-transparent hover:scrollbar-thumb-slate-400/70">
          {/* Messages Area or Initial Info Screen */}
          {messages.length === 0 ? (
            <div className="flex-1 px-6 py-8 flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FiBarChart2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">KYN Analytics Chat</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Ask questions about your social media data, get insights on communities, analyze user interactions, and explore network trends.
                </p>
                <p className="text-xs text-slate-500">
                  KYN is powered by AI to help you understand your social network analytics. Ask about users, communities, or trends.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index}>
                  {/* Show collapsible processing steps above bot messages that have steps */}
                  {message.sender === 'bot' && message.hasSteps && (
                    <div className="mb-2">
                      <CollapsibleProcessingSteps steps={message.steps} />
                    </div>
                  )}
                  
                  <div
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`p-3 rounded-lg text-sm ${
                      message.sender === 'bot'
                        ? 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 w-full border border-slate-200/60'
                        : 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20 max-w-[85%]'
                    }`}>
                      <ReactMarkdown className="prose prose-sm max-w-none prose-p:text-inherit prose-headings:text-inherit prose-strong:text-inherit">{message.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Processing - Show real-time steps OR generic loader */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-full">
                    {showSteps && currentSteps.length > 0 ? (
                      <ProcessingSteps steps={currentSteps} />
                    ) : (
                      <div className="p-3 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 text-slate-500 text-sm w-full border border-slate-200/60">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          <span className="ml-2">Analyzing your request...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Recent Chats Section - with smooth transition */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showRecentChats ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-4 py-3 border-t border-slate-200/60">
              <h3 className="text-xs font-medium text-slate-500 mb-3">Recent chats</h3>
              <div className="space-y-1">
                {recentChats.map((chat, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-2 hover:bg-slate-100 rounded-md transition-all duration-200 text-left"
                  >
                    <span className="text-sm text-slate-700 truncate">{chat.title}</span>
                    <span className="text-xs text-slate-400 ml-2 flex-shrink-0">{chat.time}</span>
                  </button>
                ))}
                <button className="w-full text-left p-2 hover:bg-slate-100 rounded-md transition-all duration-200">
                  <span className="text-sm text-slate-500">See all</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Input Area */}
        <div className="p-2 border-t border-slate-200/80">
          <form onSubmit={handleSend}>
            <div className="bg-white rounded-lg border border-slate-300/70 focus-within:border-indigo-400/80 focus-within:ring-2 focus-within:ring-indigo-300/50 transition-all duration-200 overflow-hidden">
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent text-sm focus:outline-none pl-3 pr-3 pt-2.5 pb-1 placeholder-slate-500 resize-none max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300/40 scrollbar-track-transparent hover:scrollbar-thumb-slate-400/60"
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <div className="flex items-center justify-between px-2 pt-0.5 pb-1.5">
                  <div className="flex items-center gap-0.5">
                      <button type="button" className="p-1 text-slate-500 hover:bg-slate-100 rounded-md transition-all duration-200">
                          <FiPaperclip className="w-4 h-4" />
                      </button>
                      <button type="button" className="p-1 text-slate-500 hover:bg-slate-100 rounded-md transition-all duration-200">
                          <FiAtSign className="w-4 h-4" />
                      </button>
                      <button type="button" className="p-1 text-slate-500 hover:bg-slate-100 rounded-md transition-all duration-200">
                          <FiPlus className="w-4 h-4" />
                      </button>
                  </div>
                  <button 
                    type="submit" 
                    className={`p-1.5 rounded-md transition-all duration-200 group relative overflow-hidden ${
                      input.trim() && !isLoading
                        ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/40'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                    disabled={!input.trim() || isLoading}
                  >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <FiSend className="w-4 h-4 relative z-10" />
                          <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
                        </>
                      )}
                  </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResizableSidebar; 