import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MusicPlaylistAI = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const genres = [
    { 
      id: 1, 
      name: "Pop", 
      emoji: "🎤", 
      playlist: [
        "🎶 Top Pop Hits 2025",
        "💃 Dance Pop Vibes",
        "🌟 Selena Gomez Essentials",
        "🎧 Chill Pop Beats",
        "🎵 Billboard Top 50"
      ] 
    },
    { 
      id: 2, 
      name: "Rock", 
      emoji: "🎸", 
      playlist: [
        "🔥 Classic Rock Legends",
        "⚡ Modern Rock Anthems",
        "🤘 Guitar Heroes",
        "🎧 Headbanger Mix",
        "🎤 90s Rock Revival"
      ] 
    },
    { 
      id: 3, 
      name: "Hip-Hop", 
      emoji: "🎧", 
      playlist: [
        "🎤 Rap Royalty",
        "💥 Street Beats",
        "🕶️ Old School Flow",
        "🎵 Trap Nation",
        "🔥 Freestyle Vibes"
      ] 
    },
    { 
      id: 4, 
      name: "Classical", 
      emoji: "🎻", 
      playlist: [
        "🎼 Beethoven to Bach",
        "🎹 Piano Moods",
        "🌙 Evening Symphony",
        "🎻 Calm Strings",
        "🏛️ Timeless Classics"
      ] 
    },
    { 
      id: 5, 
      name: "EDM", 
      emoji: "🎛️", 
      playlist: [
        "🎵 EDM Party Mix",
        "⚡ Festival Anthems",
        "🎧 DJ Remix Zone",
        "🔥 Bass Drop Central",
        "💫 Chillstep Vibes"
      ] 
    }
  ];

  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
  };

  const handleGeneratePlaylist = () => {
    if (selectedGenre) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setShowPlaylist(true);
    }
  };

  const handleFinish = () => {
    navigate("/student/ai-for-all/teen/airport-security-story");
  };

  const selectedGenreData = genres.find(g => g.id === selectedGenre);

  return (
    <GameShell
      title="Music Playlist AI 🎵"
      subtitle="Personalized Music with AI"
      onNext={handleFinish}
      nextEnabled={showPlaylist}
      showGameOver={showPlaylist}
      score={coins}
      gameId="ai-teen-20"
      gameType="ai"
      totalLevels={20}
      currentLevel={20}
      showConfetti={showPlaylist}
      backPath="/games/ai-for-all/teens"
    
      maxScore={20} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showPlaylist ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">🎶</div>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Choose Your Favorite Music Genre
            </h2>

            <p className="text-white/80 mb-6 text-center">
              Select a genre below — AI will create your perfect playlist! 🎧
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreSelect(genre.id)}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    selectedGenre === genre.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-6xl mb-2">{genre.emoji}</div>
                  <div className="text-white font-semibold text-lg">
                    {genre.name}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleGeneratePlaylist}
              disabled={!selectedGenre}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedGenre
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Create My Playlist! 🎧
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">🎵</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Your AI-Generated Playlist
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white/80 text-sm mb-3">
                You selected: {selectedGenreData.emoji} {selectedGenreData.name}
              </p>
              <p className="text-white text-lg font-bold mb-4">
                AI curated songs for you:
              </p>
              <div className="space-y-3">
                {selectedGenreData.playlist.map((song, index) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition"
                  >
                    <p className="text-white font-semibold">{song}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm mb-3">
                💡 AI analyzes your listening history, favorite artists, and even mood 
                to build playlists that fit your personality! Platforms like Spotify, 
                YouTube Music, and Apple Music use these AI systems to personalize your 
                music experience every day! 🎶
              </p>
              <ul className="text-white/80 text-sm space-y-1">
                <li>• <strong>Collaborative filtering:</strong> “Listeners like you also liked…”</li>
                <li>• <strong>Content-based:</strong> “Because you listened to X, try Y…”</li>
                <li>• <strong>Mood-based AI:</strong> Songs that match your energy!</li>
              </ul>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned 5 Coins! 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default MusicPlaylistAI;
