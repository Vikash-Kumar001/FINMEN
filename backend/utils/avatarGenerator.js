/**
 * Avatar Generation Utility
 * Generates unique avatars for different user types based on their information
 */

// Avatar color schemes for different user types
const avatarSchemes = {
  student: [
    { bg: '#FF6B6B', text: '#FFFFFF' }, // Red
    { bg: '#4ECDC4', text: '#FFFFFF' }, // Teal
    { bg: '#45B7D1', text: '#FFFFFF' }, // Blue
    { bg: '#96CEB4', text: '#FFFFFF' }, // Green
    { bg: '#FFEAA7', text: '#2D3436' }, // Yellow
    { bg: '#DDA0DD', text: '#FFFFFF' }, // Plum
    { bg: '#98D8C8', text: '#FFFFFF' }, // Mint
    { bg: '#F7DC6F', text: '#2D3436' }, // Light Yellow
  ],
  parent: [
    { bg: '#6C5CE7', text: '#FFFFFF' }, // Purple
    { bg: '#A29BFE', text: '#FFFFFF' }, // Light Purple
    { bg: '#74B9FF', text: '#FFFFFF' }, // Sky Blue
    { bg: '#81ECEC', text: '#2D3436' }, // Light Blue
    { bg: '#55A3FF', text: '#FFFFFF' }, // Royal Blue
    { bg: '#B2BEC3', text: '#2D3436' }, // Gray Blue
  ],
  teacher: [
    { bg: '#00B894', text: '#FFFFFF' }, // Green
    { bg: '#00CEC9', text: '#FFFFFF' }, // Turquoise
    { bg: '#6C5CE7', text: '#FFFFFF' }, // Purple
    { bg: '#A29BFE', text: '#FFFFFF' }, // Light Purple
    { bg: '#FD79A8', text: '#FFFFFF' }, // Pink
  ],
  seller: [
    { bg: '#FDCB6E', text: '#2D3436' }, // Orange
    { bg: '#E17055', text: '#FFFFFF' }, // Red Orange
    { bg: '#D63031', text: '#FFFFFF' }, // Red
    { bg: '#E84393', text: '#FFFFFF' }, // Pink Red
    { bg: '#F39C12', text: '#FFFFFF' }, // Golden
  ],
  school: [
    { bg: '#2D3436', text: '#FFFFFF' }, // Dark Gray
    { bg: '#636E72', text: '#FFFFFF' }, // Gray
    { bg: '#74B9FF', text: '#FFFFFF' }, // Blue
    { bg: '#00B894', text: '#FFFFFF' }, // Green
    { bg: '#6C5CE7', text: '#FFFFFF' }, // Purple
  ],
  csr: [
    { bg: '#00B894', text: '#FFFFFF' }, // Green
    { bg: '#00CEC9', text: '#FFFFFF' }, // Turquoise
    { bg: '#74B9FF', text: '#FFFFFF' }, // Blue
    { bg: '#A29BFE', text: '#FFFFFF' }, // Light Purple
    { bg: '#55A3FF', text: '#FFFFFF' }, // Royal Blue
  ],
  admin: [
    { bg: '#2D3436', text: '#FFFFFF' }, // Dark Gray
    { bg: '#636E72', text: '#FFFFFF' }, // Gray
    { bg: '#6C5CE7', text: '#FFFFFF' }, // Purple
    { bg: '#00B894', text: '#FFFFFF' }, // Green
  ]
};

// Icons for different user types
const userIcons = {
  student: ['🎓', '📚', '✏️', '🎒', '🔬', '📖', '🎯', '⭐'],
  parent: ['👨‍👩‍👧', '👨‍👩‍👦', '👪', '💝', '🏠', '❤️', '👨‍👧', '👩‍👦'],
  teacher: ['👨‍🏫', '👩‍🏫', '📝', '📊', '🎓', '📚', '✏️', '🏫'],
  seller: ['🛒', '💰', '📦', '🏪', '🛍️', '💳', '📊', '🎯'],
  school: ['🏫', '🎓', '📚', '🏛️', '📊', '👥', '🎯', '⭐'],
  csr: ['🎧', '💬', '📞', '🤝', '💡', '⭐', '🎯', '📋'],
  admin: ['👑', '⚙️', '🔧', '📊', '🎯', '⭐', '💼', '🔑']
};

/**
 * Generate avatar data for a user
 * @param {Object} userData - User information
 * @param {string} userData.name - User's name
 * @param {string} userData.email - User's email
 * @param {string} userData.role - User's role
 * @param {string} userData.gender - User's gender (optional)
 * @returns {Object} Avatar configuration
 */
