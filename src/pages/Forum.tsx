import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  username: string;
  content: string;
}

const Forum: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    // Mock mesaj verileri
    const mockMessages = [
      { id: 1, username: "Ahmet", content: "Her şey nasıl yazılır?" },
      { id: 2, username: "Ahmet", content: "Her şey nasıl yazılır?" },
      { id: 3, username: "Ahmet", content: "Her şey nasıl yazılır?" },
      { id: 4, username: "Ahmet", content: "Her şey nasıl yazılır?" },
    ];
    setMessages(mockMessages);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: messages.length + 1,
        username: "Kullanıcı", // Geçici olarak sabit kullanıcı adı
        content: newMessage,
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">TÜRKÇE FORUMU</h1>
        <div className="w-full max-w-4xl space-y-4 mb-8">
          {messages.map((message) => (
            <div key={message.id} className="border p-4 rounded">
              <h2 className="font-bold mb-2">{message.username}</h2>
              <p>{message.content}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center w-full max-w-4xl">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Metin Girin!"
            className="flex-1 p-4 border rounded mr-4"
          />
          <Button
            className="p-4 bg-blue-500 text-white rounded"
            onClick={handleSendMessage}
          >
            Gönder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Forum;
