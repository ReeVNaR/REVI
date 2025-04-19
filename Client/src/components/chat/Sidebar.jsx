import React from 'react';

function Sidebar({ sessions, currentSession, onSessionSelect, onNewChat, onLogout, onDeleteSession, className }) {
  // Filter out sessions with no messages
  const nonEmptySessions = sessions.filter(session => session.messages && session.messages.length > 0);

  return (
    <div className={`fixed left-0 top-0 h-full w-[260px] bg-[#202123] text-gray-200 flex flex-col 
                     shadow-xl transition-all duration-300 ease-in-out ${className}`}>
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 rounded-full border border-white/10 p-3 text-white
                   bg-[#40414F]/80 backdrop-blur-md hover:bg-[#40414F] transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 
                      [&::-webkit-scrollbar-track]:bg-transparent
                      [&::-webkit-scrollbar-thumb]:bg-[#40414F]
                      [&::-webkit-scrollbar-thumb]:rounded-full">
        {nonEmptySessions.map(session => (
          <div
            key={session._id}
            className={`px-4 py-3 text-sm flex items-center gap-3 cursor-pointer group
              ${currentSession?._id === session._id 
                ? 'bg-[#343541]' 
                : 'hover:bg-[#2A2B32] hover:backdrop-blur-md'} transition-colors duration-200`}
          >
            <div 
              onClick={() => onSessionSelect(session)}
              className="flex-1 text-white overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {session.title}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session._id);
              }}
              className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-500 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-full p-3 text-sm text-white
                   bg-[#40414F]/80 backdrop-blur-md hover:bg-[#40414F] transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Log out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
