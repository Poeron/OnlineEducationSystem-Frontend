import React, { useEffect, useState } from "react";

import { get } from "@/services/ApiHelper";
import { jwtDecode } from "jwt-decode";

interface Certificate {
  course_title: string;
  instructor_name: string;
  student_name: string;
  issued_date: Date;
}

const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken: { user_id: string } = jwtDecode(token!);
        const studentId = decodedToken.user_id;

        const response = await get(`/Certificates/student/${studentId}`);
        if (Array.isArray(response)) {
          setCertificates(response);
        } else {
          setCertificates([response]);
        }
      } catch (error) {
        console.error("Sertifikalar yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return <p className="text-center text-xl mt-8">Yükleniyor...</p>;
  }

  return (
    <div className="min-h-screen">
      <section className="flex flex-col lg:flex-row gap-6 p-6 h-[92vh]">
        {/* Sertifika Kısmı */}
        <div className="flex-1 flex items-center justify-center bg-grey shadow-md rounded-lg border border-gray-300 p-6 h-full">
          {selectedCertificate ? (
            <div
              className="border bg-gradient-to-r bg-[#eb000c] border-gray-300 p-20 w-3/4 text-center rounded-lg shadow"
              style={{
                backgroundImage:
                  "url('https://www.transparenttextures.com/patterns/black-paper.png')",
              }}
            >
              <h1 className="text-3xl font-extrabold text-white mb-6">
                KURS SERTİFİKASI
              </h1>
              <p className="text-lg font-medium text-white mb-6">
                SN.{" "}
                <span className="font-bold">
                  {selectedCertificate.student_name.toUpperCase()}
                </span>
              </p>
              <p className="text-lg font-medium text-white mb-6">
                <span className="font-bold">
                  {selectedCertificate.course_title.toUpperCase()}
                </span>{" "}
                kursunu başarıyla tamamlayarak bu belgeyi almaya hak
                kazanmıştır.
              </p>
              <p className="text-lg text-white mb-6">
                <span className="font-bold">Sertifika Tarihi:</span>{" "}
                {new Date(selectedCertificate.issued_date).toLocaleDateString(
                  "tr-TR",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
              <div className="flex justify-evenly mt-8">
                <div className="flex flex-col items-center">
                  <hr className="border-t-2 border-black w-32 mb-2" />
                  <p className="font-semibold text-white">
                    {selectedCertificate.instructor_name.toUpperCase()}
                  </p>
                  <p className="font-bold text-sm text-white">KURS SAHİBİ</p>
                </div>
                <div className="flex flex-col items-center">
                  <hr className="border-t-2 border-black w-32 mb-2" />
                  <p className="font-semibold text-white">RONAY ÖKTEM</p>
                  <p className="font-bold text-sm text-white">
                    PLATFORM SAHİBİ
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-3xl font-bold text-white">
              Sertifika seçiniz.
            </p>
          )}
        </div>

        {/* Ders Listesi */}
        <div className="w-full lg:w-64 bg-grey shadow-md rounded-lg border border-gray-300 p-4 overflow-y-auto h-full">
          {certificates.length > 0 ? (
            certificates.map((certificate, index) => (
              <div
                key={index}
                onClick={() => setSelectedCertificate(certificate)}
                className="cursor-pointer p-4 bg-indigo-800 border border-gray-300 mb-2 text-center text-white font-medium hover:shadow transition-all rounded text-ellipsis overflow-hidden whitespace-nowrap"
              >
                {certificate.course_title.toUpperCase()}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              Henüz sertifikanız bulunmamaktadır.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default CertificatesPage;
