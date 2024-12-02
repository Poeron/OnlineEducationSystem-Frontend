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
import { get } from "@/services/ApiHelper"; // API Helper importu
import { jwtDecode } from "jwt-decode";

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
      const token = localStorage.getItem("authToken");
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

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">
          Materyaller - Kurs ID: {courseId}
        </h1>
        <Table className="shadow-md w-full max-w-4xl">
          <TableCaption>Kurs materyallerinizin listesi</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>Değiştirme Tarihi</TableHead>
              <TableHead>Dosya Türü</TableHead>
              <TableHead>İndir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((material) => {
              // updated_at tarihini formatla
              const formattedDate = new Date(
                material.updated_at
              ).toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <TableRow key={material.material_id}>
                  <TableCell className="font-medium">
                    {material.title}
                  </TableCell>
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell>{material.content_type}</TableCell>
                  <TableCell>
                    <Button
                      className="bg-blue-500 text-white p-2 rounded"
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
        {userRole === "instructor" && (
          <Button className="mt-8 bg-green-500 text-white p-4 rounded">
            Yeni Materyal Ekle
          </Button>
        )}
      </div>
    </div>
  );
};

export default Materials;
