import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthUtils';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    UserPlus,
    ArrowRight,
    Shield,
    Zap,
    User,
    Calendar,
    ShieldCheck,
    Link2,
    Loader2,
    CheckCircle2,
    X,
    GraduationCap,
} from 'lucide-react';

const AnimatedBackdrop = () => (
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-r from-cyan-500/15 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-r from-purple-500/15 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
    </div>
);

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalView, setModalView] = useState('mode-select');
    const [registrationMode, setRegistrationMode] = useState(null);
    const [selectedFlow, setSelectedFlow] = useState(null);
    const [parentLinkCode, setParentLinkCode] = useState('');
    const [schoolLinkCode, setSchoolLinkCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [linkingCodeGenerated, setLinkingCodeGenerated] = useState(null);
    const [gender, setGender] = useState('');
    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    // Password strength checker
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!fullName.trim() || !dob || !email || !password || !confirmPassword || !gender) {
            setError('Please fill in all fields.');
            return;
        }

        if (fullName.trim().length === 0) {
            setError('Full name is required.');
            return;
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
            setError('Date of Birth must be in YYYY-MM-DD format.');
            return;
        }
        const dobDate = new Date(dob);
        if (isNaN(dobDate.getTime())) {
            setError('Invalid Date of Birth.');
            return;
        }
        const today = new Date();
        if (dobDate > today) {
            setError('Date of Birth cannot be in the future.');
            return;
        }

        if (!gender) {
            setError('Please select your gender.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setModalOpen(true);
        setModalView('mode-select');
        setRegistrationMode(null);
        setSelectedFlow(null);
        setParentLinkCode('');
        setSchoolLinkCode('');
        setLinkingCodeGenerated(null);
    };
    const closeModal = () => {
        setModalOpen(false);
        setModalView('mode-select');
        setRegistrationMode(null);
        setSelectedFlow(null);
        setParentLinkCode('');
        setSchoolLinkCode('');
        setIsProcessing(false);
        setLinkingCodeGenerated(null);
    };

    const loginAndRedirect = async () => {
            const res = await api.post(`/api/auth/login`, {
                email,
            password,
            });

            localStorage.setItem('finmen_token', res.data.token);
            const user = await fetchUser();
            if (user?.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/student/dashboard");
            }
    };

    const finalizeStudentRegistration = async (payload) => {
        try {
            const response = await api.post(`/api/auth/student-registration/finalize`, payload);
            const { linkingCode = null, planType = 'free' } = response.data || {};
            setLinkingCodeGenerated(linkingCode || null);
            await loginAndRedirect();
            if (planType === 'student_parent_premium_pro') {
                toast.success("You're all set! Your family plan is active.");
            } else if (planType === 'student_premium') {
                toast.success("You're connected to your school’s premium plan. Enjoy full access!");
            } else if (planType === 'educational_institutions_premium') {
                toast.success("Welcome aboard! Your school’s premium access is active.");
            } else if (payload.flow === 'school_link') {
                toast.success("Your student account is ready. You’ll start with freemium access until your school activates their plan.");
            } else {
                toast.success("Freemium student account created. Ask your parent to complete their upgrade anytime.");
            }
            if (payload.flow === 'parent_not_created' && linkingCode) {
                toast.success(`Share this linking code with your parent: ${linkingCode}`);
            }
            closeModal();
        } catch (err) {
            console.error('Student registration finalize error:', err);
            setError(err.response?.data?.message || 'Failed to complete registration.');
        } finally {
            setIsProcessing(false);
        }
    };

    const startStudentRegistration = async (flow, options = {}) => {
        setIsProcessing(true);
        setError('');
        setLinkingCodeGenerated(null);
        try {
            const parentCode = options.parentLinkingCode
                ? options.parentLinkingCode.trim().toUpperCase()
                : undefined;
            const schoolCode = options.schoolLinkingCode
                ? options.schoolLinkingCode.trim().toUpperCase()
                : undefined;

            const response = await api.post(`/api/auth/student-registration/initiate`, {
                email: email.trim(),
                password,
                fullName: fullName.trim(),
                dateOfBirth: dob,
                flow,
                parentLinkingCode: parentCode,
                schoolLinkingCode: schoolCode,
                gender,
            });
            const payload = response.data?.payload;
            if (!payload) {
                throw new Error('Invalid registration response');
            }
            await finalizeStudentRegistration(payload);
        } catch (err) {
            console.error('Student registration initiate error:', err);
            setError(err.response?.data?.message || 'Failed to start registration.');
            setIsProcessing(false);
        }
    };

    const handleFlowSelection = (flow) => {
        setSelectedFlow(flow);
        setRegistrationMode('individual');
        if (flow === 'parent_not_created') {
            startStudentRegistration('parent_not_created');
        } else {
            setModalView('enter-parent-code');
        }
    };

    const handleRegistrationModeSelection = (mode) => {
        setRegistrationMode(mode);
        setSelectedFlow(null);
        setError('');

        if (mode === 'individual') {
            setParentLinkCode('');
            setSchoolLinkCode('');
            setModalView('parent-choice');
        } else if (mode === 'school') {
            setParentLinkCode('');
            setSchoolLinkCode('');
            setModalView('school-code');
        }
    };

    const handleParentCodeSubmit = () => {
        if (!parentLinkCode.trim()) {
            setError('Please enter your parent’s secret linking code.');
            return;
        }
        startStudentRegistration('parent_exists', { parentLinkingCode: parentLinkCode });
    };

    const handleSchoolCodeSubmit = () => {
        if (!schoolLinkCode.trim()) {
            setError('Please enter your school’s secret linking code.');
            return;
        }
        setError('');
        setRegistrationMode('school');
        startStudentRegistration('school_link', { schoolLinkingCode: schoolLinkCode });
    };

    const renderModalContent = () => {
        if (isProcessing) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center gap-4 py-10"
                >
                    <Loader2 className="w-10 h-10 text-cyan-600 animate-spin" />
                    <div className="text-center space-y-1">
                        <h3 className="text-lg font-semibold text-gray-900">Hold on a moment…</h3>
                        <p className="text-sm text-gray-600">We’re preparing your student dashboard.</p>
                    </div>
                </motion.div>
            );
        }

        if (modalView === 'enter-parent-code') {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                >
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Link to your parent</h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Enter your parent’s secret linking code. If their family plan is active, you’ll upgrade instantly.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Link2 className="w-4 h-4 text-cyan-500" />
                            Parent’s secret linking code
                        </label>
                        <input
                            type="text"
                            value={parentLinkCode}
                            onChange={(event) => setParentLinkCode(event.target.value.toUpperCase())}
                            placeholder="e.g. PR-XYZ789"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent uppercase tracking-widest"
                        />
                    </div>
                    <div className="flex justify-between gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedFlow(null);
                                setParentLinkCode('');
                                setModalView('parent-choice');
                            }}
                            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleParentCodeSubmit}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
                        >
                            Link & Continue
                        </button>
                    </div>
                </motion.div>
            );
        }

        if (modalView === 'school-code') {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                >
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900">Link through your school</h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Enter your school’s secret linking code. We’ll connect you to the right classroom instantly.
                        </p>
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                                {error}
                            </div>
                        )}
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-emerald-500" />
                            School secret linking code
                        </label>
                        <input
                            type="text"
                            value={schoolLinkCode}
                            onChange={(event) => setSchoolLinkCode(event.target.value.toUpperCase())}
                            placeholder="e.g. REG-SCHOOL2025"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent uppercase tracking-widest"
                        />
                    </div>
                    <div className="flex justify-between gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setSchoolLinkCode('');
                                setModalView('mode-select');
                                setRegistrationMode(null);
                            }}
                            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleSchoolCodeSubmit}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
                        >
                            Link & Continue
                        </button>
                    </div>
                </motion.div>
            );
        }

        if (modalView === 'parent-choice') {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <button
                        type="button"
                        onClick={() => {
                            setModalView('mode-select');
                            setRegistrationMode(null);
                            setSelectedFlow(null);
                        }}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition w-fit"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Change registration type
                    </button>

                    <div>
                        <h3 className="text-xl font-bold text-gray-900 text-center">
                            Do your parents already have an account?
                        </h3>
                        <p className="text-sm text-gray-600 text-center mt-2">
                            Choose an option so we can keep your family in sync from the very first login.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => handleFlowSelection('parent_exists')}
                            className={`group rounded-2xl border-2 transition-all p-5 text-left ${
                                selectedFlow === 'parent_exists'
                                    ? 'border-cyan-500 bg-cyan-50'
                                    : 'border-gray-200 hover:border-cyan-200 hover:bg-cyan-50/50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
                                    <Link2 className="w-5 h-5" />
                                </div>
                                {selectedFlow === 'parent_exists' && (
                                    <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                                )}
                            </div>
                            <h4 className="mt-4 text-lg font-semibold text-gray-900">
                                My parent’s account is already created
                            </h4>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                Link with their secret code. If their plan is active, you’ll upgrade to the premium family plan instantly.
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleFlowSelection('parent_not_created')}
                            className={`group rounded-2xl border-2 transition-all p-5 text-left ${
                                selectedFlow === 'parent_not_created'
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                {selectedFlow === 'parent_not_created' && (
                                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                )}
                            </div>
                            <h4 className="mt-4 text-lg font-semibold text-gray-900">
                                My parent will create their account later
                            </h4>
                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                We’ll create your freemium student account now and give you a secret code to share with them.
                            </p>
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                </motion.div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div>
                    <h3 className="text-xl font-bold text-gray-900 text-center">
                        How would you like to register?
                    </h3>
                    <p className="text-sm text-gray-600 text-center mt-2">
                        Pick the option that matches you best. We’ll guide you through the next steps.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => handleRegistrationModeSelection('individual')}
                        className={`group rounded-2xl border-2 transition-all p-5 text-left ${
                            registrationMode === 'individual'
                                ? 'border-cyan-500 bg-cyan-50'
                                : 'border-gray-200 hover:border-cyan-200 hover:bg-cyan-50/50'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
                                <UserPlus className="w-5 h-5" />
                            </div>
                            {registrationMode === 'individual' && (
                                <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                            )}
                        </div>
                        <h4 className="mt-4 text-lg font-semibold text-gray-900">
                            Register Individually
                        </h4>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                            Perfect if you’re signing up with a parent or creating your own account first.
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleRegistrationModeSelection('school')}
                        className={`group rounded-2xl border-2 transition-all p-5 text-left ${
                            registrationMode === 'school'
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            {registrationMode === 'school' && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            )}
                        </div>
                        <h4 className="mt-4 text-lg font-semibold text-gray-900">
                            Register Through School
                        </h4>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                            Use your school’s secret code to unlock class access and premium benefits instantly.
                        </p>
                    </button>
                </div>
                <button
                    type="button"
                    onClick={closeModal}
                    className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
            </motion.div>
        );
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const floatingVariants = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return 'from-red-500 to-orange-500';
        if (passwordStrength <= 3) return 'from-yellow-500 to-amber-500';
        return 'from-green-500 to-emerald-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength <= 3) return 'Medium';
        return 'Strong';
    };

    return (
        <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            <AnimatedBackdrop />

            {/* Main Content - Changed to use flex to fill entire screen */}
            {/* Added responsive padding and mobile-friendly positioning */}
            <div className="relative z-10 h-full flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                {/* Back to Homepage Button - Adjusted positioning for mobile */}
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-3 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 z-50"
                >
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
                    <span className="hidden xs:inline">Back to Homepage</span>
                    <span className="xs:hidden">Home</span>
                </button>

                <motion.div
                    className="w-full max-w-3xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Register Card - Adjusted padding for mobile */}
                    <motion.div
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl"
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {/* Header - Adjusted text sizes for mobile */}
                        <motion.div
                            className="text-center mb-6 sm:mb-8"
                            variants={itemVariants}
                        >
                            <motion.div
                                className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mb-3 sm:mb-4"
                                variants={floatingVariants}
                                animate="animate"
                            >
                                <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </motion.div>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                                Create Account
                            </h1>
                            <p className="text-gray-300 text-xs sm:text-sm md:text-base">
                                Join the gamified learning experience
                            </p>
                        </motion.div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-2 sm:p-3 mb-4 sm:mb-6"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="text-red-300 text-xs sm:text-sm text-center">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Register Form */}
                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-4 sm:space-y-6"
                            variants={itemVariants}
                        >
                            {/* Full Name and Date of Birth Fields - Responsive grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {/* Full Name Field */}
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                    />
                                </motion.div>

                                {/* Date of Birth Field */}
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        placeholder="Date of Birth"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        required
                                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                    />
                                </motion.div>
                            </div>

                            {/* Email Field */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                    />
                                </motion.div>

                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        required
                                        className="w-full appearance-none pl-10 sm:pl-12 pr-8 sm:pr-10 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                    >
                                        <option value="" disabled className="bg-slate-900 text-gray-400">
                                            Select gender
                                        </option>
                                        <option value="female" className="bg-slate-900 text-white">
                                            Female
                                        </option>
                                        <option value="male" className="bg-slate-900 text-white">
                                            Male
                                        </option>
                                        <option value="non_binary" className="bg-slate-900 text-white">
                                            Non-binary
                                        </option>
                                        <option value="prefer_not_to_say" className="bg-slate-900 text-white">
                                            Prefer not to say
                                        </option>
                                        <option value="other" className="bg-slate-900 text-white">
                                            Other
                                        </option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-gray-400">
                                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 rotate-90" />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Password and Confirm Password Fields - Responsive grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {/* Password Field */}
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                        className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                                    </button>
                                </motion.div>

                                {/* Confirm Password Field */}
                                <motion.div
                                    className="relative"
                                    whileFocus={{ scale: 1.02 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                                    </button>
                                </motion.div>
                            </div>

                            {/* Password Strength Indicator */}
                            <AnimatePresence>
                                {password && (
                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs sm:text-sm text-gray-400">Password Strength</span>
                                            <span className={`text-xs sm:text-sm font-medium bg-gradient-to-r ${getPasswordStrengthColor()} bg-clip-text text-transparent`}>
                                                {getPasswordStrengthText()}
                                            </span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2">
                                            <motion.div
                                                className={`h-1.5 sm:h-2 rounded-full bg-gradient-to-r ${getPasswordStrengthColor()}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Password Match Indicator */}
                            <AnimatePresence>
                                {confirmPassword && (
                                    <motion.div
                                        className="flex items-center space-x-2"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${password === confirmPassword ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className={`text-xs sm:text-sm ${password === confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                                            {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Register Button */}
                            <motion.button
                                type="submit"
                                disabled={modalOpen}
                                className="w-full py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group text-sm sm:text-base"
                                whileHover={{ scale: modalOpen ? 1 : 1.02 }}
                                whileTap={{ scale: modalOpen ? 1 : 0.98 }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Continue
                                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "100%" }}
                                    transition={{ duration: 0.8 }}
                                />
                            </motion.button>
                        </motion.form>

                        {/* Login Link */}
                        <motion.div
                            className="text-center mt-6 pt-5 border-t border-white/10"
                            variants={itemVariants}
                        >
                            <p className="text-gray-300 text-xs sm:text-sm">
                                Already have a Student account?{' '}
                                <motion.button
                                    onClick={() => navigate('/login')}
                                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors relative group"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    Sign In
                                    <motion.span
                                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"
                                        layoutId="underline"
                                    />
                                </motion.button>
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 relative"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <button
                                type="button"
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            {renderModalContent()}
                            {linkingCodeGenerated && registrationMode === 'individual' && (
                                <div className="mt-6 p-4 bg-cyan-50 border border-cyan-100 rounded-2xl text-sm text-cyan-700">
                                    Share this code with your parent:{" "}
                                    <span className="font-semibold">{linkingCodeGenerated}</span>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Register;