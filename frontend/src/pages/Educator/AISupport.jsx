import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    MessageSquare,
    Send,
    Book,
    Video,
    Search,
    Play,
    Pause,
    ChevronRight,
    ThumbsUp,
    ThumbsDown,
    Bot,
    Sparkles,
    BookOpen,
    HelpCircle,
    Clock,
    RefreshCw
} from 'lucide-react';

const AISupport = () => {
    // State management
    const [activeTab, setActiveTab] = useState('chat');
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    // Sample knowledge base articles
    const knowledgeBase = [
        {
            id: 1,
            title: 'Getting Started with Financial Education',
            category: 'Basics',
            views: 1245,
            rating: 4.8
        },
        {
            id: 2,
            title: 'Advanced Teaching Strategies',
            category: 'Teaching',
            views: 892,
            rating: 4.6
        },
        {
            id: 3,
            title: 'Student Engagement Techniques',
            category: 'Engagement',
            views: 1567,
            rating: 4.9
        }
    ];

    // Sample video tutorials
    const videoTutorials = [
        {
            id: 1,
            title: 'Platform Overview',
            duration: '5:30',
            thumbnail: '🎥',
            views: 2341
        },
        {
            id: 2,
            title: 'Creating Interactive Lessons',
            duration: '8:45',
            thumbnail: '🎬',
            views: 1892
        },
        {
            id: 3,
            title: 'Student Progress Tracking',
            duration: '6:15',
            thumbnail: '📊',
            views: 1567
        }
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const messageVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Auto-scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle sending message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages([...messages, userMessage]);
        setInputMessage('');

        // Simulate AI response
        setIsTyping(true);
        setTimeout(() => {
            const aiMessage = {
                id: messages.length + 2,
                text: 'Thank you for your message. I understand you need help with financial education. Could you please provide more specific details about your question?',
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6"
        >
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <Bot className="w-8 h-8 text-purple-600" />
                    AI Support Assistant
                </h1>

                {/* Navigation Tabs */}
                <div className="flex gap-4 mb-8">
                    {['chat', 'knowledge', 'tutorials'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === tab
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Live Chat */}
                    {activeTab === 'chat' && (
                        <div className="h-[600px] flex flex-col">
                            <div className="flex-1 overflow-y-auto p-6">
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        variants={messageVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-lg p-4 ${message.sender === 'user'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            <p>{message.text}</p>
                                            <span className="text-xs opacity-70 mt-2 block">
                                                {message.timestamp}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        AI is typing...
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="p-4 border-t">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:border-purple-500"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Knowledge Base */}
                    {activeTab === 'knowledge' && (
                        <div className="p-6">
                            <div className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search knowledge base..."
                                        className="w-full px-4 py-2 pl-10 rounded-lg border focus:outline-none focus:border-purple-500"
                                    />
                                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                {knowledgeBase.map((article) => (
                                    <div
                                        key={article.id}
                                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <h3 className="font-medium text-lg text-gray-800">
                                            {article.title}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="w-4 h-4" />
                                                {article.category}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                {article.views} views
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                {article.rating}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Video Tutorials */}
                    {activeTab === 'tutorials' && (
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {videoTutorials.map((video) => (
                                    <div
                                        key={video.id}
                                        className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className="aspect-video bg-gray-200 flex items-center justify-center text-4xl">
                                            {video.thumbnail}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-800">
                                                {video.title}
                                            </h3>
                                            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {video.duration}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    {video.views} views
                                                </span>
                                            </div>
                                            <button className="mt-3 w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                                                <Play className="w-4 h-4" />
                                                Watch Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default AISupport;