import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useNavigate, useParams } from 'react-router-dom';
import {
  Presentation, Plus, Edit, Trash2, Eye, Play, Share2, Copy, 
  ChevronLeft, ChevronRight,ChevronDown,ChevronUp, Save, X, Image as ImageIcon, 
  Video, FileText, Type, Layout, Palette, Settings, Users, 
  Lock, Unlock, Globe, Download, MoreVertical, ArrowLeft,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Undo, Redo, Minus, Maximize2, 
  Square, Circle, Triangle, Shapes, Image, Film, Table,
  MoveUp, MoveDown, Paintbrush, Type as TypeIcon, Sparkles
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';
import { useSubscription } from '../../context/SubscriptionContext';
import UpgradePrompt from '../../components/UpgradePrompt';

const PresentationPage = () => {
  const navigate = useNavigate();
  const { id, shareCode } = useParams();
  const socket = useSocket();
  const { hasFeature } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const [view, setView] = useState('list'); // 'list', 'edit', 'present'
  const [presentations, setPresentations] = useState([]);
  const [currentPresentation, setCurrentPresentation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Editor states
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedTextFormat, setSelectedTextFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    fontSize: 24,
    color: '#000000',
    align: 'left'
  });
  const [draggedSlideIndex, setDraggedSlideIndex] = useState(null);
  
  // Tool modals
  const [showTextBoxModal, setShowTextBoxModal] = useState(false);
  const [showShapeModal, setShowShapeModal] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showEquationModal, setShowEquationModal] = useState(false);
  const [showSymbolModal, setShowSymbolModal] = useState(false);
  const [showSmartArtModal, setShowSmartArtModal] = useState(false);
  const [showImageEditModal, setShowImageEditModal] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const isUpdatingRef = useRef(false);

  // Ensure currentSlideIndex is valid when slides change
  useEffect(() => {
    if (currentPresentation && currentPresentation.slides && currentPresentation.slides.length > 0) {
      if (currentSlideIndex >= currentPresentation.slides.length) {
        setCurrentSlideIndex(Math.max(0, currentPresentation.slides.length - 1));
      }
    } else if (currentPresentation && (!currentPresentation.slides || currentPresentation.slides.length === 0)) {
      setCurrentSlideIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPresentation?.slides?.length, currentSlideIndex]);

  // Sync contentEditable with slide data
  useEffect(() => {
    if (!currentPresentation || !titleRef.current || !contentRef.current) return;
    if (isUpdatingRef.current) return;

    const currentSlide = currentPresentation.slides?.[currentSlideIndex];
    if (!currentSlide) return;

    // Update title
    if (titleRef.current.textContent !== currentSlide.title) {
      titleRef.current.textContent = currentSlide.title || 'Click to add title';
    }

    // Update content only if it's different and user is not actively editing
    const isFocused = document.activeElement === contentRef.current;
    if (contentRef.current.innerHTML !== currentSlide.content && !isFocused) {
      contentRef.current.innerHTML = currentSlide.content || '<p style="opacity: 0.5;">Click to add content</p>';
    }
  }, [currentPresentation, currentSlideIndex]);

  // Initialize contentEditable on mount or slide change
  useEffect(() => {
    if (contentRef.current && currentPresentation && currentPresentation.slides[currentSlideIndex]) {
      const currentSlide = currentPresentation.slides[currentSlideIndex];
      if (!contentRef.current.innerHTML || contentRef.current.innerHTML === '') {
        contentRef.current.innerHTML = currentSlide.content || '<p style="opacity: 0.5;">Click to add content</p>';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIndex, currentPresentation?._id]);

  // Keyboard shortcuts
  useEffect(() => {
    if (view !== 'edit' && view !== 'present') return;

    const handleKeyDown = (e) => {
      // Arrow keys for navigation
      if (e.key === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (currentSlideIndex < currentPresentation.slides.length - 1) {
          handleChangeSlide(currentSlideIndex + 1);
        }
      } else if (e.key === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (currentSlideIndex > 0) {
          handleChangeSlide(currentSlideIndex - 1);
        }
      }
      
      // Delete key for deleting slide
      if (e.key === 'Delete' && e.ctrlKey && view === 'edit') {
        e.preventDefault();
        if (currentPresentation.slides.length > 1) {
          handleDeleteSlide(currentSlideIndex);
        }
      }
      
      // Ctrl+D to duplicate
      if (e.key === 'd' && (e.ctrlKey || e.metaKey) && view === 'edit') {
        e.preventDefault();
        handleDuplicateSlide(currentSlideIndex);
      }
      
      // Ctrl+S to save
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (currentPresentation) {
          handleUpdatePresentation({});
          toast.success('Saved!');
        }
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        setShowInsertMenu(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, currentSlideIndex, currentPresentation]);
  
  // New presentation form
  const [newPresentation, setNewPresentation] = useState({
    title: '',
    description: '',
    theme: 'default',
    templateId: null
  });
  
  // Template and metadata states
  const [templates, setTemplates] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  
  // Layout presets
  const layoutPresets = [
    { name: 'Title Slide', value: 'title-only', icon: Type },
    { name: 'Title and Content', value: 'title-content', icon: FileText },
    { name: 'Two Content', value: 'two-column', icon: Layout },
    { name: 'Content with Caption', value: 'content-caption', icon: Image },
    { name: 'Blank', value: 'blank', icon: Square },
    { name: 'Centered', value: 'centered', icon: AlignCenter },
    { name: 'Left Aligned', value: 'left', icon: AlignLeft },
    { name: 'Right Aligned', value: 'right', icon: AlignRight }
  ];
  
  // Themes
  const themes = [
    { name: 'Default', value: 'default', colors: ['#FFFFFF', '#000000'] },
    { name: 'Dark', value: 'dark', colors: ['#1a1a1a', '#FFFFFF'] },
    { name: 'Light', value: 'light', colors: ['#FFFFFF', '#333333'] },
    { name: 'Colorful', value: 'colorful', colors: ['#FF6B6B', '#4ECDC4'] },
    { name: 'Minimal', value: 'minimal', colors: ['#F7F7F7', '#2C2C2C'] },
    { name: 'Professional', value: 'professional', colors: ['#2C3E50', '#ECF0F1'] },
    { name: 'Modern', value: 'modern', colors: ['#667EEA', '#764BA2'] },
    { name: 'Classic', value: 'classic', colors: ['#F5F5DC', '#8B4513'] },
    { name: 'Corporate', value: 'corporate', colors: ['#1E3A5F', '#FFFFFF'] },
    { name: 'Creative', value: 'creative', colors: ['#FF6B9D', '#C44569'] }
  ];
  
  // Fetch templates
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const fetchTemplates = useCallback(async () => {
    try {
      setTemplatesLoading(true);
      const res = await api.get('/api/presentation-templates');
      if (res.data.success) {
        setTemplates(res.data.templates || []);
      } else {
        console.error('Failed to fetch templates:', res.data.message);
        toast.error('Failed to load templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates. You can still create a blank presentation.');
      // Set empty array so UI doesn't break
      setTemplates([]);
    } finally {
      setTemplatesLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (showTemplateModal || showCreateModal) {
      fetchTemplates();
    }
  }, [showTemplateModal, showCreateModal, fetchTemplates]);
  
  // Reset form when modal opens
  useEffect(() => {
    if (showCreateModal) {
      setNewPresentation({
        title: '',
        description: '',
        theme: 'default',
        templateId: null
      });
    }
  }, [showCreateModal]);


  // Color palette
  const colorPalette = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000'
  ];

  // Font sizes
  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

  // Fetch presentations
  const fetchPresentations = useCallback(async () => {
    try {
      const res = await api.get('/api/presentations/my-presentations');
      if (res.data.success) {
        setPresentations(res.data.presentations || []);
      }
    } catch (error) {
      console.error('Error fetching presentations:', error);
      toast.error('Failed to load presentations');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single presentation
  const fetchPresentation = useCallback(async (presentationId) => {
    try {
      const res = await api.get(`/api/presentations/${presentationId}`);
      if (res.data.success) {
        setCurrentPresentation(res.data.presentation);
        setCurrentSlideIndex(res.data.presentation.currentSlide || 0);
      }
    } catch (error) {
      console.error('Error fetching presentation:', error);
      toast.error('Failed to load presentation');
    }
  }, []);

  // Fetch presentation by share code
  const fetchPresentationByShareCode = useCallback(async (code) => {
    try {
      const res = await api.get(`/api/presentations/share/${code}`);
      if (res.data.success) {
        setCurrentPresentation(res.data.presentation);
        setCurrentSlideIndex(res.data.presentation.currentSlide || 0);
        setView('present');
      }
    } catch (error) {
      console.error('Error fetching shared presentation:', error);
      toast.error('Failed to load shared presentation');
    }
  }, []);

  useEffect(() => {
    if (shareCode) {
      fetchPresentationByShareCode(shareCode);
    } else if (id) {
      fetchPresentation(id);
      setView('edit');
    } else {
      fetchPresentations();
      setView('list');
    }
  }, [id, shareCode, fetchPresentation, fetchPresentationByShareCode, fetchPresentations]);

  // Socket.IO listeners
  useEffect(() => {
    if (!socket?.socket || !currentPresentation) return;

    const handleSlideChanged = (data) => {
      if (data.presentationId === currentPresentation._id) {
        setCurrentSlideIndex(data.currentSlide);
      }
    };

    const handlePresentationStarted = (data) => {
      if (data.presentationId === currentPresentation._id) {
        setView('present');
      }
    };

    const handlePresentationStopped = (data) => {
      if (data.presentationId === currentPresentation._id) {
        setView('edit');
      }
    };

    socket.socket.emit('presentation:join', { presentationId: currentPresentation._id });

    socket.socket.on('presentation:slide-changed', handleSlideChanged);
    socket.socket.on('presentation:started', handlePresentationStarted);
    socket.socket.on('presentation:stopped', handlePresentationStopped);

    return () => {
      if (currentPresentation) {
        socket.socket.emit('presentation:leave', { presentationId: currentPresentation._id });
      }
      socket.socket.off('presentation:slide-changed', handleSlideChanged);
      socket.socket.off('presentation:started', handlePresentationStarted);
      socket.socket.off('presentation:stopped', handlePresentationStopped);
    };
  }, [socket, currentPresentation]);

  // Rich text formatting functions
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    updateTextFormat();
  };

  const updateTextFormat = () => {
    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const element = container.nodeType === 3 ? container.parentElement : container;
        
        setSelectedTextFormat({
          bold: element.closest('b, strong, [style*="font-weight: bold"]') !== null,
          italic: element.closest('i, em, [style*="font-style: italic"]') !== null,
          underline: element.closest('u, [style*="text-decoration: underline"]') !== null,
          fontSize: parseInt(window.getComputedStyle(element).fontSize) || 24,
          color: window.getComputedStyle(element).color || '#000000',
          align: window.getComputedStyle(element).textAlign || 'left'
        });
      }
    }
  };

  // Create new presentation
  const handleCreatePresentation = async () => {
    // Check if user has Inavora access
    if (!hasFeature('inavoraAccess')) {
      setShowUpgradeModal(true);
      toast.error('Inavora Presentation Tool requires a premium subscription');
      return;
    }
    if (!newPresentation.title || newPresentation.title.trim() === '') {
      toast.error('Please enter a presentation title');
      return;
    }
    
    try {
      const presentationData = {
        title: newPresentation.title.trim(),
        description: newPresentation.description?.trim() || '',
        theme: newPresentation.theme || 'default',
        templateId: newPresentation.templateId || null
      };
      
      const res = await api.post('/api/presentations', presentationData);
      if (res.data.success) {
        toast.success('Presentation created!');
        setShowCreateModal(false);
        setNewPresentation({ title: '', description: '', theme: 'default', templateId: null });
        navigate(`/student/presentation/${res.data.presentation._id}`);
        // Refresh presentations list if we're on the list view
        if (view === 'list') {
          fetchPresentations();
        }
      } else {
        toast.error(res.data.message || 'Failed to create presentation');
      }
    } catch (error) {
      console.error('Error creating presentation:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create presentation';
      toast.error(errorMessage);
    }
  };
  
  // Update presentation metadata
  const handleUpdateMetadata = async () => {
    try {
      const res = await api.put(`/api/presentations/${currentPresentation._id}/metadata`, {
        numbering: currentPresentation.numbering,
        headers: currentPresentation.headers,
        footers: currentPresentation.footers,
        masterSlides: currentPresentation.masterSlides,
        defaultMasterLayout: currentPresentation.defaultMasterLayout
      });
      
      if (res.data.success) {
        setCurrentPresentation(res.data.presentation);
        setShowMetadataModal(false);
        toast.success('Settings updated!');
      }
    } catch (error) {
      console.error('Error updating metadata:', error);
      toast.error('Failed to update settings');
    }
  };

  // Update presentation
  const handleUpdatePresentation = async (updates) => {
    try {
      const res = await api.put(`/api/presentations/${currentPresentation._id}`, updates);
      if (res.data.success) {
        setCurrentPresentation(res.data.presentation);
        toast.success('Presentation updated!');
      }
    } catch (error) {
      console.error('Error updating presentation:', error);
      toast.error('Failed to update presentation');
    }
  };

  // Delete presentation
  const handleDeletePresentation = async (presentationId) => {
    if (!window.confirm('Are you sure you want to delete this presentation?')) return;
    
    try {
      const res = await api.delete(`/api/presentations/${presentationId}`);
      if (res.data.success) {
        toast.success('Presentation deleted!');
        navigate('/student/presentation');
        fetchPresentations();
      }
    } catch (error) {
      console.error('Error deleting presentation:', error);
      toast.error('Failed to delete presentation');
    }
  };

  // Add slide
  const handleAddSlide = async (layout = 'content') => {
    try {
      const slideData = {
        slideNumber: currentPresentation.slides.length,
        title: 'New Slide',
        slideType: layout,
        content: '',
        layout: layout === 'title' ? 'centered' : 'left',
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        fontSize: 24
      };
      const res = await api.post(`/api/presentations/${currentPresentation._id}/slides`, slideData);
      if (res.data.success) {
        setCurrentPresentation(res.data.presentation);
        setCurrentSlideIndex(res.data.presentation.slides.length - 1);
        toast.success('Slide added!');
      }
    } catch (error) {
      console.error('Error adding slide:', error);
      toast.error('Failed to add slide');
    }
  };

  // Update slide
  const handleUpdateSlide = async (slideNumber, updates) => {
    try {
      const res = await api.put(`/api/presentations/${currentPresentation._id}/slides/${slideNumber}`, updates);
      if (res.data.success) {
        setCurrentPresentation(res.data.presentation);
        if (socket?.socket) {
          socket.socket.emit('presentation:slide-update', {
            presentationId: currentPresentation._id,
            slideNumber,
            updates
          });
        }
      }
    } catch (error) {
      console.error('Error updating slide:', error);
      toast.error('Failed to update slide');
    }
  };

  // Delete slide
  const handleDeleteSlide = async (slideNumber) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;
    
    try {
      const res = await api.delete(`/api/presentations/${currentPresentation._id}/slides/${slideNumber}`);
      if (res.data.success) {
        setCurrentPresentation(res.data.presentation);
        setCurrentSlideIndex(Math.min(currentSlideIndex, res.data.presentation.slides.length - 1));
        toast.success('Slide deleted!');
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Failed to delete slide');
    }
  };

  // Duplicate slide
  const handleDuplicateSlide = async (slideNumber) => {
    try {
      const res = await api.post(`/api/presentations/${currentPresentation._id}/slides/${slideNumber}/duplicate`);
      if (res.data.success) {
        setCurrentPresentation(res.data.presentation);
        setCurrentSlideIndex(res.data.presentation.slides.length - 1);
        toast.success('Slide duplicated!');
      }
    } catch (error) {
      console.error('Error duplicating slide:', error);
      toast.error('Failed to duplicate slide');
    }
  };

  // Upload image
  const handleUploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await api.post(`/api/presentations/${currentPresentation._id}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (res.data.success) {
        const imageUrl = res.data.imageUrl;
        const currentSlide = currentPresentation.slides[currentSlideIndex];
        
        // Add image to slide content
        const imageHtml = `<img src="${imageUrl}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`;
        const newContent = currentSlide.content 
          ? `${currentSlide.content}<br/>${imageHtml}` 
          : imageHtml;
        
        await handleUpdateSlide(currentSlideIndex, { content: newContent });
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  // Handle image input
  const handleImageInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      handleUploadImage(file);
    }
    e.target.value = ''; // Reset input
  };

  // Element handlers
  const handleAddElement = async (elementType, elementData) => {
    try {
      const endpoint = `/api/presentations/${currentPresentation._id}/slides/${currentSlideIndex}/${elementType}`;
      const res = await api.post(endpoint, elementData);
      if (res.data.success) {
        setCurrentPresentation(res.data.presentation);
        toast.success(`${elementType} added successfully`);
        // Close modal
        if (elementType === 'text-boxes') setShowTextBoxModal(false);
        else if (elementType === 'shapes') setShowShapeModal(false);
        else if (elementType === 'icons') setShowIconModal(false);
        else if (elementType === 'charts') setShowChartModal(false);
        else if (elementType === 'tables') setShowTableModal(false);
        else if (elementType === 'equations') setShowEquationModal(false);
        else if (elementType === 'symbols') setShowSymbolModal(false);
        else if (elementType === 'smart-art') setShowSmartArtModal(false);
      }
    } catch (error) {
      console.error(`Error adding ${elementType}:`, error);
      toast.error(`Failed to add ${elementType}`);
    }
  };

  const handleUpdateElement = async (elementType, elementId, updates) => {
    try {
      const endpoint = `/api/presentations/${currentPresentation._id}/slides/${currentSlideIndex}/${elementType}/${elementId}`;
      const res = await api.put(endpoint, updates);
      if (res.data.success) {
        setCurrentPresentation(res.data.presentation);
        toast.success(`${elementType} updated successfully`);
      }
    } catch (error) {
      console.error(`Error updating ${elementType}:`, error);
      toast.error(`Failed to update ${elementType}`);
    }
  };

  const _handleDeleteElement = async (elementType, elementId) => {
    try {
      const endpoint = `/api/presentations/${currentPresentation._id}/slides/${currentSlideIndex}/${elementType}/${elementId}`;
      const res = await api.delete(endpoint);
      if (res.data.success) {
        setCurrentPresentation(res.data.presentation);
        toast.success(`${elementType} deleted successfully`);
        setSelectedElement(null);
      }
    } catch (error) {
      console.error(`Error deleting ${elementType}:`, error);
      toast.error(`Failed to delete ${elementType}`);
    }
  };

  // Real-time element updates
  useEffect(() => {
    if (!socket?.socket || !currentPresentation) return;

    const handleElementAdded = (data) => {
      if (data.presentationId === currentPresentation._id && data.slideNumber === currentSlideIndex) {
        setCurrentPresentation(prev => {
          const updated = { ...prev };
          const slide = updated.slides[data.slideNumber];
          if (slide && !slide[data.elementType]) {
            slide[data.elementType] = [];
          }
          if (slide && slide[data.elementType]) {
            slide[data.elementType].push(data.element);
          }
          return updated;
        });
      }
    };

    const handleElementUpdated = (data) => {
      if (data.presentationId === currentPresentation._id && data.slideNumber === currentSlideIndex) {
        setCurrentPresentation(prev => {
          const updated = { ...prev };
          const slide = updated.slides[data.slideNumber];
          if (slide && slide[data.elementType]) {
            const index = slide[data.elementType].findIndex(el => el.id === data.elementId);
            if (index !== -1) {
              slide[data.elementType][index] = { ...slide[data.elementType][index], ...data.updates };
            }
          }
          return updated;
        });
      }
    };

    const handleElementDeleted = (data) => {
      if (data.presentationId === currentPresentation._id && data.slideNumber === currentSlideIndex) {
        setCurrentPresentation(prev => {
          const updated = { ...prev };
          const slide = updated.slides[data.slideNumber];
          if (slide && slide[data.elementType]) {
            slide[data.elementType] = slide[data.elementType].filter(el => el.id !== data.elementId);
          }
          return updated;
        });
      }
    };

    socket.socket.on('slide:element:added', handleElementAdded);
    socket.socket.on('slide:element:updated', handleElementUpdated);
    socket.socket.on('slide:element:deleted', handleElementDeleted);

    return () => {
      socket.socket.off('slide:element:added', handleElementAdded);
      socket.socket.off('slide:element:updated', handleElementUpdated);
      socket.socket.off('slide:element:deleted', handleElementDeleted);
    };
  }, [socket, currentPresentation, currentSlideIndex]);

  // Reorder slides
  const handleReorderSlides = async (fromIndex, toIndex) => {
    try {
      const slides = [...currentPresentation.slides];
      const [movedSlide] = slides.splice(fromIndex, 1);
      slides.splice(toIndex, 0, movedSlide);
      
      const slideOrder = slides.map((_, index) => index);
      
      const res = await api.post(`/api/presentations/${currentPresentation._id}/reorder-slides`, {
        slideOrder
      });
      
      if (res.data.success) {
        setCurrentPresentation(res.data.presentation);
        setCurrentSlideIndex(toIndex);
        toast.success('Slides reordered!');
      }
    } catch (error) {
      console.error('Error reordering slides:', error);
      toast.error('Failed to reorder slides');
    }
  };

  // Start presentation
  const handleStartPresentation = async () => {
    try {
      const res = await api.post(`/api/presentations/${currentPresentation._id}/start`);
      if (res.data.success) {
        setView('present');
        if (socket?.socket) {
          socket.socket.emit('presentation:start', { presentationId: currentPresentation._id });
        }
        toast.success('Presentation started!');
      }
    } catch (error) {
      console.error('Error starting presentation:', error);
      toast.error('Failed to start presentation');
    }
  };

  // Change slide
  const handleChangeSlide = async (newIndex) => {
    if (newIndex < 0 || newIndex >= currentPresentation.slides.length) return;
    
    setCurrentSlideIndex(newIndex);
    
    if (socket?.socket) {
      socket.socket.emit('presentation:change-slide', {
        presentationId: currentPresentation._id,
        slideNumber: newIndex
      });
    }
    
    try {
      await api.put(`/api/presentations/${currentPresentation._id}/slide`, { slideNumber: newIndex });
    } catch (error) {
      console.error('Error updating slide:', error);
    }
  };

  // Stop presentation
  const handleStopPresentation = async () => {
    try {
      const res = await api.post(`/api/presentations/${currentPresentation._id}/stop`);
      if (res.data.success) {
        setView('edit');
        if (socket?.socket) {
          socket.socket.emit('presentation:stop', { presentationId: currentPresentation._id });
        }
        toast.success('Presentation stopped!');
      }
    } catch (error) {
      console.error('Error stopping presentation:', error);
      toast.error('Failed to stop presentation');
    }
  };

  // Share presentation
  const handleShare = async () => {
    try {
      await handleUpdatePresentation({ isPublic: true, isPublished: true });
      const shareUrl = `${window.location.origin}/student/presentation/share/${currentPresentation.shareCode}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing presentation:', error);
      toast.error('Failed to share presentation');
    }
  };

  // Handle slide content change
  const handleSlideContentChange = (field, value) => {
    if (isUpdatingRef.current) return;
    
    const currentSlide = currentPresentation.slides[currentSlideIndex];
    const updates = {
      ...currentSlide,
      [field]: value
    };
    
    // Update local state immediately for better UX
    isUpdatingRef.current = true;
    const updatedSlides = [...currentPresentation.slides];
    updatedSlides[currentSlideIndex] = updates;
    setCurrentPresentation({
      ...currentPresentation,
      slides: updatedSlides
    });
    
    // Reset flag after state update
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 100);
    
    // Then save to backend (debounced)
    clearTimeout(handleSlideContentChange.saveTimeout);
    handleSlideContentChange.saveTimeout = setTimeout(() => {
      handleUpdateSlide(currentSlideIndex, updates);
    }, 1000);
  };

  // Render PowerPoint-like editor
  const renderSlideEditor = () => {
    if (!currentPresentation) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-600">Loading...</div>
        </div>
      );
    }

    if (currentPresentation.slides.length === 0) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Presentation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No slides yet. Add your first slide!</p>
            <button
              onClick={() => handleAddSlide('title')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Title Slide
            </button>
          </div>
        </div>
      );
    }

    const currentSlide = currentPresentation.slides[currentSlideIndex];
    
    // Safety check: if currentSlide is undefined, use default values
    if (!currentSlide) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-600">Loading slide...</div>
        </div>
      );
    }
    
    const aspectRatio = 16 / 9;
    const slideWidth = 960;
    const slideHeight = slideWidth / aspectRatio;

    return (
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Top Toolbar (PowerPoint-like) */}
        <div className="bg-white border-b shadow-sm">
          {/* Main Menu Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setView('list');
                  navigate('/student/presentation');
                }}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={currentPresentation.title}
                onChange={(e) => handleUpdatePresentation({ title: e.target.value })}
                className="text-lg font-semibold border-none outline-none bg-transparent px-2 py-1 hover:bg-gray-50 rounded"
                placeholder="Presentation Title"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                title="Create New Presentation"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <button
                onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
                className="px-3 py-1 text-sm hover:bg-gray-100 rounded"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm px-2">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(200, prev + 10))}
                className="px-3 py-1 text-sm hover:bg-gray-100 rounded"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <button
                onClick={handleStartPresentation}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Presenting
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 px-4 py-2 border-b">
            {/* Text Formatting */}
            <div className="flex items-center gap-1 border-r pr-2 mr-2">
              <button
                onClick={() => execCommand('bold')}
                className={`p-2 rounded hover:bg-gray-100 ${selectedTextFormat.bold ? 'bg-gray-200' : ''}`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('italic')}
                className={`p-2 rounded hover:bg-gray-100 ${selectedTextFormat.italic ? 'bg-gray-200' : ''}`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('underline')}
                className={`p-2 rounded hover:bg-gray-100 ${selectedTextFormat.underline ? 'bg-gray-200' : ''}`}
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-1 border-r pr-2 mr-2">
              <select
                value={selectedTextFormat.fontSize}
                onChange={(e) => execCommand('fontSize', e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                {fontSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Text Color */}
            <div className="flex items-center gap-1 border-r pr-2 mr-2">
              <input
                type="color"
                value={selectedTextFormat.color}
                onChange={(e) => execCommand('foreColor', e.target.value)}
                className="w-8 h-8 border rounded cursor-pointer"
                title="Text Color"
              />
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 border-r pr-2 mr-2">
              <button
                onClick={() => execCommand('justifyLeft')}
                className={`p-2 rounded hover:bg-gray-100 ${selectedTextFormat.align === 'left' ? 'bg-gray-200' : ''}`}
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('justifyCenter')}
                className={`p-2 rounded hover:bg-gray-100 ${selectedTextFormat.align === 'center' ? 'bg-gray-200' : ''}`}
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('justifyRight')}
                className={`p-2 rounded hover:bg-gray-100 ${selectedTextFormat.align === 'right' ? 'bg-gray-200' : ''}`}
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-1 border-r pr-2 mr-2">
              <button
                onClick={() => execCommand('insertUnorderedList')}
                className="p-2 rounded hover:bg-gray-100"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('insertOrderedList')}
                className="p-2 rounded hover:bg-gray-100"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
            </div>

            {/* Insert Menu */}
            <div className="relative">
              <button
                onClick={() => setShowInsertMenu(!showInsertMenu)}
                className="px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
              >
                Insert
                <ChevronDown className="w-4 h-4" />
              </button>
              {showInsertMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 w-56 max-h-96 overflow-y-auto">
                  <label className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer border-b">
                    <ImageIcon className="w-4 h-4" />
                    Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageInput}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => {
                      setShowInsertMenu(false);
                      setShowTextBoxModal(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <TypeIcon className="w-4 h-4" />
                    Text Box
                  </button>
                  <button
                    onClick={() => {
                      setShowInsertMenu(false);
                      setShowShapeModal(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Shapes className="w-4 h-4" />
                    Shapes & Lines
                  </button>
                  <button
                    onClick={() => {
                      setShowInsertMenu(false);
                      setShowIconModal(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Icons
                  </button>
                  <button
                    onClick={() => {
                      setShowInsertMenu(false);
                      setShowChartModal(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Presentation className="w-4 h-4" />
                    Charts & Graphs
                  </button>
                  <button
                    onClick={() => {
                      setShowInsertMenu(false);
                      setShowTableModal(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Table className="w-4 h-4" />
                    Table
                  </button>
                  <button
                    onClick={() => {
                      setShowInsertMenu(false);
                      setShowSmartArtModal(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Layout className="w-4 h-4" />
                    SmartArt
                  </button>
                  <button
                    onClick={() => {
                      setShowInsertMenu(false);
                      setShowEquationModal(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Type className="w-4 h-4" />
                    Equation
                  </button>
                  <button
                    onClick={() => {
                      setShowInsertMenu(false);
                      setShowSymbolModal(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    Symbols
                  </button>
                  <button
                    onClick={() => {
                      setShowInsertMenu(false);
                      toast.info('Video upload coming soon!');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 border-t"
                  >
                    <Film className="w-4 h-4" />
                    Video
                  </button>
                </div>
              )}
            </div>

            {/* Slide Layout */}
            <div className="relative ml-2">
              <div className="relative">
                <button
                  onClick={() => setShowInsertMenu(false)}
                  className="px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
                  title="Layout Presets"
                >
                  <Layout className="w-4 h-4" />
                  Layout
                  <ChevronDown className="w-3 h-3" />
                </button>
                {/* Layout dropdown will be added here */}
              </div>
            </div>
            
            {/* Settings Button */}
            <div className="relative ml-2">
              <button
                onClick={() => setShowMetadataModal(true)}
                className="px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
                title="Headers, Footers & Numbering"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Slides Thumbnail Panel (Left) */}
          <div className="w-64 bg-gray-50 border-r overflow-y-auto">
            <div className="p-4 border-b bg-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm">Slides</h3>
                <button
                  onClick={() => handleAddSlide('content')}
                  className="p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  title="Add Slide"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-2 space-y-2">
              {currentPresentation.slides.map((slide, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => {
                    setDraggedSlideIndex(index);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedSlideIndex !== null && draggedSlideIndex !== index) {
                      handleReorderSlides(draggedSlideIndex, index);
                    }
                    setDraggedSlideIndex(null);
                  }}
                  onClick={() => handleChangeSlide(index)}
                  className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                    index === currentSlideIndex
                      ? 'border-indigo-600 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${draggedSlideIndex === index ? 'opacity-50' : ''}`}
                  style={{
                    aspectRatio: '16/9',
                    background: slide.backgroundColor || '#FFFFFF'
                  }}
                >
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                  <div className="p-4 h-full flex flex-col justify-center">
                    <div
                      className="text-sm font-semibold mb-1"
                      style={{ color: slide.textColor || '#000000' }}
                    >
                      {slide.title || 'Untitled'}
                    </div>
                    <div
                      className="text-xs line-clamp-2"
                      style={{ color: slide.textColor || '#000000', opacity: 0.8 }}
                    >
                      {slide.content?.substring(0, 50) || 'No content'}
                    </div>
                  </div>
                  {index === currentSlideIndex && (
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateSlide(index);
                        }}
                        className="p-1 bg-white rounded shadow hover:bg-gray-100"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Center Slide Editor */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto bg-gray-200">
            <div
              className="bg-white shadow-2xl rounded-lg"
              style={{
                width: `${slideWidth * (zoomLevel / 100)}px`,
                height: `${slideHeight * (zoomLevel / 100)}px`,
                aspectRatio: '16/9'
              }}
            >
              <div
                className="w-full h-full p-12 relative"
                style={{
                  backgroundColor: currentSlide.backgroundColor || '#FFFFFF',
                  backgroundImage: currentSlide.backgroundImage || 'none'
                }}
              >
                {/* Header Display */}
                {currentPresentation.headers?.enabled && currentSlide.showHeader && (
                  <div
                    className="absolute top-0 left-0 right-0 px-12 py-2 border-b bg-white/80"
                    style={{
                      fontSize: `${currentPresentation.headers.fontSize || 12}px`,
                      color: currentPresentation.headers.color || '#666666',
                      textAlign: currentPresentation.headers.position === 'top-left' ? 'left' :
                                 currentPresentation.headers.position === 'top-right' ? 'right' : 'center'
                    }}
                  >
                    {currentSlide.headerText || currentPresentation.headers.text || ''}
                  </div>
                )}
                
                {/* Slide Number Display */}
                {currentPresentation.numbering?.enabled && currentSlide.showSlideNumber && (
                  <div
                    className="absolute bg-white/80 px-2 py-1 rounded"
                    style={{
                      fontSize: `${currentPresentation.numbering.fontSize || 14}px`,
                      color: currentPresentation.numbering.color || '#666666',
                      ...(currentPresentation.numbering.position === 'bottom-right' ? { bottom: '8px', right: '16px' } :
                          currentPresentation.numbering.position === 'bottom-left' ? { bottom: '8px', left: '16px' } :
                          currentPresentation.numbering.position === 'bottom-center' ? { bottom: '8px', left: '50%', transform: 'translateX(-50%)' } :
                          currentPresentation.numbering.position === 'top-right' ? { top: '8px', right: '16px' } :
                          currentPresentation.numbering.position === 'top-left' ? { top: '8px', left: '16px' } :
                          { top: '8px', left: '50%', transform: 'translateX(-50%)' })
                    }}
                  >
                    {(currentSlideIndex + (currentPresentation.numbering.startFrom || 1))}
                  </div>
                )}
                
                {/* Title Editor */}
                <div
                  contentEditable
                  ref={titleRef}
                  onBlur={(e) => {
                    const title = e.target.textContent || e.target.innerText || '';
                    if (title !== currentSlide.title) {
                      handleSlideContentChange('title', title);
                    }
                  }}
                  onInput={updateTextFormat}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      contentRef.current?.focus();
                    }
                  }}
                  className="outline-none mb-4 cursor-text"
                  style={{
                    fontSize: currentSlide.titleSize || 44,
                    fontWeight: 'bold',
                    color: currentSlide.titleColor || currentSlide.textColor || '#000000',
                    textAlign: currentSlide.layout === 'centered' ? 'center' : 'left',
                    minHeight: '60px'
                  }}
                  suppressContentEditableWarning={true}
                >
                  {currentSlide.title || 'Click to add title'}
                </div>

                {/* Content Editor */}
                <div
                  contentEditable
                  ref={contentRef}
                  onBlur={(e) => {
                    isUpdatingRef.current = false;
                    const content = e.target.innerHTML || '';
                    if (content !== currentSlide.content) {
                      handleSlideContentChange('content', content);
                    }
                  }}
                  onFocus={() => {
                    isUpdatingRef.current = true;
                  }}
                  onInput={(e) => {
                    isUpdatingRef.current = true;
                    updateTextFormat();
                    // Auto-save with debounce
                    clearTimeout(contentRef.current?.saveTimeout);
                    contentRef.current.saveTimeout = setTimeout(() => {
                      const content = e.target.innerHTML || '';
                      if (content !== currentSlide.content) {
                        handleSlideContentChange('content', content);
                      }
                    }, 1000);
                  }}
                  className="outline-none flex-1 cursor-text"
                  style={{
                    fontSize: currentSlide.fontSize || 24,
                    color: currentSlide.textColor || '#000000',
                    textAlign: currentSlide.layout === 'centered' ? 'center' : 'left',
                    minHeight: '300px',
                    lineHeight: '1.6'
                  }}
                  suppressContentEditableWarning={true}
                />
                
                {/* Render Slide Elements */}
                {/* Text Boxes */}
                {currentSlide.textBoxes?.map((textBox) => (
                  <div
                    key={textBox.id}
                    draggable
                    onDragStart={() => {
                      setSelectedElement(textBox);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElement(textBox);
                    }}
                    className="absolute cursor-move border-2 border-dashed border-transparent hover:border-indigo-500"
                    style={{
                      left: `${textBox.position?.x || 0}px`,
                      top: `${textBox.position?.y || 0}px`,
                      width: `${textBox.size?.width || 200}px`,
                      height: `${textBox.size?.height || 100}px`,
                      zIndex: textBox.zIndex || 0,
                      ...textBox.style,
                      padding: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      contentEditable
                      onBlur={(e) => {
                        handleUpdateElement('text-boxes', textBox.id, {
                          content: e.target.textContent || ''
                        });
                      }}
                      suppressContentEditableWarning={true}
                      style={{
                        width: '100%',
                        height: '100%',
                        outline: 'none'
                      }}
                    >
                      {textBox.content || 'Click to edit'}
                    </div>
                  </div>
                ))}
                
                {/* Shapes */}
                {currentSlide.shapes?.map((shape) => (
                  <div
                    key={shape.id}
                    draggable
                    onDragStart={() => {
                      setSelectedElement(shape);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElement(shape);
                    }}
                    className="absolute cursor-move border-2 border-dashed border-transparent hover:border-indigo-500"
                    style={{
                      left: `${shape.position?.x || 0}px`,
                      top: `${shape.position?.y || 0}px`,
                      width: `${shape.size?.width || 200}px`,
                      height: `${shape.size?.height || 200}px`,
                      zIndex: shape.zIndex || 0,
                      backgroundColor: shape.style?.fill || 'transparent',
                      borderColor: shape.style?.stroke || '#000000',
                      borderWidth: `${shape.style?.strokeWidth || 2}px`,
                      opacity: shape.style?.opacity || 1,
                      transform: `rotate(${shape.style?.rotation || 0}deg)`,
                      borderRadius: shape.type === 'circle' || shape.type === 'ellipse' ? '50%' : '0'
                    }}
                  />
                ))}
                
                {/* Images with edit capability */}
                {currentSlide.images?.map((image, idx) => (
                  <div
                    key={idx}
                    draggable
                    onDragStart={() => {
                      setSelectedElement(image);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElement(image);
                      setShowImageEditModal(true);
                    }}
                    className="absolute cursor-move border-2 border-dashed border-transparent hover:border-indigo-500"
                    style={{
                      left: `${image.position?.x || 0}px`,
                      top: `${image.position?.y || 0}px`,
                      width: `${image.size?.width || 200}px`,
                      height: `${image.size?.height || 200}px`,
                      zIndex: image.zIndex || 0
                    }}
                  >
                    <img
                      src={image.processedUrl || image.url}
                      alt={image.alt || 'Slide image'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
                
                {/* Footer Display */}
                {currentPresentation.footers?.enabled && currentSlide.showFooter && (
                  <div
                    className="absolute bottom-0 left-0 right-0 px-12 py-2 border-t bg-white/80"
                    style={{
                      fontSize: `${currentPresentation.footers.fontSize || 12}px`,
                      color: currentPresentation.footers.color || '#666666',
                      textAlign: currentPresentation.footers.position === 'bottom-left' ? 'left' :
                                 currentPresentation.footers.position === 'bottom-right' ? 'right' : 'center'
                    }}
                  >
                    {currentSlide.footerText || currentPresentation.footers.text || ''}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Properties Panel (Right) */}
          {showPropertiesPanel && (
            <div className="w-80 bg-white border-l overflow-y-auto">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Properties</h3>
                  <button
                    onClick={() => setShowPropertiesPanel(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Slide Layout */}
                <div>
                  <label className="block text-sm font-medium mb-2">Slide Layout</label>
                  <select
                    value={currentSlide.layout || 'left'}
                    onChange={(e) => handleUpdateSlide(currentSlideIndex, { layout: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {layoutPresets.map((preset) => (
                      <option key={preset.value} value={preset.value}>{preset.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Master Slide Selection */}
                {currentPresentation.masterSlides && currentPresentation.masterSlides.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Master Layout</label>
                    <select
                      value={currentSlide.masterLayoutId || 'default'}
                      onChange={(e) => handleUpdateSlide(currentSlideIndex, { masterLayoutId: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="default">Default</option>
                      {currentPresentation.masterSlides.map((master, idx) => (
                        <option key={idx} value={master.name}>{master.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Background Color */}
                <div>
                  <label className="block text-sm font-medium mb-2">Background Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={currentSlide.backgroundColor || '#FFFFFF'}
                      onChange={(e) => handleUpdateSlide(currentSlideIndex, { backgroundColor: e.target.value })}
                      className="w-12 h-12 border rounded cursor-pointer"
                    />
                    <div className="flex-1 grid grid-cols-5 gap-1">
                      {colorPalette.map((color, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleUpdateSlide(currentSlideIndex, { backgroundColor: color })}
                          className="w-8 h-8 border rounded hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={currentSlide.textColor || '#000000'}
                      onChange={(e) => handleUpdateSlide(currentSlideIndex, { textColor: e.target.value })}
                      className="w-12 h-12 border rounded cursor-pointer"
                    />
                    <div className="flex-1 grid grid-cols-5 gap-1">
                      {colorPalette.map((color, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleUpdateSlide(currentSlideIndex, { textColor: color })}
                          className="w-8 h-8 border rounded hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium mb-2">Font Size</label>
                  <select
                    value={currentSlide.fontSize || 24}
                    onChange={(e) => handleUpdateSlide(currentSlideIndex, { fontSize: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {fontSizes.map(size => (
                      <option key={size} value={size}>{size}px</option>
                    ))}
                  </select>
                </div>

                {/* Slide Actions */}
                <div className="pt-4 border-t">
                  <button
                    onClick={() => handleDuplicateSlide(currentSlideIndex)}
                    className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg mb-2 flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate Slide
                  </button>
                  <button
                    onClick={() => handleDeleteSlide(currentSlideIndex)}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Slide
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Show Properties Panel Button */}
          {!showPropertiesPanel && (
            <button
              onClick={() => setShowPropertiesPanel(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border rounded-l-lg px-2 py-4 shadow-lg hover:bg-gray-50"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-white border-t px-4 py-2 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>Slide {currentSlideIndex + 1} of {currentPresentation.slides.length}</span>
            <span>•</span>
            <span>{currentPresentation.slides.length} slides</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleChangeSlide(currentSlideIndex - 1)}
              disabled={currentSlideIndex === 0}
              className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleChangeSlide(currentSlideIndex + 1)}
              disabled={currentSlideIndex === currentPresentation.slides.length - 1}
              className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render presenter view
  const renderPresenterView = () => {
    if (!currentPresentation || currentPresentation.slides.length === 0) return null;

    const currentSlide = currentPresentation.slides[currentSlideIndex];
    
    if (!currentSlide) {
      return (
        <div className="flex items-center justify-center h-screen bg-black">
          <div className="text-white">No slide available</div>
        </div>
      );
    }

    return (
      <div className="h-screen flex flex-col bg-black">
        {/* Presenter Controls */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                handleStopPresentation();
                setView('edit');
              }}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
            >
              Exit
            </button>
            <div className="text-sm">
              Slide {currentSlideIndex + 1} of {currentPresentation.slides.length}
            </div>
          </div>
          <div className="text-xl font-bold">{currentPresentation.title}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleChangeSlide(currentSlideIndex - 1)}
              disabled={currentSlideIndex === 0}
              className="p-2 bg-gray-800 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleChangeSlide(currentSlideIndex + 1)}
              disabled={currentSlideIndex === currentPresentation.slides.length - 1}
              className="p-2 bg-gray-800 rounded-lg disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Display */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div
            className="rounded-lg shadow-2xl p-12 max-w-6xl w-full min-h-[600px] relative"
            style={{
              backgroundColor: currentSlide.backgroundColor || '#FFFFFF',
              aspectRatio: '16/9'
            }}
          >
            {/* Header in Presenter View */}
            {currentPresentation.headers?.enabled && currentSlide.showHeader && (
              <div
                className="absolute top-0 left-0 right-0 px-12 py-2 border-b"
                style={{
                  fontSize: `${currentPresentation.headers.fontSize || 12}px`,
                  color: currentPresentation.headers.color || '#666666',
                  textAlign: currentPresentation.headers.position === 'top-left' ? 'left' :
                             currentPresentation.headers.position === 'top-right' ? 'right' : 'center'
                }}
              >
                {currentSlide.headerText || currentPresentation.headers.text || ''}
              </div>
            )}
            
            {/* Slide Number in Presenter View */}
            {currentPresentation.numbering?.enabled && currentSlide.showSlideNumber && (
              <div
                className="absolute px-2 py-1 rounded bg-black/50 text-white"
                style={{
                  fontSize: `${currentPresentation.numbering.fontSize || 14}px`,
                  ...(currentPresentation.numbering.position === 'bottom-right' ? { bottom: '8px', right: '16px' } :
                      currentPresentation.numbering.position === 'bottom-left' ? { bottom: '8px', left: '16px' } :
                      currentPresentation.numbering.position === 'bottom-center' ? { bottom: '8px', left: '50%', transform: 'translateX(-50%)' } :
                      currentPresentation.numbering.position === 'top-right' ? { top: '8px', right: '16px' } :
                      currentPresentation.numbering.position === 'top-left' ? { top: '8px', left: '16px' } :
                      { top: '8px', left: '50%', transform: 'translateX(-50%)' })
                }}
              >
                {(currentSlideIndex + (currentPresentation.numbering.startFrom || 1))}
              </div>
            )}
            
            <h2
              className="mb-6"
              style={{
                fontSize: currentSlide.titleSize || 56,
                fontWeight: 'bold',
                color: currentSlide.titleColor || currentSlide.textColor || '#000000',
                textAlign: currentSlide.layout === 'centered' ? 'center' : 'left',
                marginTop: currentPresentation.headers?.enabled ? '48px' : '0'
              }}
            >
              {currentSlide.title || 'Untitled'}
            </h2>
            <div
              className="whitespace-pre-wrap"
              style={{
                fontSize: currentSlide.fontSize || 32,
                color: currentSlide.textColor || '#000000',
                textAlign: currentSlide.layout === 'centered' ? 'center' : 'left'
              }}
              dangerouslySetInnerHTML={{ __html: currentSlide.content || '' }}
            />
            
            {/* Footer in Presenter View */}
            {currentPresentation.footers?.enabled && currentSlide.showFooter && (
              <div
                className="absolute bottom-0 left-0 right-0 px-12 py-2 border-t"
                style={{
                  fontSize: `${currentPresentation.footers.fontSize || 12}px`,
                  color: currentPresentation.footers.color || '#666666',
                  textAlign: currentPresentation.footers.position === 'bottom-left' ? 'left' :
                             currentPresentation.footers.position === 'bottom-right' ? 'right' : 'center'
                }}
              >
                {currentSlide.footerText || currentPresentation.footers.text || ''}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render list view
  const renderListView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      );
    }

    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Presentations
              </h1>
              <p className="text-gray-600">Create and share your presentations</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Presentation
            </button>
          </div>

          {/* Presentations Grid */}
          {presentations.length === 0 ? (
            <div className="text-center py-20">
              <Presentation className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No presentations yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create Your First Presentation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {presentations.map((pres) => (
                <motion.div
                  key={pres._id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer border-2 border-gray-200 hover:border-indigo-500"
                  onClick={() => navigate(`/student/presentation/${pres._id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{pres.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/student/presentation/${pres._id}`);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePresentation(pres._id);
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{pres.description || 'No description'}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{pres.slides?.length || 0} slides</span>
                    <span>{new Date(pres.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Create Modal with Template Selection */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-8 max-w-4xl w-full my-8"
            >
              <h2 className="text-2xl font-bold mb-6">Create New Presentation</h2>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Presentation Title"
                    value={newPresentation.title}
                    onChange={(e) => setNewPresentation({ ...newPresentation, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={newPresentation.description}
                    onChange={(e) => setNewPresentation({ ...newPresentation, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>
                
                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Choose Theme</label>
                  <div className="grid grid-cols-5 gap-3">
                    {themes.map((theme) => (
                      <button
                        key={theme.value}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setNewPresentation(prev => ({ ...prev, theme: theme.value }));
                        }}
                        className={`p-3 border-2 rounded-lg hover:border-indigo-500 transition-all cursor-pointer ${
                          newPresentation.theme === theme.value ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-300' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex gap-1 mb-2 justify-center">
                          <div 
                            className="w-4 h-4 rounded border border-gray-300" 
                            style={{ backgroundColor: theme.colors[0] }}
                          />
                          <div 
                            className="w-4 h-4 rounded border border-gray-300" 
                            style={{ backgroundColor: theme.colors[1] }}
                          />
                        </div>
                        <div className="text-xs font-medium text-center">{theme.name}</div>
                      </button>
                    ))}
                  </div>
                  {newPresentation.theme && (
                    <div className="mt-2 text-xs text-gray-600">
                      Selected: <span className="font-semibold">{themes.find(t => t.value === newPresentation.theme)?.name || newPresentation.theme}</span>
                    </div>
                  )}
                </div>
                
                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Choose Template (Optional)
                    <button
                      onClick={() => setShowTemplateModal(true)}
                      className="ml-2 text-xs text-indigo-600 hover:underline"
                    >
                      Browse All Templates
                    </button>
                  </label>
                  {templatesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-gray-500">Loading templates...</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setNewPresentation(prev => ({ ...prev, templateId: null }));
                        }}
                        className={`p-4 border-2 rounded-lg hover:border-indigo-500 transition-all cursor-pointer ${
                          !newPresentation.templateId ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-300' : 'border-gray-200'
                        }`}
                        title="Start with a blank presentation"
                      >
                        <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <div className="text-xs font-medium">Blank</div>
                      </button>
                      {templates.length === 0 ? (
                        <div className="col-span-3 flex items-center justify-center py-4 text-gray-500 text-sm">
                          No templates available. Start with a blank presentation.
                        </div>
                      ) : (
                        templates.slice(0, 7).map((template) => (
                          <button
                            key={template._id}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setNewPresentation(prev => ({ ...prev, templateId: template._id }));
                            }}
                            className={`p-4 border-2 rounded-lg hover:border-indigo-500 transition-all cursor-pointer ${
                              newPresentation.templateId === template._id ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-300' : 'border-gray-200'
                            }`}
                            title={template.description || template.name}
                          >
                            <Presentation className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <div className="text-xs font-medium truncate">{template.name}</div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                  {newPresentation.templateId && (
                    <div className="mt-2 text-xs text-gray-600">
                      Selected Template: <span className="font-semibold">{templates.find(t => t._id === newPresentation.templateId)?.name || 'Template'}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCreatePresentation();
                  }}
                  disabled={!newPresentation.title || !newPresentation.title.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {newPresentation.title ? 'Create Presentation' : 'Enter Title to Create'}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowCreateModal(false);
                    setNewPresentation({ title: '', description: '', theme: 'default', templateId: null });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Template Browsing Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-8 max-w-5xl w-full my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Browse Templates</h2>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {templatesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">Loading templates...</div>
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-12">
                  <Presentation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No templates available yet.</p>
                  <p className="text-sm text-gray-500">You can start with a blank presentation or create your own template.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template._id}
                      onClick={() => {
                        setNewPresentation({ ...newPresentation, templateId: template._id });
                        setShowTemplateModal(false);
                      }}
                      className={`p-4 border-2 rounded-lg hover:border-indigo-500 transition-all text-left ${
                        newPresentation.templateId === template._id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                      }`}
                    >
                      <Presentation className="w-10 h-10 mb-3 text-gray-400" />
                      <div className="font-semibold mb-1 truncate">{template.name}</div>
                      {template.description && (
                        <div className="text-xs text-gray-600 line-clamp-2">{template.description}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        {template.category && (
                          <span className="capitalize">{template.category}</span>
                        )}
                        {template.usageCount > 0 && (
                          <span className="ml-2">• {template.usageCount} uses</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Metadata Modal (Headers, Footers, Numbering) */}
      <AnimatePresence>
        {showMetadataModal && currentPresentation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-8 max-w-2xl w-full my-8"
            >
              <h2 className="text-2xl font-bold mb-6">Slide Settings</h2>
              
              <div className="space-y-6">
                {/* Slide Numbering */}
                <div className="border-b pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold">Slide Numbering</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentPresentation.numbering?.enabled || false}
                        onChange={(e) => {
                          setCurrentPresentation({
                            ...currentPresentation,
                            numbering: {
                              ...currentPresentation.numbering,
                              enabled: e.target.checked
                            }
                          });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  {currentPresentation.numbering?.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Start From</label>
                        <input
                          type="number"
                          min="0"
                          value={currentPresentation.numbering.startFrom || 1}
                          onChange={(e) => {
                            setCurrentPresentation({
                              ...currentPresentation,
                              numbering: {
                                ...currentPresentation.numbering,
                                startFrom: parseInt(e.target.value) || 1
                              }
                            });
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Position</label>
                        <select
                          value={currentPresentation.numbering.position || 'bottom-right'}
                          onChange={(e) => {
                            setCurrentPresentation({
                              ...currentPresentation,
                              numbering: {
                                ...currentPresentation.numbering,
                                position: e.target.value
                              }
                            });
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="bottom-right">Bottom Right</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-center">Bottom Center</option>
                          <option value="top-right">Top Right</option>
                          <option value="top-left">Top Left</option>
                          <option value="top-center">Top Center</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Headers */}
                <div className="border-b pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold">Headers</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentPresentation.headers?.enabled || false}
                        onChange={(e) => {
                          setCurrentPresentation({
                            ...currentPresentation,
                            headers: {
                              ...currentPresentation.headers,
                              enabled: e.target.checked
                            }
                          });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  {currentPresentation.headers?.enabled && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Header Text</label>
                        <input
                          type="text"
                          value={currentPresentation.headers.text || ''}
                          onChange={(e) => {
                            setCurrentPresentation({
                              ...currentPresentation,
                              headers: {
                                ...currentPresentation.headers,
                                text: e.target.value
                              }
                            });
                          }}
                          placeholder="Enter header text"
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Position</label>
                          <select
                            value={currentPresentation.headers.position || 'top-center'}
                            onChange={(e) => {
                              setCurrentPresentation({
                                ...currentPresentation,
                                headers: {
                                  ...currentPresentation.headers,
                                  position: e.target.value
                                }
                              });
                            }}
                            className="w-full px-3 py-2 border rounded-lg"
                          >
                            <option value="top-left">Top Left</option>
                            <option value="top-center">Top Center</option>
                            <option value="top-right">Top Right</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Font Size</label>
                          <input
                            type="number"
                            min="8"
                            max="72"
                            value={currentPresentation.headers.fontSize || 12}
                            onChange={(e) => {
                              setCurrentPresentation({
                                ...currentPresentation,
                                headers: {
                                  ...currentPresentation.headers,
                                  fontSize: parseInt(e.target.value) || 12
                                }
                              });
                            }}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Footers */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold">Footers</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentPresentation.footers?.enabled || false}
                        onChange={(e) => {
                          setCurrentPresentation({
                            ...currentPresentation,
                            footers: {
                              ...currentPresentation.footers,
                              enabled: e.target.checked
                            }
                          });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  {currentPresentation.footers?.enabled && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Footer Text</label>
                        <input
                          type="text"
                          value={currentPresentation.footers.text || ''}
                          onChange={(e) => {
                            setCurrentPresentation({
                              ...currentPresentation,
                              footers: {
                                ...currentPresentation.footers,
                                text: e.target.value
                              }
                            });
                          }}
                          placeholder="Enter footer text"
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Position</label>
                          <select
                            value={currentPresentation.footers.position || 'bottom-center'}
                            onChange={(e) => {
                              setCurrentPresentation({
                                ...currentPresentation,
                                footers: {
                                  ...currentPresentation.footers,
                                  position: e.target.value
                                }
                              });
                            }}
                            className="w-full px-3 py-2 border rounded-lg"
                          >
                            <option value="bottom-left">Bottom Left</option>
                            <option value="bottom-center">Bottom Center</option>
                            <option value="bottom-right">Bottom Right</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Font Size</label>
                          <input
                            type="number"
                            min="8"
                            max="72"
                            value={currentPresentation.footers.fontSize || 12}
                            onChange={(e) => {
                              setCurrentPresentation({
                                ...currentPresentation,
                                footers: {
                                  ...currentPresentation.footers,
                                  fontSize: parseInt(e.target.value) || 12
                                }
                              });
                            }}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleUpdateMetadata}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Settings
                </button>
                <button
                  onClick={() => setShowMetadataModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Text Box Modal */}
      <AnimatePresence>
        {showTextBoxModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4">Add Text Box</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    id="textBoxContent"
                    placeholder="Enter text..."
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={4}
                    defaultValue={selectedElement?.content || ''}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Width</label>
                    <input
                      type="number"
                      id="textBoxWidth"
                      defaultValue={selectedElement?.size?.width || 200}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Height</label>
                    <input
                      type="number"
                      id="textBoxHeight"
                      defaultValue={selectedElement?.size?.height || 100}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Font Size</label>
                  <input
                    type="number"
                    id="textBoxFontSize"
                    defaultValue={selectedElement?.style?.fontSize || 16}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <input
                    type="color"
                    id="textBoxColor"
                    defaultValue={selectedElement?.style?.color || '#000000'}
                    className="w-full h-10 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    const content = document.getElementById('textBoxContent')?.value || '';
                    const width = parseInt(document.getElementById('textBoxWidth')?.value || 200);
                    const height = parseInt(document.getElementById('textBoxHeight')?.value || 100);
                    const fontSize = parseInt(document.getElementById('textBoxFontSize')?.value || 16);
                    const color = document.getElementById('textBoxColor')?.value || '#000000';
                    
                    if (selectedElement) {
                      handleUpdateElement('text-boxes', selectedElement.id, {
                        content,
                        size: { width, height },
                        style: { ...selectedElement.style, fontSize, color }
                      });
                    } else {
                      handleAddElement('text-boxes', {
                        content,
                        position: { x: 100, y: 100 },
                        size: { width, height },
                        style: {
                          fontSize,
                          fontFamily: 'Arial',
                          color,
                          backgroundColor: 'transparent',
                          borderColor: '#000000',
                          borderWidth: 1,
                          borderRadius: 0,
                          textAlign: 'left',
                          fontWeight: 'normal',
                          fontStyle: 'normal',
                          textDecoration: 'none'
                        }
                      });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {selectedElement ? 'Update' : 'Add'} Text Box
                </button>
                <button
                  onClick={() => {
                    setShowTextBoxModal(false);
                    setSelectedElement(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Shape Modal */}
      <AnimatePresence>
        {showShapeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4">Add Shape</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Shape Type</label>
                  <select
                    id="shapeType"
                    defaultValue={selectedElement?.type || 'rectangle'}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="rectangle">Rectangle</option>
                    <option value="circle">Circle</option>
                    <option value="ellipse">Ellipse</option>
                    <option value="triangle">Triangle</option>
                    <option value="line">Line</option>
                    <option value="arrow">Arrow</option>
                    <option value="star">Star</option>
                    <option value="heart">Heart</option>
                    <option value="diamond">Diamond</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Width</label>
                    <input
                      type="number"
                      id="shapeWidth"
                      defaultValue={selectedElement?.size?.width || 200}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Height</label>
                    <input
                      type="number"
                      id="shapeHeight"
                      defaultValue={selectedElement?.size?.height || 200}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fill Color</label>
                  <input
                    type="color"
                    id="shapeFill"
                    defaultValue={selectedElement?.style?.fill || '#3b82f6'}
                    className="w-full h-10 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stroke Color</label>
                  <input
                    type="color"
                    id="shapeStroke"
                    defaultValue={selectedElement?.style?.stroke || '#1e40af'}
                    className="w-full h-10 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stroke Width</label>
                  <input
                    type="number"
                    id="shapeStrokeWidth"
                    defaultValue={selectedElement?.style?.strokeWidth || 2}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    const type = document.getElementById('shapeType')?.value || 'rectangle';
                    const width = parseInt(document.getElementById('shapeWidth')?.value || 200);
                    const height = parseInt(document.getElementById('shapeHeight')?.value || 200);
                    const fill = document.getElementById('shapeFill')?.value || '#3b82f6';
                    const stroke = document.getElementById('shapeStroke')?.value || '#1e40af';
                    const strokeWidth = parseInt(document.getElementById('shapeStrokeWidth')?.value || 2);
                    
                    if (selectedElement) {
                      handleUpdateElement('shapes', selectedElement.id, {
                        type,
                        size: { width, height },
                        style: { ...selectedElement.style, fill, stroke, strokeWidth }
                      });
                    } else {
                      handleAddElement('shapes', {
                        type,
                        position: { x: 100, y: 100 },
                        size: { width, height },
                        style: {
                          fill,
                          stroke,
                          strokeWidth,
                          opacity: 1,
                          rotation: 0
                        }
                      });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {selectedElement ? 'Update' : 'Add'} Shape
                </button>
                <button
                  onClick={() => {
                    setShowShapeModal(false);
                    setSelectedElement(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Chart Modal */}
      <AnimatePresence>
        {showChartModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full my-8"
            >
              <h3 className="text-xl font-bold mb-4">Add Chart</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Chart Type</label>
                  <select
                    id="chartType"
                    defaultValue={selectedElement?.type || 'bar'}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="doughnut">Doughnut Chart</option>
                    <option value="area">Area Chart</option>
                    <option value="radar">Radar Chart</option>
                    <option value="scatter">Scatter Plot</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Chart Title</label>
                  <input
                    type="text"
                    id="chartTitle"
                    placeholder="Chart Title"
                    defaultValue={selectedElement?.data?.datasets?.[0]?.label || 'Chart'}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Labels (comma-separated)</label>
                  <input
                    type="text"
                    id="chartLabels"
                    placeholder="Jan, Feb, Mar, Apr"
                    defaultValue={selectedElement?.data?.labels?.join(', ') || 'Jan, Feb, Mar, Apr'}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Data Values (comma-separated)</label>
                  <input
                    type="text"
                    id="chartData"
                    placeholder="10, 20, 30, 40"
                    defaultValue={selectedElement?.data?.datasets?.[0]?.data?.join(', ') || '10, 20, 30, 40'}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Width</label>
                    <input
                      type="number"
                      id="chartWidth"
                      defaultValue={selectedElement?.size?.width || 400}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Height</label>
                    <input
                      type="number"
                      id="chartHeight"
                      defaultValue={selectedElement?.size?.height || 300}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    const type = document.getElementById('chartType')?.value || 'bar';
                    const title = document.getElementById('chartTitle')?.value || 'Chart';
                    const labels = document.getElementById('chartLabels')?.value.split(',').map(s => s.trim()) || [];
                    const data = document.getElementById('chartData')?.value.split(',').map(s => parseFloat(s.trim()) || 0) || [];
                    const width = parseInt(document.getElementById('chartWidth')?.value || 400);
                    const height = parseInt(document.getElementById('chartHeight')?.value || 300);
                    
                    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];
                    
                    if (selectedElement) {
                      handleUpdateElement('charts', selectedElement.id, {
                        type,
                        data: {
                          labels,
                          datasets: [{
                            label: title,
                            data,
                            backgroundColor: colors.slice(0, data.length),
                            borderColor: colors.slice(0, data.length).map(c => c.replace('f6', 'eb')),
                            borderWidth: 1
                          }]
                        },
                        size: { width, height }
                      });
                    } else {
                      handleAddElement('charts', {
                        type,
                        data: {
                          labels,
                          datasets: [{
                            label: title,
                            data,
                            backgroundColor: colors.slice(0, data.length),
                            borderColor: colors.slice(0, data.length).map(c => c.replace('f6', 'eb')),
                            borderWidth: 1
                          }]
                        },
                        options: {},
                        position: { x: 100, y: 100 },
                        size: { width, height }
                      });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {selectedElement ? 'Update' : 'Add'} Chart
                </button>
                <button
                  onClick={() => {
                    setShowChartModal(false);
                    setSelectedElement(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Table Modal */}
      <AnimatePresence>
        {showTableModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-3xl w-full my-8"
            >
              <h3 className="text-xl font-bold mb-4">Add Table</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rows</label>
                    <input
                      type="number"
                      id="tableRows"
                      min="1"
                      max="20"
                      defaultValue={selectedElement?.rows || 3}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Columns</label>
                    <input
                      type="number"
                      id="tableCols"
                      min="1"
                      max="20"
                      defaultValue={selectedElement?.cols || 3}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Width</label>
                    <input
                      type="number"
                      id="tableWidth"
                      defaultValue={selectedElement?.size?.width || 400}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Height</label>
                    <input
                      type="number"
                      id="tableHeight"
                      defaultValue={selectedElement?.size?.height || 300}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Header Background</label>
                  <input
                    type="color"
                    id="tableHeaderBg"
                    defaultValue={selectedElement?.style?.headerBackground || '#3b82f6'}
                    className="w-full h-10 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cell Background</label>
                  <input
                    type="color"
                    id="tableCellBg"
                    defaultValue={selectedElement?.style?.cellBackground || '#ffffff'}
                    className="w-full h-10 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    const rows = parseInt(document.getElementById('tableRows')?.value || 3);
                    const cols = parseInt(document.getElementById('tableCols')?.value || 3);
                    const width = parseInt(document.getElementById('tableWidth')?.value || 400);
                    const height = parseInt(document.getElementById('tableHeight')?.value || 300);
                    const headerBg = document.getElementById('tableHeaderBg')?.value || '#3b82f6';
                    const cellBg = document.getElementById('tableCellBg')?.value || '#ffffff';
                    
                    // Create empty table data
                    const data = Array(rows).fill(null).map(() => Array(cols).fill(''));
                    
                    if (selectedElement) {
                      handleUpdateElement('tables', selectedElement.id, {
                        rows,
                        cols,
                        data,
                        size: { width, height },
                        style: {
                          ...selectedElement.style,
                          headerBackground: headerBg,
                          cellBackground: cellBg
                        }
                      });
                    } else {
                      handleAddElement('tables', {
                        rows,
                        cols,
                        data,
                        position: { x: 100, y: 100 },
                        size: { width, height },
                        style: {
                          headerBackground: headerBg,
                          headerTextColor: '#ffffff',
                          cellBackground: cellBg,
                          cellTextColor: '#000000',
                          borderColor: '#e5e7eb',
                          borderWidth: 1,
                          fontSize: 14,
                          fontFamily: 'Arial'
                        }
                      });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {selectedElement ? 'Update' : 'Add'} Table
                </button>
                <button
                  onClick={() => {
                    setShowTableModal(false);
                    setSelectedElement(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Equation Modal */}
      <AnimatePresence>
        {showEquationModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4">Add Equation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">LaTeX Equation</label>
                  <input
                    type="text"
                    id="equationLatex"
                    placeholder="E = mc^2"
                    defaultValue={selectedElement?.latex || ''}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use LaTeX syntax (e.g., E = mc^2, \frac&#123;a&#125;&#123;b&#125;, \sum_&#123;i=1&#125;^&#123;n&#125;)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Font Size</label>
                  <input
                    type="number"
                    id="equationFontSize"
                    min="12"
                    max="72"
                    defaultValue={selectedElement?.style?.fontSize || 24}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <input
                    type="color"
                    id="equationColor"
                    defaultValue={selectedElement?.style?.color || '#000000'}
                    className="w-full h-10 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    const latex = document.getElementById('equationLatex')?.value || '';
                    const fontSize = parseInt(document.getElementById('equationFontSize')?.value || 24);
                    const color = document.getElementById('equationColor')?.value || '#000000';
                    
                    if (selectedElement) {
                      handleUpdateElement('equations', selectedElement.id, {
                        latex,
                        style: { ...selectedElement.style, fontSize, color }
                      });
                    } else {
                      handleAddElement('equations', {
                        latex,
                        position: { x: 100, y: 100 },
                        size: { width: 200, height: 50 },
                        style: {
                          fontSize,
                          color,
                          backgroundColor: 'transparent'
                        }
                      });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {selectedElement ? 'Update' : 'Add'} Equation
                </button>
                <button
                  onClick={() => {
                    setShowEquationModal(false);
                    setSelectedElement(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Icon Modal */}
      <AnimatePresence>
        {showIconModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full my-8"
            >
              <h3 className="text-xl font-bold mb-4">Add Icon</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Icon Name</label>
                  <input
                    type="text"
                    id="iconName"
                    placeholder="Star, Heart, Check, etc."
                    defaultValue={selectedElement?.name || 'Star'}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter icon name from Lucide library</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Width</label>
                    <input
                      type="number"
                      id="iconWidth"
                      defaultValue={selectedElement?.size?.width || 48}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Height</label>
                    <input
                      type="number"
                      id="iconHeight"
                      defaultValue={selectedElement?.size?.height || 48}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <input
                    type="color"
                    id="iconColor"
                    defaultValue={selectedElement?.style?.color || '#000000'}
                    className="w-full h-10 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    const name = document.getElementById('iconName')?.value || 'Star';
                    const width = parseInt(document.getElementById('iconWidth')?.value || 48);
                    const height = parseInt(document.getElementById('iconHeight')?.value || 48);
                    const color = document.getElementById('iconColor')?.value || '#000000';
                    
                    if (selectedElement) {
                      handleUpdateElement('icons', selectedElement.id, {
                        name,
                        size: { width, height },
                        style: { ...selectedElement.style, color }
                      });
                    } else {
                      handleAddElement('icons', {
                        name,
                        library: 'lucide',
                        position: { x: 100, y: 100 },
                        size: { width, height },
                        style: {
                          color,
                          fill: 'none',
                          strokeWidth: 2,
                          rotation: 0
                        }
                      });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {selectedElement ? 'Update' : 'Add'} Icon
                </button>
                <button
                  onClick={() => {
                    setShowIconModal(false);
                    setSelectedElement(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Symbol Modal */}
      <AnimatePresence>
        {showSymbolModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full my-8"
            >
              <h3 className="text-xl font-bold mb-4">Add Symbol</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    id="symbolCategory"
                    defaultValue={selectedElement?.category || 'math'}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="math">Math</option>
                    <option value="greek">Greek Letters</option>
                    <option value="arrows">Arrows</option>
                    <option value="operators">Operators</option>
                    <option value="relations">Relations</option>
                    <option value="special">Special</option>
                    <option value="currency">Currency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Symbol</label>
                  <input
                    type="text"
                    id="symbolText"
                    placeholder="∑, ∞, ±, etc."
                    defaultValue={selectedElement?.symbol || '∑'}
                    className="w-full px-3 py-2 border rounded-lg text-2xl text-center"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Font Size</label>
                    <input
                      type="number"
                      id="symbolFontSize"
                      min="12"
                      max="72"
                      defaultValue={selectedElement?.style?.fontSize || 24}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <input
                      type="color"
                      id="symbolColor"
                      defaultValue={selectedElement?.style?.color || '#000000'}
                      className="w-full h-10 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    const category = document.getElementById('symbolCategory')?.value || 'math';
                    const symbol = document.getElementById('symbolText')?.value || '∑';
                    const fontSize = parseInt(document.getElementById('symbolFontSize')?.value || 24);
                    const color = document.getElementById('symbolColor')?.value || '#000000';
                    
                    if (selectedElement) {
                      handleUpdateElement('symbols', selectedElement.id, {
                        symbol,
                        category,
                        style: { ...selectedElement.style, fontSize, color }
                      });
                    } else {
                      handleAddElement('symbols', {
                        symbol,
                        category,
                        position: { x: 100, y: 100 },
                        size: { width: 50, height: 50 },
                        style: {
                          fontSize,
                          color
                        }
                      });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {selectedElement ? 'Update' : 'Add'} Symbol
                </button>
                <button
                  onClick={() => {
                    setShowSymbolModal(false);
                    setSelectedElement(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SmartArt Modal */}
      <AnimatePresence>
        {showSmartArtModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full my-8"
            >
              <h3 className="text-xl font-bold mb-4">Add SmartArt</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SmartArt Type</label>
                  <select
                    id="smartArtType"
                    defaultValue={selectedElement?.type || 'process'}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="process">Process</option>
                    <option value="cycle">Cycle</option>
                    <option value="hierarchy">Hierarchy</option>
                    <option value="relationship">Relationship</option>
                    <option value="matrix">Matrix</option>
                    <option value="pyramid">Pyramid</option>
                    <option value="list">List</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Items (one per line)</label>
                  <textarea
                    id="smartArtItems"
                    placeholder="Item 1&#10;Item 2&#10;Item 3"
                    rows={6}
                    className="w-full px-3 py-2 border rounded-lg"
                    defaultValue={selectedElement?.data?.map(item => item.text).join('\n') || ''}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Width</label>
                    <input
                      type="number"
                      id="smartArtWidth"
                      defaultValue={selectedElement?.size?.width || 400}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Height</label>
                    <input
                      type="number"
                      id="smartArtHeight"
                      defaultValue={selectedElement?.size?.height || 300}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    const type = document.getElementById('smartArtType')?.value || 'process';
                    const itemsText = document.getElementById('smartArtItems')?.value || '';
                    const items = itemsText.split('\n').filter(s => s.trim()).map(text => ({ text, children: [] }));
                    const width = parseInt(document.getElementById('smartArtWidth')?.value || 400);
                    const height = parseInt(document.getElementById('smartArtHeight')?.value || 300);
                    
                    if (selectedElement) {
                      handleUpdateElement('smart-art', selectedElement.id, {
                        type,
                        data: items,
                        size: { width, height }
                      });
                    } else {
                      handleAddElement('smart-art', {
                        type,
                        data: items,
                        position: { x: 100, y: 100 },
                        size: { width, height },
                        style: {
                          colorScheme: 'blue',
                          layout: 'horizontal',
                          direction: 'ltr'
                        }
                      });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {selectedElement ? 'Update' : 'Add'} SmartArt
                </button>
                <button
                  onClick={() => {
                    setShowSmartArtModal(false);
                    setSelectedElement(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Edit Modal (Crop & Background Removal) */}
      <AnimatePresence>
        {showImageEditModal && selectedElement && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4">Edit Image</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Width</label>
                    <input
                      type="number"
                      id="imageWidth"
                      defaultValue={selectedElement.size?.width || 200}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Height</label>
                    <input
                      type="number"
                      id="imageHeight"
                      defaultValue={selectedElement.size?.height || 200}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      try {
                        const res = await api.post(
                          `/api/presentations/${currentPresentation._id}/slides/${currentSlideIndex}/images/${selectedElement.url || selectedElement._id}/process`,
                          { operation: 'removeBackground' }
                        );
                        if (res.data.success) {
                          setCurrentPresentation(res.data.presentation);
                          toast.success('Background removal in progress...');
                        }
                      } catch (error) {
                        console.error('Error processing image:', error);
                        toast.error('Failed to process image');
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Remove Background
                  </button>
                  <button
                    onClick={() => {
                      toast.info('Crop feature coming soon!');
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Crop Image
                  </button>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={async () => {
                    const width = parseInt(document.getElementById('imageWidth')?.value || 200);
                    const height = parseInt(document.getElementById('imageHeight')?.value || 200);
                    await handleUpdateElement('images', selectedElement.url || selectedElement._id, {
                      size: { width, height }
                    });
                    setShowImageEditModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Update Image
                </button>
                <button
                  onClick={() => {
                    setShowImageEditModal(false);
                    setSelectedElement(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm('Delete this image?')) {
                      const currentSlide = currentPresentation.slides[currentSlideIndex];
                      // Find image index
                      const imageIndex = currentSlide.images?.findIndex(img => 
                        img.url === selectedElement.url || img._id?.toString() === selectedElement._id
                      );
                      if (imageIndex !== -1) {
                        const updatedImages = [...currentSlide.images];
                        updatedImages.splice(imageIndex, 1);
                        await handleUpdateSlide(currentSlideIndex, { images: updatedImages });
                        setShowImageEditModal(false);
                        setSelectedElement(null);
                      }
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {view === 'list' && renderListView()}
      {view === 'edit' && renderSlideEditor()}
      {view === 'present' && renderPresenterView()}

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <UpgradePrompt
                feature="inavora"
                onClose={() => setShowUpgradeModal(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PresentationPage;
