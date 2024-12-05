import React, { useCallback, useEffect, useState } from "react";
import { get, post, remove } from "@/services/ApiHelper"; // Added `del` for delete request

import { Button } from "@/components/ui/button";
import { FaTrashAlt } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

interface Message {
  comment_id: string;
  comment_text: string;
  created_at: string;
  author_name: string;
}

interface Course {
  id: number;
  title: string;
}

interface DecodedToken {
  user_id: string;
  username: string;
  role: string; // Added role
}

const Forum: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [course, setCourse] = useState<Course | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  const fetchMessages = useCallback(async () => {
    try {
      const data = await get(`/ForumComments/course/${courseId}`);
      setMessages(data);
    } catch (error) {
      console.error("Mesajlar yüklenirken hata oluştu:", error);
    }
  }, [courseId]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseData = await get(`/Courses/${courseId}`);
        setCourse(courseData);
      } catch (error) {
        console.error("Kurs bilgisi yüklenirken hata oluştu:", error);
      }
    };

    const fetchUserRole = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken: DecodedToken = jwtDecode(token);
        setUserRole(decodedToken.role); // Set the user role from token
      }
    };

    fetchCourseDetails();
    fetchUserRole();
    fetchMessages();
  }, [courseId, fetchMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && courseId) {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken: DecodedToken = jwtDecode(token);
          const newMsg = {
            course_id: parseInt(courseId, 10),
            author_id: parseInt(decodedToken.user_id),
            comment_text: newMessage,
          };

          await post("/ForumComments", newMsg);
          fetchMessages(); // Refresh messages
          setNewMessage("");
        }
      } catch (error) {
        console.error("Mesaj gönderilirken hata oluştu:", error);
        alert("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
      }
    }
  };

  const handleDeleteMessage = async (commentId: string) => {
    try {
      await remove(`/ForumComments/${commentId}`);
      fetchMessages();
      alert("Mesaj başarıyla silindi.");
    } catch (error) {
      console.error("Mesaj silinirken hata oluştu:", error);
      alert("Mesaj silinemedi. Lütfen tekrar deneyin.");
    }
  };

  return (
    <section className="h-screen overflow-y-hidden">
      <div className="flex flex-col items-center justify-center min-h-screen p-8 ">
        <h1 className="text-4xl font-bold text-white mb-12">
          {course ? `${course.title.toUpperCase()} FORUMU` : "FORUM"}
        </h1>

        {/* Messages List */}
        <div className="w-full max-w-4xl space-y-6 mb-12 overflow-y-auto max-h-[500px] bg-zinc-900 p-4 rounded-lg shadow-md">
          {messages.map((message) => {
            const formattedDate = new Date(
              message.created_at
            ).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            });

            return (
              <div
                key={message.comment_id}
                className="bg-gray-300 shadow-md p-6 rounded-lg flex justify-between items-start hover:shadow-lg transition-shadow duration-300"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    {message.author_name}
                  </h2>
                  <p className="text-gray-600">{message.comment_text}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-500 mb-2">
                    {formattedDate}
                  </span>
                  {userRole === "instructor" && (
                    <button
                      className="text-red-500 hover:text-red-700 p-2 rounded focus:outline-none transition-colors"
                      onClick={() => handleDeleteMessage(message.comment_id)}
                    >
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="flex items-center w-full max-w-4xl p-4 rounded-lg shadow-md">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 p-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 "
          />
          <Button
            className="ml-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all"
            onClick={handleSendMessage}
          >
            Gönder
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Forum;
