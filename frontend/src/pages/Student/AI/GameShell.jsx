import React from 'react';
import { useNavigate } from 'react-router-dom';

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 30 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20"
        style={{
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    ))}
  </div>
);

const GameShell = ({ title, subtitle, rightSlot, children }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-start p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <FloatingParticles />

      <div className="w-full max-w-5xl z-10">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/student/games')}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full border border-white/20 backdrop-blur-md transition-all"
          >
            ← Back
          </button>
          {rightSlot || <div />}
        </div>

        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-title-glow">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-white/80 text-base md:text-lg mt-2 font-medium">{subtitle}</p>
            )}
          </div>
        )}

        {children}
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-title-glow { animation: title-glow 2s ease-in-out infinite; }
        @keyframes title-glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(255,255,255,0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.6)); }
        }
      `}</style>
    </div>
  );
};

export default GameShell;


