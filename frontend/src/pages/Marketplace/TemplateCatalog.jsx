import React, { useState, useEffect, useCallback } from 'react';
import { motion as Motion} from 'framer-motion';
import {
  Store, Search, Filter, Tag, Download, Clock, CheckCircle,
  Grid, List, Eye, Award, TrendingUp, Star as StarIcon, Sparkles,
  Package, Zap, Heart, Share2, X, BookOpen
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

const TemplateCatalog = () => {
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFeatured, setShowFeatured] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const fetchModules = useCallback(async () => {
    try {
      const params = showFeatured ? { featured: 'true' } : {};
      const response = await api.get('/api/marketplace/catalog', { params });
      setModules(response.data.data);
      setFilteredModules(response.data.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error('Failed to load template catalog');
    } finally {
      setLoading(false);
    }
  }, [showFeatured]);

  const filterModules = useCallback(() => {
    let filtered = [...modules];

    if (searchQuery) {
      filtered = filtered.filter(module =>
        module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(module => module.metadata?.category === selectedCategory);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(module =>
        selectedTags.some(tag => module.metadata?.tags?.includes(tag))
      );
    }

    setFilteredModules(filtered);
  }, [modules, searchQuery, selectedCategory, selectedTags]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  useEffect(() => {
    filterModules();
  }, [filterModules]);

  const categories = ['Education', 'Science', 'Communication', 'Games', 'Utilities', 'Analytics', 'Other'];
  const categoryColors = {
    'Education': 'from-blue-500 to-cyan-500',
    'Science': 'from-green-500 to-emerald-500',
    'Communication': 'from-purple-500 to-pink-500',
    'Games': 'from-orange-500 to-red-500',
    'Utilities': 'from-indigo-500 to-blue-500',
    'Analytics': 'from-yellow-500 to-amber-500',
    'Other': 'from-gray-500 to-slate-500'
  };
  
  const allTags = [...new Set(modules.flatMap(m => m.metadata?.tags || []))];

  const handleToggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
                  <Store className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2">Template Catalog</h1>
                  <p className="text-lg text-white/90">Discover amazing modules and templates</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full">
                  <Package className="w-5 h-5" />
                  <span className="font-bold">{modules.length} Templates</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold">Premium Quality</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-purple-600 shadow-xl scale-110' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Grid className="w-6 h-6" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-purple-600 shadow-xl scale-110' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <List className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Search Bar */}
        <div className="mb-8">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search for templates, categories, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all text-lg shadow-lg"
            />
          </Motion.div>
        </div>

        {/* Filters Section */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-gray-100"
        >
          {/* Featured Toggle */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setShowFeatured(!showFeatured)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all ${
                showFeatured 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Award className="w-5 h-5" />
              <span>Featured Only</span>
            </button>
            <span className="flex-1 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></span>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Categories
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? 'all' : category)}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r text-white shadow-lg scale-105 ' + categoryColors[category]
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                Popular Tags
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                {allTags.slice(0, 12).map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Motion.div>

        {/* Results Counter */}
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-gray-900">
              {filteredModules.length} {filteredModules.length === 1 ? 'Result' : 'Results'}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
              {modules.length} Total Templates
            </span>
          </div>
          {selectedTags.length > 0 || selectedCategory !== 'all' ? (
            <button
              onClick={() => {
                setSelectedTags([]);
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-semibold"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          ) : null}
        </Motion.div>

        {/* Modules Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredModules.map((module, idx) => (
              <Motion.div
                key={module._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-purple-300 transition-all cursor-pointer group"
                onClick={() => setSelectedModule(module)}
              >
                {/* Thumbnail */}
                <div className={`relative h-56 bg-gradient-to-br ${categoryColors[module.metadata?.category] || 'from-purple-500 to-indigo-600'}`}>
                  {module.catalogSettings?.featured && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-xl animate-pulse">
                      <Award className="w-4 h-4" />
                      Featured
                    </div>
                  )}
                  {module.metadata?.thumbnail ? (
                    <img src={module.metadata.thumbnail} alt={module.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-24 h-24 text-white/50" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {module.name}
                      </h3>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      module.type === 'inavora' 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    }`}>
                      {module.type}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                    {module.description}
                  </p>

                  {/* Rating */}
                  {module.stats?.rating > 0 && (
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                      <div className="flex">{renderStars(module.stats.rating)}</div>
                      <span className="text-lg font-bold text-gray-900">{module.stats.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({module.stats.reviewCount} reviews)</span>
                    </div>
                  )}

                  {/* Tags */}
                  {module.metadata?.tags && module.metadata.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      {module.metadata.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Download className="w-5 h-5 text-purple-600" />
                      <span className="font-bold text-gray-900">{module.stats?.downloads || 0}</span>
                      <span className="text-sm">downloads</span>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-bold text-sm group/btn">
                      <Eye className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                      Preview
                    </button>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredModules.map((module, idx) => (
              <Motion.div
                key={module._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-gray-100 hover:border-purple-300"
                onClick={() => setSelectedModule(module)}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-36 h-36 bg-gradient-to-br rounded-2xl flex-shrink-0 overflow-hidden ${categoryColors[module.metadata?.category] || 'from-purple-500 to-indigo-600'}`}>
                    {module.metadata?.thumbnail ? (
                      <img src={module.metadata.thumbnail} alt={module.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-black text-gray-900">{module.name}</h3>
                      <div className="flex items-center gap-2">
                        {module.catalogSettings?.featured && (
                          <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-xl text-xs font-black flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                          module.type === 'inavora' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {module.type}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                      {module.description}
                    </p>

                    {module.metadata?.tags && (
                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        {module.metadata.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-6 text-sm">
                      {module.stats?.rating > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(module.stats.rating)}</div>
                          <span className="font-bold text-gray-900">{module.stats.rating.toFixed(1)}</span>
                          <span className="text-gray-500">({module.stats.reviewCount} reviews)</span>
                        </div>
                      )}
                      <span className="flex items-center gap-2 text-gray-600">
                        <Download className="w-4 h-4" />
                        <span className="font-bold">{module.stats?.downloads || 0} downloads</span>
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-lg font-semibold">
                        {module.metadata?.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        )}

        {/* Module Detail Modal */}
        {selectedModule && (
          <ModuleDetailModal module={selectedModule} onClose={() => setSelectedModule(null)} categoryColors={categoryColors} />
        )}

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-20 text-center border-2 border-gray-100">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="w-16 h-16 text-purple-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">No templates found</h3>
            <p className="text-gray-600 text-lg mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSelectedTags([]);
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Module Detail Modal
const ModuleDetailModal = ({ module, onClose, categoryColors }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-purple-300"
      >
        {/* Header */}
        <div className={`p-8 border-b-4 ${categoryColors[module.metadata?.category] || 'from-purple-500 to-indigo-600'} bg-gradient-to-r text-white relative`}>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all backdrop-blur-lg"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-start gap-4">
            {module.metadata?.thumbnail && (
              <img src={module.metadata.thumbnail} alt={module.name} className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-3xl font-black">{module.name}</h2>
                {module.catalogSettings?.featured && (
                  <span className="px-3 py-1.5 bg-yellow-400 text-yellow-900 rounded-xl text-sm font-black flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Featured
                  </span>
                )}
              </div>
              <p className="text-lg text-white/90 leading-relaxed">{module.description}</p>
              {module.stats?.rating > 0 && (
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex">{Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className={`w-5 h-5 ${i < Math.floor(module.stats.rating) ? 'fill-yellow-300 text-yellow-300' : 'text-white/40'}`} />
                  ))}</div>
                  <span className="text-xl font-bold">{module.stats.rating.toFixed(1)}</span>
                  <span className="text-white/80">({module.stats.reviewCount} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Preview Section */}
          <div>
            <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-purple-600" />
              Preview
            </h3>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-80 flex items-center justify-center overflow-hidden">
              {module.metadata?.videoDemo ? (
                <video controls className="w-full h-full rounded-2xl" src={module.metadata.videoDemo}></video>
              ) : (
                <div className="text-center">
                  <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No preview available</p>
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                Category
              </h4>
              <p className="text-lg text-gray-700 font-semibold">{module.metadata?.category}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Type
              </h4>
              <p className="text-lg text-gray-700 font-semibold capitalize">{module.type}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                Version
              </h4>
              <p className="text-lg text-gray-700 font-semibold">{module.version}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Download className="w-5 h-5 text-orange-600" />
                Downloads
              </h4>
              <p className="text-lg text-gray-700 font-semibold">{module.stats?.downloads || 0}</p>
            </div>
          </div>

          {/* Tags */}
          {module.metadata?.tags && module.metadata.tags.length > 0 && (
            <div>
              <h4 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-6 h-6 text-blue-600" />
                Tags
              </h4>
              <div className="flex items-center gap-3 flex-wrap">
                {module.metadata.tags.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 border-t-2 border-gray-200">
            <button className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all font-black text-lg">
              <Download className="w-6 h-6" />
              Install Template
            </button>
            <button className="px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
              <Share2 className="w-6 h-6 text-gray-700" />
            </button>
            <button className="px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
              <Heart className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Documentation */}
          {module.metadata?.documentation && (
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
              <h4 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                Documentation
              </h4>
              <a
                href={module.metadata.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-lg font-bold text-indigo-700 hover:text-indigo-900 transition-colors"
              >
                View Full Documentation
                <TrendingUp className="w-5 h-5" />
              </a>
            </div>
          )}
        </div>
      </Motion.div>
    </div>
  );
};

export default TemplateCatalog;
