import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { get, post } from "@/services/ApiHelper";
import { jwtDecode } from "jwt-decode";
import AssignmentList from "@/components/AssignmentList";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
              return { ...assignment, submitted: true };
            }
            return { ...assignment, submitted: false };
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
        <Navbar />
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
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">
          {courseId ? `Kurs Ödevleri` : `Tüm Ödevler`}
        </h1>
        {userRole === "instructor" && (
          <div className="mb-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="p-4 bg-green-500 text-white rounded">
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
                  />
                  <Textarea
                    placeholder="Ödev Açıklaması"
                    value={newAssignmentDescription}
                    onChange={(e) =>
                      setNewAssignmentDescription(e.target.value)
                    }
                  />
                  <Input
                    type="date"
                    value={newAssignmentDueDate}
                    min={new Date().toISOString().split("T")[0]} // Geçmiş tarihler seçilemesin
                    onChange={(e) => setNewAssignmentDueDate(e.target.value)}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-300 text-black">
                    İptal
                  </AlertDialogCancel>
                  <Button
                    onClick={handleAddAssignment}
                    className="bg-blue-500 text-white"
                  >
                    Ödev Ekle
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        <AssignmentList
          assignments={assignments}
          onAssignmentClick={handleAssignmentClick}
        />
      </div>
    </div>
  );
};

export default AssignmentsPage;
