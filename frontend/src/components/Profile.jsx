import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  Building2,
  Calendar,
  CheckCircle,
  Copy,
  Globe,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Target,
  User,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../context/SocketContext";
import Avatar from "./Avatar";
import api from "../utils/api";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadUserAvatar,
} from "../services/dashboardService";

const defaultPreferences = {
  language: "en",
  notifications: { email: true, push: true, sms: false },
  privacy: {
    profileVisibility: "friends",
    contactInfo: "friends",
    academicInfo: "private",
  },
  sound: { effects: true, music: true, volume: 75 },
};

const mergeNested = (base = {}, patch = {}) => {
  const result = { ...(base || {}) };
  Object.entries(patch || {}).forEach(([key, value]) => {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      result[key] = mergeNested(base?.[key] || {}, value);
    } else if (value !== undefined) {
      result[key] = value;
    }
  });
  return result;
};

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const calculateAge = (value) => {
  if (!value) return null;
  const dob = new Date(value);
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age >= 0 ? age : null;
};

const unwrapProfile = (raw) => {
  if (!raw) return {};
  if (raw.data && typeof raw.data === "object") return raw.data;
  return raw;
};

const SectionCard = ({ title, description, action, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description && (
          <p className="text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action}
    </div>
    <div className="px-6 py-6">{children}</div>
  </section>
);

const StatHighlight = ({ label, value, icon: IconComponent, suffix }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        {IconComponent ? <IconComponent className="h-5 w-5" /> : null}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="text-lg font-semibold text-slate-900">
          {value !== undefined && value !== null && value !== ""
            ? `${value}${suffix || ""}`
            : "—"}
        </p>
      </div>
    </div>
  </div>
);

const ReadOnlyField = ({ label, value, icon: IconComponent, className }) => (
  <div
    className={`rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm ${className || ""}`}
  >
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
      {IconComponent ? <IconComponent className="h-4 w-4 text-indigo-500" /> : null}
      <span>{value || "Not available"}</span>
    </div>
  </div>
);

const ToggleRow = ({ label, description, checked, onToggle }) => (
  <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3">
    <div>
      <p className="text-sm font-medium text-slate-900">{label}</p>
      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onToggle(!checked)}
      className={`relative h-6 w-12 rounded-full transition ${
        checked ? "bg-indigo-500" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
          checked ? "left-7" : "left-1"
        }`}
      />
    </button>
  </div>
);

const TextField = ({ label, icon: Icon, error, ...props }) => (
  <label className="block space-y-1">
    <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
      {Icon && <Icon className="h-4 w-4 text-slate-400" />}
      {label}
    </span>
    <input
      {...props}
      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 ${
        error ? "border-red-400" : "border-slate-200"
      } ${props.disabled ? "bg-slate-100 text-slate-500" : ""}`}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </label>
);

const TextAreaField = ({ label, icon: Icon, error, ...props }) => (
  <label className="block space-y-1">
    <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
      {Icon && <Icon className="h-4 w-4 text-slate-400" />}
      {label}
    </span>
    <textarea
      {...props}
      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 ${
        error ? "border-red-400" : "border-slate-200"
      }`}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </label>
);

