import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Send, MoreVertical, Phone, Video, Search as SearchIcon, Search,
  Paperclip, Smile, Check, CheckCheck, Clock, User,
  FileText, Image, File as FileIcon, X, Ban, Flag, Reply, Star, Forward,
  Download, Circle, Mic, ChevronDown, MessageCircle, Pin, ChevronUp, Menu
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';
import api from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import io from 'socket.io-client';
import MessageContextMenu, { DeleteConfirmModal, EditMessageModal } from '../../components/MessageContextMenu.jsx';
import AttachMenu from '../../components/AttachMenu.jsx';
import ChatSearch from '../../components/ChatSearch.jsx';
import ChatInPageSearch from '../../components/ChatInPageSearch.jsx';
import InlineVoiceRecorder from '../../components/InlineVoiceRecorder.jsx';
import VoiceMessagePlayer from '../../components/VoiceMessagePlayer.jsx';

const TeacherStudentChat = () => {
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [messageToEdit, setMessageToEdit] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showInPageSearch, setShowInPageSearch] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [otherUserOnline, setOtherUserOnline] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [parentDetails, setParentDetails] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chatRef = useRef(chat);
  const userRef = useRef(user);
  const fileInputRef = useRef(null);
  const messageRefs = useRef({});
  const menuRef = useRef(null);
  const messagesContainerRef = useRef(null);

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
      console.log('Fetching teacher-student chat for student:', studentId);
      const response = await api.get(`/api/chat/student-chat/${studentId}`);
      console.log('Chat response:', response.data);
      console.log('Student details from API:', response.data.data?.studentDetails);
      if (response.data.success) {
        // Map chatId to _id for compatibility
        const chatData = {
          ...response.data.data,
          _id: response.data.data.chatId || response.data.data._id
        };
        setChat(chatData);
        console.log('Chat object set. Student details:', chatData.studentDetails);
        console.log('Chat _id:', chatData._id);
        console.log('Chat chatId:', chatData.chatId);
        
        // Fetch parent details
        try {
          const parentResponse = await api.get(`/api/school/student/${studentId}/parent`);
          if (parentResponse.data.success && parentResponse.data.parent) {
            setParentDetails(parentResponse.data.parent);
            console.log('Parent details fetched:', parentResponse.data.parent);
          }
        } catch (parentError) {
          console.error('Error fetching parent details:', parentError);
          // Not critical error, continue without parent details
        }
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
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    } else {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    setShowScrollButton(false);
  };

  // Handle scroll detection for scroll to bottom button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const threshold = 100; // Show button when more than 100px from bottom
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;
      setShowScrollButton(!isAtBottom);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [messages.length]);

  useEffect(() => {
    // Validate studentId before fetching
    if (!studentId || studentId === 'progress' || studentId.length !== 24) {
      console.error('Invalid student ID:', studentId);
      toast.error('Invalid student ID. Please check the URL and try again.');
      navigate('/school-teacher/students');
      return;
    }
      fetchChat();
  }, [studentId, fetchChat, navigate]);
 
  // Debug: Log chat data when it changes
  useEffect(() => {
    if (chat) {
      console.log('Chat object updated:', chat);
      console.log('Chat studentDetails:', chat.studentDetails);
      console.log('Has attendance:', chat.studentDetails?.attendance);
      console.log('Has pillars:', chat.studentDetails?.pillars);
    }
  }, [chat]);

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
            // Also check if it's from the current user (prevent showing own messages twice)
            if (data.message.senderId._id === userRef.current?._id) {
              return prev; // Don't add own messages from socket
            }
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

      // Listen for message reaction updates
      newSocket.on('message-reaction-updated', (data) => {
        if (data.chatId === chatRef.current?._id) {
          setMessages(prev => prev.map(msg => 
            msg._id === data.messageId 
              ? { ...msg, reactions: data.reactions }
              : msg
          ));
        }
      });

      // Listen for message edits
      newSocket.on('message-edited', (data) => {
        if (data.chatId === chatRef.current?._id) {
          setMessages(prev => prev.map(msg => 
            msg._id === data.messageId 
              ? { ...msg, ...data.message }
              : msg
          ));
        }
      });

      // Listen for message star updates
      newSocket.on('message-star-updated', (data) => {
        if (data.chatId === chatRef.current?._id) {
          setMessages(prev => prev.map(msg => 
            msg._id === data.messageId 
              ? { ...msg, starredBy: data.starredBy }
              : msg
          ));
        }
      });

      // Listen for message pin updates
      newSocket.on('message-pin-updated', (data) => {
        if (data.chatId === chatRef.current?._id) {
          setMessages(prev => prev.map(msg => 
            msg._id === data.messageId 
              ? { ...msg, pinnedBy: data.pinnedBy }
              : msg
          ));
        }
      });

      // Listen for message deletions
      newSocket.on('message-deleted', (data) => {
        const currentChatId = chatRef.current?._id;
        const receivedChatId = data.chatId;
        
        // Convert both to strings for comparison
        const currentChatIdStr = currentChatId?.toString();
        const receivedChatIdStr = receivedChatId?.toString();
        
        if (currentChatIdStr === receivedChatIdStr) {
          setMessages(prev => prev.map(msg => 
            msg._id === data.messageId 
              ? { ...msg, deletedBy: [...(msg.deletedBy || []), { userId: data.deletedBy, deletedAt: new Date() }] }
              : msg
          ));
        }
      });
      
      // Listen for message deleted for everyone
      newSocket.on('message-deleted-for-everyone', (data) => {
        const currentChatId = chatRef.current?._id;
        const receivedChatId = data.chatId;
        
        // Convert both to strings for comparison
        const currentChatIdStr = currentChatId?.toString();
        const receivedChatIdStr = receivedChatId?.toString();
        
        if (currentChatIdStr === receivedChatIdStr) {
          // Mark as deleted for all participants
          setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
        }
      });

      // Listen for user online/offline status
      newSocket.on('user-online', (data) => {
        if (data.chatId === chatRef.current?._id && data.userId !== userRef.current?._id) {
          // If this is an announce-presence response, only accept if we're the requester
          if (!data.requestingUserId || data.requestingUserId === userRef.current?._id) {
            setOtherUserOnline(true);
          }
        }
      });

      newSocket.on('user-offline', (data) => {
        // Handle both cases: with chatId (from leaving room) and without (from disconnect)
        if ((data.chatId === chatRef.current?._id || !data.chatId) && data.userId !== userRef.current?._id) {
          setOtherUserOnline(false);
        }
      });

      // Respond to online status requests
      newSocket.on('request-online-status', (data) => {
        if (data.chatId === chatRef.current?._id) {
          // Announce our presence to the requesting user
          newSocket.emit('announce-presence', {
            chatId: chatRef.current?._id,
            requestingUserId: data.requestingUserId
          });
        }
      });

      // Don't assume user is online initially
      setOtherUserOnline(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (chat?._id && socket) {
      socket.emit('join-chat', chat._id);
      fetchMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?._id, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Find all pinned messages - show messages that are pinned by anyone in this chat
  useEffect(() => {
    if (messages.length > 0) {
      // Find all messages that are pinned by anyone in this chat, sorted by creation time
      const pinned = messages
        .filter(msg => msg.pinnedBy && msg.pinnedBy.length > 0)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPinnedMessages(pinned);
      
      // Set the current pinned message to the first one (most recent)
      if (pinned.length > 0 && currentPinnedIndex >= pinned.length) {
        setCurrentPinnedIndex(0);
      }
    } else {
      setPinnedMessages([]);
      setCurrentPinnedIndex(0);
    }
  }, [messages, currentPinnedIndex]);

  // Set the current pinned message based on index
  useEffect(() => {
    if (pinnedMessages.length > 0) {
      setPinnedMessage(pinnedMessages[currentPinnedIndex]);
    } else {
      setPinnedMessage(null);
    }
  }, [pinnedMessages, currentPinnedIndex]);

  const sendMessage = async () => {
    // Allow sending if there's a message OR if there are files
    if ((!newMessage.trim() && selectedFiles.length === 0) || sending) return;
    
    // Check if chat and chat._id exist using ref
    const currentChat = chatRef.current || chat;
    if (!currentChat) {
      console.error('Chat is null');
      toast.error('Chat not loaded. Please wait for chat to initialize...');
      return;
    }
    
    if (!currentChat._id) {
      console.error('Chat ID is undefined. Chat object:', currentChat);
      toast.error('Chat not initialized. Please refresh the page.');
      return;
    }
    
    console.log('Sending message with chat ID:', currentChat._id);

    const tempMessageId = `temp-${Date.now()}`;
    
    try {
      setSending(true);
      
      // Store message content before clearing input
      // Use a single space if no text but files exist (backend requires some content)
      const messageContent = newMessage.trim() || (selectedFiles.length > 0 ? ' ' : '');
      
      // Upload files if any
      let attachments = [];
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach(file => {
          formData.append('files', file);
        });

        try {
          const uploadResponse = await api.post('/api/chat/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          attachments = uploadResponse.data.files || [];
        } catch (uploadError) {
          console.error('Error uploading files:', uploadError);
          toast.error('Failed to upload files');
          return;
        }
      }
      
      // Optimistic update - add message immediately to UI
      const optimisticMessage = {
        _id: tempMessageId,
        chatId: currentChat._id,
        senderId: { _id: user._id, name: user.name, avatar: user.avatar },
        content: messageContent || (attachments.length > 0 ? ' ' : ''),
        attachments: attachments,
        createdAt: new Date().toISOString(),
        status: 'sent',
        readBy: [user._id]
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');
      setSelectedFiles([]);
      scrollToBottom();

      // Determine message type
      let messageType = 'text';
      if (attachments.length > 0) {
        const firstAttachment = attachments[0];
        if (firstAttachment.fileType?.startsWith('image/')) {
          messageType = 'image';
        } else if (firstAttachment.fileType?.startsWith('video/')) {
          messageType = 'video';
        } else if (firstAttachment.fileType?.startsWith('audio/')) {
          messageType = 'audio';
        } else {
          messageType = 'file';
        }
      }

      // Send via API
      const response = await api.post(`/api/chat/${currentChat._id}/send`, {
        content: messageContent,
        messageType: messageType,
        replyTo: replyingTo?._id,
        attachments: attachments
      });
      
      // Clear reply if present
      setReplyingTo(null);

      if (response.data.success) {
        // Replace optimistic message with real message
        setMessages(prev => 
          prev.map(msg => 
            msg._id === tempMessageId ? response.data.data : msg
          )
        );
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
        return <CheckCheck className="w-4 h-4 text-white" />;
      } else if (message.status === 'delivered') {
        return <CheckCheck className="w-4 h-4 text-white" />;
      } else {
        return <Check className="w-4 h-4 text-white" />;
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 25 * 1024 * 1024; // 25MB
    const allowedFiles = [];
    
    for (const file of files) {
      if (file.size > maxSize) {
        toast.error('Oops! This file exceeds the size limit of 25 MB');
        continue;
      }
      allowedFiles.push(file);
    }
    
    if (allowedFiles.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }
    
    setSelectedFiles(prev => [...prev, ...allowedFiles]);
    if (allowedFiles.length > 0) {
      toast.success(`${allowedFiles.length} file(s) selected`);
    }
  };

  // Handle emoji selection from EmojiPicker
  const handleEmojiSelect = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Handle menu actions
  const handleMenuAction = async (action) => {
    setShowMenu(false);
    switch(action) {
      case 'block':
        toast('User blocked');
        break;
      case 'report':
        toast('User reported');
        break;
      case 'clearChat':
        try {
          await api.delete(`/api/chat/${chat._id}`);
          setMessages([]);
          toast.success('Chat cleared successfully');
        } catch (error) {
          console.error('Error clearing chat:', error);
          toast.error('Failed to clear chat');
        }
        break;
      default:
        break;
    }
  };

  // Handle phone call
  const handlePhoneCall = () => {
    toast('Phone call feature coming soon!');
  };

  // Handle video call
  const handleVideoCall = () => {
    toast('Video call feature coming soon!');
  };
  
  // Handle message context menu
  const handleMessageContextMenu = (e, message) => {
    e.preventDefault();
    setContextMenu({
      message,
      position: { x: e.clientX, y: e.clientY }
    });
  };
  
  // Handle reply
  const handleReply = (message) => {
    setReplyingTo(message);
    setContextMenu(null);
  };
  
  // Handle edit confirmation
  const handleEditConfirm = (message) => {
    setMessageToEdit(message);
  };
  
  const handleEditSave = async (newContent) => {
    if (!messageToEdit) return;
    
    try {
      await api.put(`/api/chat/message/${messageToEdit._id}/edit`, { content: newContent });
      toast.success('Message edited');
      setMessageToEdit(null);
    } catch (error) {
      console.error('Error editing message:', error);
      toast.error('Failed to edit message');
    }
  };
  
  const handleEditCancel = () => {
    setMessageToEdit(null);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = (message) => {
    setMessageToDelete(message);
  };
  
  const deleteForMe = async () => {
    if (!messageToDelete) return;
    
    try {
      await api.delete(`/api/chat/message/${messageToDelete._id}?deleteForEveryone=false`);
      
      // Optimistic update
      setMessages(prev => prev.map(msg => 
        msg._id === messageToDelete._id 
          ? { ...msg, deletedBy: [...(msg.deletedBy || []), { userId: user._id, deletedAt: new Date() }] }
          : msg
      ));
      
      toast.success('Message deleted for you');
      setMessageToDelete(null);
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };
  
  const deleteForEveryone = async () => {
    if (!messageToDelete) return;
    
    try {
      await api.delete(`/api/chat/message/${messageToDelete._id}?deleteForEveryone=true`);
      
      // For delete for everyone, we need to mark as deleted for all participants
      // This will be handled by the socket event, but we can do optimistic update too
      toast.success('Message deleted for everyone');
      setMessageToDelete(null);
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };
  
  const cancelDelete = () => {
    setMessageToDelete(null);
  };
  
  // Handle unpin message
  const handleUnpin = async (message) => {
    try {
      await api.post(`/api/chat/message/${message._id}/pin`);
      toast.success('Message unpinned');
      // Move to next pinned message if current is unpinned
      if (pinnedMessages.length > 1 && currentPinnedIndex > 0) {
        setCurrentPinnedIndex(Math.max(0, currentPinnedIndex - 1));
      }
    } catch (error) {
      console.error('Error unpinning message:', error);
      toast.error('Failed to unpin message');
    }
  };

  // Navigate to next pinned message and scroll to it
  const handleNextPinned = () => {
    if (pinnedMessages.length > 1) {
      const nextIndex = (currentPinnedIndex + 1) % pinnedMessages.length;
      setCurrentPinnedIndex(nextIndex);
      
      // Scroll to the message after state updates
      setTimeout(() => {
        const messageElement = messageRefs.current[pinnedMessages[nextIndex]._id];
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightedMessageId(pinnedMessages[nextIndex]._id);
          setTimeout(() => setHighlightedMessageId(null), 2000);
        }
      }, 100);
    }
  };

  // Navigate to previous pinned message and scroll to it
  const handlePreviousPinned = () => {
    if (pinnedMessages.length > 1) {
      const prevIndex = (currentPinnedIndex - 1 + pinnedMessages.length) % pinnedMessages.length;
      setCurrentPinnedIndex(prevIndex);
      
      // Scroll to the message after state updates
      setTimeout(() => {
        const messageElement = messageRefs.current[pinnedMessages[prevIndex]._id];
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightedMessageId(pinnedMessages[prevIndex]._id);
          setTimeout(() => setHighlightedMessageId(null), 2000);
        }
      }, 100);
    }
  };

  // Scroll to current pinned message
  const handleGoToPinnedMessage = () => {
    if (pinnedMessage) {
      const messageElement = messageRefs.current[pinnedMessage._id];
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedMessageId(pinnedMessage._id);
        setTimeout(() => setHighlightedMessageId(null), 2000);
      }
    }
  };
  
  // Handle attach menu selection
  const handleAttachSelect = (type) => {
    switch(type) {
      case 'document':
      case 'gallery':
      case 'audio':
        fileInputRef.current?.click();
        break;
      case 'camera': {
        // Camera access
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (e) => handleFileChange(e);
        input.click();
        break;
      }
      case 'contact':
        toast('Contact sharing coming soon');
        break;
      case 'location':
        toast('Location sharing coming soon');
        break;
      default:
        break;
    }
    setShowAttachMenu(false);
  };
  
  // Handle voice recording complete - send directly
  const handleVoiceRecordComplete = async (audioBlob) => {
    try {
      // Create file from blob
      const audioFile = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
      
      // Validate size
      const maxSize = 25 * 1024 * 1024; // 25MB
      if (audioFile.size > maxSize) {
        toast.error('Oops! This file exceeds the size limit of 25 MB');
        setShowVoiceRecorder(false);
        return;
      }
      
      setShowVoiceRecorder(false);
      
      // Upload file and send message directly
      const formData = new FormData();
      formData.append('files', audioFile);
      
      try {
        const uploadResponse = await api.post('/api/chat/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const attachments = uploadResponse.data.files || [];
        
        if (attachments.length > 0) {
          // Send message with voice attachment
          const response = await api.post(`/api/chat/${chat._id}/send`, {
            content: ' ',
            messageType: 'audio',
            attachments: attachments
          });
          
          if (response.data.success) {
            setMessages(prev => [...prev, response.data.data]);
            scrollToBottom();
            toast.success('Voice message sent');
          }
        }
      } catch (sendError) {
        console.error('Error sending voice message:', sendError);
        toast.error('Failed to send voice message');
      }
    } catch (error) {
      console.error('Error processing voice recording:', error);
      toast.error('Failed to process voice recording');
    }
  };
  
  // Handle download attachment
  const handleDownload = async (attachment) => {
    try {
      const response = await fetch(attachment.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  // Handle message highlighting and scrolling
  const handleHighlightMessage = (message) => {
    setHighlightedMessageId(message._id);
    const messageElement = messageRefs.current[message._id];
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Remove highlight after 2 seconds
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    }
  };

  // Highlight text in message content
  const highlightText = (text, query) => {
    if (!query || !text || typeof text !== 'string') return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-300 px-0.5 rounded">{part}</mark>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex h-screen relative">
      {/* Sidebar - Responsive */}
      <div className={`
        fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:z-auto
        ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        w-full md:w-[30%] bg-white shadow-[2px_0_8px_rgba(0,0,0,0.08)] border-r border-gray-200 flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => {
              setShowSidebar(false);
              navigate(-1);
            }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
            <div className="relative">
            <img
              src={otherUser?.userId.avatar || '/avatars/avatar1.png'}
              alt={otherUser?.userId.name}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                otherUserOnline ? 'bg-green-500 border-white' : 'bg-gray-400 border-white'
              }`} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-white truncate text-sm">{otherUser?.userId.name}</h2>
              <p className="text-xs text-white/90 truncate">{otherUser?.role === 'parent' ? 'Parent' : 'Teacher'}</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setShowSidebar(false)}
            className="md:hidden p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 space-y-4">
            {/* Parent Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Parent Details</h3>
              {parentDetails ? (
                <div className="space-y-3">
                  {/* Avatar and Name in same row */}
                  <div className="flex items-center gap-3">
                    {parentDetails.avatar && (
                      <img 
                        src={parentDetails.avatar} 
                        alt={parentDetails.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Name</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{parentDetails.name || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {/* Email and Phone in same row */}
                  {(parentDetails.email || parentDetails.phone) && (
                    <div className="grid grid-cols-2 gap-2">
                      {parentDetails.email && (
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <p className="text-sm font-medium text-gray-900 break-words">{parentDetails.email}</p>
                        </div>
                      )}
                      {parentDetails.phone && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Phone</p>
                          <p className="text-sm font-medium text-gray-900">{parentDetails.phone}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Current Student Email */}
                  {chat?.studentId?.email && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Student Email</p>
                      <p className="text-sm font-medium text-gray-900">{chat.studentId.email}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No parent information available</p>
                </div>
              )}
            </div>

            {/* Message Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-3">
              <h3 className="font-semibold text-gray-900 mb-3">Message Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Messages</span>
                  <span className="font-semibold text-gray-900">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`flex items-center gap-1 ${otherUserOnline ? 'text-green-600' : 'text-gray-500'}`}>
                    <Circle className={`w-2 h-2 ${otherUserOnline ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`} />
                    {otherUserOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay for mobile */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Chat Window - Responsive */}
      <div className="w-full md:w-[70%] flex flex-col h-screen relative">
        {/* Header - Fixed */}
        {showInPageSearch ? (
          <ChatInPageSearch
            messages={messages}
            onHighlightMessage={handleHighlightMessage}
            onSearchQueryChange={setSearchQuery}
            onClose={() => {
              setShowInPageSearch(false);
              setSearchQuery('');
              setHighlightedMessageId(null);
            }}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-b border-gray-100 px-4 py-2.5 sm:py-3.5 flex items-center justify-between flex-shrink-0 z-10"
          >
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Menu button for mobile */}
              <button
                onClick={() => setShowSidebar(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Show sidebar"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="font-semibold text-gray-900 text-lg">Chat</h2>
            </div>
        <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowInPageSearch(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Search"
              >
                <SearchIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={handlePhoneCall}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
                title="Voice Call"
              >
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
              <button 
                onClick={handleVideoCall}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
                title="Video Call"
              >
            <Video className="w-5 h-5 text-gray-600" />
          </button>
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                  title="More options"
                >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
                {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
              >
                <button
                  onClick={() => handleMenuAction('block')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Ban className="w-4 h-4" />
                  Block User
                </button>
                <button
                  onClick={() => handleMenuAction('report')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Report User
                </button>
                <button
                  onClick={() => handleMenuAction('clearChat')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Chat
                </button>
              </motion.div>
                )}
        </div>
      </div>
          </div>
        </motion.div>
        )}

      {/* Pinned Message Bar */}
      {pinnedMessage && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white text-gray-900 px-4 py-2 border-b border-gray-200 flex items-center justify-between shadow-sm group hover:bg-gray-50 transition-all cursor-pointer"
          onClick={handleGoToPinnedMessage}
        >
          {/* Navigation arrows if multiple pinned messages */}
          {pinnedMessages.length > 1 && (
            <div 
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handlePreviousPinned}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0 text-gray-600 hover:text-gray-900"
                title="Previous pinned message"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-600 px-2">
                {currentPinnedIndex + 1}/{pinnedMessages.length}
              </span>
              <button
                onClick={handleNextPinned}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0 text-gray-600 hover:text-gray-900"
                title="Next pinned message"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Pin className="w-5 h-5 flex-shrink-0 text-indigo-600" />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-sm font-semibold text-indigo-600">
                {pinnedMessage.senderId._id === user._id ? 'You:' : `${pinnedMessage.senderId.name}:`}
              </span>
              <span className="text-sm truncate text-gray-700">
                {pinnedMessage.content}
              </span>
            </div>
          </div>
          
          <div 
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Only show unpin button if current user pinned the message */}
            {pinnedMessage.pinnedBy?.some(id => (id._id || id).toString() === user._id.toString()) && (
              <button
                onClick={() => handleUnpin(pinnedMessage)}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-600"
                title="Unpin message"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Messages - Scrollable */}
      <div 
        ref={messagesContainerRef} 
        className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 bg-transparent relative custom-scrollbar"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.08'%3E%3Ccircle cx='15' cy='15' r='6'/%3E%3Ccircle cx='105' cy='25' r='5'/%3E%3Ccircle cx='30' cy='100' r='6'/%3E%3Ccircle cx='95' cy='115' r='7'/%3E%3Ccircle cx='60' cy='40' r='4'/%3E%3Crect x='100' y='10' width='8' height='8' rx='1'/%3E%3Crect x='15' y='70' width='7' height='7' rx='1'/%3E%3Crect x='105' cy='95' width='9' height='9' rx='1'/%3E%3Crect x='40' cy='115' width='7' height='7' rx='1'/%3E%3Crect x='90' cy='65' width='6' height='6' rx='1'/%3E%3Ccircle cx='45' cy='80' r='5'/%3E%3Ccircle cx='75' cy='85' r='6'/%3E%3Ccircle cx='20' cy='50' r='4'/%3E%3Ccircle cx='110' cy='70' r='5'/%3E%3Cpath d='M25 85 L32 79 L35 85 L38 79 L45 85 Z' fill='%238b5cf6'/%3E%3Cpath d='M75 18 L80 13 L83 20 L86 13 L92 20 Z' fill='%23ec4899'/%3E%3Cpath d='M100 95 L104 92 L108 100 L112 92 L116 100 Z' fill='%23a855f7'/%3E%3Cpath d='M50 55 L53 52 L56 58 L59 52 L63 58 Z' fill='%236366f1'/%3E%3Cpath d='M80 105 L84 102 L88 108 L92 102 L97 108 Z' fill='%239f7aea'/%3E%3Crect x='60' y='70' width='6' height='6' rx='1'/%3E%3Crect x='85' y='45' width='8' height='8' rx='1'/%3E%3Crect x='25' y='30' width='7' height='7' rx='1'/%3E%3Crect x='95' y='85' width='6' height='6' rx='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundAttachment: 'fixed'
        }}
      >
        {messages.filter(message => {
          const isDeleted = message.deletedBy?.some(d => {
            const deletedByUserId = d.userId?._id || d.userId;
            const currentUserId = user._id?.toString() || user._id;
            return deletedByUserId?.toString() === currentUserId?.toString();
          });
          return !isDeleted;
        }).length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex justify-center"
              >
                <div className="relative">
                  <MessageCircle className="w-24 h-24 text-indigo-400" />
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-16 h-16 bg-indigo-200 rounded-full opacity-20"></div>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Start the conversation
                </h3>
                <p className="text-sm text-gray-500">
                  Send a message to begin chatting
                </p>
              </motion.div>
            </motion.div>
          </div>
        ) : (
        <AnimatePresence>
          {messages
            .filter(message => {
              // Filter out messages deleted by current user
              const isDeleted = message.deletedBy?.some(d => {
                const deletedByUserId = d.userId?._id || d.userId;
                const currentUserId = user._id?.toString() || user._id;
                return deletedByUserId?.toString() === currentUserId?.toString();
              });
              return !isDeleted;
            })
            .map((message, index) => (
            <motion.div
              key={message._id}
              ref={(el) => { messageRefs.current[message._id] = el; }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${message.senderId._id === user._id ? 'justify-end' : 'justify-start'} ${
                highlightedMessageId === message._id ? 'animate-pulse bg-yellow-100 rounded-lg' : ''
              }`}
            >
              <div 
                className={`relative flex items-end gap-1.5 sm:gap-2 max-w-[85%] sm:max-w-xs lg:max-w-md ${message.senderId._id === user._id ? 'flex-row-reverse' : 'flex-row'}`}
                onContextMenu={(e) => handleMessageContextMenu(e, message)}
              >
                {message.senderId._id !== user._id && (
                  <img
                    src={message.senderId.avatar || '/avatars/avatar1.png'}
                    alt={message.senderId.name}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-gray-200"
                  />
                )}
                <div 
                  className={`relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl shadow-md transition-all hover:shadow-lg overflow-visible ${
                  message.senderId._id === user._id
                    ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-br-md'
                    : 'bg-white/90 backdrop-blur-sm text-gray-900 rounded-bl-md border border-white/50 shadow-md'
                  }`}
                >
                  {/* Forwarded label */}
                  {message.forwardedFrom && (
                    <div className="text-xs mb-1 opacity-75 flex items-center gap-1">
                      <Forward className="w-3 h-3" />
                      <span>Forwarded</span>
                    </div>
                  )}
                  
                  {/* Reply preview */}
                  {message.replyTo && (
                    <div className={`mb-2 px-2 py-1 rounded text-xs border-l-2 ${
                      message.senderId._id === user._id 
                        ? 'bg-indigo-600 border-indigo-300' 
                        : 'bg-gray-100 border-gray-300'
                    }`}>
                      <p className="font-semibold">
                        {message.replyTo.senderId?.name || 'User'}
                      </p>
                      <p className="truncate opacity-80">
                        {message.replyTo.content}
                      </p>
                    </div>
                  )}
                  
                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, idx) => (
                        <div key={idx} className={`p-2 rounded-lg border ${
                          message.senderId._id === user._id 
                            ? 'bg-indigo-600 border-indigo-400' 
                            : 'bg-gray-100 border-gray-300'
                        }`}>
                          {attachment.fileType?.startsWith('image/') ? (
                            <img
                              src={attachment.url}
                              alt={attachment.filename}
                              className="w-full rounded-lg max-h-48 object-cover cursor-pointer"
                              onClick={() => window.open(attachment.url, '_blank')}
                            />
                          ) : attachment.fileType?.startsWith('video/') ? (
                            <video
                              src={attachment.url}
                              controls
                              className="w-full rounded-lg max-h-48"
                            />
                          ) : attachment.fileType?.startsWith('audio/') ? (
                            <div className={`rounded-lg p-1 ${
                              message.senderId._id === user._id 
                                ? 'bg-indigo-600' 
                                : 'bg-gray-200'
                            }`}>
                              <VoiceMessagePlayer 
                                url={attachment.url.startsWith('http') ? attachment.url : `${api.defaults.baseURL}${attachment.url}`}
                                duration={attachment.duration}
                                onDownload={() => handleDownload(attachment)}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <FileIcon className="w-6 h-6 text-gray-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">{attachment.filename}</p>
                                  <p className="text-xs text-gray-500">
                                    {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDownload(attachment)}
                                className={`px-2 py-1 rounded hover:opacity-80 transition-opacity flex-shrink-0 ${
                                  message.senderId._id === user._id
                                    ? 'bg-indigo-700 text-white'
                                    : 'bg-gray-300 text-gray-700'
                                }`}
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Message content with inline info */}
                  <div className="flex items-end gap-2 flex-wrap">
                    {message.content && message.content.trim() && (
                      <p className="text-xs sm:text-sm break-words">
                        {searchQuery ? highlightText(message.content, searchQuery) : message.content}
                      </p>
                    )}
                    
                    {/* Inline info: edited, timestamp, status */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {message.isEdited && (
                        <span className={`text-[10px] opacity-75 ${
                          message.senderId._id === user._id ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          (edited)
                        </span>
                      )}
                      <span className={`text-[10px] ${
                        message.senderId._id === user._id ? 'text-white/90' : 'text-gray-500'
                    }`}>
                      {formatTime(message.createdAt)}
                    </span>
                    {getMessageStatus(message)}
                      {message.starredBy?.includes(user._id) && (
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      )}
                      {message.pinnedBy?.some(id => (id._id || id).toString() === user._id.toString()) && (
                        <Pin className="w-3 h-3 fill-blue-500 text-blue-500" />
                      )}
                  </div>
                    
                    {/* Reactions overlapping the message bubble */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div 
                        className={`absolute ${message.senderId._id === user._id ? 'right-2' : 'left-2'} bottom-[-14px] flex gap-1 flex-row`}
                      >
                        {Object.entries(
                          message.reactions.reduce((acc, r) => {
                            acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([emoji, count]) => (
                          <div 
                            key={emoji} 
                            className="flex items-center gap-1 drop-shadow-lg"
                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
                          >
                            <span className="text-lg">{emoji}</span>
                            {count > 1 && (
                              <span className="text-[10px] text-gray-600 font-semibold" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}>{count}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator - Positioned above input area */}
        {otherUserTyping && (
        <div className="px-4 py-2 flex-shrink-0 bg-transparent z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl rounded-bl-md border border-gray-200 shadow-md">
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
        </div>
      )}

      {/* Message Input - Fixed */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.08)] border-t border-gray-100 p-2 sm:p-4 flex-shrink-0 relative"
      >
        {/* Reply Preview */}
        {replyingTo && (
          <div className="mb-2 bg-indigo-50 border-l-4 border-indigo-500 p-1.5 sm:p-2 rounded flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-indigo-900 truncate">Replying to {replyingTo.senderId?.name || 'User'}</p>
              <p className="text-xs text-gray-600 truncate">{replyingTo.content}</p>
      </div>
            <button onClick={() => setReplyingTo(null)} className="ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                {file.type.startsWith('image/') ? (
                  <Image className="w-4 h-4 text-blue-600" />
                ) : (
                  <FileIcon className="w-4 h-4 text-gray-600" />
                )}
                <span className="text-sm text-gray-700 max-w-[120px] truncate">{file.name}</span>
                <button
                  onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          
          <button 
            onClick={() => setShowAttachMenu(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            title="Attach files"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            title="Add emoji"
          >
            <Smile className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 sm:left-4 mb-2 z-50 w-[350px] sm:w-[400px]">
              <div className="relative">
                <div className="absolute -top-6 -right-6 z-10">
                  <button
                    onClick={() => setShowEmojiPicker(false)}
                    className="p-3 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors cursor-pointer bg-white shadow-md"
                    aria-label="Close emoji picker"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <EmojiPicker 
                  onEmojiClick={handleEmojiSelect}
                  width="100%"
                  height="400px"
                  searchDisabled={false}
                  previewConfig={{ showPreview: false }}
                />
              </div>
            </div>
          )}
          
          {/* Voice Recording UI or Text Input */}
          {showVoiceRecorder ? (
            <InlineVoiceRecorder
              onRecordComplete={handleVoiceRecordComplete}
              onCancel={() => setShowVoiceRecorder(false)}
            />
          ) : (
            <>
              <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-gray-50 hover:bg-white transition-colors"
              disabled={sending}
            />
          </div>
              
              <button
                onClick={() => setShowVoiceRecorder(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                title="Voice message"
              >
                <Mic className="w-5 h-5 text-gray-600" />
            </button>
              
          <button
            onClick={sendMessage}
                disabled={(!newMessage.trim() && selectedFiles.length === 0) || sending}
                className="p-2 sm:p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 flex-shrink-0 shadow-lg"
          >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
            </>
          )}
        </div>
      </motion.div>
      </div>
      
      {/* Message Context Menu */}
      {contextMenu && (
        <MessageContextMenu
          message={contextMenu.message}
          user={user}
          chatId={chat._id}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
          onReply={handleReply}
          onDeleteConfirm={handleDeleteConfirm}
          onEditConfirm={handleEditConfirm}
        />
      )}
      
      {/* Edit Message Modal */}
      {messageToEdit && (
        <EditMessageModal
          isOpen={true}
          message={messageToEdit}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {messageToDelete && (
        <DeleteConfirmModal
          isOpen={true}
          isOwner={messageToDelete.senderId._id === user._id}
          onDeleteForMe={deleteForMe}
          onDeleteForEveryone={deleteForEveryone}
          onCancel={cancelDelete}
        />
      )}
      
      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[75px] sm:bottom-[80px] md:bottom-[85px] z-30">
          <button
            onClick={scrollToBottom}
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 shadow-lg transition-all hover:scale-105"
            title="Scroll to bottom"
          >
            <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      )}
      
      {/* Attach Menu */}
      {showAttachMenu && (
        <AttachMenu
          onClose={() => setShowAttachMenu(false)}
          onSelect={handleAttachSelect}
        />
      )}
      
      {/* Search */}
      {showSearch && (
        <ChatSearch
          messages={messages}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  );
};

export default TeacherStudentChat;
