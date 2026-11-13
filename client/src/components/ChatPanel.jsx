import React, { useState, useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';
import { Send, User as UserIcon } from 'lucide-react';

const ChatPanel = ({ projectId }) => {
  const { messages, joinProject, sendMessage, isLoading } = useChatStore();
  const { user } = useAuthStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (projectId) {
      joinProject(projectId);
    }
  }, [projectId, joinProject]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage(input, user?.name || 'Anonymous');
    setInput('');
  };

  if (!projectId) {
    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner items-center justify-center text-gray-400">
        <p>Select a workspace to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-200">
        Team Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4 italic">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === user?._id || msg.senderId === user?.id; // Check ID match
            return (
              <div
                key={msg._id || idx}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                   <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 text-indigo-600 flex-shrink-0">
                      {/* Avatar or Initials */}
                      <UserIcon size={16} />
                   </div>
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none'
                  }`}
                >
                  {!isMe && (
                    <div className="text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">
                      {msg.senderName}
                    </div>
                  )}
                  <p>{msg.message}</p>
                  <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-100 transition-all"
        />
        <button
          type="submit"
          className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          disabled={!input.trim()}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
