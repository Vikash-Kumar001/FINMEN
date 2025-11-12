import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  MapPin,
  Mail,
  Phone,
  Globe,
  Search,
  Filter,
  Sparkles,
  LayoutDashboard,
  BarChart3,
  History as HistoryIcon,
  AlertTriangle,
  Info,
  Loader2,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  fetchSchoolApprovalDashboard,
  fetchPendingSchoolApprovals,
  fetchSchoolApprovalHistory,
  approveSchool,
  rejectSchool,
  updatePendingSchool
} from "../../services/schoolApprovalService";
import { useSocket } from "../../context/SocketContext";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700 border border-amber-200",
  approved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border border-rose-200"
};

const priorityStyles = {
  critical: "bg-rose-100 text-rose-700 border border-rose-200",
  high: "bg-amber-100 text-amber-700 border border-amber-200",
  expedite: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  standard: "bg-slate-100 text-slate-700 border border-slate-200"
};

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(value || 0);

const formatRelativeTime = (value) => {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return null;
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

const historyPageSize = 20;

const toNumberOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const enhanceSchool = (school) => {
  if (!school) return school;
  const contactInfo = {
    ...(school.contactInfo || {}),
  };
  const academicInfo = {
    ...(school.academicInfo || {}),
  };
  const submittedAt = school.submittedAt || school.createdAt;
  const reviewHistory = (school.reviewHistory || []).map((entry) => ({
    ...entry,
    relativeTime: entry.relativeTime || formatRelativeTime(entry.createdAt || entry.updatedAt)
  }));

  return {
    ...school,
    contactInfo,
    academicInfo,
    submittedAgoHuman: school.submittedAgoHuman || formatRelativeTime(submittedAt),
    reviewHistory
  };
};

const AdminSchoolApprovals = () => {
  const socket = useSocket();

  const [initialLoading, setInitialLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [pendingSchools, setPendingSchools] = useState([]);
  const [history, setHistory] = useState({ data: [], meta: { total: 0, page: 1, pages: 1, limit: historyPageSize } });
  const [filters, setFilters] = useState({ search: "", state: "", sort: "oldest" });
  const [historyFilter, setHistoryFilter] = useState({ status: "all", page: 1 });
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
     name: "",
     institutionId: "",
     email: "",
     phone: "",
     address: "",
     city: "",
     state: "",
     pincode: "",
     website: "",
     board: "",
     establishedYear: "",
     totalStudents: "",
     totalTeachers: ""
   });
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionNote, setActionNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [detailSaving, setDetailSaving] = useState(false);
  const [editDirty, setEditDirty] = useState(false);

  const filtersRef = useRef(filters);
  const historyFilterRef = useRef(historyFilter);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    historyFilterRef.current = historyFilter;
  }, [historyFilter]);

  useEffect(() => {
    if (detailModalOpen) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [detailModalOpen]);

  const updateEditField = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    setEditDirty(true);
  };

  const loadDashboard = useCallback(async () => {
    try {
      const response = await fetchSchoolApprovalDashboard();
      setDashboard(response.data || null);
    } catch (error) {
      console.error("Error loading approval dashboard:", error);
      toast.error("Unable to load approval overview");
    }
  }, []);

  const handleDetailSave = async ({ silent = false } = {}) => {
    if (!selectedSchool) {
      setEditing(false);
      return null;
    }

    const sanitize = (value) => (typeof value === "string" ? value.trim() : value);

    const payload = {
      name: sanitize(editForm.name),
      institutionId: sanitize(editForm.institutionId),
      email: sanitize(editForm.email),
      contactInfo: {
        phone: sanitize(editForm.phone),
        address: sanitize(editForm.address),
        city: sanitize(editForm.city),
        state: sanitize(editForm.state),
        pincode: sanitize(editForm.pincode),
        website: sanitize(editForm.website)
      },
      academicInfo: {
        board: sanitize(editForm.board),
        establishedYear: sanitize(editForm.establishedYear),
        totalStudents: toNumberOrNull(editForm.totalStudents),
        totalTeachers: toNumberOrNull(editForm.totalTeachers)
      }
    };

    setDetailSaving(true);
    try {
      const response = await updatePendingSchool(selectedSchool.id, payload);
      const updated = enhanceSchool(response.data);

      setSelectedSchool(updated);
      setPendingSchools((prev) =>
        Array.isArray(prev)
          ? prev.map((item) => (item.id === updated.id ? updated : item))
          : prev
      );

      setEditing(false);
      setEditDirty(false);
      loadDashboard();
      loadHistory();
      if (!silent) {
        toast.success(response.message || "School details updated");
      }
      return updated;
    } catch (error) {
      console.error("Failed to update school details:", error);
      const message = error.response?.data?.message || "Unable to update school details";
      toast.error(message);
      return null;
    } finally {
      setDetailSaving(false);
    }
  };

  const handleInitiateAction = async (mode) => {
     if (!selectedSchool) return;
     if (detailSaving) return;
     let latest = selectedSchool;
     if (editing && editDirty) {
      const result = await handleDetailSave({ silent: true });
      if (!result) {
        return;
      }
      latest = result;
    }
    setDetailSaving(false);
    setConfirmAction({ mode, school: { ...latest } });
    setActionNote("");
  };

  const loadPending = useCallback(async () => {
    try {
      const response = await fetchPendingSchoolApprovals(filtersRef.current);
      const enriched = (response.data || []).map(enhanceSchool);
      setPendingSchools(enriched);
    } catch (error) {
      console.error("Error loading pending approvals:", error);
      toast.error("Unable to load pending schools");
    }
  }, []);

  const loadHistory = useCallback(async (overrides = {}) => {
    try {
      const params = {
        status: overrides.status ?? historyFilterRef.current.status,
        page: overrides.page ?? historyFilterRef.current.page,
        limit: overrides.limit ?? historyPageSize,
        search: overrides.search ?? filtersRef.current.search
      };

      const response = await fetchSchoolApprovalHistory(params);
      const enhanced = (response.data || []).map((item) => ({
        ...item,
        decisionRelativeTime: item.decisionRelativeTime || formatRelativeTime(item.decisionAt || item.updatedAt)
      }));
      setHistory({
        data: enhanced,
        meta: response.meta || { total: 0, page: params.page, pages: 1, limit: params.limit }
      });
      if (historyFilterRef.current.status !== params.status || historyFilterRef.current.page !== params.page) {
        setHistoryFilter({ status: params.status, page: params.page });
      }
      historyFilterRef.current = { status: params.status, page: params.page };
    } catch (error) {
      console.error("Error loading approval history:", error);
      toast.error("Unable to load approval history");
    }
  }, []);

  const initialize = useCallback(async () => {
    setInitialLoading(true);
    await Promise.all([loadDashboard(), loadPending(), loadHistory({ page: 1 })]);
    setInitialLoading(false);
  }, [loadDashboard, loadPending, loadHistory]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadPending();
      loadHistory({ page: 1 });
    }, 350);
    return () => clearTimeout(timeout);
  }, [filters, loadPending, loadHistory]);

  const handleHistoryStatusChange = (status) => {
    loadHistory({ status, page: 1 });
  };

  const handleHistoryPageChange = (page) => {
    loadHistory({ page });
  };

  useEffect(() => {
    if (!socket?.socket) return;

    const handleNew = (payload) => {
      if (!payload?.id) return;
      const enriched = enhanceSchool(payload);
      setPendingSchools((prev) => {
        const exists = prev.some((item) => item.id === enriched.id);
        if (exists) {
          return prev.map((item) => (item.id === enriched.id ? { ...item, ...enriched } : item));
        }
        return [enriched, ...prev];
      });
      loadDashboard();
    };

    const handleUpdate = (payload) => {
      if (!payload?.data?.id) return;
      const enriched = enhanceSchool(payload.data);

      setPendingSchools((prev) => {
        if (!Array.isArray(prev)) return prev;

        if (payload.status === "approved" || payload.status === "rejected") {
          return prev.filter((item) => item.id !== enriched.id);
        }

        const exists = prev.some((item) => item.id === enriched.id);
        if (!exists) {
          return [enriched, ...prev];
        }
        return prev.map((item) => (item.id === enriched.id ? enriched : item));
      });

      if (selectedSchool?.id === enriched.id) {
        setSelectedSchool(enriched);
      }

      loadDashboard();
      loadHistory();
    };

    socket.socket.on("admin:school-approval:new", handleNew);
    socket.socket.on("admin:school-approval:update", handleUpdate);

    return () => {
      socket.socket.off("admin:school-approval:new", handleNew);
      socket.socket.off("admin:school-approval:update", handleUpdate);
    };
  }, [socket, loadDashboard, loadHistory, selectedSchool]);

  const summaryCards = useMemo(() => {
    const summary = dashboard?.summary || {};
    const pendingCount = summary.pending || 0;
    const approvalRate = summary.approvalRate ?? 0;
    const rejectionRate = approvalRate ? 100 - approvalRate : summary.rejectedLast30 || 0;
    const avgDecision = summary.averageDecisionHours ?? 0;

    return [
      {
        title: "Pending Schools",
        value: formatNumber(pendingCount),
        icon: Building2,
        color: "from-indigo-500 to-purple-600",
        subtitle: `${formatNumber(summary.agingBacklog || 0)} waiting >72h`,
        decorator: pendingCount > 0 ? (
          <span className="inline-flex items-center text-sm font-semibold text-indigo-600">
            <TrendingUp className="w-4 h-4 mr-1" /> pipeline active
          </span>
        ) : null
      },
      {
        title: "Approval Rate (30d)",
        value: approvalRate ? `${approvalRate}%` : "—",
        icon: CheckCircle2,
        color: "from-emerald-500 to-teal-600",
        subtitle: `${formatNumber(summary.approvedLast30 || 0)} approved`,
        decorator: approvalRate >= 80 ? (
          <span className="inline-flex items-center text-sm font-semibold text-emerald-600">
            <Sparkles className="w-4 h-4 mr-1" /> healthy pipeline
          </span>
        ) : (
          <span className="inline-flex items-center text-sm font-semibold text-emerald-600/70">
            <TrendingDown className="w-4 h-4 mr-1" /> improvement needed
          </span>
        )
      },
      {
        title: "Avg Decision Time",
        value: avgDecision ? `${avgDecision}h` : "—",
        icon: Clock,
        color: "from-cyan-500 to-blue-600",
        subtitle: "Target < 48h",
        decorator: avgDecision && avgDecision <= 48 ? (
          <span className="inline-flex items-center text-sm font-semibold text-cyan-600">
            <TrendingDown className="w-4 h-4 mr-1" /> on target
          </span>
        ) : (
          <span className="inline-flex items-center text-sm font-semibold text-cyan-600/70">
            <AlertTriangle className="w-4 h-4 mr-1" /> above target
          </span>
        )
      },
      {
        title: "Rejections (30d)",
        value: formatNumber(summary.rejectedLast30 || 0),
        icon: XCircle,
        color: "from-rose-500 to-pink-600",
        subtitle: `${formatNumber(rejectionRate)}% rejection rate`,
        decorator: rejectionRate >= 40 ? (
          <span className="inline-flex items-center text-sm font-semibold text-rose-600">
            <AlertTriangle className="w-4 h-4 mr-1" /> review policy
          </span>
        ) : (
          <span className="inline-flex items-center text-sm font-semibold text-rose-600/70">
            <Sparkles className="w-4 h-4 mr-1" /> healthy threshold
          </span>
        )
      }
    ];
  }, [dashboard]);

  const handleApproveReject = async () => {
    if (!confirmAction?.school) return;
    setActionLoading(true);
    try {
      const payload = { note: actionNote };
      if (confirmAction.mode === "approve") {
        await approveSchool(confirmAction.school.id, payload);
        toast.success("School approved successfully");
      } else {
        await rejectSchool(confirmAction.school.id, payload);
        toast.success("School rejected successfully");
      }
      setConfirmAction(null);
      setActionNote("");
      setSelectedSchool(null);
      setDetailModalOpen(false);
      await Promise.all([loadDashboard(), loadPending(), loadHistory()]);
    } catch (error) {
      console.error("Error updating approval status:", error);
      toast.error("Unable to update approval status");
    } finally {
      setActionLoading(false);
    }
  };

  const renderPendingCard = (school) => (
    <Motion.div
      key={school.id}
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      className={`rounded-2xl border transition-all duration-300 cursor-pointer ${
        selectedSchool?.id === school.id
          ? "border-indigo-300 shadow-xl shadow-indigo-200/60"
          : "border-slate-200 shadow-sm"
      } bg-white p-5`}
      onClick={() => {
        setSelectedSchool(school);
        setEditForm({
          name: school.name || "",
          institutionId: school.institutionId || "",
          email: school.email || "",
          phone: school.contactInfo?.phone || "",
          address: school.contactInfo?.address || "",
          city: school.contactInfo?.city || "",
          state: school.contactInfo?.state || "",
          pincode: school.contactInfo?.pincode || "",
          website: school.contactInfo?.website || "",
          board: school.academicInfo?.board || "",
          establishedYear: school.academicInfo?.establishedYear ? String(school.academicInfo.establishedYear) : "",
          totalStudents:
            school.academicInfo?.totalStudents || school.academicInfo?.totalStudents === 0
              ? String(school.academicInfo.totalStudents)
              : "",
          totalTeachers:
            school.academicInfo?.totalTeachers || school.academicInfo?.totalTeachers === 0
              ? String(school.academicInfo.totalTeachers)
              : ""
        });
        setEditing(false);
        setEditDirty(false);
        setDetailModalOpen(true);
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            {school.name}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{school.institutionId || "—"}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${priorityStyles[school.priority]}`}>
          {school.priority?.toUpperCase()}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-indigo-500" />
          <span className="truncate">{school.email}</span>
        </div>
        {school.contactInfo?.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-500" />
            <span>{school.contactInfo.phone}</span>
          </div>
        )}
        {school.contactInfo?.city && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <span>
              {school.contactInfo.city}
              {school.contactInfo.state ? `, ${school.contactInfo.state}` : ""}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span>{school.submittedAgoHuman || "—"}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        {school.tags?.map((tag) => (
          <span key={tag} className="px-2.5 py-1 text-xs bg-slate-100 border border-slate-200 text-slate-600 rounded-full">
            {tag}
          </span>
        ))}
        <span className="px-2.5 py-1 text-xs bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full">
          Readiness {school.metrics?.readinessScore || 0}%
        </span>
      </div>
    </Motion.div>
  );

  const renderTimeline = () => (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-slate-900 text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-500" />
            Submission velocity (7 days)
          </h3>
          <p className="text-xs text-slate-500">Track daily intake to forecast review capacity</p>
        </div>
      </div>
      <div className="space-y-3">
        {(dashboard?.submissionTimeline || []).map((item) => (
          <div key={item.date}>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{item.label}</span>
              <span>{item.submissions} submissions</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <Motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (item.submissions || 0) * 20)}%` }}
                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500"
              />
            </div>
          </div>
        ))}
        {!dashboard?.submissionTimeline?.length && (
          <p className="text-sm text-slate-500 text-center py-4">No submission activity in the last week</p>
        )}
      </div>
    </div>
  );

  const renderPendingHighlights = () => (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-slate-900 text-lg font-semibold flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-500" />
            Fast-track pipeline
          </h3>
          <p className="text-xs text-slate-500">Schools with highest readiness scores and aging submissions</p>
        </div>
      </div>
      <div className="space-y-3">
        {(dashboard?.pendingHighlights || []).map((highlight) => (
          <div
            key={highlight.id}
            className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700"
          >
            <div>
              <p className="font-semibold text-slate-900">{highlight.name}</p>
              <p className="text-xs text-slate-500">{highlight.contactInfo?.state || "Unknown state"}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-indigo-600 font-semibold">
                {highlight.metrics?.readinessScore || 0}% readiness
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-white border border-slate-200 text-slate-600">
                {highlight.submittedAgoHuman || "—"}
              </span>
            </div>
          </div>
        ))}
        {!dashboard?.pendingHighlights?.length && (
          <p className="text-sm text-slate-500 text-center py-4">No highlights available</p>
        )}
      </div>
    </div>
  );

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
          className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-16">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-14 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold uppercase tracking-[0.35em]">
              School onboarding
            </div>
            <h1 className="text-3xl md:text-4xl font-black mt-4 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8" />
              Approval Operations Hub
            </h1>
            <p className="text-sm md:text-base text-white/80 mt-3 max-w-2xl">
              Manage the entire lifecycle of school onboarding—evaluate readiness, log reviewer notes, and make
              confident decisions with real-time context and analytics.
            </p>
          </div>
          <div className="bg-white/15 border border-white/20 rounded-2xl px-6 py-4 flex flex-col items-start gap-2 text-sm backdrop-blur-md">
            <span className="text-xs uppercase tracking-widest text-white/70">Live monitors</span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              SLA target: 48h
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Review squad: Ops Specialists
            </div>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Workflows auto-sync with onboarding CRM
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {summaryCards.map((card) => (
            <Motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-slate-200 bg-white shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-md`}>
                  <card.icon className="w-6 h-6" />
                </div>
                {card.decorator}
              </div>
              <p className="text-sm text-slate-500">{card.title}</p>
              <p className="text-3xl font-black mt-2 text-slate-900">{card.value}</p>
              <p className="text-xs text-slate-400 mt-3">{card.subtitle}</p>
            </Motion.div>
          ))}
        </div>

        <div className="mt-12 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
                <input
                  type="text"
                  placeholder="Search by school, email, city, or institution ID"
                  value={filters.search}
                  onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Filter className="w-4 h-4 text-slate-400 absolute top-3 left-3" />
                  <input
                    type="text"
                    placeholder="Filter by state"
                    value={filters.state}
                    onChange={(event) => setFilters((prev) => ({ ...prev, state: event.target.value }))}
                    className="bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <select
                  value={filters.sort}
                  onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="oldest">Oldest first</option>
                  <option value="newest">Newest first</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-500" />
                    Pending schools ({pendingSchools.length})
                  </h2>
                  <span className="text-xs text-slate-500">Prioritized by readiness score and waiting time</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pendingSchools.map(renderPendingCard)}
                  {!pendingSchools.length && (
                    <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-500 shadow-sm">
                      <Sparkles className="w-6 h-6 text-indigo-400 mx-auto mb-3" />
                      <p className="text-sm">No pending schools awaiting review</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                {renderTimeline()}
                {renderPendingHighlights()}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <HistoryIcon className="w-5 h-5 text-indigo-500" />
                    Recent approval decisions
                  </h2>
                  <p className="text-sm text-slate-500">Audit trail of approvals and rejections with reviewer notes</p>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { key: "all", label: "All" },
                    { key: "approved", label: "Approved" },
                    { key: "rejected", label: "Rejected" }
                  ].map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => handleHistoryStatusChange(option.key)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition ${
                        historyFilter.status === option.key
                          ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">School</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Decision</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Reviewer</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">When</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.data.length ? (
                      history.data.map((entry) => (
                        <tr key={entry.id} className="hover:bg-slate-50/60">
                          <td className="px-4 py-3 text-sm text-slate-700">
                            <div className="font-semibold text-slate-900">{entry.name}</div>
                            <div className="text-xs text-slate-500">{entry.institutionId || "—"}</div>
                            <div className="text-xs text-slate-500">{entry.email}</div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                statusStyles[entry.decisionOutcome] || "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                            >
                              {entry.decisionOutcome?.replace(/_/g, " ") || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            <div className="font-medium text-slate-800">{entry.reviewer?.name || "—"}</div>
                            <div className="text-xs text-slate-500">{entry.reviewer?.email || entry.adminUser?.email || ""}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {entry.reviewNote?.length ? entry.reviewNote : "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-slate-500">
                            {entry.decisionRelativeTime || formatRelativeTime(entry.decisionAt)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500">
                          No approval history available for the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {history.meta.pages > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <span>
                    Page {history.meta.page} of {history.meta.pages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => history.meta.page > 1 && handleHistoryPageChange(history.meta.page - 1)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                      disabled={history.meta.page === 1}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => history.meta.page < history.meta.pages && handleHistoryPageChange(history.meta.page + 1)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                      disabled={history.meta.page === history.meta.pages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

        </div>

      </div>

      <AnimatePresence>
        {detailModalOpen && selectedSchool && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-center justify-center px-4 transition-opacity ${
              confirmAction ? 'opacity-70 pointer-events-none' : ''
            }`}
          >
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-4xl w-full max-h-[80vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col"
            >
              <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-200/60">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    {selectedSchool.name}
                  </h3>
                  <p className="text-sm text-slate-500">{selectedSchool.institutionId || "Institution ID not provided"}</p>
                  {selectedSchool.approvalStatus && (
                    <span
                      className={`inline-flex items-center gap-1 mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        statusStyles[selectedSchool.approvalStatus] || "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {selectedSchool.approvalStatus.replace(/_/g, " ")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {!editing && (
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-100"
                      onClick={() => {
                         setEditForm({
                           name: selectedSchool.name || "",
                           institutionId: selectedSchool.institutionId || "",
                           email: selectedSchool.email || "",
                           phone: selectedSchool.contactInfo?.phone || "",
                           address: selectedSchool.contactInfo?.address || "",
                           city: selectedSchool.contactInfo?.city || "",
                           state: selectedSchool.contactInfo?.state || "",
                           pincode: selectedSchool.contactInfo?.pincode || "",
                           website: selectedSchool.contactInfo?.website || "",
                           board: selectedSchool.academicInfo?.board || "",
                           establishedYear: selectedSchool.academicInfo?.establishedYear
                             ? String(selectedSchool.academicInfo.establishedYear)
                             : "",
                           totalStudents:
                             selectedSchool.academicInfo?.totalStudents || selectedSchool.academicInfo?.totalStudents === 0
                               ? String(selectedSchool.academicInfo.totalStudents)
                               : "",
                           totalTeachers:
                             selectedSchool.academicInfo?.totalTeachers || selectedSchool.academicInfo?.totalTeachers === 0
                               ? String(selectedSchool.academicInfo.totalTeachers)
                               : ""
                         });
                         setEditing(true);
                         setEditDirty(false);
                       }}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600"
                    onClick={() => {
                      setDetailModalOpen(false);
                      setSelectedSchool(null);
                      setEditing(false);
                      setEditDirty(false);
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="px-6 pb-6 overflow-y-auto">
                {editing ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Basic details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">School Name</span>
                          <input
                            value={editForm.name}
                            onChange={(event) => updateEditField("name", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Institution ID</span>
                          <input
                            value={editForm.institutionId}
                            onChange={(event) => updateEditField("institutionId", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Email</span>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(event) => updateEditField("email", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Contact information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Phone</span>
                          <input
                            value={editForm.phone}
                            onChange={(event) => updateEditField("phone", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Website</span>
                          <input
                            value={editForm.website}
                            onChange={(event) => updateEditField("website", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">City</span>
                          <input
                            value={editForm.city}
                            onChange={(event) => updateEditField("city", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">State</span>
                          <input
                            value={editForm.state}
                            onChange={(event) => updateEditField("state", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Pincode</span>
                          <input
                            value={editForm.pincode}
                            onChange={(event) => updateEditField("pincode", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                      </div>
                      <label className="block bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                        <span className="text-xs uppercase tracking-wide text-slate-500">Address</span>
                        <textarea
                          rows={3}
                          value={editForm.address}
                          onChange={(event) => updateEditField("address", event.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                        />
                      </label>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Academic profile</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Board</span>
                          <input
                            value={editForm.board}
                            onChange={(event) => updateEditField("board", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Established year</span>
                          <input
                            value={editForm.establishedYear}
                            onChange={(event) => updateEditField("establishedYear", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Total students</span>
                          <input
                            type="number"
                            min="0"
                            value={editForm.totalStudents}
                            onChange={(event) => updateEditField("totalStudents", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                        <label className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                          <span className="text-xs uppercase tracking-wide text-slate-500">Total teachers</span>
                          <input
                            type="number"
                            min="0"
                            value={editForm.totalTeachers}
                            onChange={(event) => updateEditField("totalTeachers", event.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition"
                        onClick={() => {
                          if (selectedSchool) {
                            setEditForm({
                              name: selectedSchool.name || "",
                              institutionId: selectedSchool.institutionId || "",
                              email: selectedSchool.email || "",
                              phone: selectedSchool.contactInfo?.phone || "",
                              address: selectedSchool.contactInfo?.address || "",
                              city: selectedSchool.contactInfo?.city || "",
                              state: selectedSchool.contactInfo?.state || "",
                              pincode: selectedSchool.contactInfo?.pincode || "",
                              website: selectedSchool.contactInfo?.website || "",
                              board: selectedSchool.academicInfo?.board || "",
                              establishedYear: selectedSchool.academicInfo?.establishedYear
                                ? String(selectedSchool.academicInfo.establishedYear)
                                : "",
                              totalStudents:
                                selectedSchool.academicInfo?.totalStudents || selectedSchool.academicInfo?.totalStudents === 0
                                  ? String(selectedSchool.academicInfo.totalStudents)
                                  : "",
                              totalTeachers:
                                selectedSchool.academicInfo?.totalTeachers || selectedSchool.academicInfo?.totalTeachers === 0
                                  ? String(selectedSchool.academicInfo.totalTeachers)
                                  : ""
                            });
                          }
                          setEditDirty(false);
                          setEditing(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={() => handleDetailSave()}
                        disabled={detailSaving}
                      >
                        {detailSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-2">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Contact</p>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-indigo-500" />
                          <span>{selectedSchool.email}</span>
                        </div>
                        {selectedSchool.contactInfo?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-indigo-500" />
                            <span>{selectedSchool.contactInfo.phone}</span>
                          </div>
                        )}
                        {selectedSchool.contactInfo?.address && (
                          <div className="flex items-start gap-2">
                            <Building2 className="w-4 h-4 text-indigo-500 mt-0.5" />
                            <span>{selectedSchool.contactInfo.address}</span>
                          </div>
                        )}
                        {(selectedSchool.contactInfo?.city || selectedSchool.contactInfo?.state) && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                            <span>
                              {[selectedSchool.contactInfo.city, selectedSchool.contactInfo.state]
                                .filter(Boolean)
                                .join(", ") || "—"}
                            </span>
                          </div>
                        )}
                        {selectedSchool.contactInfo?.pincode && (
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">Pincode:</span>
                            <span>{selectedSchool.contactInfo.pincode}</span>
                          </div>
                        )}
                        {selectedSchool.contactInfo?.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-indigo-500" />
                            <a
                              href={selectedSchool.contactInfo.website.startsWith("http")
                                ? selectedSchool.contactInfo.website
                                : `https://${selectedSchool.contactInfo.website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 underline-offset-2 hover:underline"
                            >
                              {selectedSchool.contactInfo.website}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 space-y-2">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Academic profile</p>
                        <div className="flex items-center justify-between text-xs">
                          <span>Total Students</span>
                          <span>{formatNumber(selectedSchool.academicInfo?.totalStudents || 0)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Total Teachers</span>
                          <span>{formatNumber(selectedSchool.academicInfo?.totalTeachers || 0)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Board</span>
                          <span>{selectedSchool.academicInfo?.board?.toUpperCase() || "—"}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Established</span>
                          <span>{selectedSchool.academicInfo?.establishedYear || "—"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
                        <HistoryIcon className="w-4 h-4 text-indigo-500" />
                        Review timeline
                      </h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {(selectedSchool.reviewHistory || []).length ? (
                          selectedSchool.reviewHistory
                            .slice()
                            .reverse()
                            .map((entry) => (
                              <div key={entry.id || entry.createdAt} className="text-xs text-slate-600 bg-white border border-slate-200 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-slate-900 capitalize">{entry.action}</span>
                                  <span className="text-slate-500">{entry.relativeTime}</span>
                                </div>
                                {entry.note && <p className="mt-1 text-slate-600">{entry.note}</p>}
                                {entry.reviewer && (
                                  <p className="mt-1 text-slate-500">
                                    {entry.reviewer.name || entry.reviewer.email || "System"}
                                  </p>
                                )}
                              </div>
                            ))
                        ) : (
                          <p className="text-xs text-slate-500">No review events recorded yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700">
                      <div className="flex items-center justify-between">
                        <span>Readiness score</span>
                        <span className="font-semibold text-indigo-600">{selectedSchool.metrics?.readinessScore || 0}%</span>
                      </div>
                      <div className="h-2 mt-2 bg-slate-100 rounded-full overflow-hidden">
                        <Motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedSchool.metrics?.readinessScore || 0}%` }}
                          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        High readiness schools have well-documented contact and academic profiles, enabling faster onboarding.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={() => handleInitiateAction("approve")}
                        disabled={detailSaving || actionLoading}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Approve school
                      </button>
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={() => handleInitiateAction("reject")}
                        disabled={detailSaving || actionLoading}
                      >
                        <XCircle className="w-5 h-5" />
                        Reject school
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmAction && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2300] flex items-center justify-center px-4"
          >
            <Motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-start gap-3">
                {confirmAction.mode === "approve" ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-500" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {confirmAction.mode === "approve" ? "Approve school onboarding" : "Reject school onboarding"}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {confirmAction.mode === "approve"
                      ? "Confirm that you’ve reviewed all documents and readiness criteria for this school."
                      : "Provide a clear reason so the onboarding team can guide the school on next steps."}
                  </p>
                </div>
              </div>
              <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <div className="font-semibold text-slate-900">{confirmAction.school.name}</div>
                <div className="text-xs text-slate-500">{confirmAction.school.email}</div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-500 mb-2 block">Reviewer note</label>
                <textarea
                  value={actionNote}
                  onChange={(event) => setActionNote(event.target.value)}
                  rows={4}
                  placeholder={confirmAction.mode === "approve" ? "Optional note for audit trail" : "Provide rejection reason"}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition"
                  onClick={() => setConfirmAction(null)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApproveReject}
                  disabled={actionLoading || (!actionNote.trim() && confirmAction.mode === "reject")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition ${
                    confirmAction.mode === "approve"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                      : "bg-gradient-to-r from-rose-500 to-red-500 text-white"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {confirmAction.mode === "approve" ? "Confirm approval" : "Reject school"}
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSchoolApprovals;

