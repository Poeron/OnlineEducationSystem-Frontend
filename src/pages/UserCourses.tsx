import * as Yup from "yup";

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
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { get, post } from "@/services/ApiHelper";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    const getCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken: DecodedToken = jwtDecode(token);
          const userId = decodedToken.user_id;
          setUserRole(decodedToken.role);

          if (decodedToken.role === "instructor") {
            const userCoursesData = await get(`/Courses/instructor/${userId}`);
            setCourses(userCoursesData);
          } else if (decodedToken.role === "student") {
            const userCoursesData = await get(`/Courses/student/${userId}`);
            setCourses(userCoursesData);
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

  const handleAddCourse = async (values: {
    title: string;
    description: string;
  }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken: DecodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;

        const newCourse = {
          instructor_id: userId,
          title: values.title,
          description: values.description,
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

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Kurs başlığı en az 3 karakter olmalıdır")
      .max(50, "Kurs başlığı en fazla 50 karakter olmalıdır")
      .required("Kurs başlığı gerekli"),
    description: Yup.string()
      .min(10, "Kurs açıklaması en az 10 karakter olmalıdır")
      .max(500, "Kurs açıklaması en fazla 500 karakter olmalıdır")
      .required("Kurs açıklaması gerekli"),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          {userRole === "instructor"
            ? "Mevcut Kurslarım"
            : "Kayıtlı Olduğum Kurslar"}
        </h1>
        {userRole === "instructor" && (
          <div className="mb-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="p-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all">
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
                <Formik
                  initialValues={{ title: "", description: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleAddCourse}
                >
                  {({ isValid, dirty }) => (
                    <Form className="flex flex-col gap-4">
                      <div>
                        <Field
                          name="title"
                          placeholder="Kurs Başlığı"
                          className="w-full p-2 border rounded"
                          as={Input}
                        />
                        <ErrorMessage
                          name="title"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <Field
                          name="description"
                          placeholder="Kurs Açıklaması"
                          className="w-full p-2 border rounded"
                          as={Textarea}
                        />
                        <ErrorMessage
                          name="description"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-300 text-black">
                          İptal
                        </AlertDialogCancel>
                        <Button
                          type="submit"
                          disabled={!(isValid && dirty)}
                          className="bg-blue-500 text-white hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Kurs Ekle
                        </Button>
                      </AlertDialogFooter>
                    </Form>
                  )}
                </Formik>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
            {courses.map((course) => (
              <div
                key={course.course_id}
                className="flex flex-col items-center justify-center h-40 w-64 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 p-4 cursor-pointer"
                onClick={() =>
                  navigate(`/${userRole}/courses/${course.course_id}`)
                }
              >
                <h2 className="text-xl font-bold text-center truncate w-full">
                  {course.title.toUpperCase()}
                </h2>
              </div>
            ))}
          </div>
        ) : userRole === "student" ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold  mb-4 text-gray-800">
              Hiçbir kursa katılmadın, katılmak için tıkla
            </h1>
            <Button
              className="p-4 bg-green-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate("/student/allcourses")}
            >
              Kurslara Göz At
            </Button>
          </div>
        ) : (
          <p className="text-white text-xl">Henüz kurs eklenmedi.</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
