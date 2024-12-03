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
import { get, post } from "@/services/ApiHelper"; // API Helper importu
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

  // Yeni materyal bilgileri
  const [newMaterialTitle, setNewMaterialTitle] = useState<string>("");
  const [newMaterialContentType, setNewMaterialContentType] =
    useState<string>("");
  const [newMaterialContentUrl, setNewMaterialContentUrl] =
    useState<string>("");

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

  const handleAddMaterial = async () => {
    try {
      const newMaterial = {
        course_id: courseId,
        title: newMaterialTitle,
        content_type: newMaterialContentType,
        content_url: newMaterialContentUrl,
      };

      await post("/CourseMaterials", newMaterial);
      alert("Yeni materyal başarıyla eklendi!");
      window.location.reload(); // Materyallerin yeniden yüklenmesi için sayfayı yenile
    } catch (error) {
      console.error("Materyal eklenirken hata oluştu:", error);
      alert("Materyal eklenemedi. Lütfen tekrar deneyin.");
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
          <div className="mt-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-green-500 text-white p-4 rounded">
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
                <div className="flex flex-col gap-4">
                  <Input
                    placeholder="Materyal Başlığı"
                    value={newMaterialTitle}
                    onChange={(e) => setNewMaterialTitle(e.target.value)}
                  />
                  <Input
                    placeholder="Dosya Türü (örn: PDF, Video)"
                    value={newMaterialContentType}
                    onChange={(e) => setNewMaterialContentType(e.target.value)}
                  />
                  <Input
                    placeholder="İçerik URL"
                    value={newMaterialContentUrl}
                    onChange={(e) => setNewMaterialContentUrl(e.target.value)}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-300 text-black">
                    İptal
                  </AlertDialogCancel>
                  <Button
                    onClick={handleAddMaterial}
                    className="bg-blue-500 text-white"
                  >
                    Materyal Ekle
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;
