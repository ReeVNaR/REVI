import React, { useState } from 'react';
import Message from './Message';

function ChatArea({ session, username, loading, onSendMessage, message, setMessage, onNewChat, onToggleSidebar }) {
  return (
    <main className="flex-1 flex flex-col bg-[#343541] relative min-w-0">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#343541]/95 backdrop-blur-lg border-b border-white/10">
        <div className="w-full px-4 flex justify-between items-center h-14">
          <div className="flex items-center gap-3">
            <button onClick={onToggleSidebar}
                    className="h-9 w-9 flex items-center justify-center hover:bg-[#40414F] rounded-lg transition-all duration-200">
              <svg className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-white/90">Revi AI</h1>
          </div>

          <div className="flex items-center">
            <div className="flex items-center gap-2 bg-[#40414F]/80 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/10">
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-white/90">{username}</div>
                <div className="text-xs text-white/50">Free Plan</div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#5436DA] flex items-center justify-center">
                <span className="text-white font-medium text-sm">{username?.[0]?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="w-full md:w-[80%] lg:w-[70%] mx-auto px-3 md:px-4">
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
            <div className="flex flex-col space-y-3 md:space-y-4 py-4">
              {session?.messages?.filter(msg => msg.parts?.[0]?.text).map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`group relative max-w-[92%] md:max-w-[85%] px-3 md:px-4 py-2.5 md:py-3 rounded-2xl
                    ${msg.role === 'user'
                      ? 'bg-[#5436DA] text-white rounded-tr-none'
                      : 'bg-[#444654] text-white/90 rounded-tl-none'}`}>
                    <div className="prose prose-invert prose-sm md:prose-base max-w-none">
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
      <div className="fixed bottom-0 inset-x-0 md:right-0 md:left-[280px] bg-gradient-to-t from-[#343541] from-50% 
                    via-[#343541]/95 to-transparent pb-3 pt-6 md:pb-6 md:pt-8">
        <div className="w-[94%] md:w-[80%] lg:w-[70%] mx-auto">
          <form onSubmit={onSendMessage} className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message Revi AI..."
              className="w-full p-3 md:p-4 pr-10 bg-[#40414F]/90 backdrop-blur-md border border-white/10 
                       rounded-lg md:rounded-xl text-white shadow-lg placeholder:text-white/50
                       focus:outline-none focus:border-[#5436DA] focus:ring-1 focus:ring-[#5436DA]/50
                       disabled:opacity-50 transition-all duration-200
                       text-sm md:text-base"
              disabled={!session || loading}
            />
            <button
              type="submit"
              disabled={!session || !message.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg
                       text-white/80 hover:text-white disabled:text-white/40
                       hover:bg-[#5436DA]/20 disabled:hover:bg-transparent transition-all"
            >
              <svg className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ChatArea;
