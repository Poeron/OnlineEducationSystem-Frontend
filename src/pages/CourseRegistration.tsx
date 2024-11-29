import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  name: string;
  owner: string;
  description: string;
}

const CourseRegistration: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    // Mock course data
    const mockCourses = [
      {
        id: 1,
        name: "Türkçe",
        owner: "Ahmet Yılmaz",
        description:
          "Türkçe dil bilgisi ve edebiyat üzerine kapsamlı bir kurs.",
      },
      {
        id: 2,
        name: "Matematik",
        owner: "Mehmet Demir",
        description: "Temel matematik ve ileri düzey matematik konuları.",
      },
    ];

    const foundCourse = mockCourses.find((c) => c.id.toString() === courseId);
    setCourse(foundCourse || null);
  }, [courseId]);

  const handleRegister = () => {
    // Kayıt olma işlemi gerçekleştirildikten sonra yönlendirme
    navigate(`/courses/${courseId}`);
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col text-black items-center justify-center min-h-screen p-8">
        {course ? (
          <div className="w-full max-w-3xl border p-8 rounded-lg shadow-md bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Kurs Adı: {course.name}</h1>
            <h2 className="text-xl font-semibold mb-4">
              Kurs Sahibi: {course.owner}
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
          <p>Kurs bilgisi yükleniyor...</p>
        )}
      </div>
    </div>
  );
};

export default CourseRegistration;
