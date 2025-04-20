import React from 'react';

function DynamicSidebar({ isOpen, onClose, sessions = [], currentSession, onSessionSelect, onNewChat, onDeleteSession }) {
  // Filter out any empty sessions that might have slipped through
  const validSessions = sessions.filter(session => session.messages && session.messages.length > 0);

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden
                   ${isOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'}`}
           onClick={onClose}
      />

      <aside className={`fixed md:relative top-0 left-0 h-full w-[260px] xl:w-[280px] bg-[#202123] 
                      transition-all duration-300 ease-in-out z-50 flex flex-col
                      ${isOpen ? 'translate-x-0 shadow-xl md:shadow-none' : '-translate-x-full md:translate-x-0'}
                      border-r border-white/10`}>
        <div className="p-2">
          <button onClick={() => { onNewChat(); onClose(); }}
                  className="w-full flex items-center gap-3 p-3 text-white/90 
                           border border-white/10 rounded-lg
                           hover:bg-[#40414F] transition-all duration-200">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
            <span className="font-medium text-sm">New chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {validSessions.map(session => (
            <div key={session._id} 
                 className={`group flex items-center px-2 py-2 mx-2 rounded-lg
                          ${currentSession?._id === session._id 
                            ? 'bg-[#40414F] text-white' 
                            : 'text-white/80 hover:bg-[#2A2B32]'} 
                          transition-colors duration-200`}>
              <button onClick={() => { onSessionSelect(session); onClose(); }}
                      className="flex-1 text-sm text-white text-left truncate">
                {session.title || 'New Chat'}
              </button>
              <button onClick={() => onDeleteSession(session._id)}
                      className={`p-1 opacity-0 group-hover:opacity-100 rounded-lg
                               hover:bg-red-500/10 text-red-400 transition-all duration-200`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" />
                </svg>
              </button>
            </div>
          ))}
          {validSessions.length === 0 && (
            <div className="px-2 py-3 text-sm text-white/50 text-center">
              No chats yet
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default DynamicSidebar;
