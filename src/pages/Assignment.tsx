import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";

interface AssignmentData {
  title: string;
  deadline: string;
  instructions: string;
}

const AssignmentPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(
    null
  );

  useEffect(() => {
    // Mock assignment data
    const mockData = {
      title: "Proje Ödevi",
      deadline: "9 Haziran 2023 23:59",
      instructions:
        "Arkadaşlar merhaba, ödevinizde el yazısı ile yaptığınız sayfaları taratıp pdf olarak birleştirerek 9 Haziran Cuma günü gece 00.00'a kadar yükleyebilirsiniz.",
    };
    setAssignmentData(mockData);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      // Dosya gönderme işlemi yapılacak
      console.log("Dosya gönderiliyor:", file.name);
    }
  };

  if (!assignmentData) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">{assignmentData.title}</h1>
        <p className="text-lg mb-8">Son tarih: {assignmentData.deadline}</p>
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4">Yönergeler</h2>
          <p className="mb-8">{assignmentData.instructions}</p>
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
