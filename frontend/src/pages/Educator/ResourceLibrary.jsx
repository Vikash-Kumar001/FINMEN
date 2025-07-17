import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Search,
    Filter,
    Plus,
    Download,
    Upload,
    Share2,
    Bookmark,
    Star,
    FolderPlus,
    Folder,
    Tag,
    List,
    Grid,
    Clock,
    Calendar,
    Users,
    BookOpen,
    Video,
    Image,
    File,
    Link,
    Paperclip,
    Edit,
    Trash2,
    Copy,
    Eye,
    Sparkles,
    Lightbulb,
    Cpu,
    RefreshCw,
    Database,
    Zap,
    Heart,
} from "lucide-react";

const ResourceLibrary = () => {
    // State management
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [showResourceModal, setShowResourceModal] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [sortBy, setSortBy] = useState("recent");
    const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
    const [showAIRecommendations, setShowAIRecommendations] = useState(false);

    // Sample data for resources
    const resources = [
        {
            id: 1,
            title: "Financial Literacy Fundamentals",
            description: "Comprehensive guide to basic financial concepts for teens",
            type: "document",
            format: "pdf",
            category: "finance",
            url: "#",
            thumbnail: "📄",
            author: "Financial Education Team",
            dateAdded: "2023-10-05",
            lastAccessed: "2023-11-10",
            accessCount: 78,
            rating: 4.7,
            fileSize: "2.4 MB",
            collections: ["Core Materials", "Beginner Resources"],
            tags: ["finance", "basics", "literacy"],
            aiRecommended: true,
        },
        {
            id: 2,
            title: "Budgeting Workshop Slides",
            description: "Interactive presentation for teaching budgeting skills",
            type: "presentation",
            format: "pptx",
            category: "budgeting",
            url: "#",
            thumbnail: "🖼️",
            author: "Sarah Johnson",
            dateAdded: "2023-09-18",
            lastAccessed: "2023-11-12",
            accessCount: 45,
            rating: 4.5,
            fileSize: "5.8 MB",
            collections: ["Workshop Materials", "Interactive Resources"],
            tags: ["budgeting", "workshop", "interactive"],
            aiRecommended: false,
        },
        {
            id: 3,
            title: "Investment Basics Video Series",
            description: "Five-part video series explaining investment concepts for beginners",
            type: "video",
            format: "mp4",
            category: "investing",
            url: "#",
            thumbnail: "🎬",
            author: "Investment Education Channel",
            dateAdded: "2023-10-22",
            lastAccessed: "2023-11-08",
            accessCount: 120,
            rating: 4.9,
            fileSize: "450 MB",
            collections: ["Video Resources", "Investment Materials"],
            tags: ["investing", "video", "series"],
            aiRecommended: true,
        },
        {
            id: 4,
            title: "Saving Strategies Infographic",
            description: "Visual guide to effective saving strategies for students",
            type: "image",
            format: "png",
            category: "saving",
            url: "#",
            thumbnail: "📊",
            author: "Design Team",
            dateAdded: "2023-11-01",
            lastAccessed: "2023-11-15",
            accessCount: 67,
            rating: 4.3,
            fileSize: "1.2 MB",
            collections: ["Visual Aids", "Quick References"],
            tags: ["saving", "infographic", "visual"],
            aiRecommended: false,
        },
        {
            id: 5,
            title: "Financial Goal Setting Worksheet",
            description: "Interactive worksheet for students to set and track financial goals",
            type: "worksheet",
            format: "xlsx",
            category: "planning",
            url: "#",
            thumbnail: "📝",
            author: "Curriculum Development Team",
            dateAdded: "2023-10-15",
            lastAccessed: "2023-11-14",
            accessCount: 92,
            rating: 4.6,
            fileSize: "780 KB",
            collections: ["Worksheets", "Interactive Resources"],
            tags: ["goals", "planning", "worksheet"],
            aiRecommended: true,
        },
        {
            id: 6,
            title: "Credit and Debt Management Guide",
            description: "Comprehensive resource for teaching about credit and debt",
            type: "document",
            format: "pdf",
            category: "credit",
            url: "#",
            thumbnail: "📄",
            author: "Financial Literacy Association",
            dateAdded: "2023-09-28",
            lastAccessed: "2023-11-05",
            accessCount: 53,
            rating: 4.8,
            fileSize: "3.1 MB",
            collections: ["Core Materials", "Advanced Topics"],
            tags: ["credit", "debt", "management"],
            aiRecommended: false,
        },
    ];

    // Sample data for collections
    const collections = [
        {
            id: 1,
            name: "Core Materials",
            description: "Essential resources for financial education curriculum",
            resourceCount: 15,
            lastUpdated: "2023-11-10",
            icon: "📚",
            color: "blue",
        },
        {
            id: 2,
            name: "Workshop Materials",
            description: "Resources for interactive workshops and activities",
            resourceCount: 8,
            lastUpdated: "2023-11-05",
            icon: "🧩",
            color: "purple",
        },
        {
            id: 3,
            name: "Video Resources",
            description: "Educational videos on various financial topics",
            resourceCount: 12,
            lastUpdated: "2023-11-12",
            icon: "🎥",
            color: "red",
        },
        {
            id: 4,
            name: "Visual Aids",
            description: "Infographics, charts, and visual learning materials",
            resourceCount: 10,
            lastUpdated: "2023-10-28",
            icon: "📊",
            color: "green",
        },
        {
            id: 5,
            name: "Worksheets",
            description: "Interactive worksheets and exercises for students",
            resourceCount: 14,
            lastUpdated: "2023-11-08",
            icon: "📝",
            color: "orange",
        },
    ];

    // Sample data for AI recommendations
    const aiRecommendations = [
        {
            id: "rec1",
            title: "Retirement Planning Basics",
            description: "Introduction to retirement planning concepts for teens",
            reasoning: "Complements your recent uploads on long-term financial planning",
            type: "document",
            source: "Financial Education Network",
            confidence: 92,
            thumbnail: "📄",
        },
        {
            id: "rec2",
            title: "Interactive Budget Game",
            description: "Gamified learning experience for budget management",
            reasoning: "Students engage well with your interactive resources",
            type: "interactive",
            source: "FinEdu Games",
            confidence: 87,
            thumbnail: "🎮",
        },
        {
            id: "rec3",
            title: "Financial Vocabulary Flashcards",
            description: "Digital flashcards covering essential financial terms",
            reasoning: "Supports vocabulary building for your beginner students",
            type: "learning aid",
            source: "Educator Resource Hub",
            confidence: 85,
            thumbnail: "🔤",
        },
    ];

    // Categories for filtering
    const categories = [
        { id: "all", name: "All Categories" },
        { id: "finance", name: "Financial Literacy" },
        { id: "budgeting", name: "Budgeting" },
        { id: "investing", name: "Investing" },
        { id: "saving", name: "Saving" },
        { id: "planning", name: "Financial Planning" },
        { id: "credit", name: "Credit & Debt" },
    ];

    // Resource types for filtering
    const resourceTypes = [
        { id: "all", name: "All Types" },
        { id: "document", name: "Documents" },
        { id: "presentation", name: "Presentations" },
        { id: "video", name: "Videos" },
        { id: "image", name: "Images & Infographics" },
        { id: "worksheet", name: "Worksheets" },
        { id: "interactive", name: "Interactive Resources" },
    ];

    // Sort options
    const sortOptions = [
        { id: "recent", name: "Most Recent" },
        { id: "popular", name: "Most Popular" },
        { id: "rating", name: "Highest Rated" },
        { id: "title", name: "Title (A-Z)" },
    ];

    // Filter resources based on search, category, and type
    const filteredResources = resources.filter(
        (resource) =>
            (filterCategory === "all" || resource.category === filterCategory) &&
            (filterType === "all" || resource.type === filterType) &&
            (searchTerm === "" ||
                resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    // Sort resources based on selected sort option
    const sortedResources = [...filteredResources].sort((a, b) => {
        switch (sortBy) {
            case "recent":
                return new Date(b.dateAdded) - new Date(a.dateAdded);
            case "popular":
                return b.accessCount - a.accessCount;
            case "rating":
                return b.rating - a.rating;
            case "title":
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    // Simulate real-time data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(new Date().toLocaleTimeString());
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Handle resource actions
    const handleCreateResource = () => {
        setSelectedResource(null);
        setShowResourceModal(true);
    };

    const handleEditResource = (resource) => {
        setSelectedResource(resource);
        setShowResourceModal(true);
    };

    const handleDeleteResource = (id) => {
        if (window.confirm("Are you sure you want to delete this resource?")) {
            // Delete logic would go here
            alert(`Resource ${id} would be deleted`);
        }
    };

    const handleViewResource = (resource) => {
        alert(`Viewing resource: ${resource.title}`);
        // In a real app, this would open the resource or show a detailed view
    };

    const handleDownloadResource = (resource) => {
        alert(`Downloading resource: ${resource.title}`);
        // In a real app, this would trigger a download
    };

    const handleShareResource = (resource) => {
        alert(`Sharing resource: ${resource.title}`);
        // In a real app, this would open a sharing dialog
    };

    // Handle collection actions
    const handleCreateCollection = () => {
        setSelectedCollection(null);
        setShowCollectionModal(true);
    };

    const handleEditCollection = (collection) => {
        setSelectedCollection(collection);
        setShowCollectionModal(true);
    };

    const handleViewCollection = (collection) => {
        alert(`Viewing collection: ${collection.name}`);
        // In a real app, this would show the collection contents
    };

    // Handle data refresh
    const handleRefreshData = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setLastUpdated(new Date().toLocaleTimeString());
            alert("Resource library refreshed");
        }, 800);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    // Get icon based on resource type
    const getResourceIcon = (type) => {
        switch (type) {
            case "document":
                return <FileText className="w-6 h-6" />;
            case "presentation":
                return <Folder className="w-6 h-6" />;
            case "video":
                return <Video className="w-6 h-6" />;
            case "image":
                return <Image className="w-6 h-6" />;
            case "worksheet":
                return <File className="w-6 h-6" />;
            case "interactive":
                return <Zap className="w-6 h-6" />;
            default:
                return <Link className="w-6 h-6" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                            <span className="text-lg font-semibold text-gray-800">
                                Loading...
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-black">
                                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
                                    Resource Library
                                </span>
                            </h1>
                            <p className="text-gray-600 text-lg mt-2">
                                Curated educational resources with smart recommendations
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefreshData}
                                className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                                title="Refresh Data"
                            >
                                <RefreshCw className="w-5 h-5 text-indigo-600" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCreateResource}
                                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add Resource</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCreateCollection}
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                            >
                                <FolderPlus className="w-5 h-5" />
                                <span>New Collection</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-white/50 mb-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Database className="w-5 h-5 text-indigo-500" />
                                    <span className="text-sm font-medium text-gray-600">
                                        {resources.length} Resources
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Folder className="w-5 h-5 text-purple-500" />
                                    <span className="text-sm font-medium text-gray-600">
                                        {collections.length} Collections
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    <span className="text-sm font-medium text-gray-600">
                                        Last updated: {lastUpdated}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowAIRecommendations(!showAIRecommendations)}
                                    className={`px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 ${showAIRecommendations ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white" : "bg-white text-gray-700"}`}
                                >
                                    <Sparkles className="w-5 h-5" />
                                    <span>AI Recommendations</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-white/50 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Search resources by title, description, or tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <select
                                    className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-xl bg-white/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-xl bg-white/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    {resourceTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-xl bg-white/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>

                                <div className="flex items-center bg-white/50 border border-gray-300 rounded-xl overflow-hidden">
                                    <button
                                        className={`px-3 py-2 ${viewMode === "grid" ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:bg-gray-100"}`}
                                        onClick={() => setViewMode("grid")}
                                        title="Grid View"
                                    >
                                        <Grid className="w-5 h-5" />
                                    </button>
                                    <button
                                        className={`px-3 py-2 ${viewMode === "list" ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:bg-gray-100"}`}
                                        onClick={() => setViewMode("list")}
                                        title="List View"
                                    >
                                        <List className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* AI Recommendations Section */}
                {showAIRecommendations && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-8"
                    >
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 shadow-md border border-amber-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-amber-800 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                    AI-Recommended Resources
                                </h2>
                                <div className="text-sm text-amber-700 flex items-center gap-1">
                                    <Cpu className="w-4 h-4" />
                                    Powered by EdTech AI
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {aiRecommendations.map((rec) => (
                                    <motion.div
                                        key={rec.id}
                                        variants={itemVariants}
                                        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-amber-100 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="text-2xl">{rec.thumbnail}</div>
                                            <div className="flex-grow">
                                                <h3 className="font-semibold text-gray-800">{rec.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                                                <div className="mt-2 text-xs text-amber-700 italic">
                                                    "{rec.reasoning}"
                                                </div>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <span className="text-xs text-gray-500">{rec.source}</span>
                                                    <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full">
                                                        <Lightbulb className="w-3 h-3 text-amber-600" />
                                                        <span className="text-xs font-medium text-amber-800">
                                                            {rec.confidence}% match
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-end gap-2">
                                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                                Add to Library
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Collections Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-8"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Folder className="w-5 h-5 text-indigo-500" />
                        Collections
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {collections.map((collection) => (
                            <motion.div
                                key={collection.id}
                                variants={itemVariants}
                                className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-${collection.color}-100 hover:shadow-lg transition-all duration-300 cursor-pointer`}
                                onClick={() => handleViewCollection(collection)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-2xl">{collection.icon}</div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditCollection(collection);
                                            }}
                                            className="p-1 text-gray-400 hover:text-indigo-600"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-800">{collection.name}</h3>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {collection.description}
                                </p>
                                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                    <span>{collection.resourceCount} resources</span>
                                    <span>Updated {collection.lastUpdated}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Resources Section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            Resources
                        </h2>
                        <div className="text-sm text-gray-500">
                            {sortedResources.length} of {resources.length} resources
                        </div>
                    </div>

                    {sortedResources.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-md border border-gray-100 text-center">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                No resources found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Try adjusting your search or filters to find what you're looking for.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterCategory("all");
                                    setFilterType("all");
                                }}
                                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sortedResources.map((resource) => (
                                <motion.div
                                    key={resource.id}
                                    variants={itemVariants}
                                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg text-indigo-600">
                                            {getResourceIcon(resource.type)}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-start justify-between">
                                                <h3 className="font-semibold text-gray-800">{resource.title}</h3>
                                                {resource.aiRecommended && (
                                                    <div className="ml-2 flex items-center bg-amber-100 px-1.5 py-0.5 rounded-full">
                                                        <Sparkles className="w-3 h-3 text-amber-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {resource.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {resource.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <div className="flex items-center mr-3">
                                                <Star className="w-4 h-4 text-amber-400 mr-1" />
                                                <span>{resource.rating}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Eye className="w-4 h-4 text-gray-400 mr-1" />
                                                <span>{resource.accessCount}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleViewResource(resource)}
                                                className="p-1.5 text-gray-400 hover:text-indigo-600"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDownloadResource(resource)}
                                                className="p-1.5 text-gray-400 hover:text-indigo-600"
                                                title="Download"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleShareResource(resource)}
                                                className="p-1.5 text-gray-400 hover:text-indigo-600"
                                                title="Share"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditResource(resource)}
                                                className="p-1.5 text-gray-400 hover:text-indigo-600"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Resource
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rating
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Added
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedResources.map((resource) => (
                                        <motion.tr
                                            key={resource.id}
                                            variants={itemVariants}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg text-indigo-600">
                                                        {getResourceIcon(resource.type)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="flex items-center">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {resource.title}
                                                            </div>
                                                            {resource.aiRecommended && (
                                                                <div className="ml-2 flex items-center bg-amber-100 px-1.5 py-0.5 rounded-full">
                                                                    <Sparkles className="w-3 h-3 text-amber-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-gray-500 line-clamp-1">
                                                            {resource.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {resource.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-500">{resource.category}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Star className="w-4 h-4 text-amber-400 mr-1" />
                                                    <span className="text-sm text-gray-500">{resource.rating}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {resource.dateAdded}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleViewResource(resource)}
                                                        className="p-1 text-gray-400 hover:text-indigo-600"
                                                        title="View"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownloadResource(resource)}
                                                        className="p-1 text-gray-400 hover:text-indigo-600"
                                                        title="Download"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleShareResource(resource)}
                                                        className="p-1 text-gray-400 hover:text-indigo-600"
                                                        title="Share"
                                                    >
                                                        <Share2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditResource(resource)}
                                                        className="p-1 text-gray-400 hover:text-indigo-600"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Footer */}
                <div className="mt-12 text-center text-sm text-gray-500">
                    <p>Resource Library • Powered by FINMEN Education Platform</p>
                </div>
            </div>

            {/* Resource Modal would go here */}
            {/* Collection Modal would go here */}
        </div>
    );
};

export default ResourceLibrary;