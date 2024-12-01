import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { get } from "@/services/ApiHelper";
import { jwtDecode } from "jwt-decode";

interface Course {
  course_id: number;
  title: string;
}

interface DecodedToken {
  user_id: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // API'den kullanıcının kurslarını getir
    const getCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken: DecodedToken = jwtDecode(token);
          const studentId = decodedToken.user_id;

          // Kullanıcının kayıtlı olduğu kursları getirmek için API isteği
          const userCoursesData = await get(`/Courses/student/${studentId}`);
          setCourses(userCoursesData);
        }
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
                key={course.course_id}
                className="text-2xl p-12 bg-blue-500 text-white rounded"
                onClick={() => navigate(`/student/courses/${course.course_id}`)}
              >
                {course.title}
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Hiçbir kursa katılmadın, katılmak için tıkla
            </h1>
            <Button
              className="p-4 bg-green-500 text-white rounded"
              onClick={() => navigate("/student/allcourses")}
            >
              Kurslara Göz At
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
