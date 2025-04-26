import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const messagesEndRef = useRef(null);
  const { username } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSessions = async () => {
    try {
      const response = await api.get('/sessions');
      setSessions(response.data);
      if (response.data.length === 0) {
        createNewSession();
      } else {
        setCurrentSession(response.data[0]);
        loadMessages(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await api.post('/sessions');
      setCurrentSession(response.data);
      setSessions([response.data, ...sessions]);
      setMessages([]);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const loadMessages = async (sessionId) => {
    try {
      const response = await api.get(`/sessions/${sessionId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentSession) return;

    const userMessage = { role: 'user', parts: [{ text: input }] };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await api.post(`/sessions/${currentSession._id}/chat`, {
        message: input
      });
      
      setMessages([...messages, userMessage, {
        role: 'model',
        parts: [{ text: response.data.response }]
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white">
        <button
          onClick={createNewSession}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          New Chat
        </button>
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          {sessions.map((session) => (
            <div
              key={session._id}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-800 ${
                currentSession?._id === session._id ? 'bg-gray-800' : ''
              }`}
              onClick={() => {
                setCurrentSession(session);
                loadMessages(session._id);
              }}
            >
              {session.title || 'New Chat'}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg p-4 max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {msg.parts[0].text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form
          onSubmit={sendMessage}
          className="border-t border-gray-200 p-4 bg-white"
        >
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
