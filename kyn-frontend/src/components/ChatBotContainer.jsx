import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Send, Plus, X } from "lucide-react";

const ChatBotContainer = () => {
  const [messages, setMessages] = useState([
    { text: "Hello, **How can I help you today?**", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [chatbotCollapsed, setChatbotCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (!chatbotCollapsed && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, chatbotCollapsed]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: "user" },
      ]);
      setInput("");

      setIsLoading(true);

      try {
        const response = await fetch("http://127.0.0.1:5000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        });
        const data = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.response, sender: "bot" },
        ]);
      } catch (error) {
        console.error("Error communicating with chatbot API:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Sorry, something went wrong.", sender: "bot" },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className={`fixed z-50 transition-transform bg-slate-950/90 text-zinc-100 shadow-xl ${
        chatbotCollapsed ? "bottom-6 right-6 h-14 w-14 rounded-full" : "bottom-6 right-6 h-[750px] w-[600px] rounded-2xl"
      } overflow-hidden`}
    >
      {chatbotCollapsed ? (
        // Collapsed state - just show the icon button
        <button
          onClick={() => setChatbotCollapsed(false)}
          className="w-full h-full flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 transition-colors"
          aria-label="Open chat"
        >
          <MessageSquare className="w-6 h-6 text-zinc-100" />
        </button>
      ) : (
        // Expanded state - show the full chat interface
        <div className="flex flex-col h-full relative">
          {/* Header */}
          <div className="flex justify-between items-center py-2 px-4 bg-zinc-800/45 border-b border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-zinc-100" />
              <h3 className="text-sm font-medium">AI Assistant</h3>
            </div>
            <div>
              <button
                onClick={() => setChatbotCollapsed(true)}
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages with thin scrollbar - extending to the bottom now */}
          <div className="flex-1 overflow-y-auto p-4 pb-20 space-y-4 bg-slate-900/45 thin-scrollbar">
            <style jsx global>{`
              .thin-scrollbar::-webkit-scrollbar {
                width: 3px;
                background-color: transparent;
              }
              
              .thin-scrollbar::-webkit-scrollbar-thumb {
                background-color: rgba(100, 116, 139, 0.2);
                border-radius: 3px;
              }
              
              .thin-scrollbar:hover::-webkit-scrollbar-thumb {
                background-color: rgba(100, 116, 139, 0.3);
              }
              
              .thin-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: rgba(100, 116, 139, 0.2) transparent;
              }
            `}</style>

            {messages.map((message, index) => (
              <div key={index} className={`w-full flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`${
                    message.sender === "bot" 
                      ? "w-full bg-black/90 text-zinc-100" 
                      : "max-w-[80%] text-zinc-100"
                  } p-3 rounded-lg text-sm break-words`}
                >
                  {message.sender === "bot" ? (
                    <ReactMarkdown className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap break-words">{message.text}</ReactMarkdown>
                  ) : (
                    <div className="whitespace-pre-wrap break-words">{message.text}</div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="w-full">
                <div className="w-full p-3 rounded-lg text-sm bg-black/90 text-zinc-100">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-zinc-400 border-t-transparent animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input - now positioned absolute at the bottom */}
          <form 
            onSubmit={handleSend} 
            className="absolute bottom-0 left-0 right-0 p-4 bg-transparent"
          >
            <div className="flex items-center gap-2 bg-zinc-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <button
                type="button"
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
                aria-label="Add attachment"
              >
                <Plus className="w-5 h-5" />
              </button>
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-400 focus:outline-none"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="text-zinc-400 hover:text-zinc-100 transition-colors disabled:opacity-50"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                {isLoading ? 
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-400 border-t-transparent animate-spin" /> : 
                  <Send className="w-5 h-5" />
                }
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBotContainer;