import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Building2,
  CheckCircle2,
  Clock,
  Users,
  UserCircle,
  MapPin,
  Phone,
  Filter,
  Search,
  Sparkles,
  Layers,
  LayoutGrid,
  Rows,
} from "lucide-react";
import { fetchAdminSchools } from "../../services/adminSchoolsService";
import { useSocket } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";

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

const MetricsChip = ({ icon: Icon, label, value, accent = "from-emerald-500 to-teal-500" }) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
    <div className={`p-2 rounded-lg bg-gradient-to-br ${accent} text-white`}>
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-lg font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const OverviewCard = ({ title, value, subtitle, icon: Icon, gradient }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className="rounded-3xl shadow-xl border border-white/40 bg-white/90 backdrop-blur-lg px-6 py-5 relative overflow-hidden"
  >
    <div className={`absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br ${gradient}`} />
    <div className="relative z-10 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <p className="text-3xl font-black text-slate-900 mt-2">{value}</p>
        {subtitle && <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>}
      </div>
      <div className="p-3 rounded-2xl bg-white/85 shadow-lg">
        <Icon className="w-7 h-7 text-slate-700" />
      </div>
    </div>
  </motion.div>
);

const AdminSchools = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [groupedSchools, setGroupedSchools] = useState({
    approved: [],
    pending: [],
    rejected: [],
  });
  const [summary, setSummary] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [filters, setFilters] = useState({ status: "all", search: "", sort: "recent" });
  const [pagination, setPagination] = useState({ page: 1, limit: 18, total: 0, pages: 1 });
  const [searchDraft, setSearchDraft] = useState("");
  const [viewMode, setViewMode] = useState("rows");

  const filtersRef = useRef(filters);
  const paginationRef = useRef(pagination);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  const loadSchools = useCallback(
    async (overrides = {}) => {
      const currentFilters = filtersRef.current;
      const currentPagination = paginationRef.current;
      const params = {
        status: overrides.status ?? currentFilters.status,
        search: overrides.search ?? currentFilters.search,
        sort: overrides.sort ?? currentFilters.sort,
        page: overrides.page ?? currentPagination.page,
        limit: overrides.limit ?? currentPagination.limit,
      };

      setLoading(true);
      try {
        const response = await fetchAdminSchools(params);
        setSchools(response.data || []);
        setGroupedSchools(response.grouped || { approved: [], pending: [], rejected: [] });
        setSummary(response.summary || { total: 0, approved: 0, pending: 0, rejected: 0 });
        if (response.pagination) {
          const nextPagination = {
            page: response.pagination.page ?? params.page,
            limit: response.pagination.limit ?? params.limit,
            total: response.pagination.total ?? 0,
            pages: response.pagination.pages ?? 1,
          };
          paginationRef.current = nextPagination;
          setPagination(nextPagination);
        }
      } catch (error) {
        console.error("Error loading schools:", error);
        toast.error(error.response?.data?.message || "Unable to load schools overview");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadSchools({ page: 1 });
  }, [loadSchools]);

  useEffect(() => {
    setPagination((prev) => {
      const next = { ...prev, page: 1 };
      paginationRef.current = next;
      return next;
    });
    loadSchools({ page: 1 });
  }, [filters.status, filters.sort, filters.search, loadSchools]);

  useEffect(() => {
    if (!socket?.socket) return;
    const handleRealtimeUpdate = () => loadSchools();
    socket.socket.on("admin:school-approval:update", handleRealtimeUpdate);
    socket.socket.on("admin:schools:update", handleRealtimeUpdate);
    return () => {
      socket.socket.off("admin:school-approval:update", handleRealtimeUpdate);
      socket.socket.off("admin:schools:update", handleRealtimeUpdate);
    };
  }, [socket, loadSchools]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => {
        const nextSearch = searchDraft.trim();
        if (prev.search === nextSearch) return prev;
        return { ...prev, search: nextSearch };
      });
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchDraft]);

  const visibleSchools = useMemo(() => {
    if (filters.status === "all") return schools;
    return groupedSchools[filters.status] || [];
  }, [schools, groupedSchools, filters.status]);

  const statusSummaryCards = useMemo(
    () => [
      {
        title: "Total Schools",
        value: formatNumber(summary.total),
        subtitle: `${formatNumber(summary.pending)} awaiting review`,
        icon: Building2,
        gradient: "from-sky-400/70 via-blue-500/70 to-indigo-600/70",
      },
      {
        title: "Approved",
        value: formatNumber(summary.approved),
        subtitle: `${formatNumber(summary.rejected)} rejected overall`,
        icon: CheckCircle2,
        gradient: "from-emerald-400/70 via-green-500/70 to-teal-600/70",
      },
      {
        title: "Pending",
        value: formatNumber(summary.pending),
        subtitle: "Active onboarding pipeline",
        icon: Clock,
        gradient: "from-amber-400/70 via-orange-500/70 to-rose-500/70",
      },
    ],
    [summary]
  );

  const handleStatusFilter = (status) => {
    setFilters((prev) => (prev.status === status ? prev : { ...prev, status }));
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    setFilters((prev) => (prev.sort === value ? prev : { ...prev, sort: value }));
  };

  const handleCardSelect = (school) => {
    if (!school?.id) return;
    navigate(`/admin/schools/${school.id}`);
  };

  const handlePageChange = (direction) => {
    const target =
      direction === "next"
        ? Math.min(pagination.page + 1, pagination.pages || pagination.page)
        : Math.max(pagination.page - 1, 1);
    paginationRef.current = { ...paginationRef.current, page: target };
    setPagination((prev) => ({ ...prev, page: target }));
    loadSchools({ page: target });
  };

  const gridClass =
    viewMode === "grid"
      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
      : "grid grid-cols-1 gap-6";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-sky-50 pb-24">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-lg">
                  <Building2 className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black leading-tight">
                    Schools Intelligence Board
                  </h1>
                  <p className="text-white/80 text-base font-medium mt-1">
                    Track every institution across onboarding, approvals, and active delivery.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:min-w-[520px]">
              {statusSummaryCards.map((card) => (
                <OverviewCard key={card.title} {...card} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-14 space-y-12 relative z-10">
        <div className="rounded-3xl bg-white shadow-2xl border border-slate-100 px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex flex-wrap items-center gap-3">
              {[
                { key: "all", label: "All", count: summary.total },
                { key: "approved", label: "Approved", count: summary.approved },
                { key: "pending", label: "Pending", count: summary.pending },
                { key: "rejected", label: "Rejected", count: summary.rejected },
              ].map((item) => {
                const isActive = filters.status === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleStatusFilter(item.key)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all border ${
                      isActive
                        ? "bg-emerald-100 border-emerald-300 text-emerald-700 shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="inline-flex items-center justify-center text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200">
                      {formatNumber(item.count)}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={searchDraft}
                  onChange={(event) => setSearchDraft(event.target.value)}
                  placeholder="Search by name, city, or contact"
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={filters.sort}
                  onChange={handleSortChange}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                >
                  <option value="recent">Recently updated</option>
                  <option value="name">Alphabetical</option>
                  <option value="oldest">Oldest first</option>
                  <option value="students">Most students</option>
                </select>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1">
                <button
                  type="button"
                  onClick={() => setViewMode("rows")}
                  className={`p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors ${
                    viewMode === "rows" ? "bg-slate-100 text-slate-700" : ""
                  }`}
                  aria-label="Show rows"
                >
                  <Rows className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors ${
                    viewMode === "grid" ? "bg-slate-100 text-slate-700" : ""
                  }`}
                  aria-label="Show grid"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white shadow-2xl border border-slate-100 px-8 py-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 h-48" />
              ))}
            </div>
          ) : visibleSchools.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900">No schools match the selected filters</h3>
              <p className="text-slate-500 mt-2">
                Try adjusting your status filters or search keywords to broaden the results.
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 lg:grid-cols-2 gap-8"
                  : gridClass
              }
            >
              {visibleSchools.map((school) => {
                const token = statusTokens[school.approvalStatus] || {
                  label: school.approvalStatus,
                  className: "bg-slate-100 text-slate-700 border border-slate-200",
                };
                const isRow = viewMode === "rows";
                return (
                  <motion.button
                    key={school.id}
                    type="button"
                    layout
                    onClick={() => handleCardSelect(school)}
                    whileHover={{ y: -4 }}
                    className={`rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all ${
                      isRow ? "flex flex-col md:flex-row md:items-center md:justify-between" : "text-left"
                    }`}
                  >
                    <div
                      className={`px-6 py-5 ${
                        isRow
                          ? "flex-1 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                          : "space-y-5"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-[220px] max-w-[260px]">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-slate-900 truncate">
                            {school.name || "Unnamed school"}
                          </h3>
                          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1 truncate">
                            {school.institutionId || "Institution ID unavailable"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ${token.className} ${
                          isRow ? "md:ml-auto md:flex-shrink-0" : ""
                        }`}
                      >
                        {token.label}
                      </span>

                      {isRow ? (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 md:justify-end md:flex-1 md:min-w-[220px]">
                          <span className="inline-flex items-center gap-2 max-w-[220px] truncate">
                            <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            {[
                              school.contactInfo?.city,
                              school.contactInfo?.state,
                            ]
                              .filter(Boolean)
                              .join(", ") || "No location recorded"}
                          </span>
                          <span className="inline-flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                            Updated {formatRelativeTime(school.updatedAt)}
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                                <Users className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Students</p>
                                <p className="text-lg font-black text-slate-900 mt-1">
                                  {formatNumber(school.metrics?.studentCount)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500 to-slate-700 text-white">
                                <UserCircle className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Teachers</p>
                                <p className="text-lg font-black text-slate-900 mt-1">
                                  {formatNumber(school.metrics?.teacherCount)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                                <Layers className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Classes</p>
                                <p className="text-lg font-black text-slate-900 mt-1">
                                  {formatNumber(school.metrics?.classCount)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 text-white">
                                <Phone className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Contact</p>
                                <p className="text-lg font-black text-slate-900 mt-1 truncate">
                                  {school.contactInfo?.phone || "—"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-2 min-w-[160px]">
                              <MapPin className="w-4 h-4 text-emerald-500" />
                              {[
                                school.contactInfo?.city,
                                school.contactInfo?.state,
                              ]
                                .filter(Boolean)
                                .join(", ") || "No location recorded"}
                            </span>
                            <span className="inline-flex items-center gap-2 text-xs text-slate-400 font-semibold">
                              Updated {formatRelativeTime(school.updatedAt)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div
                      className={`border-t border-slate-100 px-6 py-3 text-xs font-semibold text-emerald-600 ${
                        isRow
                          ? "md:border-t-0 md:border-l md:flex md:flex-col md:justify-center md:px-6 md:min-w-[150px]"
                          : "text-center"
                      }`}
                    >
                      View details
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {!loading && pagination.pages > 1 && (
            <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-6">
              <span className="text-sm text-slate-500">
                Page {pagination.page} of {pagination.pages} • {formatNumber(pagination.total)} schools
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange("prev")}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => handlePageChange("next")}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSchools;

