import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { get, post } from "@/services/ApiHelper";
import { jwtDecode } from "jwt-decode";
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

interface Course {
  course_id: number;
  title: string;
}

interface DecodedToken {
  user_id: string;
  role: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("");
  const [newCourseTitle, setNewCourseTitle] = useState<string>("");
  const [newCourseDescription, setNewCourseDescription] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // API'den kullanıcının kurslarını getir
    const getCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken: DecodedToken = jwtDecode(token);
          const userId = decodedToken.user_id;
          setUserRole(decodedToken.role);

          // Kullanıcının kayıtlı olduğu kursları getirmek için API isteği
          if (decodedToken.role === "instructor") {
            const userCoursesData = await get(`/Courses/instructor/${userId}`);
            setCourses(userCoursesData);
          } else if (decodedToken.role === "student") {
            const userCoursesData = await get(`/Courses/student/${userId}`);
            setCourses(userCoursesData);
          } else {
            console.error("Rol belirlenemedi");
          }
        }
      } catch (error) {
        console.error("Kurslar yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    getCourses();
  }, []);

  const handleAddCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken: DecodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;

        const newCourse = {
          instructor_id: userId,
          title: newCourseTitle,
          description: newCourseDescription,
        };

        await post("/Courses", newCourse);
        alert("Yeni kurs başarıyla eklendi!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Kurs eklenirken hata oluştu:", error);
      alert("Kurs eklenemedi. Lütfen tekrar deneyin.");
    }
  };

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        {userRole === "instructor" && (
          <div className="mb-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="p-4 bg-green-500 text-white rounded">
                  Yeni Kurs Ekle
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Yeni Kurs Ekle</AlertDialogTitle>
                  <AlertDialogDescription>
                    Lütfen yeni kursun başlığını ve açıklamasını girin.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col gap-4">
                  <Input
                    placeholder="Kurs Başlığı"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Kurs Açıklaması"
                    value={newCourseDescription}
                    onChange={(e) => setNewCourseDescription(e.target.value)}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-300 text-black">
                    İptal
                  </AlertDialogCancel>
                  <Button
                    onClick={handleAddCourse}
                    className="bg-blue-500 text-white"
                  >
                    Kurs Ekle
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        {courses.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {courses.map((course) => (
              <Button
                key={course.course_id}
                className="text-2xl p-12 bg-blue-500 text-white rounded"
                onClick={() =>
                  navigate(`/${userRole}/courses/${course.course_id}`)
                }
              >
                {course.title}
              </Button>
            ))}
          </div>
        ) : userRole === "student" ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Hiçbir kursa katılmadın, katılmak için tıkla
            </h1>
            <Button
              className="p-4 bg-green-500 text-white rounded"
              onClick={() => navigate("/${userRole}/allcourses")}
            >
              Kurslara Göz At
            </Button>
          </div>
        ) : (
          "Henüz kurs eklenmedi."
        )}
      </div>
    </div>
  );
};

export default Courses;
