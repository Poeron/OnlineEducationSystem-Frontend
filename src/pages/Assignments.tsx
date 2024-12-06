import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React, { useEffect, useState } from "react";
import { get, post } from "@/services/ApiHelper";
import { useNavigate, useParams } from "react-router-dom";

import AssignmentList from "@/components/AssignmentList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { jwtDecode } from "jwt-decode";

interface Assignment {
  assignment_id: number; // Benzersiz ödev ID'si
  course_id: number;
  course_name: string;
  title: string;
  description: string;
  due_date: string;
  submitted: boolean;
  grade?: number;
}

interface DecodedToken {
  user_id: number;
  role: string;
}

const AssignmentsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId?: string }>();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [newAssignmentTitle, setNewAssignmentTitle] = useState<string>("");
  const [newAssignmentDescription, setNewAssignmentDescription] =
    useState<string>("");
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        let data;
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken: DecodedToken = jwtDecode(token);
          setUserRole(decodedToken.role);

          const studentId = decodedToken.user_id;
          const doneAssignments = await get(
            `/AssignmentSubmissions/student/${studentId}`
          );

          if (courseId) {
            data = await get(`/Assignments/Courses/${courseId}`);
          } else {
            // Genel ödevleri getir
            data = await get(`/Assignments/student/${studentId}`);
          }
          data = data.map((assignment: Assignment) => {
            const submittedAssignment = doneAssignments.find(
              (a: Assignment) => a.assignment_id === assignment.assignment_id
            );
            if (submittedAssignment) {
              return {
                ...assignment,
                submitted: true,
                grade: submittedAssignment.grade,
              };
            }
            return { ...assignment, submitted: false, grade: undefined };
          });
        }
        if (data) {
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
  }, [courseId]);

  const handleAddAssignment = async () => {
    try {
      const newAssignment = {
        course_id: parseInt(courseId!),
        title: newAssignmentTitle,
        description: newAssignmentDescription,
        due_date: newAssignmentDueDate,
      };

      await post("/Assignments", newAssignment);
      alert("Yeni ödev başarıyla eklendi!");
      window.location.reload();
    } catch (error) {
      console.error("Ödev eklenirken hata oluştu:", error);
      alert("Ödev eklenemedi. Lütfen tekrar deneyin.");
    }
  };

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  if (error) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <p className="text-red-500 text-lg font-bold">{error}</p>
        </div>
      </div>
    );
  }

  function handleAssignmentClick(courseId: number): void {
    navigate(`/${userRole}/assignments/${courseId}`);
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center text-white p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          {courseId ? `Kurs Ödevleri` : `Tüm Ödevler`}
        </h1>

        {userRole === "instructor" && (
          <div className="mb-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-all">
                  Yeni Ödev Ekle
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Yeni Ödev Ekle</AlertDialogTitle>
                  <AlertDialogDescription>
                    Lütfen yeni ödevin başlığını, açıklamasını ve son teslim
                    tarihini girin.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col gap-4">
                  <Input
                    placeholder="Ödev Başlığı"
                    value={newAssignmentTitle}
                    onChange={(e) => setNewAssignmentTitle(e.target.value)}
                    className="bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <Textarea
                    placeholder="Ödev Açıklaması"
                    value={newAssignmentDescription}
                    onChange={(e) =>
                      setNewAssignmentDescription(e.target.value)
                    }
                    className="bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <Input
                    type="date"
                    value={newAssignmentDueDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setNewAssignmentDueDate(e.target.value)}
                    className="bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400">
                    İptal
                  </AlertDialogCancel>
                  <Button
                    onClick={handleAddAssignment}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all"
                  >
                    Ödev Ekle
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Ödev Listesi */}
        <AssignmentList
          assignments={assignments}
          onAssignmentClick={handleAssignmentClick}
        />
      </div>
    </div>
  );
};

export default AssignmentsPage;
