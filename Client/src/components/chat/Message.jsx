import React from 'react';

function Message({ message, username, isConsecutive }) {
  const { role, parts, timestamp } = message;
  const isUser = role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} 
        ${isConsecutive ? 'mt-2' : 'mt-6'}`}
    >
      <div className={`flex items-end gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <Avatar isUser={isUser} username={username} />
        <MessageBubble text={parts[0].text} timestamp={timestamp} isUser={isUser} />
      </div>
    </div>
  );
}

const Avatar = ({ isUser, username }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
    ${isUser ? 'bg-blue-500 ring-2 ring-blue-300' : 'bg-gray-600 ring-2 ring-gray-300'}`}
  >
    <span className="text-white text-sm font-medium">
      {isUser ? username?.[0]?.toUpperCase() : 'R'}
    </span>
  </div>
);

const MessageBubble = ({ text, timestamp, isUser }) => (
  <div
    className={`py-3 px-4 rounded-2xl shadow-sm
      ${isUser ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'}`}
  >
    <div className="whitespace-pre-wrap leading-relaxed">{text}</div>
    <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
      {new Date(timestamp || Date.now()).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}
    </div>
  </div>
);

export default Message;
