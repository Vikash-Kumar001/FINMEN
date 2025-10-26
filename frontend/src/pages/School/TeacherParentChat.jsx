import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, MoreVertical, Phone, Video, Search,
  Paperclip, Smile, Check, CheckCheck, Clock, User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import io from 'socket.io-client';

const TeacherParentChat = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chatRef = useRef(chat);
  const userRef = useRef(user);

  // Update refs when values change
  useEffect(() => {
    chatRef.current = chat;
  }, [chat]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const fetchChat = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching chat for student:', studentId);
      const response = await api.get(`/api/chat/student/${studentId}`);
      console.log('Chat response:', response.data);
      if (response.data.success) {
        setChat(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to load chat');
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load chat';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  const fetchMessages = useCallback(async () => {
    if (!chat?._id) return;
    
    try {
      const response = await api.get(`/api/chat/${chat._id}/messages`);
      if (response.data.success) {
        setMessages(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to load messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load messages';
      toast.error(errorMessage);
    }
  }, [chat?._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (studentId) {
      fetchChat();
    }
  }, [studentId, fetchChat]);

  useEffect(() => {
    // Initialize socket connection only once
    const token = localStorage.getItem('finmen_token');
    if (token && !socket) {
      console.log('Initializing socket connection with token:', token.substring(0, 20) + '...');
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      newSocket.on('new-message', (data) => {
        console.log('New message received:', data);
        if (data.chatId === chatRef.current?._id) {
          setMessages(prev => {
            // Check if message already exists to prevent duplicates
            const exists = prev.some(msg => msg._id === data.message._id);
            if (exists) return prev;
            return [...prev, data.message];
          });
          scrollToBottom();
        }
      });

      newSocket.on('messages-seen', (data) => {
        console.log('Messages seen:', data);
        if (data.chatId === chatRef.current?._id) {
          setMessages(prev => 
            prev.map(msg => 
              msg.senderId._id !== data.seenBy 
                ? { ...msg, status: 'seen', readBy: [...(msg.readBy || []), { userId: data.seenBy, readAt: data.seenAt }] }
                : msg
            )
          );
        }
      });

      newSocket.on('user-typing', (data) => {
        if (data.chatId === chatRef.current?._id && data.userId !== userRef.current?._id) {
          setOtherUserTyping(data.isTyping);
        }
      });

      setSocket(newSocket);
    } else if (!token) {
      console.error('No token found for socket connection');
    }

    return () => {
      if (socket) {
        console.log('Disconnecting socket');
        socket.disconnect();
        setSocket(null);
      }
    };
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (chat?._id && socket) {
      socket.emit('join-chat', chat._id);
      fetchMessages();
    }
  }, [chat?._id, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    const tempMessageId = `temp-${Date.now()}`;
    
    try {
      setSending(true);
      
      // Store message content before clearing input
      const messageContent = newMessage.trim();
      
      // Optimistic update - add message immediately to UI
      const optimisticMessage = {
        _id: tempMessageId,
        chat: chat._id,
        senderId: { _id: user._id, name: user.name, avatar: user.avatar },
        content: messageContent,
        createdAt: new Date().toISOString(),
        status: 'sent',
        readBy: [user._id]
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');
      scrollToBottom();

      // Send via API
      const response = await api.post(`/api/chat/${chat._id}/send`, {
        content: messageContent,
        messageType: 'text'
      });

      if (response.data.success) {
        // Replace optimistic message with real message
        setMessages(prev => 
          prev.map(msg => 
            msg._id === tempMessageId ? response.data.data : msg
          )
        );
        
        // Emit via socket for real-time delivery
        if (socket) {
          socket.emit('send-message', {
            chatId: chat._id,
            content: messageContent
          });
        }
      } else {
        // Remove optimistic message if API call failed
        setMessages(prev => prev.filter(msg => msg._id !== tempMessageId));
        toast.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg._id !== tempMessageId));
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = () => {
    if (socket && chatRef.current?._id && userRef.current?._id) {
      socket.emit('typing-start', { chatId: chatRef.current._id, userId: userRef.current._id });

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing-stop', { chatId: chatRef.current._id, userId: userRef.current._id });
      }, 1000);
    }
  };

  const getMessageStatus = (message) => {
    if (message.senderId._id === user._id) {
      if (message.status === 'seen') {
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      } else if (message.status === 'delivered') {
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      } else {
        return <Check className="w-4 h-4 text-gray-400" />;
      }
    }
    return null;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getOtherUser = () => {
    if (!chat) return null;
    return chat.participants.find(p => p.userId._id !== user._id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Chat not found</p>
          <button
            onClick={() => navigate('/school-teacher/students')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  const otherUser = getOtherUser();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <img
              src={otherUser?.userId.avatar || '/avatars/avatar1.png'}
              alt={otherUser?.userId.name}
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
            <div>
              <h2 className="font-semibold text-gray-900">{otherUser?.userId.name}</h2>
              <p className="text-sm text-gray-500">
                {otherUser?.role === 'parent' ? 'Parent' : 'Teacher'} • {chat.studentId.name}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${message.senderId._id === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end gap-2 max-w-xs lg:max-w-md ${message.senderId._id === user._id ? 'flex-row-reverse' : 'flex-row'}`}>
                {message.senderId._id !== user._id && (
                  <img
                    src={message.senderId.avatar || '/avatars/avatar1.png'}
                    alt={message.senderId.name}
                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                  />
                )}
                <div className={`px-4 py-2 rounded-2xl ${
                  message.senderId._id === user._id
                    ? 'bg-indigo-500 text-white rounded-br-md'
                    : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <div className={`flex items-center gap-1 mt-1 ${
                    message.senderId._id === user._id ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className={`text-xs ${
                      message.senderId._id === user._id ? 'text-indigo-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.createdAt)}
                    </span>
                    {getMessageStatus(message)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {otherUserTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl rounded-bl-md border border-gray-200">
              <img
                src={otherUser?.userId.avatar || '/avatars/avatar1.png'}
                alt={otherUser?.userId.name}
                className="w-6 h-6 rounded-full"
              />
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={sending}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors">
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="p-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherParentChat;
