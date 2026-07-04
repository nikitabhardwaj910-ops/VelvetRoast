"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const audio = new Audio("/cafe-music.mp3");
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    if (isPlaying) {
      // Smooth fade out
      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.05);
        } else {
          audio.volume = 0;
          audio.pause();
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        }
      }, 50);
      setIsPlaying(false);
    } else {
      // Smooth fade in
      audio.play().catch((err) => {
        console.error("Audio playback error:", err);
      });
      setIsPlaying(true);
      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume < 0.75) {
          audio.volume = Math.min(0.8, audio.volume + 0.05);
        } else {
          audio.volume = 0.8;
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        }
      }, 50);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {isPlaying && (
        <div className="glass-panel px-4 py-2 rounded-full border border-[#D4AF37]/50 flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-[#141414]/90 backdrop-blur-md animate-fade-in">
          <Music className="w-3.5 h-3.5 text-[#D4AF37] animate-spin [animation-duration:6s]" />
          <span className="text-[11px] uppercase tracking-[0.15em] text-[#D4AF37] font-semibold">
            Velvet Roast Jazz Lounge
          </span>
          <div className="flex items-end gap-0.5 h-3.5 ml-1">
            <span className="w-0.5 bg-[#D4AF37] rounded-full animate-pulse h-2.5"></span>
            <span className="w-0.5 bg-[#D4AF37] rounded-full animate-pulse h-3.5 [animation-delay:200ms]"></span>
            <span className="w-0.5 bg-[#D4AF37] rounded-full animate-pulse h-2 [animation-delay:400ms]"></span>
            <span className="w-0.5 bg-[#D4AF37] rounded-full animate-pulse h-3 [animation-delay:600ms]"></span>
          </div>
        </div>
      )}
      <button
        onClick={toggleSound}
        aria-label="Toggle background music"
        title={isPlaying ? "Mute Ambient Jazz" : "Play Ambient Jazz Lounge Music"}
        className="w-12 h-12 rounded-full bg-[#141414] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] hover:bg-gold-gradient hover:text-[#0F0F0F] transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-110 active:scale-95 group cursor-pointer"
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-cream/80 group-hover:text-[#0F0F0F] transition-colors" />
        )}
      </button>
    </div>
  );
}
