import Presentation from '../models/Presentation.js';
import PresentationTemplate from '../models/PresentationTemplate.js';
import User from '../models/User.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.resolve(__dirname, '../uploads/presentations');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    cb(null, `presentation_${Date.now()}_${base}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Create a new presentation
export const createPresentation = async (req, res) => {
  try {
    const { title, description, theme, slides, templateId, numbering, headers, footers, masterSlides } = req.body;
    const userId = req.user?.id;

    // Check if user has Inavora access
    const { hasFeatureAccess } = await import('../utils/subscriptionUtils.js');
    const hasAccess = await hasFeatureAccess(userId, 'inavoraAccess');
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Inavora Presentation Tool requires a premium subscription. Please upgrade to access this feature.',
        upgradeRequired: true,
        feature: 'inavoraAccess'
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    let template = null;
    if (templateId) {
      template = await PresentationTemplate.findById(templateId);
      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }
      // Increment usage count
      template.usageCount = (template.usageCount || 0) + 1;
      await template.save();
    }

    const presentation = new Presentation({
      title,
      description: description || '',
      theme: theme || 'default',
      createdBy: req.user.id,
      slides: slides || [],
      templateId: templateId || null,
      template: template?.name || null,
      numbering: numbering || {
        enabled: true,
        startFrom: 1,
        position: 'bottom-right',
        fontSize: 14,
        color: '#666666'
      },
      headers: headers || {
        enabled: false,
        text: '',
        fontSize: 12,
        color: '#666666',
        position: 'top-center'
      },
      footers: footers || {
        enabled: false,
        text: '',
        fontSize: 12,
        color: '#666666',
        position: 'bottom-center'
      },
      masterSlides: masterSlides || [],
      defaultMasterLayout: 'default'
    });

    // If template exists, apply its master slides
    if (template && template.masterSlides && template.masterSlides.length > 0) {
      presentation.masterSlides = template.masterSlides;
      presentation.defaultMasterLayout = template.defaultLayout || 'centered';
    }

    // Add a default title slide if no slides provided
    if (!slides || slides.length === 0) {
      await presentation.addSlide({
        slideNumber: 0,
        title: title,
        slideType: 'title',
        content: description || '',
        showSlideNumber: presentation.numbering.enabled,
        showHeader: presentation.headers.enabled,
        showFooter: presentation.footers.enabled,
        headerText: presentation.headers.text,
        footerText: presentation.footers.text
      });
    } else {
      // Apply numbering, headers, footers to all slides
      presentation.slides.forEach(slide => {
        slide.showSlideNumber = presentation.numbering.enabled;
        slide.showHeader = presentation.headers.enabled;
        slide.showFooter = presentation.footers.enabled;
        slide.headerText = presentation.headers.text;
        slide.footerText = presentation.footers.text;
      });
    }

    await presentation.save();

    res.status(201).json({
      success: true,
      message: 'Presentation created successfully',
      presentation
    });
  } catch (error) {
    console.error('Error creating presentation:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating presentation',
      error: error.message
    });
  }
};

// Get all presentations for the current user
export const getMyPresentations = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      createdBy: req.user.id
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const presentations = await Presentation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email');

    const total = await Presentation.countDocuments(query);

    res.json({
      success: true,
      presentations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching presentations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching presentations',
      error: error.message
    });
  }
};

// Get shared presentations
export const getSharedPresentations = async (req, res) => {
  try {
    const presentations = await Presentation.find({
      $or: [
        { 'sharedWith.userId': req.user.id },
        { isPublic: true, isPublished: true }
      ]
    })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .limit(50);

    res.json({
      success: true,
      presentations
    });
  } catch (error) {
    console.error('Error fetching shared presentations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shared presentations',
      error: error.message
    });
  }
};

// Get a single presentation by ID
export const getPresentation = async (req, res) => {
  try {
    const { id } = req.params;

    const presentation = await Presentation.findById(id)
      .populate('createdBy', 'name email')
      .populate('sharedWith.userId', 'name email');

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found'
      });
    }

    // Check access
    const hasAccess = 
      presentation.createdBy._id.toString() === req.user.id ||
      presentation.isPublic && presentation.isPublished ||
      presentation.sharedWith.some(s => s.userId._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update views
    presentation.views += 1;
    presentation.lastViewed = new Date();
    await presentation.save();

    res.json({
      success: true,
      presentation
    });
  } catch (error) {
    console.error('Error fetching presentation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching presentation',
      error: error.message
    });
  }
};

// Get presentation by share code
export const getPresentationByShareCode = async (req, res) => {
  try {
    const { shareCode } = req.params;

    const presentation = await Presentation.findOne({ shareCode })
      .populate('createdBy', 'name email');

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found'
      });
    }

    if (!presentation.isPublic || !presentation.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'Presentation is not publicly available'
      });
    }

    // Update views
    presentation.views += 1;
    presentation.lastViewed = new Date();
    await presentation.save();

    res.json({
      success: true,
      presentation
    });
  } catch (error) {
    console.error('Error fetching presentation by share code:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching presentation',
      error: error.message
    });
  }
};

