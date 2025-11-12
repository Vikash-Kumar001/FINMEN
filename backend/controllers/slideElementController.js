import Presentation from '../models/Presentation.js';

// Generic helper to find slide and check access
const findSlideAndCheckAccess = async (presentationId, slideNumber, userId) => {
  const presentation = await Presentation.findById(presentationId);
  if (!presentation) {
    throw new Error('Presentation not found');
  }

  if (presentation.createdBy.toString() !== userId) {
    throw new Error('Access denied');
  }

  const slide = presentation.slides.find(s => s.slideNumber === parseInt(slideNumber));
  if (!slide) {
    throw new Error('Slide not found');
  }

  return { presentation, slide };
};

// Add text box
export const addTextBox = async (req, res) => {
  try {
    const { id, slideNumber } = req.params;
    const textBoxData = req.body;

    const { presentation, slide } = await findSlideAndCheckAccess(id, slideNumber, req.user.id);

    const newTextBox = {
      id: `textbox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: textBoxData.content || '',
      position: textBoxData.position || { x: 100, y: 100 },
      size: textBoxData.size || { width: 200, height: 100 },
      style: {
        fontSize: textBoxData.style?.fontSize || 16,
        fontFamily: textBoxData.style?.fontFamily || 'Arial',
        color: textBoxData.style?.color || '#000000',
        backgroundColor: textBoxData.style?.backgroundColor || 'transparent',
        borderColor: textBoxData.style?.borderColor || '#000000',
        borderWidth: textBoxData.style?.borderWidth || 1,
        borderRadius: textBoxData.style?.borderRadius || 0,
        textAlign: textBoxData.style?.textAlign || 'left',
        fontWeight: textBoxData.style?.fontWeight || 'normal',
        fontStyle: textBoxData.style?.fontStyle || 'normal',
        textDecoration: textBoxData.style?.textDecoration || 'none'
      },
      zIndex: textBoxData.zIndex || (slide.textBoxes?.length || 0)
    };

    if (!slide.textBoxes) {
      slide.textBoxes = [];
    }
    slide.textBoxes.push(newTextBox);
    await presentation.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`presentation:${id}`).emit('slide:element:added', {
        presentationId: id,
        slideNumber: parseInt(slideNumber),
        elementType: 'textBox',
        element: newTextBox
      });
    }

    res.json({
      success: true,
      message: 'Text box added successfully',
      textBox: newTextBox,
      presentation
    });
  } catch (error) {
    console.error('Error adding text box:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding text box',
      error: error.message
    });
  }
};

// Update text box
export const updateTextBox = async (req, res) => {
  try {
    const { id, slideNumber, elementId } = req.params;
    const updates = req.body;

    const { presentation, slide } = await findSlideAndCheckAccess(id, slideNumber, req.user.id);

    if (!slide.textBoxes) {
      return res.status(404).json({
        success: false,
        message: 'Text box not found'
      });
    }

    const textBox = slide.textBoxes.find(tb => tb.id === elementId);
    if (!textBox) {
      return res.status(404).json({
        success: false,
        message: 'Text box not found'
      });
    }

    Object.assign(textBox, updates);
    if (updates.style) {
      textBox.style = { ...textBox.style, ...updates.style };
    }
    if (updates.position) {
      textBox.position = { ...textBox.position, ...updates.position };
    }
    if (updates.size) {
      textBox.size = { ...textBox.size, ...updates.size };
    }

    await presentation.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`presentation:${id}`).emit('slide:element:updated', {
        presentationId: id,
        slideNumber: parseInt(slideNumber),
        elementType: 'textBox',
        elementId,
        updates
      });
    }

    res.json({
      success: true,
      message: 'Text box updated successfully',
      textBox,
      presentation
    });
  } catch (error) {
    console.error('Error updating text box:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating text box',
      error: error.message
    });
  }
};

// Delete text box
export const deleteTextBox = async (req, res) => {
  try {
    const { id, slideNumber, elementId } = req.params;

    const { presentation, slide } = await findSlideAndCheckAccess(id, slideNumber, req.user.id);

    if (!slide.textBoxes) {
      return res.status(404).json({
        success: false,
        message: 'Text box not found'
      });
    }

    const index = slide.textBoxes.findIndex(tb => tb.id === elementId);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Text box not found'
      });
    }

    slide.textBoxes.splice(index, 1);
    await presentation.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`presentation:${id}`).emit('slide:element:deleted', {
        presentationId: id,
        slideNumber: parseInt(slideNumber),
        elementType: 'textBox',
        elementId
      });
    }

    res.json({
      success: true,
      message: 'Text box deleted successfully',
      presentation
    });
  } catch (error) {
    console.error('Error deleting text box:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting text box',
      error: error.message
    });
  }
};

// Generic element handlers (for shapes, icons, charts, tables, equations, symbols, smartArt)
const createElementHandler = (elementType, defaultData) => {
  return {
    add: async (req, res) => {
      try {
        const { id, slideNumber } = req.params;
        const elementData = req.body;

        const { presentation, slide } = await findSlideAndCheckAccess(id, slideNumber, req.user.id);

        const newElement = {
          id: `${elementType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...defaultData,
          ...elementData,
          position: elementData.position || { x: 100, y: 100 },
          size: elementData.size || { width: 200, height: 200 },
          zIndex: elementData.zIndex || (slide[elementType]?.length || 0)
        };

        if (!slide[elementType]) {
          slide[elementType] = [];
        }
        slide[elementType].push(newElement);
        await presentation.save();

        // Emit real-time update
        const io = req.app.get('io');
        if (io) {
          io.to(`presentation:${id}`).emit('slide:element:added', {
            presentationId: id,
            slideNumber: parseInt(slideNumber),
            elementType,
            element: newElement
          });
        }

        res.json({
          success: true,
          message: `${elementType} added successfully`,
          [elementType]: newElement,
          presentation
        });
      } catch (error) {
        console.error(`Error adding ${elementType}:`, error);
        res.status(500).json({
          success: false,
          message: error.message || `Error adding ${elementType}`,
          error: error.message
        });
      }
    },

    update: async (req, res) => {
      try {
        const { id, slideNumber, elementId } = req.params;
        const updates = req.body;

        const { presentation, slide } = await findSlideAndCheckAccess(id, slideNumber, req.user.id);

        if (!slide[elementType]) {
          return res.status(404).json({
            success: false,
            message: `${elementType} not found`
          });
        }

        const element = slide[elementType].find(el => el.id === elementId);
        if (!element) {
          return res.status(404).json({
            success: false,
            message: `${elementType} not found`
          });
        }

        Object.assign(element, updates);
        if (updates.style) {
          element.style = { ...element.style, ...updates.style };
        }
        if (updates.position) {
          element.position = { ...element.position, ...updates.position };
        }
        if (updates.size) {
          element.size = { ...element.size, ...updates.size };
        }

        await presentation.save();

        // Emit real-time update
        const io = req.app.get('io');
        if (io) {
          io.to(`presentation:${id}`).emit('slide:element:updated', {
            presentationId: id,
            slideNumber: parseInt(slideNumber),
            elementType,
            elementId,
            updates
          });
        }

        res.json({
          success: true,
          message: `${elementType} updated successfully`,
          [elementType]: element,
          presentation
        });
      } catch (error) {
        console.error(`Error updating ${elementType}:`, error);
        res.status(500).json({
          success: false,
          message: error.message || `Error updating ${elementType}`,
          error: error.message
        });
      }
    },

    delete: async (req, res) => {
      try {
        const { id, slideNumber, elementId } = req.params;

        const { presentation, slide } = await findSlideAndCheckAccess(id, slideNumber, req.user.id);

        if (!slide[elementType]) {
          return res.status(404).json({
            success: false,
            message: `${elementType} not found`
          });
        }

        const index = slide[elementType].findIndex(el => el.id === elementId);
        if (index === -1) {
          return res.status(404).json({
            success: false,
            message: `${elementType} not found`
          });
        }

        slide[elementType].splice(index, 1);
        await presentation.save();

        // Emit real-time update
        const io = req.app.get('io');
        if (io) {
          io.to(`presentation:${id}`).emit('slide:element:deleted', {
            presentationId: id,
            slideNumber: parseInt(slideNumber),
            elementType,
            elementId
          });
        }

        res.json({
          success: true,
          message: `${elementType} deleted successfully`,
          presentation
        });
      } catch (error) {
        console.error(`Error deleting ${elementType}:`, error);
        res.status(500).json({
          success: false,
          message: error.message || `Error deleting ${elementType}`,
          error: error.message
        });
      }
    }
  };
};

