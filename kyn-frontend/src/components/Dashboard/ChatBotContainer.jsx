import React, { useState } from 'react';
import { FiPlus, FiSend } from 'react-icons/fi'; // Icons for plus and send
import ReactMarkdown from 'react-markdown'; // Library for rendering Markdown

const ChatBotContainer = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello, **How are you?**', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: 'user' },
      ]);

      try {
        const response = await fetch('http://127.0.0.1:5000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        });
        const data = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.response, sender: 'bot' },
        ]);
      } catch (error) {
        console.error('Error communicating with chatbot API:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Sorry, something went wrong.', sender: 'bot' },
        ]);
      }

      setInput('');
    }
  };

  return (
    <div className="bg-white text-purple-600 rounded-lg shadow-lg p-4 w-full h-80 mx-auto mt-10 flex flex-col">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-purple-100 pr-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg text-sm ${
              message.sender === 'bot'
                ? 'bg-purple-100 text-purple-800 self-start'
                : 'bg-purple-600 text-white self-end'
            }`}
          >
            {/* Render Markdown for bot messages */}
            {message.sender === 'bot' ? (
              <ReactMarkdown>{message.text}</ReactMarkdown>
            ) : (
              message.text
            )}
          </div>
        ))}
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
        />
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