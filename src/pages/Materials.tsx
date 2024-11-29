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
} from "@/components/ui/table"; // Shadowed Table component
import { Button } from "@/components/ui/button";
// import axios from "axios";

interface Material {
  id: number;
  name: string;
  dateModified: string;
  author: string;
  link: string;
}

const Materials: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // API'den kurs materyallerini getir
    const fetchMaterials = async () => {
      try {
        // Mock data kullanılıyor
        const mockMaterials = [
          {
            id: 1,
            name: "ATG2.pdf",
            dateModified: "25 Eylül",
            author: "MÜGE ÖZÇEVİK",
            link: "#",
          },
          {
            id: 2,
            name: "Chapter_1_v8.2.pptx",
            dateModified: "16 Eylül",
            author: "MÜGE ÖZÇEVİK",
            link: "#",
          },
          {
            id: 3,
            name: "Chapter_2_v8.2.pptx",
            dateModified: "16 Eylül",
            author: "MÜGE ÖZÇEVİK",
            link: "#",
          },
        ];
        // const response = await axios.get(`/api/courses/${courseId}/materials`);
        // setMaterials(response.data);
        setMaterials(mockMaterials);
      } catch (error) {
        console.error("Materyaller yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
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
      </div>
    </div>
  );
};

export default Materials;
