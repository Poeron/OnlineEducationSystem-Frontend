import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { get } from "@/services/ApiHelper";
import { jwtDecode } from "jwt-decode";
import AssignmentList from "@/components/AssignmentList";

interface Assignment {
  assignment_id: number; // Benzersiz ödev ID'si
  course_id: number;
  course_name: string;
  title: string;
  description: string;
  due_date: string;
  submitted: boolean;
}

interface DecodedToken {
  user_id: number;
}

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken: DecodedToken = jwtDecode(token);
          const studentId = decodedToken.user_id;
          const data = await get(`/Assignments/student/${studentId}`);
          setAssignments(data);
        }
      } catch (error) {
        console.error("Ödevler yüklenirken hata oluştu:", error);
        setError("Ödevler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <p className="text-red-500 text-lg font-bold">{error}</p>
        </div>
      </div>
    );
  }

  function handleAssignmentClick(courseId: number): void {
    navigate(`/student/assignments/${courseId}`);
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">Ödevler</h1>
        <AssignmentList
          assignments={assignments}
          onAssignmentClick={handleAssignmentClick}
        />
      </div>
    </div>
  );
};

export default AssignmentsPage;
