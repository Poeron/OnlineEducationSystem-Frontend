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
  const [filter, setFilter] = useState<"active" | "inactive">("active"); // Aktif/pasif filtre
  const navigate = useNavigate();

  const fetchCourses = async (filter: "active" | "inactive") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken: DecodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;
        setUserRole(decodedToken.role);

        let endpoint = "";
        if (decodedToken.role === "instructor") {
          endpoint = `/Courses/instructor/${userId}`;
        } else if (decodedToken.role === "student") {
          endpoint = `/Courses/student/${userId}`;
        }

        // Pasif kurslar için endpointin sonuna /passive ekle
        if (filter === "inactive") {
          endpoint += "/passive";
        }

        const userCoursesData = await get(endpoint);
        setCourses(userCoursesData);
      }
    } catch (error) {
      console.error("Kurslar yüklenirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(filter); // Filtreye göre kursları getir
  }, [filter]);

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
        {/* Filtre Butonları */}
        <div className="flex gap-4 mb-6">
          <Button
            className={`p-2 ${
              filter === "active" ? "bg-blue-500" : "bg-gray-400"
            }`}
            onClick={() => setFilter("active")}
          >
            Aktif Kurslarım
          </Button>
          <Button
            className={`p-2 ${
              filter === "inactive" ? "bg-blue-500" : "bg-gray-400"
            }`}
            onClick={() => setFilter("inactive")}
          >
            Pasif Kurslarım
          </Button>
        </div>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
            {courses.map((course) => (
              <div
                key={course.course_id}
                className={`flex flex-col items-center justify-center h-40 w-64 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 p-4 cursor-pointer ${
                  filter === "inactive"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-xl"
                }`}
                onClick={() =>
                  filter === "active" &&
                  navigate(`/${userRole}/courses/${course.course_id}`)
                }
              >
                <h2 className="text-xl font-bold text-center truncate w-full">
                  {course.title.toUpperCase()}
                </h2>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-xl">Hiç kurs bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
