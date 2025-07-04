import React from "react";
import { useEffect, useState, useRef } from "react";
import { sendChatMessage, getChatHistory } from "../services/cbtService";
import EmojiPicker from "emoji-picker-react";
import { FaStar, FaRegStar, FaSmile } from "react-icons/fa";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        getChatHistory().then((res) => {
            const history = res.data.history || [];
            const withStars = history.map((msg) => ({ ...msg, starred: false }));
            setMessages(withStars);
            scrollToBottom();
        });
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleEmojiClick = (emoji) => {
        setInput((prev) => prev + emoji.emoji);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = {
            sender: "user",
            text: input,
            timestamp: new Date(),
            starred: false,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await sendChatMessage(userMsg.text);
            const botMsg = {
                sender: "bot",
                text: res.data.reply,
                timestamp: new Date(),
                starred: false,
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            console.error("Chat error", err);
        }

        setLoading(false);
        scrollToBottom();
    };

    const toggleStar = (index) => {
        setMessages((prev) =>
            prev.map((msg, i) =>
                i === index ? { ...msg, starred: !msg.starred } : msg
            )
        );
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">🧠 CBT Chatbot</h1>

            <div className="bg-gray-100 h-96 overflow-y-auto p-4 rounded shadow mb-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div className="flex items-center gap-2 max-w-[80%]">
                            {msg.sender === "bot" && (
                                <span
                                    className={`bg-gray-300 text-black p-2 rounded relative`}
                                >
                                    {msg.text}
                                    <span className="block text-xs text-gray-500 mt-1 text-right">
                                        {formatTime(msg.timestamp)}
                                    </span>
                                </span>
                            )}

                            {msg.sender === "user" && (
                                <span className="bg-blue-500 text-white p-2 rounded relative">
                                    {msg.text}
                                    <span className="block text-xs text-white mt-1 text-right">
                                        {formatTime(msg.timestamp)}
                                    </span>
                                </span>
                            )}

                            <button onClick={() => toggleStar(i)} className="text-yellow-500">
                                {msg.starred ? <FaStar /> : <FaRegStar />}
                            </button>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="text-left mt-2">
                        <span className="bg-gray-300 p-2 rounded inline-block text-black">
                            Typing...
                        </span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-xl"
                >
                    <FaSmile />
                </button>
                {showEmojiPicker && (
                    <div className="absolute bottom-24">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                )}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    disabled={loading}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chatbot;
