import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

const ChatInPageSearch = ({ messages, onHighlightMessage, onClose, onSearchQueryChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const inputRef = useRef(null);

  // Update parent component with search query
  useEffect(() => {
    if (onSearchQueryChange) {
      onSearchQueryChange(searchQuery);
    }
  }, [searchQuery, onSearchQueryChange]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = messages.filter(message =>
        message.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setCurrentResultIndex(filtered.length > 0 ? 0 : -1);
    } else {
      setSearchResults([]);
      setCurrentResultIndex(-1);
    }
  }, [searchQuery, messages]);

  const navigateToNext = () => {
    if (searchResults.length > 0) {
      // Highlight the current result
      const message = searchResults[currentResultIndex];
      if (onHighlightMessage) {
        onHighlightMessage(message);
      }
      // Move to next result (or back to 0 if at the end)
      const nextIndex = (currentResultIndex + 1) % searchResults.length;
      setCurrentResultIndex(nextIndex);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      e.preventDefault();
      navigateToNext();
    } else if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown' && searchResults.length > 0) {
      e.preventDefault();
      setCurrentResultIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp' && searchResults.length > 0) {
      e.preventDefault();
      setCurrentResultIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    }
  };

  const handleNext = () => {
    if (searchResults.length > 0) {
      const nextIndex = (currentResultIndex + 1) % searchResults.length;
      setCurrentResultIndex(nextIndex);
      if (onHighlightMessage) {
        onHighlightMessage(searchResults[nextIndex]);
      }
    }
  };

  const handlePrevious = () => {
    if (searchResults.length > 0) {
      const prevIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
      setCurrentResultIndex(prevIndex);
      if (onHighlightMessage) {
        onHighlightMessage(searchResults[prevIndex]);
      }
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setCurrentResultIndex(-1);
    onClose();
  };

  return (
    <div className="bg-white border-b border-gray-200 flex items-center justify-between px-2 sm:px-4 py-2 sm:py-4.5 flex-shrink-0 z-10">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search messages..."
            className="flex-1 outline-none text-sm sm:text-base bg-transparent"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2 mr-1 sm:mr-2">
            <button
              onClick={handlePrevious}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
              title="Previous"
            >
              <ChevronUp className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-[10px] sm:text-xs text-gray-500">
              {currentResultIndex + 1}/{searchResults.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
              title="Next"
            >
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}

        <button
          onClick={handleClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          title="Close search"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
    </div>
  );
};

export default ChatInPageSearch;

