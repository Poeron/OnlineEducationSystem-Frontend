import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";

interface Assignment {
  courseId: number;
  courseName: string;
  title: string;
  dueDate: string;
  submitted: boolean;
}

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const mockAssignments = [
      {
        courseId: 1,
        courseName: "Veri Yapıları",
        title: "Veri Yapıları Ödev - 1",
        dueDate: "26 Mar",
        submitted: false,
      },
      {
        courseId: 2,
        courseName: "Matematik II",
        title: "YAZILIM - MATEMATİK II İKİNCİ ÖĞR. BÜTÜNLEME SINAVI",
        dueDate: "21 Haz 2023",
        submitted: false,
      },
      {
        courseId: 2,
        courseName: "Matematik II",
        title: "MATEMATİK II (İKİNCİ ÖĞRETİM) FİNAL SINAVI",
        dueDate: "7 Haz 2023",
        submitted: true,
      },
    ];
    setAssignments(mockAssignments);
  }, []);

  const handleAssignmentClick = (courseId: number) => {
    navigate(`/courses/${courseId}/assignments`);
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">Ödevler</h1>
        <div className="w-full max-w-4xl space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.courseId}
              className="w-full bg-gray-800 text-white p-4 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{assignment.title}</h2>
                  <p className="text-sm text-gray-400">
                    {assignment.courseName}
                  </p>
                </div>
                <p className="text-sm">{assignment.dueDate}</p>
              </div>
              <div className="mt-2 flex justify-end">
                <Button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => handleAssignmentClick(assignment.courseId)}
                >
                  Ödev Detayları
                </Button>
                {assignment.submitted ? (
                  <span className="ml-4 text-green-500 font-semibold">
                    ✔ Teslim edildi
                  </span>
                ) : (
                  <span className="ml-4 text-gray-500 font-semibold">
                    ✖ Teslim edilmedi
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentsPage;
