import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // Mock course data
  const courses = [
    { id: 1, name: "Türkçe" },
    { id: 2, name: "Matematik" },
    { id: 3, name: "İngilizce" },
  ];

  const course = courses.find((c) => c.id.toString() === courseId);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">
          {course?.name || "Kurs Adı Bilinmiyor"}
        </h1>
        <div className="grid grid-cols-1 gap-4">
          <Button
            className="text-2xl p-8 bg-blue-500 text-white rounded"
            onClick={() => navigate(`/courses/${courseId}/materials`)}
          >
            Materyal
          </Button>
          <Button
            className="text-2xl p-8 bg-green-500 text-white rounded"
            onClick={() => navigate(`/courses/${courseId}/assignments`)}
          >
            Ödevler
          </Button>
          <Button
            className="text-2xl p-8 bg-yellow-500 text-white rounded"
            onClick={() => navigate(`/courses/${courseId}/quiz`)}
          >
            Sınavlar
          </Button>
          <Button
            className="text-2xl p-8 bg-red-500 text-white rounded"
            onClick={() => navigate(`/courses/${courseId}/forum`)}
          >
            Forum
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
