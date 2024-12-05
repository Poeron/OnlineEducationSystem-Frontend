import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { get } from "@/services/ApiHelper";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

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
        const allCourses = await get("/Courses");
        setCourses(allCourses);

        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken: DecodedToken = jwtDecode(token);
          const studentId = decodedToken.user_id;

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
      <div className="flex flex-col items-center justify-center min-h-screen p-8  text-white">
        <h1 className="text-4xl font-extrabold mb-8">Tüm Kurslar</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl justify-items-center">
          {courses.map((course) => (
            <div
              key={course.course_id}
              className="relative bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all w-full max-w-sm"
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                {course.title.toUpperCase()}
              </h2>
              <p className="text-sm text-gray-400">{course.description}</p>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-lg">
                {userCourses.includes(course.course_id) ? (
                  <span className="text-lg bg-green-500 text-white px-4 py-2 rounded-lg">
                    Zaten Kayıtlısınız
                  </span>
                ) : (
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all"
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
