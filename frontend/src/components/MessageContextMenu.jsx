import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Reply, Copy, Star, Trash2, Edit, Forward, Heart, Smile,
  X, MoreVertical, Check, CheckCheck, Plus, XCircle, Pin
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const MessageContextMenu = ({ message, user, onClose, onReply, onDeleteConfirm, onEditConfirm }) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMoreEmojis, setShowMoreEmojis] = useState(false);
  
  const reactions = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '⭐'];
  const moreReactions = ['😀', '😁', '🤣', '😊', '😉', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😝', '😜', '🤪', '😇', '🤗', '🤭', '🤫', '🤔', '😏', '😎', '🥳', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'];
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success('Message copied');
    onClose();
  };
  
  const handleStar = async () => {
    try {
      await api.post(`/api/chat/message/${message._id}/star`);
      toast.success('Message starred');
      onClose();
    } catch (error) {
      console.error('Error starring message:', error);
      toast.error('Failed to star message');
    }
  };
  
  const handlePin = async () => {
    try {
      const response = await api.post(`/api/chat/message/${message._id}/pin`);
      const action = response.data.isPinned ? 'pinned' : 'unpinned';
      toast.success(`Message ${action}`);
      onClose();
    } catch (error) {
      console.error('Error pinning message:', error);
      toast.error(error.response?.data?.message || 'Failed to pin message');
    }
  };
  
  const handleDeleteClick = () => {
    onClose();
    if (onDeleteConfirm) {
      onDeleteConfirm(message);
    }
  };
  
  const handleReact = async (emoji) => {
    try {
      await api.post(`/api/chat/message/${message._id}/react`, { emoji });
      
      // Check if user already reacted with this emoji to show appropriate toast
      const userReaction = message.reactions?.find(r => r.userId === user._id && r.emoji === emoji);
      if (userReaction) {
        toast.success('Reaction removed');
      } else {
        toast.success('Reaction added');
      }
      
      setShowReactionPicker(false);
      onClose();
    } catch (error) {
      console.error('Error reacting:', error);
      toast.error('Failed to react');
    }
  };
  
  const handleRemoveAllReactions = async () => {
    try {
      // Get all reactions this user has added
      const userReactions = message.reactions?.filter(r => r.userId === user._id) || [];
      
      // Remove each reaction
      for (const reaction of userReactions) {
        await api.post(`/api/chat/message/${message._id}/react`, { emoji: reaction.emoji });
      }
      
      if (userReactions.length > 0) {
        toast.success('All reactions removed');
      }
      
      onClose();
    } catch (error) {
      console.error('Error removing all reactions:', error);
      toast.error('Failed to remove reactions');
    }
  };
  
  const handleEditClick = () => {
    onClose();
    if (onEditConfirm) {
      onEditConfirm(message);
    }
  };
  
  const handleReplyClick = () => {
    onReply(message);
    onClose();
  };
  
  const isOwner = message.senderId._id === user._id;
  const isStarred = message.starredBy?.includes(user._id);
  const isPinnedByMe = message.pinnedBy?.some(id => (id._id || id).toString() === user._id.toString());
  const isPinnedBySomeone = message.pinnedBy && message.pinnedBy.length > 0;
  
  // Prevent body scroll when menu is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-2xl border border-gray-200 py-2 min-w-[240px] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-between">
          <h3 className="font-semibold text-xs">Message Options</h3>
          <button 
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        
        {/* Reactions */}
        <div className="px-3 py-2 border-b border-gray-200">
          <div className="flex gap-2">
            {/* Remove all reactions button */}
            {message.reactions?.some(r => r.userId === user._id) && (
              <button
                onClick={handleRemoveAllReactions}
                className="text-2xl rounded-lg p-2 transition-all hover:bg-red-50 border-2 border-red-200"
                title="Remove all my reactions"
              >
                <XCircle className="w-5 h-5 text-red-600" />
              </button>
            )}
            
            {reactions.map((emoji) => {
              const hasReacted = message.reactions?.some(r => r.userId === user._id && r.emoji === emoji);
              return (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className={`text-2xl rounded-lg p-2 transition-all ${
                    hasReacted
                      ? 'bg-indigo-100 border-2 border-indigo-500 scale-110'
                      : 'hover:bg-gray-100'
                  }`}
                  title={hasReacted ? 'Remove reaction' : 'Add reaction'}
                >
                  {emoji}
                </button>
              );
            })}
            <button
              onClick={() => setShowMoreEmojis(!showMoreEmojis)}
              className="text-2xl rounded-lg p-2 transition-all hover:bg-gray-100 border-2 border-dashed border-gray-300"
              title="More reactions"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* More Reactions */}
          {showMoreEmojis && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                {moreReactions.map((emoji) => {
                  const hasReacted = message.reactions?.some(r => r.userId === user._id && r.emoji === emoji);
                  return (
                    <button
                      key={emoji}
                      onClick={() => {
                        handleReact(emoji);
                        setShowMoreEmojis(false);
                      }}
                      className={`text-lg rounded-lg p-2 transition-all ${
                        hasReacted
                          ? 'bg-indigo-100 border-2 border-indigo-500 scale-110'
                          : 'hover:bg-gray-100'
                      }`}
                      title={hasReacted ? 'Remove reaction' : 'Add reaction'}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="py-1">
          <button
            onClick={handleReplyClick}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Reply className="w-4 h-4" />
            Reply
          </button>
          
          <button
            onClick={handleCopy}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          
          <button
            onClick={handleStar}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Star className={`w-4 h-4 ${isStarred ? 'text-yellow-500 fill-yellow-500' : ''}`} />
            {isStarred ? 'Unstar' : 'Star'}
          </button>
          
          <button
            onClick={handlePin}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Pin className={`w-4 h-4 ${isPinnedByMe ? 'text-blue-500 fill-blue-500' : ''}`} />
            {isPinnedByMe ? 'Unpin' : 'Pin'}
          </button>
          
          {/* Show info if pinned by multiple users */}
          {isPinnedBySomeone && !isPinnedByMe && (
            <div className="w-full px-4 py-2 text-left text-xs text-blue-600 flex items-center gap-2">
              <Pin className="w-4 h-4 text-blue-500 fill-blue-500" />
              Also pinned by others
            </div>
          )}
          
          <button
            onClick={() => {
              toast('Forward feature coming soon');
              onClose();
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Forward className="w-4 h-4" />
            Forward
          </button>
          
          {/* Edit button - only for sender */}
          {isOwner && (
            <button
              onClick={handleEditClick}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
          
          {/* Delete button - available for everyone */}
          <button
            onClick={handleDeleteClick}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const DeleteConfirmModal = ({ isOpen, isOwner, onDeleteForMe, onDeleteForEveryone, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={onCancel}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-sm w-[90%] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-white text-lg">Delete Message</h3>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 py-5">
          {isOwner ? (
            <p className="text-gray-700 text-sm mb-4">
              How would you like to delete this message?
            </p>
          ) : (
            <p className="text-gray-700 text-sm mb-4">
              Delete this message from your chat?
            </p>
          )}
          
          {/* Delete for me - Always available */}
          <button
            onClick={onDeleteForMe}
            className="w-full mb-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200">
                <Trash2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Delete for me</div>
                <div className="text-xs text-gray-500">Remove from your chat</div>
              </div>
            </div>
          </button>
          
          {/* Delete for everyone - Only for sender */}
          {isOwner && (
            <button
              onClick={onDeleteForEveryone}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30">
                  <Trash2 className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">Delete for everyone</div>
                  <div className="text-xs text-white/90">Remove for all participants</div>
                </div>
              </div>
            </button>
          )}
        </div>
        
        {/* Cancel Button */}
        <div className="px-6 py-3 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const EditMessageModal = ({ isOpen, message, onSave, onCancel }) => {
  const [editContent, setEditContent] = useState(message?.content || '');
  
  React.useEffect(() => {
    if (isOpen && message) {
      setEditContent(message.content);
    }
  }, [isOpen, message]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (editContent.trim() && editContent !== message.content) {
      onSave(editContent);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={onCancel}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-[90%] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Edit className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-white text-lg">Edit Message</h3>
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 py-5">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Edit your message..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={4}
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2">
            {editContent.trim().length} characters
          </p>
        </div>
        
        {/* Buttons */}
        <div className="px-6 py-4 flex gap-3 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!editContent.trim() || editContent === message.content}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MessageContextMenu;

export { DeleteConfirmModal, EditMessageModal };

