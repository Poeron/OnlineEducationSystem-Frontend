import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasExamResult, setHasExamResult] = useState<boolean>(false);
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (courseId) {
          // Tüm kursları al
          const courses: Course[] = await get("/Courses");

          // course_id eşleşen kursu bul
          const selectedCourse = courses.find(
            (c) => c.course_id === parseInt(courseId, 10)
          );

          if (selectedCourse) {
            setCourse(selectedCourse);
          }

          const token = localStorage.getItem("token");
          const decodedToken: DecodedToken = jwtDecode(token!);
          const studentId = parseInt(decodedToken.user_id);
          // Sınav sonucu kontrolü
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

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">
          {course?.title || "Kurs Adı Bilinmiyor"}
        </h1>
        <p className="text-lg mb-8">
          {course?.description || "Açıklama bulunamadı"}
        </p>
        <div className="grid grid-cols-1 gap-4">
          <Button
            className="text-2xl p-8 bg-blue-500 text-white rounded"
            onClick={() => navigate(`/student/courses/${courseId}/materials`)}
          >
            Materyal
          </Button>
          <Button
            className="text-2xl p-8 bg-green-500 text-white rounded"
            onClick={() => navigate(`/student/courses/${courseId}/assignments`)}
          >
            Ödevler
          </Button>
          <Button
            className={`text-2xl p-8 ${
              hasExamResult ? "bg-purple-500" : "bg-yellow-500"
            } text-white rounded`}
            onClick={() =>
              navigate(
                hasExamResult
                  ? `/student/courses/${courseId}/exam-result`
                  : `/student/courses/${courseId}/quiz`
              )
            }
            disabled={hasExamResult}
          >
            {hasExamResult ? `Sinav sonucunuz : ${result}` : "Sınavlar"}
          </Button>
          <Button
            className="text-2xl p-8 bg-red-500 text-white rounded"
            onClick={() => navigate(`/student/courses/${courseId}/forum`)}
          >
            Forum
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
