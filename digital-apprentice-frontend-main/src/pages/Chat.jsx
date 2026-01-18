import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import { chat } from '../api/api';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage = {
      id: chats.length + 1,
      sender: 'Me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats((prev) => [...prev, newMessage]);
    setMessage('');
    setIsLoading(true);

    // call backend chat proxy
    (async () => {
      try {
        const res = await chat(message);
        const botMessage = {
          id: chats.length + 2,
          sender: 'Assistant',
          text: res.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChats((prev) => [...prev, botMessage]);
      } catch (err) {
        const errMsg = {
          id: chats.length + 2,
          sender: 'Assistant',
          text: 'Sorry, something went wrong. Try again later.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChats((prev) => [...prev, errMsg]);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  // Auto-scroll to bottom when messages or loading state changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, isLoading]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Chat Support" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md h-[calc(100vh-12rem)] flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {
            !chats.length ? (
              <div className="text-center text-gray-500 mt-20">
                No messages yet. Start the conversation!
              </div>
            )
            :
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`mb-4 flex ${chat.sender === 'Me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    chat.sender === 'Me'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {chat.sender !== 'Me' && (
                    <div className="text-sm font-semibold mb-1">{chat.sender}</div>
                  )}
                  <p className="text-sm">{chat.text}</p>
                  <div className={`text-xs mt-1 ${
                    chat.sender === 'Me' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {chat.time}
                  </div>
                </div>
              </div>
            ))}

            {/* Skeleton loader while waiting for response */}
            {isLoading && (
              <div className="mb-4 flex justify-start">
                <div className="max-w-[60%] rounded-lg p-3 bg-gray-100 text-gray-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-4">
              {/* <label className="flex items-center px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <input type="file" className="hidden" />
              </label> */}

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <button
                type="submit"
                className="px-6 py-2 bg-[#0A3D91] text-white rounded-lg hover:bg-blue-800 
                  transition-colors duration-200 flex items-center"
              >
                <span>Send</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;