import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  Save,
  Send,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  FileText,
  Users,
  Target
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AssignmentAttempt = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Assignment and attempt data
  const [assignment, setAssignment] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [timer, setTimer] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // Auto-save interval
  const [autoSaveInterval, setAutoSaveInterval] = useState(null);

  // Start assignment attempt
  const startAttempt = async () => {
    try {
      setStarting(true);
      const response = await api.post(`/api/assignment-attempts/start/${assignmentId}`);
      
      if (response.data.success) {
        setAssignment(response.data.data.assignment);
        setAttempt(response.data.data.attempt);
        setTimeSpent(response.data.data.attempt.timeSpent || 0);
        
        // Initialize answers from existing attempt
        const existingAnswers = {};
        if (response.data.data.attempt.answers) {
          response.data.data.attempt.answers.forEach(answer => {
            existingAnswers[answer.questionId] = answer.answer;
          });
        }
        setAnswers(existingAnswers);
        
        // Start timer
        startTimer();
        
        // Start auto-save
        startAutoSave();
        
        toast.success('Assignment started successfully!');
      }
    } catch (error) {
      console.error('Error starting attempt:', error);
      toast.error(error.response?.data?.message || 'Failed to start assignment');
      navigate('/student/activity');
    } finally {
      setStarting(false);
    }
  };

  // Start timer
  const startTimer = () => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setTimeSpent(prev => prev + 1);
      }
    }, 1000);
    setTimer(interval);
  };

  // Pause/Resume timer
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Start auto-save
  const startAutoSave = () => {
    const interval = setInterval(() => {
      saveProgress();
    }, 30000); // Auto-save every 30 seconds
    setAutoSaveInterval(interval);
  };

  // Save progress
  const saveProgress = async () => {
    if (!attempt) return;
    
    try {
      setSaving(true);
      const answersArray = Object.entries(answers).map(([questionId, answer]) => {
        const question = assignment.questions.find(q => q.id === questionId);
        return {
          questionId,
          questionType: question?.type || 'multiple_choice',
          answer,
          timeSpent: 0 // Individual question time tracking can be added later
        };
      });

      await api.put(`/api/assignment-attempts/progress/${attempt._id}`, {
        answers: answersArray,
        timeSpent
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      // Don't show error toast for auto-save failures
    } finally {
      setSaving(false);
    }
  };

  // Submit assignment
  const submitAssignment = async () => {
    if (!attempt) return;
    
    const confirmed = window.confirm('Are you sure you want to submit this assignment? You cannot make changes after submission.');
    if (!confirmed) return;

    try {
      setSubmitting(true);
      const answersArray = Object.entries(answers).map(([questionId, answer]) => {
        const question = assignment.questions.find(q => q.id === questionId);
        return {
          questionId,
          questionType: question?.type || 'multiple_choice',
          answer,
          timeSpent: 0
        };
      });

      const response = await api.post(`/api/assignment-attempts/submit/${attempt._id}`, {
        answers: answersArray,
        timeSpent
      });

      if (response.data.success) {
        toast.success('Assignment submitted successfully!');
        navigate('/student/activity');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle answer change
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Navigate questions
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < assignment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if assignment is overdue
  const isOverdue = assignment && new Date() > new Date(assignment.dueDate);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
      if (autoSaveInterval) clearInterval(autoSaveInterval);
    };
  }, [timer, autoSaveInterval]);

  // Load assignment data on mount
  useEffect(() => {
    const loadAssignment = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/school/assignments/${assignmentId}`);
        if (response.data.success) {
          setAssignment(response.data.data);
        }
      } catch (error) {
        console.error('Error loading assignment:', error);
        toast.error('Failed to load assignment');
        navigate('/student/activity');
      } finally {
        setLoading(false);
      }
    };

    loadAssignment();
  }, [assignmentId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignment Not Found</h2>
          <p className="text-gray-600 mb-4">The assignment you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/student/activity')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Activities
          </button>
        </div>
      </div>
    );
  }

  // If attempt not started, show start screen
  if (!attempt) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
              <p className="text-gray-600 text-lg">{assignment.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Assignment Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{assignment.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{assignment.questions?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Marks:</span>
                    <span className="font-medium">{assignment.totalMarks || 100}</span>
                  </div>
                  {assignment.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{assignment.duration} minutes</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Time Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Time:</span>
                    <span className="font-medium">
                      {new Date(assignment.dueDate).toLocaleTimeString()}
                    </span>
                  </div>
                  {isOverdue && (
                    <div className="flex justify-between text-red-600">
                      <span>Status:</span>
                      <span className="font-medium">Overdue</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {assignment.instructions && (
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
                <p className="text-gray-700">{assignment.instructions}</p>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={startAttempt}
                disabled={starting}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 flex items-center mx-auto"
              >
                {starting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Starting Assignment...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Assignment
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main assignment interface
  const currentQuestion = assignment.questions[currentQuestionIndex];
  const totalQuestions = assignment.questions.length;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/student/activity')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{assignment.title}</h1>
                <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Timer */}
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="font-mono text-lg">{formatTime(timeSpent)}</span>
                <button
                  onClick={togglePause}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
              </div>

              {/* Progress */}
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {answeredQuestions}/{totalQuestions} answered
                </span>
              </div>

              {/* Auto-save indicator */}
              {saving && (
                <div className="flex items-center text-blue-600">
                  <Save className="w-4 h-4 mr-1" />
                  <span className="text-sm">Saving...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
              <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
                {assignment.questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => goToQuestion(index)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600 text-white'
                        : answers[question.id]
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Question {currentQuestionIndex + 1}
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {currentQuestion.question}
                </p>
                {currentQuestion.points && (
                  <div className="mt-2 text-sm text-gray-500">
                    {currentQuestion.points} points
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                  currentQuestion.options.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name={`question_${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))
                )}

                {currentQuestion.type === 'true_false' && (
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name={`question_${currentQuestion.id}`}
                        value="true"
                        checked={answers[currentQuestion.id] === 'true'}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700">True</span>
                    </label>
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name={`question_${currentQuestion.id}`}
                        value="false"
                        checked={answers[currentQuestion.id] === 'false'}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700">False</span>
                    </label>
                  </div>
                )}

                {currentQuestion.type === 'fill_blank' && (
                  <input
                    type="text"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Enter your answer here..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}

                {currentQuestion.type === 'short_answer' && (
                  <textarea
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Enter your answer here..."
                    rows={4}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={goToPrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>

                <div className="flex space-x-3">
                  <button
                    onClick={saveProgress}
                    disabled={saving}
                    className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>

                  {currentQuestionIndex === totalQuestions - 1 ? (
                    <button
                      onClick={submitAssignment}
                      disabled={submitting}
                      className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {submitting ? 'Submitting...' : 'Submit Assignment'}
                    </button>
                  ) : (
                    <button
                      onClick={goToNext}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentAttempt;