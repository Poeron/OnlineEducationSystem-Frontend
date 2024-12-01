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
  id: number;
  name: string;
  dateModified: string;
  author: string;
  link: string;
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
        const data = await get(`/CourseMaterials/${courseId}`);
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
              <TableHead>Değiştiren</TableHead>
              <TableHead>İndir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell>{material.dateModified}</TableCell>
                <TableCell>{material.author}</TableCell>
                <TableCell>
                  <Button
                    className="bg-blue-500 text-white p-2 rounded"
                    onClick={() => window.open(material.link, "_blank")}
                  >
                    İndir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
