import React, { useState } from "react";
import GameShell, { GameCard, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const ChatbotFriend = () => {
    const [inputValue, setInputValue] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [score, setScore] = useState(0);
    const [flashPoints, setFlashPoints] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Add kid's message to chat
        const newHistory = [...chatHistory, { sender: "kid", text: inputValue }];
        setChatHistory(newHistory);

        if (inputValue.toLowerCase() === "hello") {
            // AI reply
            setTimeout(() => {
                setChatHistory([...newHistory, { sender: "ai", text: "Hi, how are you?" }]);
                setScore(prev => prev + 5);
                setFlashPoints(5);
                setShowConfetti(true);

                setTimeout(() => setFlashPoints(null), 1000);
            }, 500);

            setTimeout(() => {
                setShowConfetti(false);
                setShowModal(true); // End game after one exchange
            }, 2000);
        }

        setInputValue("");
    };

    return (
        <GameShell
            gameId="chatbot-friend"
            gameType="ai"
            totalLevels={1}
            title="Chatbot Friend"
            subtitle="Talk to your AI friend!"
            rightSlot={
                <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
                    Score: {score} ⭐
                </div>
            }
            onNext={() => setShowModal(true)}
            nextEnabled={chatHistory.length > 0}
            showGameOver={showModal}
            score={score}
        >
            {showConfetti && <Confetti />}
            {flashPoints && <ScoreFlash points={flashPoints} />}

            <LevelCompleteHandler gameId="chatbot-friend" gameType="ai" levelNumber={1}>
                <GameCard>
                    <div className="flex flex-col gap-2 text-white">
                        {chatHistory.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`px-4 py-2 rounded-xl max-w-fit ${msg.sender === "kid" ? "bg-blue-500 self-end" : "bg-green-500 self-start"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                </GameCard>
            </LevelCompleteHandler>

            {/* Chat Input */}
            <div className="flex gap-2 mt-4">
                <input
                    type="text"
                    className="flex-1 px-3 py-2 rounded-xl border focus:outline-none"
                    placeholder="Type 'Hello'..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={showModal}
                />
                <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={showModal}
                >
                    Send
                </button>
            </div>

            {showModal && (
                <div className="mt-4">
                    <FeedbackBubble message="Great! You just chatted with an AI chatbot." type="correct" />
                </div>
            )}
        </GameShell>
    );
};

export default ChatbotFriend;
