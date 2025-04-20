import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import ChatArea from './chat/ChatArea';
import DynamicSidebar from './chat/DynamicSidebar';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchSessions();
  }, [token]); // Add token as dependency to refetch when logged in

  useEffect(() => {
    scrollToBottom();
  }, [currentSession]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!token) {
        navigate('/login');
        return;
      }

      const { data } = await api.get('/sessions');
      // Filter out and delete empty sessions
      const emptySessionIds = data
        .filter(session => !session.messages || session.messages.length === 0)
        .map(session => session._id);

      // Delete empty sessions in parallel
      if (emptySessionIds.length > 0) {
        await Promise.all(
          emptySessionIds.map(id => api.delete(`/sessions/${id}`))
        );
      }

      // Keep only non-empty sessions
      const validSessions = data.filter(session => session.messages && session.messages.length > 0);
      setSessions(validSessions);
      
      if (validSessions.length > 0) {
        setCurrentSession(validSessions[0]);
      } else {
        // Create a new session if all were empty
        createNewSession();
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
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
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
      <DynamicSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        currentSession={currentSession}
        onSessionSelect={(session) => {
          setCurrentSession(session);
          if (window.innerWidth < 768) setIsSidebarOpen(false);
        }}
        onNewChat={createNewSession}
        onDeleteSession={handleDeleteSession}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <ChatArea
          session={currentSession}
          username={username}
          loading={loading}
          message={message}
          setMessage={setMessage}
          onSendMessage={sendMessage}
          onDeleteSession={handleDeleteSession}
          onNewChat={createNewSession}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
    </div>
  );
}

export default Chat;
