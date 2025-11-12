import PresentationTemplate from '../models/PresentationTemplate.js';

// Get all templates
export const getTemplates = async (req, res) => {
  try {
    const { category, theme, isPublic } = req.query;
    
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (theme) {
      query.theme = theme;
    }
    
    if (isPublic !== undefined) {
      query.isPublic = isPublic === 'true';
    } else {
      // Default: show public templates and user's own templates
      query.$or = [
        { isPublic: true },
        { createdBy: req.user.id },
        { isSystem: true }
      ];
    }

    const templates = await PresentationTemplate.find(query)
      .sort({ usageCount: -1, createdAt: -1 })
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching templates',
      error: error.message
    });
  }
};

// Get single template
export const getTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    
    const template = await PresentationTemplate.findById(id).populate('createdBy', 'name email');
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Check if user can access this template
    if (!template.isPublic && !template.isSystem && template.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      template
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching template',
      error: error.message
    });
  }
};

// Create template
export const createTemplate = async (req, res) => {
  try {
    const { name, description, category, theme, masterSlides, defaultLayout, tags } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Template name is required'
      });
    }

    const template = new PresentationTemplate({
      name,
      description: description || '',
      category: category || 'custom',
      theme: theme || 'default',
      masterSlides: masterSlides || [],
      defaultLayout: defaultLayout || 'centered',
      tags: tags || [],
      createdBy: req.user.id,
      isPublic: false,
      isSystem: false
    });

    await template.save();

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      template
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating template',
      error: error.message
    });
  }
};

// Update template
export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const template = await PresentationTemplate.findById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Check ownership
    if (template.createdBy?.toString() !== req.user.id && !template.isSystem) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can update this template'
      });
    }

    // Don't allow updating system templates
    if (template.isSystem) {
      return res.status(403).json({
        success: false,
        message: 'System templates cannot be modified'
      });
    }

    Object.assign(template, updates);
    await template.save();

    res.json({
      success: true,
      message: 'Template updated successfully',
      template
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating template',
      error: error.message
    });
  }
};

// Delete template
export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await PresentationTemplate.findById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Check ownership
    if (template.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can delete this template'
      });
    }

    // Don't allow deleting system templates
    if (template.isSystem) {
      return res.status(403).json({
        success: false,
        message: 'System templates cannot be deleted'
      });
    }

    await template.deleteOne();

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting template',
      error: error.message
    });
  }
};

