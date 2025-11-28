import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  Users,
  UserCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  GraduationCap,
  Layers,
  ShieldCheck,
  Edit3,
  Save,
  X,
  Sparkles,
  BarChart2,
} from "lucide-react";
import {
  fetchAdminSchoolDetail,
  updateAdminSchool,
} from "../../services/adminSchoolsService";
import { useSocket } from "../../context/SocketContext";

const statusTokens = {
  approved: {
    label: "Approved",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-100 text-rose-700 border border-rose-200",
  },
};

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0
  );

const formatRelativeTime = (value) => {
  if (!value) return "—";
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "—";
  const diffMs = Date.now() - timestamp;
  if (diffMs < 0) return "just now";
  const diffMinutes = diffMs / 60000;
  if (diffMinutes < 60) return `${Math.max(1, Math.round(diffMinutes))}m ago`;
  const diffHours = diffMinutes / 60;
  if (diffHours < 24) return `${Math.max(1, Math.round(diffHours))}h ago`;
  const diffDays = diffHours / 24;
  if (diffDays < 30) return `${Math.max(1, Math.round(diffDays))}d ago`;
  const diffMonths = diffDays / 30;
  if (diffMonths < 12) return `${Math.max(1, Math.round(diffMonths))}mo ago`;
  const diffYears = diffMonths / 12;
  return `${Math.max(1, Math.round(diffYears))}y ago`;
};

const formatAbsoluteDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatAbsoluteDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
};

const buildFormState = (detail) => ({
  name: detail?.name || "",
  email: detail?.email || "",
  approvalStatus: detail?.approvalStatus || "pending",
  approvalNotes: detail?.approvalNotes || "",
  rejectionReason: detail?.rejectionReason || "",
  note: "",
  contactInfo: {
    phone: detail?.contactInfo?.phone || "",
    address: detail?.contactInfo?.address || "",
    city: detail?.contactInfo?.city || "",
    state: detail?.contactInfo?.state || "",
    pincode: detail?.contactInfo?.pincode || "",
    website: detail?.contactInfo?.website || "",
  },
  academicInfo: {
    board: detail?.academicInfo?.board || "",
    establishedYear: detail?.academicInfo?.establishedYear || "",
    totalStudents:
      detail?.metrics?.studentCount ?? detail?.academicInfo?.totalStudents ?? "",
    totalTeachers:
      detail?.metrics?.teacherCount ?? detail?.academicInfo?.totalTeachers ?? "",
  },
});

const MetricsChip = ({ icon, label, value, accent = "from-emerald-500 to-teal-500" }) => {
  const IconComponent = icon;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className={`p-2 rounded-lg bg-gradient-to-br ${accent} text-white`}>
        <IconComponent className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-lg font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
};

