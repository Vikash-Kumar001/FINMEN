import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  Crown,
  Copy,
  Edit3,
  Flame,
  LineChart,
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
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../context/SocketContext";
import Avatar from "../../components/Avatar";
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
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-3xl border border-white/40 bg-white/90 p-6 shadow-lg backdrop-blur ${gradient}`}
    >
      <div className="absolute inset-0 opacity-10" />
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
          {delta && (
            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              {delta}
            </span>
          )}
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-4 text-white shadow-lg">
          <IconComponent className="h-7 w-7" />
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
    className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur"
  >
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${
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
    <div className="flex-1">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-slate-900">{notification.title}</p>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {formatRelativeTime(notification.timestamp)}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
    </div>
  </Motion.div>
);

const ChildCard = ({ child, onSelect }) => (
  <Motion.button
    type="button"
    onClick={() => onSelect(child)}
    whileHover={{ y: -6 }}
    whileTap={{ scale: 0.98 }}
    className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white/80 p-6 text-left shadow-lg transition hover:border-indigo-200 hover:bg-white backdrop-blur"
  >
    <div className="flex items-center gap-4">
      <div className="relative">
        <img
          src={child.avatar}
          alt={child.name}
          className="h-14 w-14 rounded-2xl border-2 border-white object-cover shadow-lg"
        />
        <span className="absolute -bottom-2 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white shadow">
          {child.level}
        </span>
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-900">{child.name}</p>
        <p className="text-sm text-slate-500">
          {child.grade} • {child.institution}
        </p>
      </div>
    </div>
    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
      <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
        <p className="font-semibold">Streak</p>
        <p className="mt-1 text-xl font-black">{child.streak} 🔥</p>
      </div>
      <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
        <p className="font-semibold">HealCoins</p>
        <p className="mt-1 text-xl font-black">{child.healCoins}</p>
      </div>
      <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
        <p className="font-semibold">Mastery</p>
        <p className="mt-1 text-xl font-black">{child.overallMastery}%</p>
      </div>
      <div className="rounded-2xl bg-purple-50 p-3 text-purple-600">
        <p className="font-semibold">Mood</p>
        <p className="mt-1 text-xl font-black">
          {child.averageMoodScore ? `${child.averageMoodScore}/5` : "—"}
        </p>
      </div>
    </div>
    <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
      <span className="inline-flex items-center gap-1">
        <Activity className="h-4 w-4 text-indigo-500" />
        {child.engagement.minutes} mins this week
      </span>
      <span className="inline-flex items-center gap-1 text-indigo-500 group-hover:text-indigo-600">
        View insights
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </div>
  </Motion.button>
);

const ParentProfile = () => {
  const { user } = useAuth();
  const { subscribeProfileUpdate, socket } = useSocket();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
      } else {
        setRefreshing(true);
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
      setRefreshing(false);
    }
  }, [normalizeAvatarUrl]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

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
      await updateUserProfile({
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

  const { parent, children = [], notifications = [], activityTimeline = [] } = overview;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-slate-50 py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <Motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 p-8 text-white shadow-2xl md:p-12"
        >
          <div className="absolute inset-0 opacity-30 mix-blend-screen">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-10 right-10 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
          </div>
          <div className="absolute right-4 top-4 flex flex-col items-center gap-3 sm:right-8 sm:top-8">
            <Avatar
              user={avatarUser || user}
              size="large"
              showCustomize
              className="border-4 border-white/40 shadow-2xl rounded-full"
              onAvatarUpdate={(updated) => {
                const nextAvatar = updated?.url || updated?.avatar || updated;
                if (!nextAvatar) return;
                applyAvatarUpdate(nextAvatar);
              }}
            />
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur">
              Parent
            </span>
          </div>
          <div className="relative flex flex-col gap-10 pt-24 sm:pt-16 lg:flex-row lg:items-center lg:justify-between lg:pr-48 lg:pt-0">
            <div className="flex flex-1 flex-col gap-6 pr-28 sm:pr-36 lg:pr-0">
              <div className="text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
                  Family Command Center
                </p>
                <h1 className="mt-2 text-4xl font-black leading-tight sm:text-5xl">
                  {parent.name ? `Welcome back, ${parent.name.split(" ")[0]}!` : "Welcome back!"}
                </h1>
                <p className="mt-3 max-w-xl text-base text-white/80">
                  Monitor progress, celebrate wins, and stay connected with your child's growth — all in one beautiful hub.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                    <Mail className="h-4 w-4" />
                    {parent.email}
                  </span>
                  {parent.phone && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                      <MessageCircle className="h-4 w-4" />
                      {parent.phone}
                    </span>
                  )}
                  {parent.location && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                      <MapPin className="h-4 w-4" />
                      {parent.location}
                    </span>
                  )}
                </div>
                  {parent.linkingCode && (
                    <div className="mt-6 w-full max-w-md rounded-3xl border border-white/30 bg-white/15 p-4 text-white backdrop-blur">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                            Secret linking code
                          </p>
                          <p className="text-sm text-white/80">
                            Share this with your child so they can join your family dashboard.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyLinkingCode}
                          className="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
                        >
                          <Copy className="h-4 w-4" />
                          {copiedCode ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <div className="mt-4 rounded-2xl bg-white/20 px-4 py-3 text-center text-lg font-mono tracking-[0.4em] text-white shadow-inner">
                        {parent.linkingCode}
                      </div>
                    </div>
                  )}
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
              >
                <Edit3 className="h-4 w-4" />
                Edit profile
              </button>
              <button
                type="button"
                onClick={() => loadOverview({ silent: true })}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/25 disabled:opacity-60"
              >
                <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <Link
                to="/parent/settings"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-indigo-600 shadow-lg transition hover:bg-slate-100"
              >
                <Settings className="h-4 w-4" />
                Parent settings
              </Link>
            </div>
          </div>
        </Motion.section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {insights.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Children overview</h2>
              <span className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                {children.length} linked
              </span>
            </div>
            {children.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-sm">
                <Users className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-4 text-xl font-semibold text-slate-800">No children linked yet</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Share your secret linking code from the personal tab to connect your child instantly.
                </p>
                <Link
                  to="/parent/settings"
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
                >
                  Link a child
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {children.map((child) => (
                  <ChildCard key={child.id} child={child} onSelect={setSelectedChild} />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-lg backdrop-blur">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Smart alerts</h3>
                <button
                  type="button"
                  onClick={handleToggleEmailNotifications}
                  disabled={notificationLoading}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    overview.parent?.preferences?.notifications?.email ?? true
                      ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  } disabled:opacity-60`}
                >
                  <Bell className={`h-4 w-4 ${notificationLoading ? "animate-pulse" : ""}`} />
                  {overview.parent?.preferences?.notifications?.email ?? true
                    ? "Email alerts on"
                    : "Enable email alerts"}
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {overview.nextActions.map((action) => (
                  <div
                    key={`${action.title}-${action.category}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                        {action.category === "wellbeing" && <Heart className="h-4 w-4" />}
                        {action.category === "rewards" && <Crown className="h-4 w-4" />}
                        {action.category === "subscription" && <Calendar className="h-4 w-4" />}
                        {action.category === "engagement" && <Flame className="h-4 w-4" />}
                        {!["wellbeing", "rewards", "subscription", "engagement"].includes(
                          action.category
                        ) && <Sparkles className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{action.title}</p>
                        <p className="text-sm text-slate-500">{action.description}</p>
                      </div>
                      <span
                        className={`ml-auto inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          action.priority === "high"
                            ? "bg-rose-100 text-rose-600"
                            : action.priority === "medium"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {action.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-lg backdrop-blur">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-semibold text-slate-900">Recent notifications</h3>
              </div>
              <div className="mt-4 space-y-4">
                {notifications.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    You're all caught up! No new notifications at the moment.
                  </p>
                ) : (
                  notifications.slice(0, 4).map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))
                )}
              </div>
              <Link
                to="/parent/notifications"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View all
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-lg backdrop-blur">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-slate-900">Family activity timeline</h3>
            </div>
            {activityTimeline.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No recent activity from linked children.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {activityTimeline.slice(0, 8).map((entry) => (
                  <Motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm"
                  >
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {entry.childName}
                        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {entry.type}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {entry.title}
                        {entry.description && (
                          <span className="text-slate-400"> · {entry.description}</span>
                        )}
                      </p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {formatRelativeTime(entry.timestamp)}
                    </span>
                  </Motion.div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-lg backdrop-blur">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-slate-900">Subscription</h3>
            </div>
            {parent.subscription ? (
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600">
                  <p className="text-xs font-semibold uppercase tracking-wide">Current plan</p>
                  <p className="mt-1 text-lg font-bold">{parent.subscription.name || "Premium Family"}</p>
                  <p className="mt-2 text-sm">
                    Status:{" "}
                    <span className="font-semibold text-indigo-700">
                      {parent.subscription.status || "Active"}
                    </span>
                  </p>
                </div>
                {parent.subscription.nextBilling && (
                  <p>
                    Next billing date:
                    <span className="ml-1 font-semibold text-slate-900">
                      {new Date(parent.subscription.nextBilling).toLocaleDateString()}
                    </span>
                  </p>
                )}
                {parent.subscription.features && parent.subscription.features.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Included features
                    </p>
                    <ul className="mt-2 space-y-2">
                      {parent.subscription.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Link
                  to="/parent/upgrade"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Explore upgrades
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="mt-4 text-sm text-slate-500">
                No subscription data available. Upgrade to unlock premium family analytics.
                <Link
                  to="/parent/upgrade"
                  className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
                >
                  Upgrade now
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
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
        {selectedChild && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm md:items-center"
          >
            <Motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedChild.avatar}
                    alt={selectedChild.name}
                    className="h-16 w-16 rounded-3xl border-4 border-slate-100 object-cover shadow-lg"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{selectedChild.name}</h3>
                    <p className="text-sm text-slate-500">
                      {selectedChild.grade} • {selectedChild.institution}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-indigo-600">
                        <Sparkles className="h-3.5 w-3.5" />
                        Level {selectedChild.level}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-amber-600">
                        <Coins className="h-3.5 w-3.5" />
                        {selectedChild.healCoins} HealCoins
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-emerald-600">
                        <Smile className="h-3.5 w-3.5" />
                        Mood {selectedChild.averageMoodScore ?? "—"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedChild(null)}
                  className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
                >
                  ×
                </button>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm text-indigo-600">
                  <p className="text-xs font-semibold uppercase">Weekly engagement</p>
                  <p className="mt-2 text-2xl font-black">
                    {selectedChild.engagement.minutes} mins
                  </p>
                  <p className="text-xs uppercase tracking-wide text-indigo-400">
                    {selectedChild.engagement.sessions} learning sessions
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-600">
                  <p className="text-xs font-semibold uppercase">Mastery pulse</p>
                  <p className="mt-2 text-2xl font-black">{selectedChild.overallMastery}%</p>
                  <p className="text-xs uppercase tracking-wide text-emerald-400">
                    {selectedChild.totalGamesPlayed} games played
                  </p>
                </div>
                <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-sm text-rose-600">
                  <p className="text-xs font-semibold uppercase">Alerts</p>
                  <p className="mt-2 text-2xl font-black">{selectedChild.alerts.length}</p>
                  <p className="text-xs uppercase tracking-wide text-rose-400">
                    Priority checkpoints
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Top strengths
                  </h4>
                  <div className="mt-3 space-y-3">
                    {selectedChild.topPillars && selectedChild.topPillars.length > 0 ? (
                      selectedChild.topPillars.map((pillar) => (
                        <div
                          key={pillar.name}
                          className="flex items-center justify-between rounded-2xl bg-slate-100/70 px-4 py-3 text-sm"
                        >
                          <span className="font-semibold text-slate-700">{pillar.name}</span>
                          <span className="text-slate-500">{pillar.percentage}%</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Not enough data yet.</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Focus areas
                  </h4>
                  <div className="mt-3 space-y-3">
                    {selectedChild.alerts.length > 0 ? (
                      selectedChild.alerts.map((alert, index) => (
                        <div
                          key={`${alert.type}-${index}`}
                          className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3 text-sm text-rose-600"
                        >
                          <AlertTriangle className="h-4 w-4" />
                          <span>{alert.message}</span>
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
              <div className="mt-8 flex justify-end gap-3">
                <Link
                  to={`/parent/child/${selectedChild.id}/analytics`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700"
                >
                  View full analytics
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedChild(null)}
                  className="rounded-2xl px-5 py-3 text-sm font-semibold text-slate-500 hover:text-slate-700"
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

