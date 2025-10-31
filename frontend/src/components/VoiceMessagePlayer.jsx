import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download } from 'lucide-react';

const VoiceMessagePlayer = ({ url, duration, onDownload }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration || 0);
  const audioRef = useRef(null);
  
  // Generate random heights for waveform bars (generate once)
  const [waveformHeights] = useState(() => 
    Array.from({ length: 12 }, () => Math.random() * 60 + 35)
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Check if metadata is already loaded
    if (audio.duration && !audioDuration && isFinite(audio.duration)) {
      setAudioDuration(audio.duration);
    }

    const updateProgress = () => {
      if (audio.duration && isFinite(audio.duration)) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        setCurrentTime(audio.currentTime);
        setProgress(progressPercent);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    const handleLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration) && !audioDuration) {
        setAudioDuration(audio.duration);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioDuration]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        // Set current time to start if we're at the end
        if (audio.currentTime >= audio.duration - 0.1) {
          audio.currentTime = 0;
        }
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 px-1.5 py-1">
      <audio ref={audioRef} src={url} preload="metadata" />
      
      <button
        onClick={togglePlay}
        className="flex-shrink-0 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center transition-colors"
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 text-white" fill="white" />
        ) : (
          <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="white" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        {/* Simplified waveform visualization */}
        <div className="w-full h-3 rounded-full mb-1.5 flex items-end gap-0.5 sm:gap-1 px-1">
          {waveformHeights.map((height, i) => {
            const barProgress = (i / waveformHeights.length) * 100;
            const shouldFill = progress > barProgress;
            const barHeight = shouldFill ? '100%' : `${height}%`;
            
            return (
              <div
                key={i}
                className="w-1.5 sm:w-2 rounded-t-sm bg-white transition-all duration-150 ease-out flex-shrink-0"
                style={{
                  height: barHeight,
                  opacity: shouldFill ? 1 : 0.4,
                  minHeight: shouldFill ? '100%' : '25%'
                }}
              />
            );
          })}
        </div>

        {/* Time info */}
        <div className="flex items-center justify-between text-[10px] text-white/90">
          <span className="font-medium">{formatTime(Math.max(0, (audioDuration || 0) - currentTime))}</span>
        </div>
      </div>

      {/* Download button */}
      {onDownload && (
        <button
          onClick={onDownload}
          className="flex-shrink-0 w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center transition-colors"
          title="Download"
        >
          <Download className="w-3.5 h-3.5 text-white" />
        </button>
      )}
    </div>
  );
};

export default VoiceMessagePlayer;

