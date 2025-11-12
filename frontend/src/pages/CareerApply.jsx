import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  ArrowLeft, Briefcase, Clock, Loader2, MapPin, Send, User, Check
} from "lucide-react";
import api from "../utils/api";

const defaultForm = {
  applicantName: "",
  applicantEmail: "",
  applicantPhone: "",
  experienceYears: "",
  resumeUrl: "",
  linkedinUrl: "",
  portfolioUrl: "",
  coverLetter: "",
};

const CareerApply = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [jobError, setJobError] = useState("");
  const [formData, setFormData] = useState(defaultForm);
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (jobId) {
      let isCancelled = false;
      const loadJob = async () => {
        try {
          setLoadingJob(true);
          setJobError("");
          const res = await api.get(`/api/careers/openings/${jobId}`);
          if (!isCancelled) {
            setJob(res.data?.data || null);
          }
        } catch (error) {
          console.error("Error fetching job opening:", error);
          if (!isCancelled) {
            setJob(null);
            setJobError(
              error.response?.data?.message ||
                "This opening is unavailable or no longer accepting applications."
            );
          }
        } finally {
          if (!isCancelled) {
            setLoadingJob(false);
          }
        }
      };

      loadJob();
      return () => {
        isCancelled = true;
      };
    }
  }, [jobId]);

  const responsibilities = useMemo(
    () => (job?.responsibilities || []).filter(Boolean),
    [job]
  );

  const requirements = useMemo(
    () => (job?.requirements || []).filter(Boolean),
    [job]
  );

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResumeFileChange = (event) => {
    const file = event.target.files?.[0];
    setResumeFile(file || null);
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setResumeFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!job) {
      toast.error("This opening is no longer available.");
      return;
    }

    if (!formData.applicantName.trim() || !formData.applicantEmail.trim()) {
      toast.error("Please provide your name and email.");
      return;
    }

    if (!resumeFile && !formData.resumeUrl.trim()) {
      toast.error("Please upload your resume or provide a resume link.");
      return;
    }

    if (!formData.experienceYears.trim()) {
      toast.error("Please enter your total years of experience.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = new FormData();
      payload.append("applicantName", formData.applicantName.trim());
      payload.append("applicantEmail", formData.applicantEmail.trim());
      payload.append("applicantPhone", formData.applicantPhone.trim());
      payload.append("experienceYears", formData.experienceYears.trim());
      if (formData.resumeUrl.trim()) {
        payload.append("resumeUrl", formData.resumeUrl.trim());
      }
      if (formData.linkedinUrl.trim()) {
        payload.append("linkedinUrl", formData.linkedinUrl.trim());
      }
      if (formData.portfolioUrl.trim()) {
        payload.append("portfolioUrl", formData.portfolioUrl.trim());
      }
      if (formData.coverLetter.trim()) {
        payload.append("coverLetter", formData.coverLetter.trim());
      }
      if (resumeFile) {
        payload.append("resumeFile", resumeFile);
      }

      await api.post(`/api/careers/openings/${jobId}/apply`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Application submitted successfully! 🎉");
      resetForm();
      navigate("/careers", { replace: true });
    } catch (error) {
      console.error("Error submitting job application:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit your application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      <div className="relative py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-5xl mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {job?.title || "Apply for this Role"}
          </h1>
          <p className="text-lg text-white/90 max-w-3xl">
            Join WiseStudent and help us build the future of education. Share
            your experience, and our team will get in touch if there’s a strong
            match.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Share your details
          </h2>

          {loadingJob ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              Fetching role details...
            </div>
          ) : jobError ? (
            <div className="py-12 text-center text-red-500 font-semibold">
              {jobError}
            </div>
          ) : !job ? (
            <div className="py-12 text-center text-gray-500">
              This role is no longer accepting applications.
            </div>
          ) : (
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.applicantName}
                    onChange={handleChange("applicantName")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.applicantEmail}
                    onChange={handleChange("applicantEmail")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.applicantPhone}
                    onChange={handleChange("applicantPhone")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.experienceYears}
                    onChange={handleChange("experienceYears")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 3"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resume / CV <span className="text-red-500">*</span>
                </label>
                <div className="grid gap-4 md:grid-cols-2 md:items-end bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      Shareable Link
                    </label>
                    <input
                      type="url"
                      value={formData.resumeUrl}
                      onChange={handleChange("resumeUrl")}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      Upload File <span className="text-gray-400 font-normal">(PDF or Word, max 10MB)</span>
                    </label>
                    <label className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-dashed border-gray-300 bg-white text-sm text-gray-600 cursor-pointer hover:border-indigo-400 transition-colors">
                      <span className="truncate">
                        {resumeFile ? resumeFile.name : "Click to upload or drag & drop"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.rtf,.txt,.odt"
                        onChange={handleResumeFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Provide either a public link to your resume or upload the document directly. Only one is required, but you may provide both if you prefer.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    LinkedIn Profile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={handleChange("linkedinUrl")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://linkedin.com/in/..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Portfolio / Website
                  </label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={handleChange("portfolioUrl")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://mywebsite.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cover Letter / Message
                </label>
                <textarea
                  value={formData.coverLetter}
                  onChange={handleChange("coverLetter")}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tell us why you'd be a great fit for this role."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </button>
            </form>
          )}
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Role at a glance
            </h3>
            {job ? (
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  <span className="font-semibold text-gray-800">
                    {job.department}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span>{job.employmentType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-500" />
                  <span>{job.workMode}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Role details load here once available.
              </p>
            )}
          </div>

          {responsibilities.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Responsibilities
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {responsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {requirements.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Requirements
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {requirements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Need help?</h3>
                <p className="text-white/80 text-sm mt-1">
                  Have questions about the role or application process? Reach us
                  at{" "}
                  <span className="font-semibold">
                    support@wisestudent.org
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Motion.div>
      </div>
    </Motion.div>
  );
};

export default CareerApply;

