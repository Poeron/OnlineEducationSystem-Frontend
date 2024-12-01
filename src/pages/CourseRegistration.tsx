import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { get, post } from "@/services/ApiHelper";
import { jwtDecode } from "jwt-decode";

interface Course {
  course_id: number;
  title: string;
  instructor_id: number;
  description: string;
}

interface DecodedToken {
  user_id: number;
}

const CourseRegistration: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (courseId) {
          const courseData: Course = await get(`/Courses/${courseId}`);
          setCourse(courseData);
        }
      } catch (err) {
        console.error("Kurs bilgileri yüklenirken hata oluştu:", err);
        setError("Kurs bilgileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken: DecodedToken = jwtDecode(token);
        const studentId = decodedToken.user_id;

        const requestBody = {
          course_id: parseInt(courseId ?? "", 10),
          student_id: studentId,
        };

        await post("/CourseEnrollments", requestBody);
        navigate(`/courses/${courseId}`);
      }
    } catch (error) {
      console.error("Kursa kayıt olurken hata oluştu:", error);
      setError("Kursa kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <p className="text-red-500 text-lg font-bold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-black">
        {course ? (
          <div className="w-full max-w-3xl border p-8 rounded-lg shadow-md bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">
              Kurs Adı: {course.title}
            </h1>
            <h2 className="text-xl font-semibold mb-4">
              Kurs Sahibi ID: {course.instructor_id}
            </h2>
            <p className="text-lg mb-8">
              Kurs Açıklaması: {course.description}
            </p>
            <Button
              className="bg-blue-500 text-white p-4 rounded"
              onClick={handleRegister}
            >
              Kayıt Ol
            </Button>
          </div>
        ) : (
          <p>Kurs bilgisi bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default CourseRegistration;
