import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';
import { toast } from 'react-hot-toast';

const VoiceRecorder = ({ onRecordComplete, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        setAudioBlob(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Automatically stop after 60 seconds
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
          toast('Maximum recording time reached');
        }
      }, 60000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      // Check file size (25MB limit)
      if (audioBlob.size > 25 * 1024 * 1024) {
        toast.error('Oops! This file exceeds the size limit of 25 MB');
        setAudioBlob(null);
        return;
      }

      onRecordComplete(audioBlob);
      setAudioBlob(null);
    }
  };

  const handleCancel = () => {
    stopRecording();
    if (audioBlob) {
      setAudioBlob(null);
    }
    if (onCancel) {
      onCancel();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4">
        {!audioBlob ? (
          <>
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
                {isRecording ? (
                  <Mic className="w-8 h-8 text-red-600 animate-pulse" />
                ) : (
                  <Mic className="w-8 h-8 text-gray-400" />
                )}
              </div>
              {isRecording && (
                <p className="text-2xl font-mono text-red-600">{formatTime(recordingTime)}</p>
              )}
              {!isRecording && (
                <p className="text-sm text-gray-600">Hold to record</p>
              )}
            </div>

            <div className="flex gap-3">
              {!isRecording ? (
                <button
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Mic className="w-5 h-5" />
                  Hold to Record
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Square className="w-5 h-5" />
                  Stop Recording
                </button>
              )}
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Recording complete</p>
            <div className="flex gap-3">
              <button
                onClick={handleSend}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add to Message
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;