// Update presentation
export const updatePresentation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const presentation = await Presentation.findById(id);

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found'
      });
    }

    // Check ownership or edit permission
    const isOwner = presentation.createdBy.toString() === req.user.id;
    const hasEditPermission = presentation.sharedWith.some(
      s => s.userId.toString() === req.user.id && s.permission === 'edit'
    );

    if (!isOwner && !hasEditPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Remove fields that shouldn't be updated directly
    delete updates.createdBy;
    delete updates._id;
    delete updates.__v;

    Object.assign(presentation, updates);
    await presentation.save();

    res.json({
      success: true,
      message: 'Presentation updated successfully',
      presentation
    });
  } catch (error) {
    console.error('Error updating presentation:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating presentation',
      error: error.message
    });
  }
};

// Add slide
export const addSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const slideData = req.body;

    const presentation = await Presentation.findById(id);

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found'
      });
    }

    // Check ownership or edit permission
    const isOwner = presentation.createdBy.toString() === req.user.id;
    const hasEditPermission = presentation.sharedWith.some(
      s => s.userId.toString() === req.user.id && s.permission === 'edit'
    );

    if (!isOwner && !hasEditPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await presentation.addSlide(slideData);

    res.json({
      success: true,
      message: 'Slide added successfully',
      presentation
    });
  } catch (error) {
    console.error('Error adding slide:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding slide',
      error: error.message
    });
  }
};

// Update slide
export const updateSlide = async (req, res) => {
  try {
    const { id, slideNumber } = req.params;
    const updates = req.body;

    const presentation = await Presentation.findById(id);

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found'
      });
    }

    // Check ownership or edit permission
    const isOwner = presentation.createdBy.toString() === req.user.id;
    const hasEditPermission = presentation.sharedWith.some(
      s => s.userId.toString() === req.user.id && s.permission === 'edit'
    );

    if (!isOwner && !hasEditPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await presentation.updateSlide(parseInt(slideNumber), updates);

    res.json({
      success: true,
      message: 'Slide updated successfully',
      presentation
    });
  } catch (error) {
    console.error('Error updating slide:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating slide',
      error: error.message
    });
  }
};

// Delete slide
export const deleteSlide = async (req, res) => {
  try {
    const { id, slideNumber } = req.params;

    const presentation = await Presentation.findById(id);

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found'
      });
    }

    // Check ownership
    if (presentation.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can delete slides'
      });
    }

    await presentation.removeSlide(parseInt(slideNumber));

    res.json({
      success: true,
      message: 'Slide deleted successfully',
      presentation
    });
  } catch (error) {
    console.error('Error deleting slide:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting slide',
      error: error.message
    });
  }
};

// Delete presentation
export const deletePresentation = async (req, res) => {
  try {
    const { id } = req.params;

    const presentation = await Presentation.findById(id);

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found'
      });
    }

    // Check ownership
    if (presentation.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Presentation.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Presentation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting presentation:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting presentation',
      error: error.message
    });
  }
};

// Share presentation
export const sharePresentation = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, permission = 'view' } = req.body;

    const presentation = await Presentation.findById(id);

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found'
      });
    }

    // Check ownership
    if (presentation.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can share presentations'
      });
    }

    // Check if already shared
    const existingShare = presentation.sharedWith.find(
      s => s.userId.toString() === userId
    );

    if (existingShare) {
      existingShare.permission = permission;
    } else {
      presentation.sharedWith.push({
        userId,
        permission,
        sharedAt: new Date()
      });
    }

    await presentation.save();

    res.json({
      success: true,
      message: 'Presentation shared successfully',
      presentation
    });
  } catch (error) {
    console.error('Error sharing presentation:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing presentation',
      error: error.message
    });
  }
};

// Start presentation session (real-time)
export const startPresentation = async (req, res) => {
  try {
    const { id } = req.params;

    const presentation = await Presentation.findById(id);

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found'
      });
    }

    // Check access
    const hasAccess = 
      presentation.createdBy.toString() === req.user.id ||
      presentation.isPublic && presentation.isPublished ||
      presentation.sharedWith.some(s => s.userId.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Generate session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    presentation.isPresenting = true;
    presentation.presentationSessionId = sessionId;
    presentation.currentSlide = 0;
    await presentation.save();

    // Emit to Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`presentation:${id}`).emit('presentation:started', {
        presentationId: id,
        sessionId,
        currentSlide: 0
      });
    }

    res.json({
      success: true,
      message: 'Presentation started',
      sessionId,
      presentation
    });
  } catch (error) {
    console.error('Error starting presentation:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting presentation',
      error: error.message
    });
  }
};

