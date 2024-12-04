import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Table,
  TableCaption,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { get, remove } from "@/services/ApiHelper";
import { Trash2 } from "lucide-react";
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

interface Student {
  user_id: number;
  name: string;
  email: string;
  enrollment_id: number;
  enrollment_date: string;
}

interface Course {
  title: string;
}

const CourseStudents: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchCourseTitle = async () => {
      try {
        const course: Course = await get(`/Courses/${courseId}`);
        setCourseTitle(course.title);
      } catch (error) {
        console.error("Kurs bilgileri yüklenirken hata oluştu:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const studentsData: Student[] = await get(
          `/Courses/${courseId}/students`
        );
        setStudents(studentsData);
      } catch (error) {
        console.error("Öğrenciler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseTitle();
    fetchStudents();
  }, [courseId]);

  const formattedDueDate = (date: string): string => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleRemoveStudent = async () => {
    if (selectedEnrollmentId === null) return;
    try {
      await remove(`/CourseEnrollments/${selectedEnrollmentId}`);
      alert("Öğrenci başarıyla kaldırıldı!");
      const updatedStudents: Student[] = await get(
        `/Courses/${courseId}/students`
      );
      setStudents(updatedStudents);
    } catch (e) {
      console.error("Öğrenci kaldırılırken hata oluştu:", e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className=" text-white min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">
          {courseTitle ? `${courseTitle} - Öğrenciler` : "Kurs Adı Bilinmiyor"}
        </h1>
        <div className="w-full max-w-5xl">
          <Table className="shadow-lg bg-gray-800 rounded-lg overflow-hidden">
            <TableCaption className="text-gray-400">
              Kursa kayıtlı öğrencilerin listesi
            </TableCaption>
            <TableHeader className="bg-gray-700">
              <TableRow>
                <TableHead className="p-4">Ad</TableHead>
                <TableHead className="p-4">E-posta</TableHead>
                <TableHead className="p-4">Kayıt Tarihi</TableHead>
                <TableHead className="p-4">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow
                  key={student.enrollment_id}
                  className="hover:bg-gray-700 transition-all"
                >
                  <TableCell className="p-4 font-medium">
                    {student.name}
                  </TableCell>
                  <TableCell className="p-4">{student.email}</TableCell>
                  <TableCell className="p-4">
                    {formattedDueDate(student.enrollment_date)}
                  </TableCell>
                  <TableCell className="p-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="bg-red-500 text-white p-2 rounded shadow hover:bg-red-600 transition-all"
                          onClick={() =>
                            setSelectedEnrollmentId(student.enrollment_id)
                          }
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-800 text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Öğrenciyi Kaldır</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu öğrenciyi kurstan kaldırmak istediğinize emin
                            misiniz? Bu işlem geri alınamaz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-500 text-white rounded">
                            İptal
                          </AlertDialogCancel>
                          <Button
                            onClick={handleRemoveStudent}
                            className="bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                          >
                            Öğrenciyi Kaldır
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CourseStudents;
