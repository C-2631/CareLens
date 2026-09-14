import React, { useState, useRef } from 'react';
import { Play, Pause, Sparkles } from 'lucide-react';

export default function VideoBackground({
  videoSrc = '/videos/video_project.mp4',
  overlayOpacity = 'bg-white/80',
  className = '',
  showControls = true
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(videoSrc);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const switchVideo = (src) => {
    setCurrentVideo(src);
    if (videoRef.current) {
      videoRef.current.src = src;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background HTML5 Video */}
      <video
        ref={videoRef}
        key={currentVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none scale-105 transition-all duration-700 filter brightness-105 contrast-95"
      >
        <source src={currentVideo} type="video/mp4" />
      </video>

      {/* Light Glassmorphism Overlays */}
      <div className={`absolute inset-0 ${overlayOpacity} backdrop-blur-[2px] transition-all duration-500`} />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/60 via-transparent to-white pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-transparent to-white/90 pointer-events-none" />

      {/* Subtle Medical Ambient Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Video Controls Switcher */}
      {showControls && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sky-100 shadow-md text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-sky-700 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Project Stream</span>
          </div>
          <button
            onClick={() => switchVideo('/videos/video_project.mp4')}
            className={`px-2.5 py-0.5 rounded-full transition-all text-[11px] font-bold ${
              currentVideo === '/videos/video_project.mp4' ? 'bg-sky-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            Project Video
          </button>
          <button
            onClick={() => switchVideo('/videos/bg1.mp4')}
            className={`px-2.5 py-0.5 rounded-full transition-all text-[11px] font-bold ${
              currentVideo === '/videos/bg1.mp4' ? 'bg-sky-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            Stream 1
          </button>
          <button
            onClick={() => switchVideo('/videos/bg2.mp4')}
            className={`px-2.5 py-0.5 rounded-full transition-all text-[11px] font-bold ${
              currentVideo === '/videos/bg2.mp4' ? 'bg-sky-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            Stream 2
          </button>
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-600 transition-colors ml-1"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-sky-600" />}
          </button>
        </div>
      )}
    </div>
  );
}
