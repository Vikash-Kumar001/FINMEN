import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, MessageSquare, FileText, Eye, Users, Flag, TrendingUp } from "lucide-react";

const StudentActionsMenu = ({ 
  student, 
  onMessage, 
  onAddNote, 
  onViewDetails, 
  onAssignToGroup,
  onViewFullProfile 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action) => {
    action(student);
    setIsOpen(false);
  };

  const actions = [
    {
      label: "Message",
      icon: MessageSquare,
      color: "text-blue-600",
      bgHover: "hover:bg-blue-50",
      action: onMessage
    },
    {
      label: "Add Note",
      icon: FileText,
      color: "text-purple-600",
      bgHover: "hover:bg-purple-50",
      action: onAddNote
    },
    {
      label: "View Details",
      icon: Eye,
      color: "text-green-600",
      bgHover: "hover:bg-green-50",
      action: onViewDetails
    },
    {
      label: "Assign to Group",
      icon: Users,
      color: "text-amber-600",
      bgHover: "hover:bg-amber-50",
      action: onAssignToGroup
    },
    {
      label: "Full Profile",
      icon: TrendingUp,
      color: "text-pink-600",
      bgHover: "hover:bg-pink-50",
      action: onViewFullProfile
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 hover:bg-gray-100 rounded-lg transition-all"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden z-50"
          >
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  whileHover={{ x: 4 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(action.action);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-all ${action.bgHover} ${
                    index < actions.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <Icon className={`w-5 h-5 ${action.color}`} />
                  <span className="font-semibold text-gray-700">{action.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentActionsMenu;

