import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Calendar,
  Coins,
  Crown,
  Copy,
  Edit3,
  Flame,
  Heart,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Smile,
  Sparkles,
  TrendingUp,
  Users,
  Link as LinkIcon,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../context/SocketContext";
import Avatar from "../../components/Avatar";
import api from "../../utils/api";
import {
  fetchParentProfileOverview,
  updateEmailNotifications,
} from "../../services/parentService";
import { updateUserProfile } from "../../services/dashboardService";

const formatRelativeTime = (date) => {
  if (!date) return "just now";
  const value = new Date(date).getTime();
  if (Number.isNaN(value)) {
    return "just now";
  }
  const diff = Date.now() - value;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

const StatCard = ({ icon, label, value, delta, gradient }) => {
  const IconComponent = icon;
  return (
    <Motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
          {delta && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              <TrendingUp className="h-3 w-3" />
              {delta}
            </span>
          )}
        </div>
        <div className="rounded-lg bg-indigo-50 p-2.5 shrink-0">
          <IconComponent className="h-5 w-5 text-indigo-600" />
        </div>
      </div>
    </Motion.div>
  );
};

const NotificationCard = ({ notification }) => (
  <Motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-2.5 hover:bg-slate-100 transition"
  >
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-md text-sm shrink-0 ${
        notification.type === "achievement"
          ? "bg-amber-100 text-amber-600"
          : notification.type === "alert"
          ? "bg-rose-100 text-rose-600"
          : notification.type === "message"
          ? "bg-blue-100 text-blue-600"
          : "bg-indigo-100 text-indigo-600"
      }`}
    >
      {notification.type === "achievement" && "🏆"}
      {notification.type === "alert" && "⚠️"}
      {notification.type === "message" && "💬"}
      {!["achievement", "alert", "message"].includes(notification.type) && "🔔"}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-slate-900">{notification.title}</p>
        <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
          {formatRelativeTime(notification.timestamp)}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-slate-600 line-clamp-2">{notification.message}</p>
    </div>
  </Motion.div>
);

const ChildCard = ({ child, onSelect }) => (
  <Motion.button
    type="button"
    onClick={() => onSelect(child)}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="relative">
        <img
          src={child.avatar}
          alt={child.name}
          className="h-12 w-12 rounded-lg border-2 border-slate-200 object-cover"
        />
        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white border-2 border-white">
          {child.level}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">{child.name}</p>
        <p className="text-xs text-slate-500 truncate">
          {child.grade || "Not specified"} • {child.institution || "Not specified"}
        </p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 mb-4">
      <div className="rounded-md bg-indigo-50 p-2">
        <p className="text-xs font-medium text-indigo-700 mb-0.5">Streak</p>
        <p className="text-base font-bold text-indigo-900">{child.streak} 🔥</p>
      </div>
      <div className="rounded-md bg-amber-50 p-2">
        <p className="text-xs font-medium text-amber-700 mb-0.5">HealCoins</p>
        <p className="text-base font-bold text-amber-900">{child.healCoins || 0}</p>
      </div>
      <div className="rounded-md bg-emerald-50 p-2">
        <p className="text-xs font-medium text-emerald-700 mb-0.5">Mastery</p>
        <p className="text-base font-bold text-emerald-900">{child.overallMastery || 0}%</p>
      </div>
      <div className="rounded-md bg-purple-50 p-2">
        <p className="text-xs font-medium text-purple-700 mb-0.5">Mood</p>
        <p className="text-base font-bold text-purple-900">
          {child.averageMoodScore ? `${child.averageMoodScore}/5` : "—"}
        </p>
      </div>
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
        <Activity className="h-3.5 w-3.5 text-slate-400" />
        {child.engagement?.minutes || 0} mins this week
      </span>
      <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
        View insights
        <ArrowUpRight className="h-3 w-3" />
      </span>
    </div>
  </Motion.button>
);

const ParentProfile = () => {
  const { user } = useAuth();
  const { subscribeProfileUpdate, socket } = useSocket();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("/avatars/avatar1.png");
  const [studentLinkingCode, setStudentLinkingCode] = useState("");
  const [linkingStudent, setLinkingStudent] = useState(false);
  const [showLinkStudentForm, setShowLinkStudentForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000";

  const normalizeAvatarUrl = useCallback(
    (src) => {
      if (!src) return src;
      if (src.startsWith("http")) return src;
      if (src.startsWith("/uploads/")) return `${apiBaseUrl}${src}`;
      return src;
    },
    [apiBaseUrl]
  );

  const getCurrentUserId = useCallback(() => {
    return (
      overview?.parent?._id ||
      overview?.parent?.id ||
      overview?.parent?.userId ||
      user?._id ||
      user?.id ||
      user?.userId ||
      null
    );
  }, [
    overview?.parent?._id,
    overview?.parent?.id,
    overview?.parent?.userId,
    user?._id,
    user?.id,
    user?.userId,
  ]);

  const loadOverview = useCallback(async (opts = { silent: false }) => {
    try {
      if (!opts.silent) {
        setLoading(true);
      }
      setError(null);
      const data = await fetchParentProfileOverview();
      setOverview(data);
      setAvatarPreview(
        normalizeAvatarUrl(data.parent?.avatar) || "/avatars/avatar1.png"
      );
      setFormState((prev) => ({
        ...prev,
        name: data.parent?.name || "",
        phone: data.parent?.phone || "",
        location: data.parent?.location || "",
        bio: data.parent?.bio || "",
      }));
    } catch (err) {
      console.error("Failed to load parent profile overview", err);
      setError(err);
      toast.error("Unable to load parent profile right now.");
    } finally {
      setLoading(false);
    }
  }, [normalizeAvatarUrl]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (isEditing || showPasswordModal || selectedChild) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEditing, showPasswordModal, selectedChild]);

  useEffect(() => {
    if (!subscribeProfileUpdate) return undefined;
    const unsubscribe = subscribeProfileUpdate((payload) => {
      if (!payload) return;
      if (user && payload.userId === (user._id || user.id)) {
        setOverview((prev) =>
          prev
            ? {
                ...prev,
                parent: {
                  ...prev.parent,
                  name: payload.fullName || payload.name || prev.parent.name,
                  phone: payload.phone ?? prev.parent.phone,
                  location: payload.location ?? prev.parent.location,
                  bio: payload.bio ?? prev.parent.bio,
                  avatar: payload.avatar || prev.parent.avatar,
                  preferences: payload.preferences || prev.parent.preferences,
                },
              }
            : prev
        );
        setFormState((prev) => ({
          ...prev,
          name: payload.fullName || payload.name || prev.name,
          phone: payload.phone ?? prev.phone,
          location: payload.location ?? prev.location,
          bio: payload.bio ?? prev.bio,
        }));
        if (payload.avatar) {
          setAvatarPreview(normalizeAvatarUrl(payload.avatar));
        }
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [normalizeAvatarUrl, subscribeProfileUpdate, user]);

  const handleProfileFieldChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const response = await updateUserProfile({
        name: formState.name,
        phone: formState.phone,
        location: formState.location,
        bio: formState.bio,
        personal: {
          name: formState.name,
          phone: formState.phone,
          location: formState.location,
          bio: formState.bio,
        },
      });
      toast.success("Profile updated successfully");
      
      // Update overview state immediately with saved values
      setOverview((prev) =>
        prev
          ? {
              ...prev,
              parent: {
                ...prev.parent,
                name: formState.name,
                phone: formState.phone,
                location: formState.location,
                bio: formState.bio,
                ...(response?.user || {}),
              },
            }
          : prev
      );
      
      setIsEditing(false);
      await loadOverview({ silent: true });
      if (socket) {
        socket.emit("profile_updated", {
          userId: user?._id || user?.id,
          name: formState.name,
          phone: formState.phone,
          location: formState.location,
          bio: formState.bio,
        });
      }
    } catch (err) {
      console.error("Failed to update parent profile", err);
      toast.error(
        err?.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const applyAvatarUpdate = useCallback(
    (newAvatarUrl) => {
      if (!newAvatarUrl) return;
      setOverview((prev) =>
        prev
          ? {
              ...prev,
              parent: {
                ...prev.parent,
                avatar: newAvatarUrl,
              },
            }
          : prev
      );
      setAvatarPreview(normalizeAvatarUrl(newAvatarUrl));
      if (socket && getCurrentUserId()) {
        socket.emit("profile_updated", {
          userId: getCurrentUserId(),
          avatar: newAvatarUrl,
        });
      }
    },
    [getCurrentUserId, normalizeAvatarUrl, socket]
  );

  const avatarUser = useMemo(() => {
    const baseUser = user ? { ...user } : {};
    const userId =
      overview?.parent?._id ||
      overview?.parent?.id ||
      overview?.parent?.userId ||
      baseUser._id ||
      baseUser.id ||
      baseUser.userId ||
      null;

    const name = overview?.parent?.name || baseUser.name;
    const email = overview?.parent?.email || baseUser.email;
    const avatarSrc =
      normalizeAvatarUrl(overview?.parent?.avatar) || avatarPreview;

    return {
      ...baseUser,
      _id: userId || baseUser._id,
      id: userId || baseUser.id,
      name,
      email,
      avatar: avatarSrc,
    };
  }, [avatarPreview, normalizeAvatarUrl, overview?.parent, user]);

  const handleToggleEmailNotifications = async () => {
    if (!overview) return;
    const currentValue =
      overview.parent?.preferences?.notifications?.email !== undefined
        ? overview.parent.preferences.notifications.email
        : true;
    const nextValue = !currentValue;
    setNotificationLoading(true);
    try {
      await updateEmailNotifications(nextValue);
      toast.success(
        nextValue ? "Email alerts enabled" : "Email alerts turned off"
      );
      setOverview((prev) =>
        prev
          ? {
              ...prev,
              parent: {
                ...prev.parent,
                preferences: {
                  ...(prev.parent?.preferences || {}),
                  notifications: {
                    ...(prev.parent?.preferences?.notifications || {}),
                    email: nextValue,
                  },
                },
              },
            }
          : prev
      );
    } catch (err) {
      console.error("Failed to update email notifications", err);
      toast.error("Unable to update email notifications right now.");
    } finally {
      setNotificationLoading(false);
    }
  };

  const insights = useMemo(() => {
    if (!overview) return [];
    const data = overview.insights || {};
    return [
      {
        label: "Linked Children",
        value: data.totalChildren || 0,
        icon: Users,
        gradient: "from-indigo-500/20 to-purple-500/10",
      },
      {
        label: "Active Learners",
        value: data.activeChildren || 0,
        icon: Sparkles,
        gradient: "from-emerald-500/15 to-lime-500/10",
        delta:
          data.totalChildren > 0
            ? `${Math.round((data.activeChildren / data.totalChildren) * 100)}% active`
            : null,
      },
      {
        label: "Family HealCoins",
        value: data.totalHealCoins || 0,
        icon: Coins,
        gradient: "from-amber-500/15 to-orange-500/10",
      },
      {
        label: "Weekly Engagement",
        value: `${data.avgWeeklyEngagementMinutes || 0} mins`,
        icon: Activity,
        gradient: "from-sky-500/15 to-cyan-500/10",
      },
    ];
  }, [overview]);

  const handleCopyLinkingCode = useCallback(async () => {
    if (!overview?.parent?.linkingCode) return;
    try {
      await navigator.clipboard.writeText(overview.parent.linkingCode);
      setCopiedCode(true);
      toast.success("Linking code copied!");
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy linking code", err);
      toast.error("Unable to copy right now. Please copy manually.");
    }
  }, [overview?.parent?.linkingCode]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setChangingPassword(true);
      await api.put("/api/user/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLinkSchoolStudent = useCallback(async (e) => {
    e?.preventDefault();
    if (!studentLinkingCode.trim()) {
      toast.error("Please enter a student linking code");
      return;
    }

    try {
      setLinkingStudent(true);
      const response = await api.post("/api/auth/parent/link-school-student", {
        studentLinkingCode: studentLinkingCode.trim().toUpperCase(),
      });

      if (response.data.success) {
        toast.success("Successfully linked to school student!");
        setStudentLinkingCode("");
        setShowLinkStudentForm(false);
        loadOverview({ silent: true });
        // Emit realtime event if socket is available
        if (socket) {
          socket.emit("child_linked", {
            childId: response.data.student.id,
            childName: response.data.student.name,
          });
        }
      }
    } catch (error) {
      console.error("Error linking school student:", error);
      toast.error(error.response?.data?.message || "Failed to link to school student");
    } finally {
      setLinkingStudent(false);
    }
  }, [studentLinkingCode, socket, loadOverview]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-sky-50">
        <Motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          className="h-20 w-20 rounded-full border-4 border-indigo-500 border-t-transparent"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="rounded-3xl bg-white p-10 shadow-2xl">
          <AlertTriangle className="mx-auto h-16 w-16 text-rose-500" />
          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-slate-500">
            We couldn't load your profile overview. Please refresh and try again.
          </p>
          <button
            type="button"
            onClick={() => loadOverview()}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!overview) {
    return null;
  }

  const { parent, children = [], notifications = [] } = overview;

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Professional Header Section */}
        <Motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4 flex-1">
                <Avatar
                  user={avatarUser || user}
                  size="large"
                  showCustomize
                  className="border-4 border-white shadow-xl rounded-full"
                  onAvatarUpdate={(updated) => {
                    const nextAvatar = updated?.url || updated?.avatar || updated;
                    if (!nextAvatar) return;
                    applyAvatarUpdate(nextAvatar);
                  }}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-white">
                      {parent.name || "Parent"}
                    </h1>
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white/90">
                      Parent
                    </span>
                  </div>
                  <p className="text-sm text-white/80">{parent.email}</p>
                  {parent.bio && (
                    <p className="mt-1 text-sm text-white/70 max-w-2xl">{parent.bio}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (overview?.parent) {
                      setFormState({
                        name: overview.parent.name || "",
                        phone: overview.parent.phone || "",
                        location: overview.parent.location || "",
                        bio: overview.parent.bio || "",
                      });
                    }
                    setIsEditing(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/20 backdrop-blur px-4 py-2 text-sm font-medium text-white transition hover:bg-white/30"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/20 backdrop-blur px-4 py-2 text-sm font-medium text-white transition hover:bg-white/30"
                >
                  <Lock className="h-4 w-4" />
                  Password
                </button>
                <Link
                  to="/parent/settings"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-md transition hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Contact & Quick Actions */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {parent.phone && (
                <div className="flex items-center gap-2 text-slate-600">
                  <MessageCircle className="h-4 w-4 text-slate-400" />
                  <span>{parent.phone}</span>
                </div>
              )}
              {parent.location && (
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{parent.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Linking Sections */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {parent.linkingCode && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-700 mb-1">
                      Secret Linking Code
                    </p>
                    <p className="text-xs text-slate-600">
                      Share with your child to connect their account
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLinkingCode}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700 shrink-0"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copiedCode ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="rounded-lg bg-white border border-slate-200 px-4 py-2.5 text-center text-sm font-mono tracking-wider text-slate-900">
                  {parent.linkingCode}
                </div>
              </div>
            )}

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700 mb-1">
                    Link School Student
                  </p>
                  <p className="text-xs text-slate-600">
                    Connect your child's school account
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLinkStudentForm(!showLinkStudentForm)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700 shrink-0"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  {showLinkStudentForm ? "Cancel" : "Link"}
                </button>
              </div>
              {showLinkStudentForm && (
                <form onSubmit={handleLinkSchoolStudent} className="space-y-2">
                  <input
                    type="text"
                    value={studentLinkingCode}
                    onChange={(e) => setStudentLinkingCode(e.target.value.toUpperCase())}
                    placeholder="SST-XXXXXX"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono uppercase text-xs"
                  />
                  <button
                    type="submit"
                    disabled={linkingStudent || !studentLinkingCode.trim()}
                    className="w-full px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {linkingStudent ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Linking...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-3.5 w-3.5" />
                        Link Student
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </Motion.section>

        {/* Stats Overview */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Children Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Children Overview</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{children.length} child{children.length !== 1 ? 'ren' : ''} linked</p>
                </div>
              </div>
              
              {children.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                  <Users className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-base font-semibold text-slate-800 mb-2">No children linked yet</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Share your secret linking code to connect your child's account.
                  </p>
                  <Link
                    to="/parent/settings"
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                  >
                    Link a child
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {children.map((child) => (
                    <ChildCard key={child.id} child={child} onSelect={setSelectedChild} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Alerts & Notifications */}
          <div className="space-y-6">
            {/* Smart Alerts */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900">Smart Alerts</h3>
                <button
                  type="button"
                  onClick={handleToggleEmailNotifications}
                  disabled={notificationLoading}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    overview.parent?.preferences?.notifications?.email ?? true
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  } disabled:opacity-60`}
                >
                  <Bell className={`h-3 w-3 ${notificationLoading ? "animate-pulse" : ""}`} />
                  {overview.parent?.preferences?.notifications?.email ?? true ? "On" : "Off"}
                </button>
              </div>
              <div className="space-y-2">
                {overview.nextActions.map((action) => (
                  <div
                    key={`${action.title}-${action.category}`}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 transition"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 shrink-0 mt-0.5">
                        {action.category === "wellbeing" && <Heart className="h-3.5 w-3.5" />}
                        {action.category === "rewards" && <Crown className="h-3.5 w-3.5" />}
                        {action.category === "subscription" && <Calendar className="h-3.5 w-3.5" />}
                        {action.category === "engagement" && <Flame className="h-3.5 w-3.5" />}
                        {!["wellbeing", "rewards", "subscription", "engagement"].includes(
                          action.category
                        ) && <Sparkles className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{action.title}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{action.description}</p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium shrink-0 ${
                          action.priority === "high"
                            ? "bg-rose-100 text-rose-700"
                            : action.priority === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {action.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">Recent Notifications</h3>
              </div>
              <div className="space-y-2.5">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">
                    You're all caught up! No new notifications.
                  </p>
                ) : (
                  notifications.slice(0, 4).map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <Link
                  to="/parent/notifications"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View all
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
          >
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Update profile</h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
                >
                  ×
                </button>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Full name</label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => handleProfileFieldChange("name", e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="Your name"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Phone</label>
                    <input
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => handleProfileFieldChange("phone", e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      placeholder="+91 90000 00000"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Location</label>
                    <input
                      type="text"
                      value={formState.location}
                      onChange={(e) => handleProfileFieldChange("location", e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Bio</label>
                  <textarea
                    value={formState.bio}
                    onChange={(e) => handleProfileFieldChange("bio", e.target.value)}
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="Tell us about your family or goals"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-2xl px-5 py-3 text-sm font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
                >
                  {savingProfile && <RefreshCcw className="h-4 w-4 animate-spin" />}
                  Save changes
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPasswordModal && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
          >
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Change password</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Current password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">New password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="Enter new password (min. 6 characters)"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Confirm new password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    }}
                    className="rounded-2xl px-5 py-3 text-sm font-semibold text-slate-500 hover:text-slate-700"
                    disabled={changingPassword}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {changingPassword && <RefreshCcw className="h-4 w-4 animate-spin" />}
                    Change password
                  </button>
                </div>
              </form>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedChild && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedChild(null)}
          >
            <Motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedChild.avatar}
                      alt={selectedChild.name}
                      className="h-12 w-12 rounded-lg border-2 border-slate-200 object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{selectedChild.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedChild.grade || "Not specified"} • {selectedChild.institution || "Not specified"}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                          <Sparkles className="h-3 w-3" />
                          Level {selectedChild.level || 1}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          <Coins className="h-3 w-3" />
                          {selectedChild.healCoins || 0} HealCoins
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          <Smile className="h-3 w-3" />
                          Mood {selectedChild.averageMoodScore ?? "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedChild(null)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                    <p className="text-xs font-medium text-indigo-600 mb-1 uppercase tracking-wide">Weekly engagement</p>
                    <p className="text-xl font-bold text-indigo-700">
                      {selectedChild.engagement?.minutes || 0} mins
                    </p>
                    <p className="text-xs text-indigo-600 mt-0.5">
                      {selectedChild.engagement?.sessions || 0} learning sessions
                    </p>
                  </div>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <p className="text-xs font-medium text-emerald-600 mb-1 uppercase tracking-wide">Mastery pulse</p>
                    <p className="text-xl font-bold text-emerald-700">{selectedChild.overallMastery || 0}%</p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      {selectedChild.totalGamesPlayed || 0} games played
                    </p>
                  </div>
                  <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
                    <p className="text-xs font-medium text-rose-600 mb-1 uppercase tracking-wide">Alerts</p>
                    <p className="text-xl font-bold text-rose-700">{selectedChild.alerts?.length || 0}</p>
                    <p className="text-xs text-rose-600 mt-0.5">
                      Priority checkpoints
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                      Top strengths
                    </h4>
                    <div className="space-y-2">
                      {selectedChild.topPillars && selectedChild.topPillars.length > 0 ? (
                        selectedChild.topPillars.map((pillar) => (
                          <div
                            key={pillar.name}
                            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm border border-slate-200"
                          >
                            <span className="font-medium text-slate-700">{pillar.name}</span>
                            <span className="text-slate-600">{pillar.percentage}%</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">Not enough data yet.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                      Focus areas
                    </h4>
                    <div className="space-y-2">
                      {selectedChild.alerts && selectedChild.alerts.length > 0 ? (
                        selectedChild.alerts.map((alert, index) => (
                          <div
                            key={`${alert.type}-${index}`}
                            className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700"
                          >
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            <span className="text-xs">{alert.message}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No urgent alerts. Keep encouraging consistent progress!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                <Link
                  to={`/parent/child/${selectedChild.id}/analytics`}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                >
                  View full analytics
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedChild(null)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Close
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParentProfile;

