import React, { useEffect, useState } from "react";
import { get, post } from "@/services/ApiHelper";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
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
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (courseId) {
          const courseData: Course = await get(`/Courses/${courseId}`);
          setCourse(courseData);

          const token = localStorage.getItem("token");
          if (token) {
            const decodedToken: DecodedToken = jwtDecode(token);
            const studentId = decodedToken.user_id;
            const enrollments = await get(`/Courses/student/${studentId}`);

            const registered = enrollments.some(
              (enrollment: { course_id: number }) =>
                enrollment.course_id === parseInt(courseId)
            );
            setIsRegistered(registered);
          }
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
        navigate(`/student/courses/${courseId}`);
      } else {
        setError("Kullanıcı girişi yapılmadı. Lütfen giriş yapın.");
      }
    } catch (error) {
      console.error("Kursa kayıt olurken hata oluştu:", error);
      setError("Kursa kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-xl font-semibold animate-pulse">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8 text-red-500">
          <p className="text-lg font-bold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" text-white min-h-screen">
      <div className="flex flex-col items-center justify-center p-8">
        {course ? (
          <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <h2 className="text-lg text-gray-400 mb-6">
              Eğitmen ID: {course.instructor_id}
            </h2>
            <p className="text-gray-300 mb-8">{course.description}</p>
            <Button
              className={`w-full py-3 text-lg font-semibold rounded-lg transition-all ${
                isRegistered
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleRegister}
              disabled={isRegistered}
            >
              {isRegistered ? "Kayıtlısınız" : "Kayıt Ol"}
            </Button>
          </div>
        ) : (
          <p className="text-gray-300">Kurs bilgisi bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default CourseRegistration;
