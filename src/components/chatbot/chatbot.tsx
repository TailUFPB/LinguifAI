import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Message {
    text: string;
    origin: 'user' | 'bot';
}

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<Message[]>([]);

    useEffect(() => {
        if (isOpen && chatHistory.length === 0) {
            sendInitialMessage();
        }
    }, [isOpen, chatHistory]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = async () => {
        if (message.trim() === "") return;

        const newMessage: Message = { text: message, origin: 'user' };
        setChatHistory(prevHistory => [...prevHistory, newMessage]);

        try {
            const response = await axios.post('http://localhost:5000/chat', {
                message,
                history: [...chatHistory, newMessage]
            });

            const botResponse: Message = { text: response.data.reply, origin: 'bot' };
            setChatHistory(prevHistory => [...prevHistory, botResponse]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = { text: "Desculpe, ocorreu um erro. Tente novamente.", origin: 'bot' };
            setChatHistory(prevHistory => [...prevHistory, errorMessage]);
        }

        setMessage("");
    };

    const sendInitialMessage = () => {
        setChatHistory(prevHistory => [
            ...prevHistory,
            { text: "Olá! Eu sou o (LinguiTalk ou LinguaBot). Como posso ajudar?", origin: 'bot' }
        ]);
    };

    return (
        <div>
            <button
                className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
                onClick={toggleChat}
            >
                💬
            </button>

            {/* Chat Dialog */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 bg-white border border-gray-300 shadow-lg rounded-lg w-80 flex flex-col max-h-[600px]">
                    <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
                        <h2 className="text-lg">LinguiTalk ou LinguaBot</h2>
                        <button
                            className="text-white hover:text-gray-200"
                            onClick={toggleChat}
                        >
                            ✖
                        </button>
                    </div>
                    <div className="p-4 overflow-y-auto h-64 flex-1">
                        <div>
                            {chatHistory.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 p-2 rounded-lg ${msg.origin === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'}`}
                                >
                                    <p className={`text-sm ${msg.origin === 'user' ? 'text-blue-700' : 'text-red-700'}`}>
                                        {msg.origin === 'user' ? 'Você' : 'LinguiBot'}
                                    </p>
                                    <p className="text-md">{msg.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-300">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                            placeholder="Digite sua mensagem..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') sendMessage();
                            }}
                        />
                        <button
                            className="w-full mt-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none"
                            onClick={sendMessage}
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
