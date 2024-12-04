import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { get, patch, post } from "@/services/ApiHelper";

import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

interface AssignmentData {
  title: string;
  description: string;
  due_date: string;
}

interface SubmissionData {
  submission_id: number;
  student_id: number;
  submission_url: string;
  grade: number | null;
  submitted_at: string;
  name: string;
}

interface DecodedToken {
  user_id: string;
  role: string;
}

const AssignmentPage: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(
    null
  );
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  const [grades, setGrades] = useState<{ [key: number]: number }>({});

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

    const fetchUserRole = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken: DecodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      }
    };

    fetchUserRole();
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
        const filePath = file.name;
        const token = localStorage.getItem("token");
        const decodedToken: DecodedToken = jwtDecode(token!);

        // API'ye gönderilecek veri
        const submissionData = {
          assignment_id: parseInt(assignmentId!, 10),
          student_id: parseInt(decodedToken.user_id),
          submission_url: filePath,
        };

        // Ödevi yüklemek için API isteği
        await post(`/AssignmentSubmissions`, submissionData);

        alert("Dosya başarıyla kaydedildi!");
      } catch (error) {
        console.error("Ödev yüklenirken hata oluştu:", error);
        alert("Dosya kaydedilemedi. Lütfen tekrar deneyin.");
      }
    }
  };

  const handleViewSubmissions = async () => {
    try {
      // Teslim edilen ödevleri almak için API isteği
      const data = await get(
        `/AssignmentSubmissions/assignment/${assignmentId}`
      );
      setSubmissions(data);
    } catch (error) {
      console.error("Teslim edilen ödevler yüklenirken hata oluştu:", error);
      alert("Teslim edilen ödevler yüklenemedi. Lütfen tekrar deneyin.");
    }
  };

  const handleGradeChange = (submissionId: number, newGrade: number) => {
    setGrades((prevGrades) => ({ ...prevGrades, [submissionId]: newGrade }));
  };

  const handleGradeSubmit = async (submissionId: number) => {
    const newGrade = grades[submissionId];
    try {
      await patch(`/AssignmentSubmissions/grade`, {
        grade: newGrade,
        submission_id: submissionId,
      });
      alert("Not başarıyla güncellendi!");
      handleViewSubmissions();
    } catch (error) {
      console.error("Not güncellenirken hata oluştu:", error);
      alert("Not güncellenemedi. Lütfen tekrar deneyin.");
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
      <div className="flex flex-col items-center min-h-screen p-8 text-white">
        <h1 className="text-4xl font-extrabold mb-4">{assignmentData.title}</h1>
        <p className="text-lg text-gray-300 mb-8">
          Son tarih: {formattedDueDate}
        </p>
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4">Yönergeler</h2>
          <p className="mb-8 text-gray-300">{assignmentData.description}</p>

          {userRole === "student" ? (
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2">
                <span className="text-lg font-medium">Çalışmam:</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="text-white bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <Button
                className={`bg-blue-500 hover:bg-blue-600 text-white p-4 rounded mt-4 transition-all ${
                  !file && "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleSubmit}
                disabled={!file}
              >
                Teslim Et
              </Button>
            </div>
          ) : (
            <Button
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded mt-4 transition-all"
              onClick={handleViewSubmissions}
            >
              Teslim Edenleri Görüntüle
            </Button>
          )}

          {userRole === "instructor" && submissions.length > 0 && (
            <Table className="shadow-lg w-full mt-8 border-separate border-spacing-0">
              <TableCaption className="text-lg text-gray-400">
                Teslim edilen ödevlerin listesi
              </TableCaption>
              <TableHeader className="bg-gray-700">
                <TableRow>
                  <TableHead className="text-left p-4 text-gray-300">
                    Öğrenci Adı
                  </TableHead>
                  <TableHead className="text-left p-4 text-gray-300">
                    Not
                  </TableHead>
                  <TableHead className="text-left p-4 text-gray-300">
                    Ödev Linki
                  </TableHead>
                  <TableHead className="text-left p-4 text-gray-300">
                    Gönderme Tarihi
                  </TableHead>
                  <TableHead className="text-left p-4 text-gray-300">
                    Not Ver
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow
                    key={submission.submission_id}
                    className="hover:bg-gray-700 transition-all"
                  >
                    <TableCell className="p-4">{submission.name}</TableCell>
                    <TableCell className="p-4">
                      {submission.grade !== null ? submission.grade : "-"}
                    </TableCell>
                    <TableCell className="p-4">
                      <a
                        href={submission.submission_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline hover:text-blue-600 transition-all"
                      >
                        Ödevi Görüntüle
                      </a>
                    </TableCell>
                    <TableCell className="p-4">
                      {new Date(submission.submitted_at).toLocaleString(
                        "tr-TR"
                      )}
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Not"
                          className="w-20 p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={grades[submission.submission_id] || ""}
                          onChange={(e) =>
                            handleGradeChange(
                              submission.submission_id,
                              parseInt(e.target.value)
                            )
                          }
                        />
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-all"
                          onClick={() =>
                            handleGradeSubmit(submission.submission_id)
                          }
                        >
                          Notu Kaydet
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;