// Shape handlers
const shapeHandlers = createElementHandler('shapes', {
  type: 'rectangle',
  style: {
    fill: '#3b82f6',
    stroke: '#1e40af',
    strokeWidth: 2,
    opacity: 1,
    rotation: 0
  }
});
export const addShape = shapeHandlers.add;
export const updateShape = shapeHandlers.update;
export const deleteShape = shapeHandlers.delete;

// Icon handlers
const iconHandlers = createElementHandler('icons', {
  name: 'Star',
  library: 'lucide',
  style: {
    color: '#000000',
    fill: 'none',
    strokeWidth: 2,
    rotation: 0
  }
});
export const addIcon = iconHandlers.add;
export const updateIcon = iconHandlers.update;
export const deleteIcon = iconHandlers.delete;

// Chart handlers
const chartHandlers = createElementHandler('charts', {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{
      label: 'Sales',
      data: [10, 20, 30, 40],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
      borderColor: ['#2563eb', '#7c3aed', '#db2777', '#d97706'],
      borderWidth: 1
    }]
  },
  options: {}
});
export const addChart = chartHandlers.add;
export const updateChart = chartHandlers.update;
export const deleteChart = chartHandlers.delete;

// Table handlers
const tableHandlers = createElementHandler('tables', {
  rows: 3,
  cols: 3,
  data: [['', '', ''], ['', '', ''], ['', '', '']],
  style: {
    headerBackground: '#3b82f6',
    headerTextColor: '#ffffff',
    cellBackground: '#ffffff',
    cellTextColor: '#000000',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'Arial'
  }
});
export const addTable = tableHandlers.add;
export const updateTable = tableHandlers.update;
export const deleteTable = tableHandlers.delete;

