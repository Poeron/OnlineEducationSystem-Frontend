import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { get } from "@/services/ApiHelper";
import { jwtDecode } from "jwt-decode";

interface Course {
  course_id: number;
  title: string;
  description: string;
}

interface DecodedToken {
  user_id: string;
}

const AllCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Tüm kursları getirmek için API isteği
        const allCourses = await get("/Courses");
        setCourses(allCourses);

        // Kullanıcının token'ını almak ve çözmek
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken: DecodedToken = jwtDecode(token);
          const studentId = decodedToken.user_id;

          // Kullanıcının kayıtlı olduğu kursları getirmek için API isteği
          const userCoursesData = await get(`/Courses/student/${studentId}`);
          setUserCourses(
            userCoursesData.map(
              (course: { course_id: number }) => course.course_id
            )
          );
        }
      } catch (error) {
        console.error("Veriler yüklenirken hata oluştu:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleRegisterClick = (courseId: number) => {
    navigate(`/student/courses/${courseId}/register`);
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-black">
        <h1 className="text-3xl font-bold mb-8">Tüm Kurslar</h1>
        <div className="grid grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course.course_id}
              className="relative group text-black border p-12 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              <span className="text-2xl text-black font-bold">
                {course.title}
              </span>
              <p className="mt-2 text-sm text-gray-600">{course.description}</p>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {userCourses.includes(course.course_id) ? (
                  <span className="text-lg bg-green-500 text-white p-2 rounded">
                    Zaten Kayıtlısınız
                  </span>
                ) : (
                  <Button
                    className="bg-blue-500 text-white p-4 rounded"
                    onClick={() => handleRegisterClick(course.course_id)}
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
