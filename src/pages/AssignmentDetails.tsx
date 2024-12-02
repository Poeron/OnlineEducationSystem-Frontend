import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { get, post } from "@/services/ApiHelper";

interface AssignmentData {
  title: string;
  description: string;
  due_date: string;
}

const AssignmentPage: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        // Ödev verilerini almak için API isteği
        const data = await get(`/Assignments/${assignmentId}`);
        if (data) {
          setAssignmentData(data);
        } else {
          setError("Bu kurs için ödev bulunmamaktadır.");
        }
      } catch (error) {
        console.error("Ödev verileri yüklenirken hata oluştu:", error);
        setError("Ödev verileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        // Ödevi yüklemek için API isteği
        await post(`/Assignments/${assignmentId}`, formData);

        alert("Dosya başarıyla yüklendi!");
      } catch (error) {
        console.error("Ödev yüklenirken hata oluştu:", error);
        alert("Ödev yüklenemedi. Lütfen tekrar deneyin.");
      }
    }
  };

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <p className="text-red-500 text-lg font-bold">{error}</p>
        </div>
      </div>
    );
  }

  if (!assignmentData) {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <p className="text-red-500 text-lg font-bold">Ödev bulunamadı.</p>
        </div>
      </div>
    );
  }

  // due_date'i formatla
  const formattedDueDate = new Date(assignmentData.due_date).toLocaleDateString(
    "tr-TR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">{assignmentData.title}</h1>
        <p className="text-lg mb-8">Son tarih: {formattedDueDate}</p>
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4">Yönergeler</h2>
          <p className="mb-8">{assignmentData.description}</p>
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2">
              <span className="text-lg">Çalışmam:</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="text-white"
              />
            </label>
            <Button
              className="bg-blue-500 text-white p-4 rounded mt-4"
              onClick={handleSubmit}
              disabled={!file}
            >
              Teslim Et
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;
