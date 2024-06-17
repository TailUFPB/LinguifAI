import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Message {
    text: string;
    origin: 'user' | 'bot';
}

const ChatBot: React.FC = () => {
    const [apikey, setApiKey] = useState("");
    const [firstTime, setFirstTime] = useState(true);
    const [apiKeyInput, setApiKeyInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<Message[]>([]);

    useEffect(() => {
        if (isOpen && !apikey && firstTime) {
            sendAPIKeyMessage();
        }
    }, [isOpen, apikey]);

    useEffect(() => {
        if (isOpen && chatHistory.length === 0 && apikey) {
            sendInitialMessage();
        }
    }, [isOpen, chatHistory, apikey]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = async () => {
        if (message.trim() === "" || !apikey) return;

        const newMessage: Message = { text: message, origin: 'user' };
        setChatHistory(prevHistory => [...prevHistory, newMessage]);

        try {
            const response = await axios.post('http://localhost:5000/chat', {
                message,
                history: [...chatHistory, newMessage],
                apikey
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

    const sendAPIKeyMessage = () => {
        setChatHistory(prevHistory => [
            ...prevHistory,
            { text: "Olá! Eu sou o LinguiTalk, um chatbot para lhe auxiliar na exploração dos seus dados! Primeiro, insira uma chave API válida do ChatGPT:", origin: 'bot' }
        ]);
    };

    const sendInitialMessage = () => {
        setChatHistory(prevHistory => [
            ...prevHistory,
            { text: "Olá! Eu sou o LinguiTalk. Como posso ajudar?", origin: 'bot' }
        ]);
    };

    const handleApiKeySubmit = async () => {
        setApiKey(apiKeyInput);
        const response = await axios.post('http://localhost:5000/apikey', {
            apikey: apiKeyInput
        });
        const botResponse: Message = { text: response.data.reply, origin: 'bot' };
        setChatHistory(prevHistory => [...prevHistory, botResponse]);
        setApiKeyInput("");
        if (response.status == 202) {
            sendInitialMessage()
        }
        else {
            setApiKey("")
            setFirstTime(false)
        }
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
                        <h2 className="text-lg">LinguiTalk</h2>
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
                    {apikey ? (
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
                    ) : (
                        <div className="p-4 border-t border-gray-300">
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                                placeholder="Digite sua chave API..."
                                value={apiKeyInput}
                                onChange={(e) => setApiKeyInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleApiKeySubmit();
                                }}
                            />
                            <button
                                className="w-full mt-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none"
                                onClick={handleApiKeySubmit}
                            >
                                Enviar Chave API
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatBot;
