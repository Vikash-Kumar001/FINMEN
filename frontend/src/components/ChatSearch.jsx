import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

const ChatSearch = ({ messages, onSelectMessage, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = messages.filter(message =>
        message.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages([]);
    }
  }, [searchQuery, messages]);

  const handleMessageClick = (message) => {
    if (onSelectMessage) {
      onSelectMessage(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="flex-1 outline-none text-sm"
          />
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
          {searchQuery.trim() ? (
            <>
              {filteredMessages.length > 0 ? (
                <div className="p-2">
                  <p className="text-xs text-gray-500 px-2 py-2">
                    {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''} found
                  </p>
                  {filteredMessages.map((message) => (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => handleMessageClick(message)}
                      className="p-3 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 line-clamp-2">
                            {message.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No messages found</p>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Type to search messages...</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ChatSearch;

