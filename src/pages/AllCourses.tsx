import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  name: string;
}

const AllCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock veri kullanılıyor
    const mockAllCourses = [
      { id: 1, name: "Türkçe" },
      { id: 2, name: "Matematik" },
      { id: 3, name: "İngilizce" },
      { id: 4, name: "Fizik" },
    ];
    const mockUserCourses = [1, 3]; // Kullanıcının kayıtlı olduğu kursların ID'leri
    setCourses(mockAllCourses);
    setUserCourses(mockUserCourses);
  }, []);

  const handleRegisterClick = (courseId: number) => {
    navigate(`/courses/${courseId}/register`);
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">Tüm Kurslar</h1>
        <div className="grid grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="relative group text-black border p-12 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              <span className="text-2xl font-bold">{course.name}</span>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {userCourses.includes(course.id) ? (
                  <span className="text-lg bg-green-500 text-white p-2 rounded">
                    Zaten Kayıtlısınız
                  </span>
                ) : (
                  <Button
                    className="bg-blue-500 text-white p-4 rounded"
                    onClick={() => handleRegisterClick(course.id)}
                  >
                    Hemen Kayıt Ol
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCourses;