const generateAvatar = (userData) => {
  const { name, email, role, gender } = userData;
  
  // Use role as fallback if not provided
  const userRole = role || 'student';
  
  // Get initials from name
  const initials = getInitials(name);
  
  // Generate consistent color based on email hash
  const emailHash = hashString(email || name);
  const colorScheme = avatarSchemes[userRole] || avatarSchemes.student;
  const colorIndex = emailHash % colorScheme.length;
  const colors = colorScheme[colorIndex];
  
  // Generate consistent icon based on name hash
  const nameHash = hashString(name);
  const icons = userIcons[userRole] || userIcons.student;
  const iconIndex = nameHash % icons.length;
  const icon = icons[iconIndex];
  
  // Generate avatar URL (for now, we'll use a data URL approach)
  const avatarUrl = generateAvatarUrl(initials, colors, icon, userRole);
  
  return {
    url: avatarUrl,
    initials,
    colors,
    icon,
    role: userRole,
    isGenerated: true,
    generatedAt: new Date().toISOString()
  };
};

/**
 * Extract initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'U';
  
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

/**
 * Simple hash function for consistent color/icon selection
 * @param {string} str - String to hash
 * @returns {number} Hash value
 */
const hashString = (str) => {
  if (!str) return 0;
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

/**
 * Generate SVG avatar URL
 * @param {string} initials - User initials
 * @param {Object} colors - Color scheme
 * @param {string} icon - Emoji icon
 * @param {string} role - User role
 * @returns {string} Data URL for SVG avatar
 */
const generateAvatarUrl = (initials, colors, icon, role) => {
  const svg = `
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${darkenColor(colors.bg, 20)};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Background Circle -->
      <circle cx="100" cy="100" r="95" fill="url(#bg)" filter="url(#shadow)"/>
      
      <!-- Icon (Emoji) -->
      <text x="100" y="120" text-anchor="middle" font-size="60" font-family="system-ui, -apple-system, sans-serif">
        ${icon}
      </text>
      
      <!-- Initials -->
      <text x="100" y="160" text-anchor="middle" font-size="24" font-weight="bold" font-family="system-ui, -apple-system, sans-serif" fill="${colors.text}">
        ${initials}
      </text>
      
      <!-- Role Badge -->
      <circle cx="160" cy="40" r="20" fill="${colors.text}" opacity="0.9"/>
      <text x="160" y="47" text-anchor="middle" font-size="12" font-weight="bold" font-family="system-ui, -apple-system, sans-serif" fill="${colors.bg}">
        ${role.charAt(0).toUpperCase()}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

/**
 * Darken a color by a percentage
 * @param {string} color - Hex color
 * @param {number} percent - Percentage to darken (0-100)
 * @returns {string} Darkened hex color
 */
const darkenColor = (color, percent) => {
  if (!color.startsWith('#')) return color;
  
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

/**
 * Generate multiple avatar options for user selection
 * @param {Object} userData - User information
 * @returns {Array} Array of avatar options
 */
const generateAvatarOptions = (userData) => {
  const { name, email, role } = userData;
  const userRole = role || 'student';
  const initials = getInitials(name);
  
  const options = [];
  const colorScheme = avatarSchemes[userRole] || avatarSchemes.student;
  const icons = userIcons[userRole] || userIcons.student;
  
  // Generate 6 different options
  for (let i = 0; i < 6; i++) {
    const colorIndex = i % colorScheme.length;
    const iconIndex = i % icons.length;
    const colors = colorScheme[colorIndex];
    const icon = icons[iconIndex];
    
    options.push({
      id: `option_${i}`,
      url: generateAvatarUrl(initials, colors, icon, userRole),
      initials,
      colors,
      icon,
      role: userRole
    });
  }
  
  return options;
};

/**
 * Update existing avatar with new customization
 * @param {Object} currentAvatar - Current avatar data
 * @param {Object} customizations - New customizations
 * @returns {Object} Updated avatar data
 */
const updateAvatar = (currentAvatar, customizations) => {
  const { colors, icon, initials } = customizations;
  
  return {
    ...currentAvatar,
    url: generateAvatarUrl(
      initials || currentAvatar.initials,
      colors || currentAvatar.colors,
      icon || currentAvatar.icon,
      currentAvatar.role
    ),
    colors: colors || currentAvatar.colors,
    icon: icon || currentAvatar.icon,
    initials: initials || currentAvatar.initials,
    isGenerated: true,
    updatedAt: new Date().toISOString()
  };
};

export {
  generateAvatar,
  generateAvatarOptions,
  updateAvatar,
  avatarSchemes,
  userIcons
};
