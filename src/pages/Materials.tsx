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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { get, post } from "@/services/ApiHelper";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

interface Material {
  material_id: number;
  course_id: number;
  title: string;
  content_type: string;
  content_url: string;
  updated_at: string;
}

interface DecodedToken {
  role: string;
}

const Materials: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const fetchUserRole = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken: DecodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      }
    };

    const fetchMaterials = async () => {
      try {
        const data = await get(`/CourseMaterials/Course/${courseId}`);
        setMaterials(data);
      } catch (error) {
        console.error("Materyaller yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
    fetchMaterials();
  }, [courseId]);

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Materyal başlığı en az 3 karakter olmalıdır")
      .max(50, "Materyal başlığı en fazla 50 karakter olmalıdır")
      .required("Materyal başlığı gerekli"),
    content_type: Yup.string()
      .max(50, "Dosya türü en fazla 50 karakter olmalıdır")
      .required("Dosya türü gerekli"),
    content_url: Yup.string()
      .url("Geçerli bir URL girin")
      .max(255, "İçerik URL en fazla 255 karakter olmalıdır")
      .required("İçerik URL gerekli"),
  });

  const handleAddMaterial = async (values: {
    title: string;
    content_type: string;
    content_url: string;
  }) => {
    try {
      const newMaterial = {
        course_id: courseId,
        title: values.title,
        content_type: values.content_type,
        content_url: values.content_url,
      };

      await post("/CourseMaterials", newMaterial);
      alert("Yeni materyal başarıyla eklendi!");
      window.location.reload();
    } catch (error) {
      console.error("Materyal eklenirken hata oluştu:", error);
      alert("Materyal eklenemedi. Lütfen tekrar deneyin.");
    }
  };

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <section>
      <div className="w-full max-w-6xl mx-auto px-4 pt-12">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-white">
          Materyaller - Kurs ID: {courseId}
        </h1>
        <div className="rounded-2xl border border-white shadow-xl">
          <Table className="w-full rounded-lg">
            <TableHeader>
              <TableRow className="text-gray-200">
                <TableHead className="text-left px-4 py-3">Ad</TableHead>
                <TableHead className="text-left px-4 py-3">
                  Değiştirme Tarihi
                </TableHead>
                <TableHead className="text-left px-4 py-3">
                  Dosya Türü
                </TableHead>
                <TableHead className="text-center px-4 py-3">İndir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => {
                const formattedDate = new Date(
                  material.updated_at
                ).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                return (
                  <TableRow
                    key={material.material_id}
                    className="hover:shadow-md transition-all"
                  >
                    <TableCell className="px-4 py-3 font-medium text-gray-200">
                      {material.title}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-400">
                      {formattedDate}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-400">
                      {material.content_type || "Yok"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <Button
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={() =>
                          window.open(material.content_url, "_blank")
                        }
                      >
                        İndir
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {userRole === "instructor" && (
          <div className="mt-8 flex justify-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-green-500 text-white py-3 px-6 rounded hover:bg-green-600">
                  Yeni Materyal Ekle
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Yeni Materyal Ekle</AlertDialogTitle>
                  <AlertDialogDescription>
                    Lütfen yeni materyal için gerekli bilgileri girin.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Formik
                  initialValues={{
                    title: "",
                    content_type: "",
                    content_url: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleAddMaterial}
                >
                  {({ isValid, dirty }) => (
                    <Form className="flex flex-col gap-4">
                      <div>
                        <Field
                          name="title"
                          placeholder="Materyal Başlığı"
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
                          name="content_type"
                          placeholder="Dosya Türü (örn: PDF, Video)"
                          className="w-full p-2 border rounded"
                          as={Input}
                        />
                        <ErrorMessage
                          name="content_type"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <Field
                          name="content_url"
                          placeholder="İçerik URL"
                          className="w-full p-2 border rounded"
                          as={Input}
                        />
                        <ErrorMessage
                          name="content_url"
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-300 text-black py-2 px-4 rounded">
                          İptal
                        </AlertDialogCancel>
                        <Button
                          type="submit"
                          disabled={!(isValid && dirty)}
                          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Materyal Ekle
                        </Button>
                      </AlertDialogFooter>
                    </Form>
                  )}
                </Formik>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </section>
  );
};

export default Materials;