// Update current slide (real-time)
export const updateCurrentSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { slideNumber } = req.body;

    const presentation = await Presentation.findById(id);

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found'
      });
    }

    if (!presentation.isPresenting) {
      return res.status(400).json({
        success: false,
        message: 'Presentation is not currently active'
      });
    }

    presentation.currentSlide = slideNumber;
    await presentation.save();

    // Emit to Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`presentation:${id}`).emit('presentation:slide-changed', {
        presentationId: id,
        currentSlide: slideNumber
      });
    }

    res.json({
      success: true,
      message: 'Slide updated',
      presentation
    });
  } catch (error) {
    console.error('Error updating slide:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating slide',
      error: error.message
    });
  }
};

// Stop presentation session
export const stopPresentation = async (req, res) => {
  try {
    const { id } = req.params;

    const presentation = await Presentation.findById(id);

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found'
      });
    }

    presentation.isPresenting = false;
    presentation.presentationSessionId = null;
    await presentation.save();

    // Emit to Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`presentation:${id}`).emit('presentation:stopped', {
        presentationId: id
      });
    }

    res.json({
      success: true,
      message: 'Presentation stopped',
      presentation
    });
  } catch (error) {
    console.error('Error stopping presentation:', error);
    res.status(500).json({
      success: false,
      message: 'Error stopping presentation',
      error: error.message
    });
  }
};

// Upload image for presentation slide
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const apiBaseUrl = process.env.API_URL || 'http://localhost:5000';
    const imageUrl = `${apiBaseUrl}/uploads/presentations/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
};

// Reorder slides
export const reorderSlides = async (req, res) => {
  try {
    const { id } = req.params;
    const { slideOrder } = req.body; // Array of slide numbers in new order

    if (!slideOrder || !Array.isArray(slideOrder)) {
      return res.status(400).json({
        success: false,
        message: 'Slide order array is required'
      });
    }

    const presentation = await Presentation.findById(id);

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found'
      });
    }

    // Check ownership
    if (presentation.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can reorder slides'
      });
    }

    // Validate slide order
    if (slideOrder.length !== presentation.slides.length) {
      return res.status(400).json({
        success: false,
        message: 'Slide order must include all slides'
      });
    }

    // Reorder slides
    const reorderedSlides = slideOrder.map((oldIndex, newIndex) => {
      const slide = presentation.slides[oldIndex];
      slide.slideNumber = newIndex;
      return slide;
    });

    presentation.slides = reorderedSlides;
    await presentation.save();

    res.json({
      success: true,
      message: 'Slides reordered successfully',
      presentation
    });
  } catch (error) {
    console.error('Error reordering slides:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering slides',
      error: error.message
    });
  }
};

// Duplicate slide
export const duplicateSlide = async (req, res) => {
  try {
    const { id, slideNumber } = req.params;

    const presentation = await Presentation.findById(id);

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found'
      });
    }

    // Check ownership
    if (presentation.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can duplicate slides'
      });
    }

    const slide = presentation.slides.find(s => s.slideNumber === parseInt(slideNumber));
    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Slide not found'
      });
    }

    // Create duplicate slide
    const newSlide = {
      ...slide.toObject(),
      slideNumber: presentation.slides.length,
      _id: undefined
    };

    presentation.slides.push(newSlide);
    await presentation.save();

    res.json({
      success: true,
      message: 'Slide duplicated successfully',
      presentation
    });
  } catch (error) {
    console.error('Error duplicating slide:', error);
    res.status(500).json({
      success: false,
      message: 'Error duplicating slide',
      error: error.message
    });
  }
};

// Update presentation numbering, headers, footers
export const updatePresentationMetadata = async (req, res) => {
  try {
    const { id } = req.params;
    const { numbering, headers, footers, masterSlides, defaultMasterLayout } = req.body;

    const presentation = await Presentation.findById(id);

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: 'Presentation not found'
      });
    }

    // Check ownership
    if (presentation.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can update presentation metadata'
      });
    }

    if (numbering) {
      presentation.numbering = { ...presentation.numbering, ...numbering };
      // Update all slides
      presentation.slides.forEach(slide => {
        slide.showSlideNumber = presentation.numbering.enabled;
      });
    }

    if (headers) {
      presentation.headers = { ...presentation.headers, ...headers };
      // Update all slides
      presentation.slides.forEach(slide => {
        slide.showHeader = presentation.headers.enabled;
        slide.headerText = presentation.headers.text;
      });
    }

    if (footers) {
      presentation.footers = { ...presentation.footers, ...footers };
      // Update all slides
      presentation.slides.forEach(slide => {
        slide.showFooter = presentation.footers.enabled;
        slide.footerText = presentation.footers.text;
      });
    }

    if (masterSlides) {
      presentation.masterSlides = masterSlides;
    }

    if (defaultMasterLayout) {
      presentation.defaultMasterLayout = defaultMasterLayout;
    }

    await presentation.save();

    res.json({
      success: true,
      message: 'Presentation metadata updated successfully',
      presentation
    });
  } catch (error) {
    console.error('Error updating presentation metadata:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating presentation metadata',
      error: error.message
    });
  }
};

