import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { get, post } from "@/services/ApiHelper";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

interface Message {
  id: number;
  username: string;
  content: string;
}

interface Course {
  id: number;
  title: string;
}

interface DecodedToken {
  user_id: number;
  username: string;
}

const Forum: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Kurs detaylarını almak için API isteği
        const courseData = await get(`/Courses/${courseId}`);
        setCourse(courseData);
      } catch (error) {
        console.error("Kurs bilgisi yüklenirken hata oluştu:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        // Forum mesajlarını almak için API isteği
        const data = await get(`/ForumThreads/course/${courseId}`);
        setMessages(data);
      } catch (error) {
        console.error("Mesajlar yüklenirken hata oluştu:", error);
      }
    };

    fetchCourseDetails();
    fetchMessages();
  }, [courseId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && courseId) {
      try {
        // Kullanıcının token'ını almak ve çözmek
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken: DecodedToken = jwtDecode(token);
          const newMsg = {
            course_id: parseInt(courseId, 10),
            author_id: decodedToken.user_id,
            title: newMessage,
          };

          // Yeni mesaj göndermek için API isteği
          const response = await post("/ForumThreads", newMsg);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: response.id,
              username: decodedToken.username,
              content: newMessage,
            },
          ]);
          setNewMessage("");
        }
      } catch (error) {
        console.error("Mesaj gönderilirken hata oluştu:", error);
        alert("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">
          {course ? `${course.title} FORUMU` : "Forum"}
        </h1>
        <div className="w-full max-w-4xl space-y-4 mb-8">
          {messages.map((message, index) => (
            <div
              key={`${message.username}-${index}`}
              className="border p-4 rounded"
            >
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