// Equation handlers
const equationHandlers = createElementHandler('equations', {
  latex: 'E = mc^2',
  style: {
    fontSize: 24,
    color: '#000000',
    backgroundColor: 'transparent'
  }
});
export const addEquation = equationHandlers.add;
export const updateEquation = equationHandlers.update;
export const deleteEquation = equationHandlers.delete;

// Symbol handlers
const symbolHandlers = createElementHandler('symbols', {
  symbol: '∑',
  category: 'math',
  style: {
    fontSize: 24,
    color: '#000000'
  }
});
export const addSymbol = symbolHandlers.add;
export const updateSymbol = symbolHandlers.update;
export const deleteSymbol = symbolHandlers.delete;

// SmartArt handlers
const smartArtHandlers = createElementHandler('smartArt', {
  type: 'process',
  data: [{ text: 'Start', children: [] }],
  style: {
    colorScheme: 'blue',
    layout: 'horizontal',
    direction: 'ltr'
  }
});
export const addSmartArt = smartArtHandlers.add;
export const updateSmartArt = smartArtHandlers.update;
export const deleteSmartArt = smartArtHandlers.delete;

// Update image (for crop and background removal)
export const updateImage = async (req, res) => {
  try {
    const { id, slideNumber, elementId } = req.params;
    const updates = req.body;

    const { presentation, slide } = await findSlideAndCheckAccess(id, slideNumber, req.user.id);

    if (!slide.images) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    const image = slide.images.find(img => img._id?.toString() === elementId || img.url === elementId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    Object.assign(image, updates);
    if (updates.crop) {
      image.crop = { ...image.crop, ...updates.crop };
    }
    if (updates.position) {
      image.position = { ...image.position, ...updates.position };
    }
    if (updates.size) {
      image.size = { ...image.size, ...updates.size };
    }

    await presentation.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`presentation:${id}`).emit('slide:element:updated', {
        presentationId: id,
        slideNumber: parseInt(slideNumber),
        elementType: 'image',
        elementId,
        updates
      });
    }

    res.json({
      success: true,
      message: 'Image updated successfully',
      image,
      presentation
    });
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating image',
      error: error.message
    });
  }
};

// Process image (crop/background removal) - placeholder for future implementation
export const processImage = async (req, res) => {
  try {
    const { id, slideNumber, elementId } = req.params;
    const { operation, options } = req.body; // operation: 'crop' | 'removeBackground'

    const { presentation, slide } = await findSlideAndCheckAccess(id, slideNumber, req.user.id);

    if (!slide.images) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    const image = slide.images.find(img => img._id?.toString() === elementId || img.url === elementId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // TODO: Implement actual image processing (crop, background removal)
    // For now, just update the metadata
    if (operation === 'crop' && options) {
      image.crop = options;
    } else if (operation === 'removeBackground') {
      image.backgroundRemoved = true;
      // In production, this would call an image processing service
      image.processedUrl = image.url; // Placeholder
    }

    await presentation.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`presentation:${id}`).emit('slide:element:updated', {
        presentationId: id,
        slideNumber: parseInt(slideNumber),
        elementType: 'image',
        elementId,
        updates: { [operation]: options || true }
      });
    }

    res.json({
      success: true,
      message: `Image ${operation} completed`,
      image,
      presentation
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing image',
      error: error.message
    });
  }
};

