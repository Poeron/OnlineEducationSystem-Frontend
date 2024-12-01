import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { get } from "@/services/ApiHelper";

interface Course {
  course_id: number;
  title: string;
}

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (courseId) {
          const courseData = await get(`/Courses/${courseId}`);
          setCourse(courseData);
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
        <h1 className="text-3xl font-bold mb-8">
          {course?.title || "Kurs Adı Bilinmiyor"}
        </h1>
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
            className="text-2xl p-8 bg-yellow-500 text-white rounded"
            onClick={() => navigate(`/student/courses/${courseId}/quiz`)}
          >
            Sınavlar
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
