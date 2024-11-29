import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
// import { fetchUserCourses } from "@/services/apiHelpers";

interface Course {
  id: number;
  name: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // API'den kullanıcının kurslarını getir
    const getCourses = async () => {
      try {
        // Backend olmadığı için mock data kullanılıyor
        const mockCourses = [
          { id: 1, name: "Türkçe" },
          { id: 2, name: "Matematik" },
          { id: 3, name: "İngilizce" },
        ];
        // const response = await fetchUserCourses();
        // setCourses(response);
        setCourses(mockCourses);
      } catch (error) {
        console.error("Kurslar yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    getCourses();
  }, []);

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        {courses.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {courses.map((course) => (
              <Button
                key={course.id}
                className="text-2xl p-12 bg-blue-500 text-white rounded"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                {course.name}
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Hiçbir kursa katılmadın, katılmak için tıkla
            </h1>
            <Button className="p-4 bg-green-500 text-white rounded">
              Kurslara Göz At
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