const AdminSchoolDetail = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [detail, setDetail] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [formState, setFormState] = useState(null);

  const loadDetail = useCallback(
    async (silent = false) => {
      if (!schoolId) return;
      if (!silent) setLoading(true);
      try {
        const response = await fetchAdminSchoolDetail(schoolId);
        const record = response.data || null;
        setDetail(record);
        setAnalytics(response.analytics || null);
        setFormState(buildFormState(record));
        setEditMode(false);
      } catch (error) {
        console.error("Error loading school detail:", error);
        toast.error(error.response?.data?.message || "Unable to load school information");
        if (!silent) navigate("/admin/schools");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [schoolId, navigate]
  );

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    if (!socket?.socket || !schoolId) return;
    const handleRealtimeUpdate = (payload) => {
      // Check if this update is for the current school
      const updateId = payload?.id || payload?.data?.id || payload?.data?._id;
      if (updateId && (updateId.toString() === schoolId.toString() || updateId === schoolId)) {
        // Reload detail to get fresh data
        loadDetail(true);
      }
    };
    socket.socket.on("admin:schools:update", handleRealtimeUpdate);
    socket.socket.on("admin:school-approval:update", handleRealtimeUpdate);
    return () => {
      socket.socket.off("admin:schools:update", handleRealtimeUpdate);
      socket.socket.off("admin:school-approval:update", handleRealtimeUpdate);
    };
  }, [socket, schoolId, loadDetail]);

  const handleFormFieldChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedFieldChange = (scope, field, value) => {
    setFormState((prev) => ({
      ...prev,
      [scope]: { ...(prev?.[scope] || {}), [field]: value },
    }));
  };

  const handleSave = async () => {
    if (!schoolId || !formState) return;
    setSaving(true);
    try {
      const payload = {
        name: formState.name?.trim?.() || "",
        email: formState.email?.trim?.() || "",
        contactInfo: { ...(formState.contactInfo || {}) },
        academicInfo: {
          ...(formState.academicInfo || {}),
          totalStudents:
            formState.academicInfo?.totalStudents === "" || formState.academicInfo?.totalStudents === null
              ? null
              : Number(formState.academicInfo?.totalStudents),
          totalTeachers:
            formState.academicInfo?.totalTeachers === "" || formState.academicInfo?.totalTeachers === null
              ? null
              : Number(formState.academicInfo?.totalTeachers),
        },
        approvalStatus: formState.approvalStatus,
        approvalNotes: formState.approvalNotes,
        rejectionReason:
          formState.approvalStatus === "rejected" ? formState.rejectionReason : undefined,
        note: formState.note,
      };
      const response = await updateAdminSchool(schoolId, payload);
      const updated = response.data || null;
      
      // Update state with fresh data from server
      if (updated) {
      setDetail(updated);
      setFormState(buildFormState(updated));
        if (response.analytics) {
          setAnalytics(response.analytics);
        }
      }
      
      setEditMode(false);
      toast.success("School record updated");
      
      // Reload detail to ensure we have the latest data including metrics
      await loadDetail(true);
    } catch (error) {
      console.error("Error updating school:", error);
      toast.error(error.response?.data?.message || "Unable to update school");
    } finally {
      setSaving(false);
    }
  };

  const statusSummary = useMemo(() => ({
    students: formatNumber(detail?.academicInfo?.totalStudents ?? detail?.metrics?.studentCount ?? 0),
    teachers: formatNumber(detail?.academicInfo?.totalTeachers ?? detail?.metrics?.teacherCount ?? 0),
    classes: formatNumber(detail?.metrics?.classCount ?? 0),
    campuses: formatNumber(detail?.metrics?.campusCount ?? 0),
  }), [detail]);

  const planDetails = useMemo(() => {
    const subscriptionPlan = detail?.subscription?.plan || {};
    
    // Compute actual status based on endDate first
    const expiresAt = detail?.subscription?.endDate || detail?.subscriptionExpiry || null;
    let status = detail?.subscription?.status ||
      (detail?.subscriptionPlan === "educational_institutions_premium" ? "active" : null);
    
    // If status is active/pending but endDate has passed, mark as expired
    if (expiresAt && (status === 'active' || status === 'pending')) {
      const endDate = new Date(expiresAt);
      const now = new Date();
      if (endDate <= now) {
        status = 'expired';
      }
    }
    
    // Determine plan name based on status
    let planName;
    
    // If plan is expired, show "Free Plan"
    if (status === 'expired') {
      planName = "Free Plan";
    } else if (status === 'active' || status === 'pending') {
      // If plan is active/renewed, show the premium plan name
      planName = subscriptionPlan.displayName || subscriptionPlan.name;
      
      // If subscription plan is "free" or missing but status is active and there's an endDate,
      // it means the subscription should be using the Company's subscriptionPlan
      if ((planName === 'free' || !planName) && expiresAt) {
        // Use Company's subscriptionPlan as fallback
        if (detail?.subscriptionPlan === "educational_institutions_premium") {
          planName = "Educational Institutions Premium Plan";
        } else if (detail?.subscriptionPlan) {
          // Map other plan types if needed
          const planMap = {
            'educational_institutions_premium': 'Educational Institutions Premium Plan',
            'student_premium': 'Student Premium Plan',
            'student_parent_premium_pro': 'Student + Parent Premium Pro Plan',
          };
          planName = planMap[detail.subscriptionPlan] || detail.subscriptionPlan;
        }
      }
      
      // Final fallback for active plans
      if (!planName || planName === 'free') {
        planName = detail?.subscriptionPlan === "educational_institutions_premium"
          ? "Educational Institutions Premium Plan"
          : detail?.subscriptionPlan || "Educational Institutions Premium Plan";
      }
    } else {
      // For other statuses (cancelled, etc.), show Free Plan
      planName = "Free Plan";
    }
    
    // Use current cycle start date (renewal date) instead of original activation date
    const activatedAt = detail?.subscription?.currentCycleStartDate || 
                        detail?.subscription?.lastRenewedAt ||
                        detail?.subscription?.startDate || 
                        detail?.subscriptionStart || null;

    return {
      planName,
      activatedAt,
      expiresAt,
      status,
    };
  }, [detail]);

  const planStatusDisplay = useMemo(() => {
    const status = planDetails.status;
    if (!status) {
      return {
        label: "Not Active",
        badgeClass: "bg-slate-100 text-slate-600 border border-slate-200",
      };
    }
    const label = status
      .split("_")
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ");
    if (status === "active") {
      return {
        label,
        badgeClass: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      };
    }
    if (status === "pending") {
      return {
        label,
        badgeClass: "bg-amber-100 text-amber-700 border border-amber-200",
      };
    }
    return {
      label,
      badgeClass: "bg-rose-100 text-rose-700 border border-rose-200",
    };
  }, [planDetails.status]);

  const PlanStatusIcon = planDetails.status === "active" ? CheckCircle2 : planDetails.status === "pending" ? Clock : X;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-sky-50 pb-24">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-4xl font-black">
              {detail?.name || "School detail"}
            </h1>
            <p className="text-white/80 text-base font-medium mt-1">
              Institution ID: {detail?.institutionId || "Not assigned"}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-14 space-y-10 relative z-10">
        <div className="rounded-3xl bg-white shadow-2xl border border-slate-100 px-8 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {detail?.approvalStatus && (
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  statusTokens[detail.approvalStatus]?.className || "bg-slate-100 text-slate-700"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                {statusTokens[detail.approvalStatus]?.label || detail.approvalStatus}
              </span>
            )}
            <span className="text-sm text-slate-500 font-medium">
              Last updated {formatRelativeTime(detail?.updatedAt)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditMode((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all"
            >
              {editMode ? (
                <>
                  <X className="w-4 h-4" /> Cancel
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" /> Edit
                </>
              )}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save changes
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white shadow-2xl border border-slate-100 px-8 py-10">
            <div className="animate-pulse h-72 bg-slate-100 rounded-2xl" />
          </div>
        ) : !detail ? (
          <div className="rounded-3xl bg-white shadow-2xl border border-slate-100 px-8 py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 mx-auto flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-4">School information unavailable</h3>
            <p className="text-slate-500 mt-2">This record could not be loaded. Please return to the schools list.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <section className="rounded-2xl border border-slate-200 shadow-sm bg-white">
                  <header className="border-b border-slate-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-slate-900">Core Profile</h2>
                    <p className="text-sm text-slate-500">Ownership, contact, and communication footprint</p>
                  </header>
                  <div className="px-6 py-5 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">School Name</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formState?.name || ""}
                            onChange={(event) => handleFormFieldChange("name", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                          />
                        ) : (
                          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {detail?.name || "—"}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Primary Email</label>
                        {editMode ? (
                          <input
                            type="email"
                            value={formState?.email || ""}
                            onChange={(event) => handleFormFieldChange("email", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                          />
                        ) : (
                          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                            <Mail className="w-5 h-5 text-emerald-600" />
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {detail?.email || "—"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone Number</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formState?.contactInfo?.phone || ""}
                            onChange={(event) => handleNestedFieldChange("contactInfo", "phone", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                          />
                        ) : (
                          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                            <Phone className="w-5 h-5 text-emerald-600" />
                            <p className="text-sm font-semibold text-slate-800">
                              {detail?.contactInfo?.phone || "—"}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Website</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formState?.contactInfo?.website || ""}
                            onChange={(event) => handleNestedFieldChange("contactInfo", "website", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                          />
                        ) : (
                          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                            <Globe className="w-5 h-5 text-emerald-600" />
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {detail?.contactInfo?.website || "—"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Address</label>
                      {editMode ? (
                        <textarea
                          rows={3}
                          value={formState?.contactInfo?.address || ""}
                          onChange={(event) => handleNestedFieldChange("contactInfo", "address", event.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                        />
                      ) : (
                        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                          {detail?.contactInfo?.address || "No street address recorded"}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { field: "city", label: "City" },
                        { field: "state", label: "State" },
                        { field: "pincode", label: "Pincode" },
                      ].map(({ field, label }) => (
                        <div key={field} className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
                          {editMode ? (
                            <input
                              type="text"
                              value={formState?.contactInfo?.[field] || ""}
                              onChange={(event) => handleNestedFieldChange("contactInfo", field, event.target.value)}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                            />
                          ) : (
                            <p className="text-sm font-semibold text-slate-700">
                              {detail?.contactInfo?.[field] || "—"}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 shadow-sm bg-white">
                  <header className="border-b border-slate-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-slate-900">Academic & Capacity</h2>
                    <p className="text-sm text-slate-500">Snapshot of academic profile and headcount</p>
                  </header>
                  <div className="px-6 py-5 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Board</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formState?.academicInfo?.board || ""}
                            onChange={(event) => handleNestedFieldChange("academicInfo", "board", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                          />
                        ) : (
                          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <GraduationCap className="w-4 h-4 text-slate-400" />
                            {detail?.academicInfo?.board || "—"}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Established Year</label>
                        {editMode ? (
                          <input
                            type="number"
                            value={formState?.academicInfo?.establishedYear || ""}
                            onChange={(event) => handleNestedFieldChange("academicInfo", "establishedYear", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                          />
                        ) : (
                          <p className="text-sm font-semibold text-slate-700">
                            {detail?.academicInfo?.establishedYear || "—"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Students</label>
                        {editMode ? (
                          <input
                            type="number"
                            value={formState?.academicInfo?.totalStudents ?? ""}
                            onChange={(event) => handleNestedFieldChange("academicInfo", "totalStudents", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                          />
                        ) : (
                          <p className="text-sm font-semibold text-slate-700">
                            {formatNumber(detail?.academicInfo?.totalStudents ?? detail?.metrics?.studentCount ?? 0)}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Teachers</label>
                        {editMode ? (
                          <input
                            type="number"
                            value={formState?.academicInfo?.totalTeachers ?? ""}
                            onChange={(event) => handleNestedFieldChange("academicInfo", "totalTeachers", event.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                          />
                        ) : (
                          <p className="text-sm font-semibold text-slate-700">
                            {formatNumber(detail?.academicInfo?.totalTeachers ?? detail?.metrics?.teacherCount ?? 0)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <MetricsChip icon={Users} label="Students" value={statusSummary.students} />
                      <MetricsChip icon={UserCircle} label="Teachers" value={statusSummary.teachers} accent="from-slate-500 to-slate-700" />
                      <MetricsChip icon={Layers} label="Classes" value={statusSummary.classes} accent="from-indigo-500 to-purple-500" />
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 shadow-sm bg-white">
                  <header className="border-b border-slate-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-slate-900">Review Notes</h2>
                    <p className="text-sm text-slate-500">Track the decision log and add internal updates</p>
                  </header>
                  <div className="px-6 py-5 space-y-4">
                    {editMode && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Add Internal Note</label>
                        <textarea
                          rows={3}
                          value={formState?.note || ""}
                          onChange={(event) => handleFormFieldChange("note", event.target.value)}
                          placeholder="Capture a note for the decision timeline"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      {(detail?.reviewHistory || []).length === 0 ? (
                        <p className="text-sm text-slate-500">No review activity captured yet.</p>
                      ) : (
                        detail.reviewHistory
                          .slice()
                          .reverse()
                          .map((entry) => (
                            <div key={entry.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                                <span className="inline-flex items-center gap-1">
                                  {entry.action === "approved" && (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                  )}
                                  {entry.action === "rejected" && (
                                    <X className="w-3 h-3 text-rose-500" />
                                  )}
                                  {entry.action === "commented" && (
                                    <Sparkles className="w-3 h-3 text-amber-500" />
                                  )}
                                  {entry.action.toUpperCase()}
                                </span>
                                <span>{formatRelativeTime(entry.createdAt)}</span>
                              </div>
                              <p className="text-sm font-semibold text-slate-700 mt-1">
                                {entry.note || "No note recorded"}
                              </p>
                              {entry.reviewer?.name && (
                                <p className="text-xs text-slate-400 mt-1">
                                  {entry.reviewer.name} • {entry.reviewer.email}
                                </p>
                              )}
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-200 shadow-sm bg-white">
                  <header className="border-b border-slate-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-slate-900">Status & Workflow</h2>
                    <p className="text-sm text-slate-500">Control the lifecycle and communication state</p>
                  </header>
                  <div className="px-6 py-5 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-4 ">Approval Status</label>
                      {editMode ? (
                        <select
                          value={formState?.approvalStatus || "pending"}
                          onChange={(event) => handleFormFieldChange("approvalStatus", event.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                        >
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                            statusTokens[detail.approvalStatus]?.className || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          {statusTokens[detail.approvalStatus]?.label || detail.approvalStatus}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Approval Notes</label>
                      {editMode ? (
                        <textarea
                          rows={3}
                          value={formState?.approvalNotes || ""}
                          onChange={(event) => handleFormFieldChange("approvalNotes", event.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                        />
                      ) : (
                        <p className="text-sm text-slate-600">
                          {detail?.approvalNotes || "No approval notes set"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Subscription Plan</label>
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-4 shadow-inner">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-emerald-600" />
                            <div>
                              <p className="text-sm font-bold text-emerald-900">{planDetails.planName}</p>
                              <p className="text-xs text-emerald-700/80">
                                Plan access activates immediately on approval and renews yearly.
                              </p>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${planStatusDisplay.badgeClass}`}
                          >
                            <PlanStatusIcon className="w-4 h-4" />
                            {planStatusDisplay.label}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-emerald-100 bg-white px-3 py-2">
                            <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide">
                              {detail?.subscription?.lastRenewedAt || detail?.subscription?.currentCycleStartDate 
                                ? "Renewed On" 
                                : "Activated On"}
                            </p>
                            <p className="text-sm font-semibold text-emerald-900">
                              {formatAbsoluteDateTime(planDetails.activatedAt)}
                            </p>
                          </div>
                          <div className="rounded-xl border border-emerald-100 bg-white px-3 py-2">
                            <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide">Expires On</p>
                            <p className="text-sm font-semibold text-emerald-900">
                              {formatAbsoluteDate(planDetails.expiresAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {formState?.approvalStatus === "rejected" && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rejection Reason</label>
                        {editMode ? (
                          <textarea
                            rows={3}
                            value={formState?.rejectionReason || ""}
                            onChange={(event) => handleFormFieldChange("rejectionReason", event.target.value)}
                            className="w-full border border-rose-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400"
                          />
                        ) : (
                          <p className="text-sm text-rose-600">
                            {detail?.rejectionReason || "No rejection reason captured"}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 shadow-sm bg-white">
                  <header className="border-b border-slate-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-slate-900">Analytics Snapshot</h2>
                    <p className="text-sm text-slate-500">Engagement signals for this institution</p>
                  </header>
                  <div className="px-6 py-5 space-y-4">
                    <MetricsChip
                      icon={BarChart2}
                      label="Active Teachers (7d)"
                      value={formatNumber(analytics?.activeTeachers7d)}
                      accent="from-blue-500 to-indigo-500"
                    />
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Admissions (last 30 days)
                      </p>
                      {analytics?.admissionsLast30?.length ? (
                        <div className="space-y-2">
                          {analytics.admissionsLast30.map((entry) => (
                            <div
                              key={`${entry.grade}-${entry.count}`}
                              className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                            >
                              <span className="font-semibold text-slate-700">Grade {entry.grade}</span>
                              <span className="text-slate-500 font-medium">{formatNumber(entry.count)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">No recent admission activity recorded.</p>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSchoolDetail;
