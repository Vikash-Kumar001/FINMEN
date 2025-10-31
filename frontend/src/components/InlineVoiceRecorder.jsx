import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Pause, Play, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

const InlineVoiceRecorder = ({ onRecordComplete, onCancel }) => {
  const [isRecording, setIsRecording] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startRecording();
    
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          setAudioBlob(blob);
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      startTimeRef.current = Date.now();

      // Start timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRecordingTime(elapsed);
        
        // Auto-stop at 60 seconds
        if (elapsed >= 60) {
          stopRecording();
          toast('Maximum recording time reached');
        }
      }, 100);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
      if (onCancel) {
        onCancel();
      }
    }
  };

  const togglePause = () => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      // Resume recording
      mediaRecorderRef.current.resume();
      // Update start time to account for paused duration
      startTimeRef.current = Date.now() - (recordingTime * 1000);
      setIsPaused(false);
      
      // Restart timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRecordingTime(elapsed);
        
        // Auto-stop at 60 seconds
        if (elapsed >= 60) {
          stopRecording();
          toast('Maximum recording time reached');
        }
      }, 100);
    } else {
      // Pause recording
      mediaRecorderRef.current.pause();
      
      // Clear timer interval to stop time counting
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      setIsPaused(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleCancel = () => {
    stopRecording();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setAudioBlob(null);
    if (onCancel) {
      onCancel();
    }
  };

  const handleSend = async () => {
    // Stop recording if still active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      // If paused, resume first to ensure we get all audio data
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      }
      
      // Stop the recorder
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Wait for the blob to be created from the onstop handler
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Create blob and send
      if (chunksRef.current.length > 0) {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        
        // Check file size (25MB limit)
        if (blob.size > 25 * 1024 * 1024) {
          toast.error('Oops! This file exceeds the size limit of 25 MB');
          handleCancel();
          return;
        }
        
        onRecordComplete(blob);
      }
    } else if (audioBlob) {
      // If already stopped, just send the blob
      onRecordComplete(audioBlob);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate waveform dots (simplified visualization)
  const generateWaveform = () => {
    const numDots = 20;
    const dots = [];
    for (let i = 0; i < numDots; i++) {
      // Random height for visual effect
      const height = Math.random() * 4 + 1;
      const isActive = recordingTime % 10 < i || i < 5; // Animation effect
      dots.push(
        <div
          key={i}
          className={`w-1 rounded-full ${isActive && !isPaused ? 'bg-indigo-500' : 'bg-indigo-200'}`}
          style={{ height: `${height}px` }}
        />
      );
    }
    return dots;
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-indigo-50 border border-indigo-200 rounded-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">
      {/* Timer */}
      <span className="text-indigo-700 font-mono font-semibold text-xs sm:text-sm md:text-base min-w-[2.5rem] sm:min-w-[3rem] md:min-w-[3.5rem]">
        {formatTime(recordingTime)}
      </span>

      {/* Waveform */}
      <div className="flex items-center gap-0.5 sm:gap-1 flex-1 max-w-xs">
        {generateWaveform()}
      </div>

      {/* Pause/Play Button */}
      <button
        onClick={togglePause}
        className="flex-shrink-0 p-1.5 sm:p-2 hover:bg-indigo-100 rounded-full transition-colors"
        title={isPaused ? 'Resume' : 'Pause'}
      >
        {isPaused ? (
          <Play className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="currentColor" />
        ) : (
          <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
        )}
      </button>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={recordingTime < 1}
        className="flex-shrink-0 p-1.5 sm:p-2 md:p-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-full"
        title="Send recording"
      >
        <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
      </button>

      {/* Cancel/Delete Button */}
      <button
        onClick={handleCancel}
        className="flex-shrink-0 p-0.5 sm:p-1 hover:bg-red-100 rounded-full transition-colors"
        title="Cancel recording"
      >
        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
      </button>
    </div>
  );
};

export default InlineVoiceRecorder;

