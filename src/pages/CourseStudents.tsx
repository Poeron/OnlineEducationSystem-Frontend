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
import { get, remove } from "@/services/ApiHelper"; // API Helper importu
import { Trash2 } from "lucide-react"; // Çöp kutusu simgesi için
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
        // Kurs bilgilerini getir
        const course: Course = await get(`/Courses/${courseId}`);
        setCourseTitle(course.title);
      } catch (error) {
        console.error("Kurs bilgileri yüklenirken hata oluştu:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        // Kursa kayıtlı öğrencileri getir
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

  // Tarih formatlama fonksiyonu
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
      fetchStudents(); // Öğrenci listesini yeniden almak için fetchStudents()'ı çağırın
    } catch (e) {
      fetchStudents();
      console.error("Öğrenci kaldırılırken hata oluştu:", e);
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
    }
  };

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">
          {courseTitle ? `${courseTitle} - Öğrenciler` : "Kurs Adı Bilinmiyor"}
        </h1>
        <Table className="shadow-md w-full max-w-4xl">
          <TableCaption>Kursa kayıtlı öğrencilerin listesi</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Kayıt Tarihi</TableHead>
              <TableHead>İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.enrollment_id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  {formattedDueDate(student.enrollment_date)}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="bg-red-500 text-white p-2 rounded"
                        onClick={() =>
                          setSelectedEnrollmentId(student.enrollment_id)
                        }
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Öğrenciyi Kaldır</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bu öğrenciyi kurstan kaldırmak istediğinize emin
                          misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-300 text-black">
                          İptal
                        </AlertDialogCancel>
                        <Button
                          onClick={handleRemoveStudent}
                          className="bg-red-500 text-white"
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
  );
};

export default CourseStudents;
