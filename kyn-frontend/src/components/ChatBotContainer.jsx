import React, { useState } from 'react';
import { FiPlus, FiSend } from 'react-icons/fi'; // Icons for plus and send

const ChatBotContainer = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello, How are you?', sender: 'bot' },
    { text: "I'm good, thanks for asking! How about you?", sender: 'user' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: 'user' },
        { text: `Echo: ${input}`, sender: 'bot' },
      ]);
      setInput('');
    }
  };

  return (
    <div className="bg-white text-purple-600 rounded-lg shadow-lg p-4 w-80 h-96 mx-auto mt-10 flex flex-col">
      {/* Header */}
      <div className="flex items-center border-b border-purple-200 pb-2 mb-4">
        <div className="w-12 h-12 rounded-full bg-purple-600 mr-4"></div>
        <h2 className="text-xl font-bold">Chat</h2>
      </div>
      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto mb-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-purple-100 pr-2"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg text-sm ${
              message.sender === 'bot'
                ? 'bg-purple-100 text-purple-800 self-start'
                : 'bg-purple-600 text-white self-end'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center bg-purple-100 rounded-full px-4 py-2 shadow-inner border border-purple-200"
      >
        {/* Plus Icon */}
        <button
          type="button"
          className="text-purple-600 hover:text-purple-800 focus:outline-none"
        >
          <FiPlus size={20} />
        </button>
        {/* Input Field */}
        <input
          type="text"
          className="flex-1 bg-transparent text-purple-600 placeholder-purple-400 focus:outline-none px-3"
          placeholder="Message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {/* Send Icon */}
        <button
          type="submit"
          className="text-purple-600 hover:text-purple-800 focus:outline-none"
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatBotContainer;
