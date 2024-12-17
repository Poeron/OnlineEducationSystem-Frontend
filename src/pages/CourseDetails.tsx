import React, { useEffect, useState } from "react";
import { get, remove } from "@/services/ApiHelper";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";

interface Course {
  course_id: number;
  title: string;
  description: string;
}

interface DecodedToken {
  user_id: string;
  role: string;
}

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasExamResult, setHasExamResult] = useState<boolean>(false);
  const [result, setResult] = useState<number>(0);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (courseId) {
          const courses: Course[] = await get("/Courses");
          const selectedCourse = courses.find(
            (c) => c.course_id === parseInt(courseId, 10)
          );

          if (selectedCourse) {
            setCourse(selectedCourse);
          }

          const token = localStorage.getItem("token");
          const decodedToken: DecodedToken = jwtDecode(token!);
          const studentId = parseInt(decodedToken.user_id);
          setUserRole(decodedToken.role);

          const examResults = await get(
            `/ExamResults/course/${courseId}/student/${studentId}`
          );
          if (examResults) {
            setHasExamResult(true);
            setResult(examResults.score);
          }
        }
      } catch (error) {
        console.error("Kurs bilgileri yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleLeaveCourse = async () => {
    try {
      await remove(`/CourseEnrollments/course/${courseId}`);
      alert("Kurstan başarıyla ayrıldınız.");
      navigate("/student/mycourses");
    } catch (error) {
      console.error("Kurstan ayrılırken hata oluştu:", error);
      alert("Kurstan ayrılırken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-4xl font-extrabold text-gray-100 mb-4 text-center uppercase">
          {course?.title || "Kurs Adı Bilinmiyor"}
        </h1>
        <p className="text-lg mb-8 text-gray-300 text-center max-w-2xl">
          {course?.description || "Açıklama bulunamadı"}
        </p>
        <div className="grid grid-cols-1 gap-6 w-full max-w-lg">
          <Button
            className="btn-shared btn-hover btn-blue py-8 px-4"
            onClick={() =>
              navigate(`/${userRole}/courses/${courseId}/materials`)
            }
          >
            Materyal
          </Button>
          <Button
            className="btn-shared btn-hover btn-green py-8 px-4"
            onClick={() =>
              navigate(`/${userRole}/courses/${courseId}/assignments`)
            }
          >
            Ödevler
          </Button>
          <Button
            className={`btn-shared btn-hover py-8 px-4 ${
              hasExamResult ? "btn-purple" : "btn-yellow"
            }`}
            onClick={() =>
              navigate(
                hasExamResult
                  ? `/${userRole}/courses/${courseId}/exam-result`
                  : `/${userRole}/courses/${courseId}/quiz`
              )
            }
            disabled={hasExamResult}
          >
            {hasExamResult ? `Sınav Sonucunuz: ${result}` : "Sınavlar"}
          </Button>
          <Button
            className="btn-shared btn-hover btn-red py-8 px-4"
            onClick={() => navigate(`/${userRole}/courses/${courseId}/forum`)}
          >
            Forum
          </Button>
          {userRole === "instructor" && (
            <Button
              className="btn-shared btn-hover btn-teal py-8 px-4"
              onClick={() =>
                navigate(`/${userRole}/courses/${courseId}/students`)
              }
            >
              Öğrenciler
            </Button>
          )}
          {userRole === "student" && (
            <Button
              className="btn-shared btn-red py-8 px-4"
              onClick={handleLeaveCourse}
            >
              Kurstan Ayrıl
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
