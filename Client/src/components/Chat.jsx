import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import Sidebar from './chat/Sidebar';
import ChatArea from './chat/ChatArea';

function Chat() {
  const { token, username, logout } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [deletingSession, setDeletingSession] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchSessions();
  }, [token]); // Add token as dependency to refetch when logged in

  useEffect(() => {
    scrollToBottom();
  }, [currentSession]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!token) {
        navigate('/login');
        return;
      }

      const { data } = await api.get('/sessions');
      setSessions(data);
      if (data.length > 0) {
        setCurrentSession(data[0]);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Failed to load sessions. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async () => {
    try {
      setLoading(true);
      const { data } = await api.post('/sessions');
      setCurrentSession(data);
      setSessions([data, ...sessions]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create session');
      console.error('Failed to create session:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentSession) return;

    try {
      const currentMessage = message;
      setMessage('');
      
      // Optimistically update UI
      const optimisticSession = {
        ...currentSession,
        messages: [...(currentSession.messages || []), {
          role: 'user',
          parts: [{ text: currentMessage }]
        }]
      };
      setCurrentSession(optimisticSession);

      const { data } = await api.post(`/sessions/${currentSession._id}/chat`, {
        message: currentMessage
      });
      
      setCurrentSession(data.session);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
      console.error('Failed to send message:', err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      setLoading(true);
      await api.delete(`/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s._id !== sessionId));
      
      // Immediately create new session
      const { data } = await api.post('/sessions');
      setSessions(prevSessions => [data, ...prevSessions.filter(s => s._id !== sessionId)]);
      setCurrentSession(data);
    } catch (err) {
      setError('Failed to delete session');
      console.error('Failed to delete session:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#343541]">
      <Sidebar
        sessions={sessions}
        currentSession={currentSession}
        onSessionSelect={setCurrentSession}
        onNewChat={createNewSession}
        onLogout={logout}
        username={username}  // Add this line
        className={`${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} 
                   transition-transform duration-300 ease-in-out absolute md:relative z-30`}
      />
      <ChatArea
        session={currentSession}
        username={username}
        loading={loading}
        message={message}
        setMessage={setMessage}
        onSendMessage={sendMessage}
        onDeleteSession={handleDeleteSession}
        onNewChat={createNewSession}
        onToggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
        isSidebarVisible={isSidebarVisible}
      />
    </div>
  );
}

export default Chat;