const Profile = () => {
  const { user } = useAuth();
  const { subscribeProfileUpdate, socket } = useSocket();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [personalForm, setPersonalForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    bio: "",
    dateOfBirth: "",
  });
  const [personalErrors, setPersonalErrors] = useState({});
  const [personalSaving, setPersonalSaving] = useState(false);

  const [, setAvatarPreview] = useState("/avatars/avatar1.png");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef(null);

  const [achievements, setAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [stats, setStats] = useState({
    level: 0,
    xp: 0,
    streak: 0,
    rank: null,
  });

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

  const applyProfilePatch = useCallback(
    (patch, { silent } = {}) => {
      const data = unwrapProfile(patch);
      if (!data) return;

      setProfile((prev) => {
        const next = { ...(prev || {}) };
        if (data.fullName || data.name) {
          next.fullName = data.fullName || data.name;
          next.name = data.fullName || data.name;
        }
        if (data.email !== undefined) next.email = data.email || "";
        if (data.phone !== undefined) next.phone = data.phone || "";
        if (data.location !== undefined || data.city !== undefined) {
          next.location = data.location || data.city || "";
        }
        if (data.website !== undefined) next.website = data.website || "";
        if (data.bio !== undefined) next.bio = data.bio || "";
        if (data.avatar) next.avatar = data.avatar;
        if (data.dateOfBirth !== undefined || data.dob !== undefined) {
          next.dateOfBirth = data.dateOfBirth || data.dob || "";
        }
        if (data.academic) {
          next.academic = { ...(next.academic || {}), ...data.academic };
        }
        if (data.preferences) {
          next.preferences = mergeNested(
            next.preferences || defaultPreferences,
            data.preferences
          );
        }
        if (data.school) {
          next.school = {
            ...(next.school || {}),
            ...data.school,
          };
        }
        if (data.schoolDetails) {
          next.schoolDetails = {
            ...(next.schoolDetails || {}),
            ...data.schoolDetails,
          };
        }
        if (data.stats) {
          next.stats = { ...(next.stats || {}), ...data.stats };
        }
        if (data.linkingCode) next.linkingCode = data.linkingCode;
        if (data.createdAt) next.createdAt = data.createdAt;
        return next;
      });

      setPersonalForm((prev) => ({
        ...prev,
        name: data.fullName || data.name || prev.name,
        phone:
          data.phone !== undefined ? data.phone || "" : prev.phone || "",
        location:
          data.location !== undefined || data.city !== undefined
            ? data.location || data.city || ""
            : prev.location || "",
        website:
          data.website !== undefined ? data.website || "" : prev.website || "",
        bio: data.bio !== undefined ? data.bio || "" : prev.bio || "",
        dateOfBirth:
          data.dateOfBirth || data.dob
            ? toDateInputValue(data.dateOfBirth || data.dob)
            : prev.dateOfBirth,
      }));

      if (data.avatar) {
        setAvatarPreview(normalizeAvatarUrl(data.avatar));
      }

      if (data.stats) {
        setStats((prev) => ({ ...prev, ...data.stats }));
      }

      if (!silent) {
        toast.info("Profile updated in real-time");
      }
    },
    [normalizeAvatarUrl]
  );

  const loadProfile = useCallback(async () => {
    if (!user) return;
    setLoadingProfile(true);
    try {
      const response = await fetchUserProfile();
      const data = unwrapProfile(response);

      const mergedPreferences = mergeNested(
        defaultPreferences,
        data.preferences || {}
      );

      setProfile({
        id: data._id || user._id || user.id,
        fullName:
          data.fullName || data.name || user.fullName || user.name || "",
        name: data.fullName || data.name || user.fullName || user.name || "",
        email: data.email || user.email || "",
        phone: data.phone || "",
        location: data.location || data.city || "",
        website: data.website || "",
        bio: data.bio || "",
        avatar: data.avatar || "",
        dateOfBirth: data.dateOfBirth || data.dob || "",
        academic: data.academic || {},
        preferences: mergedPreferences,
        role: data.role,
        linkingCode: data.linkingCode || user.linkingCode,
        school: data.school,
        schoolDetails: data.schoolDetails || null,
        stats: data.stats || {},
        createdAt: data.createdAt || data.joiningDate || user.createdAt || null,
      });

      setPersonalForm({
        name:
          data.fullName || data.name || user.fullName || user.name || "",
        email: data.email || user.email || "",
        phone: data.phone || "",
        location: data.location || data.city || "",
        website: data.website || "",
        bio: data.bio || "",
        dateOfBirth: toDateInputValue(data.dateOfBirth || data.dob),
      });

      setStats((prev) => ({
        ...prev,
        level: data.stats?.level || data.level || prev.level,
        xp: data.stats?.xp || prev.xp,
        streak: data.stats?.streak || prev.streak,
        rank:
          data.stats?.rank !== undefined ? data.stats.rank : prev.rank,
      }));

      setAvatarPreview(
        normalizeAvatarUrl(data.avatar) || "/avatars/avatar1.png"
      );
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Unable to load your profile right now.");
    } finally {
      setLoadingProfile(false);
    }
  }, [normalizeAvatarUrl, user]);

  const fetchAchievementsAndStats = useCallback(async () => {
    if (!user) return;
    try {
      setAchievementsLoading(true);
      const [achievementsRes, progressRes, statsRes] = await Promise.all([
        api.get("/api/game/achievements"),
        api.get("/api/progress"),
        api.get("/api/stats/student").catch(() => ({ data: {} })),
      ]);

      setAchievements(Array.isArray(achievementsRes.data) ? achievementsRes.data : []);

      if (progressRes.data) {
        setStats((prev) => ({
          ...prev,
          level: progressRes.data.level || prev.level || 1,
          xp: progressRes.data.xp || prev.xp || 0,
          streak: progressRes.data.streak || prev.streak || 0,
          rank:
            statsRes.data?.rank !== undefined
              ? statsRes.data.rank
              : prev.rank,
        }));
      }
    } catch (error) {
      console.warn("Unable to load achievements:", error);
    } finally {
      setAchievementsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    fetchAchievementsAndStats();
  }, [fetchAchievementsAndStats]);

  useEffect(() => {
    if (!user || !subscribeProfileUpdate) return undefined;
    const unsubscribe = subscribeProfileUpdate((payload) => {
      if (
        payload.userId &&
        payload.userId !== (user._id || user.id)
      ) {
        return;
      }
      applyProfilePatch(payload, { silent: false });
    });
    return () => unsubscribe();
  }, [applyProfilePatch, subscribeProfileUpdate, user]);

  const handleAvatarFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);
    setAvatarUploading(true);
    try {
      const res = await uploadUserAvatar(formData);
      const newAvatar = res?.avatar;
      if (newAvatar) {
        applyProfilePatch({ avatar: newAvatar }, { silent: true });
        setAvatarPreview(normalizeAvatarUrl(newAvatar));
        toast.success("Profile photo updated");
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
      toast.error("Failed to update profile photo");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAvatarReset = async () => {
    setAvatarUploading(true);
    try {
      const res = await api.post("/api/user/avatar", {
        avatar: "/avatars/avatar1.png",
      });
      const newAvatar = res.data?.avatar || "/avatars/avatar1.png";
      applyProfilePatch({ avatar: newAvatar }, { silent: true });
      setAvatarPreview(normalizeAvatarUrl(newAvatar));
      toast.success("Profile photo reset");
    } catch (error) {
      console.error("Avatar reset failed:", error);
      toast.error("Could not reset profile photo");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handlePersonalSave = async () => {
    setPersonalErrors({});
    if (!personalForm.name.trim()) {
      setPersonalErrors({ name: "Name is required" });
      return;
    }

    setPersonalSaving(true);
    try {
      const payload = {
        personal: {
          name: personalForm.name.trim(),
          phone: personalForm.phone?.trim() || "",
          location: personalForm.location?.trim() || "",
          website: personalForm.website?.trim() || "",
          bio: personalForm.bio || "",
        },
        dateOfBirth: personalForm.dateOfBirth || null,
      };
      const res = await updateUserProfile(payload);
      applyProfilePatch(
        {
          ...payload.personal,
          dateOfBirth: payload.dateOfBirth,
          fullName: payload.personal.name,
          ...res?.user,
        },
        { silent: true }
      );
      toast.success("Personal information updated");
    } catch (error) {
      console.error("Personal update error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update personal information"
      );
    } finally {
      setPersonalSaving(false);
    }
  };

  const age = useMemo(
    () =>
      calculateAge(
        personalForm.dateOfBirth || profile?.dateOfBirth || null
      ),
    [personalForm.dateOfBirth, profile?.dateOfBirth]
  );

  const achievementsSummary = useMemo(() => {
    if (!Array.isArray(achievements) || achievements.length === 0) {
      return [];
    }
    return achievements
      .map((item) => ({
        id: `${item.game}-${item.achievements?.length || 0}`,
        title: item.game || "Achievement",
        count: item.achievements?.length || 0,
      }))
      .slice(0, 6);
  }, [achievements]);

  const schoolSummary = useMemo(() => {
    const details = profile?.schoolDetails || {};
    const schoolInfo = profile?.school || {};

    const classGrade =
      details.classGrade ||
      [
        details.classNumber !== undefined && details.classNumber !== null
          ? `Class ${details.classNumber}`
          : null,
        details.stream || null,
        details.section ? `Section ${details.section}` : null,
      ]
        .filter(Boolean)
        .join(" · ");

    return {
      schoolName:
        details.schoolName ||
        schoolInfo.name ||
        "Not available",
      teacherName: details.teacherName || "Not assigned yet",
      classGrade:
        classGrade ||
        profile?.academic?.className ||
        profile?.academic?.grade ||
        "Not assigned yet",
    };
  }, [profile]);

  const handleCopyCode = async (value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Linking code copied");
    } catch (error) {
      console.error("Clipboard error:", error);
      toast.error("Unable to copy right now");
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="relative">
                <Avatar
                  user={user}
                  size="large"
                  showCustomize
                  className="border border-slate-200"
                  onAvatarUpdate={(updated) => {
                    const nextAvatar =
                      updated?.url || updated?.avatar || updated;
                    if (!nextAvatar) return;
                    applyProfilePatch(
                      { avatar: nextAvatar },
                      { silent: true }
                    );
                    setAvatarPreview(normalizeAvatarUrl(nextAvatar));
                    if (socket) {
                      socket.emit("profile_updated", {
                        userId: user?._id || user?.id,
                        avatar: nextAvatar,
                      });
                    }
                  }}
                />
                {avatarUploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/70">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                  {personalForm.name || "Student Profile"}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Keep your information current so mentors and coaches can
                  support you better.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 md:justify-start">
                  {personalForm.email && (
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-indigo-500" />
                      {personalForm.email}
                    </span>
                  )}
                  {personalForm.phone && (
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-indigo-500" />
                      {personalForm.phone}
                    </span>
                  )}
                  {age !== null && (
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-indigo-500" />
                      {age} years
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    Change photo
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 transition hover:border-red-300 hover:text-red-600"
                    onClick={handleAvatarReset}
                  >
                    Reset to default
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileChange}
                  />
                </div>
              </div>
            </div>
            {profile?.linkingCode && (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-4 text-center shadow-sm sm:min-w-[220px]">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  Linking Code
                </p>
                <p className="mt-2 text-lg font-mono font-semibold text-indigo-900">
                  {profile.linkingCode}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyCode(profile.linkingCode)}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-white"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatHighlight
              label="Current Level"
              value={stats.level || 1}
              icon={TrendingUp}
            />
            <StatHighlight
              label="XP Points"
              value={stats.xp || 0}
              icon={Award}
            />
            <StatHighlight
              label="Daily Streak"
              value={stats.streak || 0}
              icon={Target}
            />
            <StatHighlight
              label="Global Rank"
              value={stats.rank !== null ? stats.rank : "N/A"}
              icon={CheckCircle}
            />
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="flex flex-col gap-8">
            <SectionCard
              title="Personal Information"
              description="Update how your mentors and classmates will see you."
              action={
                <button
                  type="button"
                  onClick={handlePersonalSave}
                  disabled={personalSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
                >
                  {personalSaving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Save changes
                </button>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Full name"
                  name="name"
                  value={personalForm.name}
                  onChange={(event) =>
                    setPersonalForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Your full name"
                  icon={User}
                  error={personalErrors.name}
                />
                <TextField
                  label="Email address"
                  name="email"
                  value={personalForm.email}
                  onChange={(event) =>
                    setPersonalForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  disabled
                  icon={Mail}
                />
                <TextField
                  label="Phone number"
                  name="phone"
                  value={personalForm.phone}
                  onChange={(event) =>
                    setPersonalForm((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="e.g. +91 98765 43210"
                  icon={Phone}
                />
                <TextField
                  label="Location"
                  name="location"
                  value={personalForm.location}
                  onChange={(event) =>
                    setPersonalForm((prev) => ({
                      ...prev,
                      location: event.target.value,
                    }))
                  }
                  placeholder="City, Country"
                  icon={MapPin}
                />
                <TextField
                  label="Portfolio or website"
                  name="website"
                  value={personalForm.website}
                  onChange={(event) =>
                    setPersonalForm((prev) => ({
                      ...prev,
                      website: event.target.value,
                    }))
                  }
                  placeholder="https://"
                  icon={Globe}
                />
                <TextField
                  label="Date of birth"
                  name="dateOfBirth"
                  type="date"
                  value={personalForm.dateOfBirth}
                  onChange={(event) =>
                    setPersonalForm((prev) => ({
                      ...prev,
                      dateOfBirth: event.target.value,
                    }))
                  }
                  icon={Calendar}
                />
              </div>
              <div className="mt-4">
                <TextAreaField
                  label="About you"
                  name="bio"
                  value={personalForm.bio}
                  onChange={(event) =>
                    setPersonalForm((prev) => ({
                      ...prev,
                      bio: event.target.value,
                    }))
                  }
                  placeholder="Highlight your interests, clubs, and goals."
                  rows={4}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Academic Profile"
              description="Capture your academic focus and interests."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <ReadOnlyField
                  className="md:col-span-2"
                  label="School name"
                  value={schoolSummary.schoolName}
                  icon={Building2}
                />
                <ReadOnlyField
                  label="Teacher name"
                  value={schoolSummary.teacherName}
                  icon={User}
                />
                <ReadOnlyField
                  label="Class / Grade"
                  value={schoolSummary.classGrade}
                  icon={GraduationCap}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Performance & Achievements"
              description="Celebrate your progress and milestones."
            >
              {achievementsLoading ? (
                <div className="flex items-center justify-center py-6 text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                </div>
              ) : achievementsSummary.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {achievementsSummary.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-white px-5 py-4 shadow-sm"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                        <Award className="h-4 w-4 text-amber-500" />
                        {item.count} achievements unlocked
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  Track achievements as you complete challenges and
                  assignments.
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

