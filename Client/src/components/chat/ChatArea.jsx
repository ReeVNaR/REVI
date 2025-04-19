import React, { useState } from 'react';
import Message from './Message';

function ChatArea({ session, username, loading, onSendMessage, message, setMessage, onDeleteSession, onNewChat, onToggleSidebar, isSidebarVisible }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDeleteChat = async () => {
    if (session?._id) {
      setIsMenuOpen(false);
      await onDeleteSession(session._id);
      setMessage(''); // Clear message input after deletion
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#343541] relative">
      {/* Sticky Header */}
      <div className={`sticky top-0 z-20 bg-[#343541]/95 backdrop-blur-md border-b border-white/10
                       transition-all duration-300 ease-in-out ${isSidebarVisible ? 'ml-[260px]' : 'ml-0'}`}>
        <div className="max-w-4xl mx-auto w-full flex justify-between items-center h-16">
          <div className="flex items-center gap-1 px-2">
            <button
              onClick={onToggleSidebar}
              className="h-12 w-12 flex items-center justify-center hover:bg-[#40414F] rounded-xl transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <button
              onClick={onNewChat}
              className="h-12 w-12 flex items-center justify-center hover:bg-[#40414F] rounded-xl transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <h1 className="text-xl font-semibold text-white tracking-wide">Revi AI</h1>
          </div>

          <div className="flex items-center gap-4 px-4">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="h-10 w-10 flex items-center justify-center hover:bg-[#40414F] rounded-xl transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#40414F] rounded-xl shadow-lg py-1 border border-white/10">
                  <button
                    onClick={handleDeleteChat}
                    className="w-full px-4 py-3 text-sm text-red-400 hover:bg-[#2A2B32] text-left flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete chat
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 bg-[#40414F]/80 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{username}</div>
                <div className="text-xs text-gray-400">Free Plan</div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-[#5436DA] flex items-center justify-center">
                <span className="text-white font-medium">{username?.[0]?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out 
                      ${isSidebarVisible ? 'ml-[260px]' : 'ml-0'} pb-32`}>
        <div className="max-w-4xl mx-auto w-full px-4">
          {loading ? (
            <div className="h-[calc(100vh-180px)] flex items-center justify-center">
              <div className="flex items-center gap-2 text-white/80">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-6 py-8">
              {session?.messages?.filter(msg => msg.parts?.[0]?.text).map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`group relative max-w-[85%] px-4 py-3 rounded-2xl hover:shadow-lg transition-all duration-200
                      ${msg.role === 'user'
                        ? 'bg-[#5436DA] text-white rounded-tr-none'
                        : 'bg-[#444654] text-white rounded-tl-none'}`}
                  >
                    <div className="prose prose-invert max-w-none">
                      {msg.parts[0].text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className={`fixed bottom-0 right-0 bg-gradient-to-t from-[#343541] via-[#343541] 
                      to-transparent pb-8 pt-6 transition-all duration-300 ease-in-out
                      ${isSidebarVisible ? 'left-[260px]' : 'left-0'}`}>
        <div className="max-w-4xl mx-auto w-full px-4">
          <form onSubmit={onSendMessage} className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send a message..."
              className="w-full p-4 pr-12 bg-[#40414F]/90 backdrop-blur-md border border-white/10 
                       rounded-xl text-white shadow-lg
                       focus:outline-none focus:border-[#5436DA]/50 focus:ring-2 focus:ring-[#5436DA]/20
                       disabled:bg-gray-800/50 transition-all duration-200"
              disabled={!session || loading}
            />
            <button
              type="submit"
              disabled={!session || !message.trim() || loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg
                       text-gray-300 hover:text-white disabled:hover:text-gray-400
                       disabled:opacity-40 hover:bg-[#5436DA]/20 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
