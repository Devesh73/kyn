import React, { useState, useEffect, useRef } from "react";
import { FiPlus, FiSend } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import ProcessingSteps from "./ProcessingSteps";

const ChatBotContainer = () => {
  const [messages, setMessages] = useState([
    { text: "Hello, **How are you?**", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [chatbotCollapsed, setChatbotCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSteps, setCurrentSteps] = useState([]);
  const [showSteps, setShowSteps] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentSteps]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = input;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userMessage, sender: "user" },
      ]);
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
                          { text: data.message, sender: "bot" },
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
      setCurrentSteps(steps.map(step => ({ ...step, status: "completed" })));
      
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, sender: "bot" },
      ]);
      
      setIsLoading(false);
      setShowSteps(false);
    } catch (fallbackError) {
      console.error("Fallback request also failed:", fallbackError);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, something went wrong during processing.", sender: "bot" },
      ]);
      setIsLoading(false);
      setShowSteps(false);
    }
  };

  return (
    <div
      className={`fixed z-50 transition-all ${
        chatbotCollapsed
          ? "bottom-4 right-4 h-13 w-48"
          : "bottom-4 right-4 h-[500px] w-[350px]"
      } bg-slate-900 text-gray-200 shadow-lg rounded-lg overflow-hidden`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-2 bg-slate-800 border-b border-slate-800">
        <h3 className="text-md font-bold">
          {chatbotCollapsed ? "KYN Chatbot" : "KYN Chatbot"}
        </h3>
        <button
          onClick={() => setChatbotCollapsed(!chatbotCollapsed)}
          className="text-gray-400 hover:text-gray-200 text-sm"
        >
          {chatbotCollapsed ? "Expand" : "Collapse"}
        </button>
      </div>

      {/* Chat Interface */}
      {!chatbotCollapsed && (
        <div className="bg-white text-purple-600 rounded-lg shadow-lg p-4 w-full h-[450px] mt-2 mx-auto flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto overflow-x-auto mb-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-purple-100 pr-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-sm break-words max-w-full ${
                  message.sender === "bot"
                    ? "bg-purple-100 text-purple-800 self-start"
                    : "bg-purple-600 text-white self-end"
                }`}
              >
                {/* Render Markdown for bot messages */}
                {message.sender === "bot" ? (
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                ) : (
                  message.text
                )}
              </div>
            ))}
            
            {/* Processing Steps */}
            {showSteps && currentSteps.length > 0 && (
              <div className="self-start max-w-full">
                <ProcessingSteps steps={currentSteps} />
              </div>
            )}
            
            {isLoading && (
              <div className="self-start p-3 rounded-lg bg-purple-100 text-purple-800 text-sm">
                Processing your request...
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>
          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center bg-purple-100 rounded-full px-4 py-2 shadow-inner border border-purple-200"
          >
            <button
              type="button"
              className="text-purple-600 hover:text-purple-800 focus:outline-none"
            >
              <FiPlus size={20} />
            </button>
            <input
              type="text"
              className="flex-1 bg-transparent text-purple-600 placeholder-purple-400 focus:outline-none px-3"
              placeholder="Message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="text-purple-600 hover:text-purple-800 focus:outline-none disabled:opacity-50"
              disabled={isLoading}
            >
              <FiSend size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBotContainer;