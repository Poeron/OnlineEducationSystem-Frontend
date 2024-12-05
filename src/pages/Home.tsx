import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white flex flex-col">
      <div className="flex-grow flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-center mb-12">Öğrenci Paneli</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <button
            className="btn-shared btn-blue py-12 px-6"
            onClick={() => navigate("/student/mycourses")}
          >
            Kurslarım
          </button>
          <button
            className="btn-shared btn-green py-12 px-6"
            onClick={() => navigate("/student/allcourses")}
          >
            Tüm Kurslar
          </button>
          <button
            className="btn-shared btn-yellow py-12 px-6"
            onClick={() => navigate("/student/assignments")}
          >
            Ödevler
          </button>
          <button
            className="btn-shared btn-red py-12 px-6"
            onClick={() => navigate("/student/certificates")}
          >
            Sertifikalar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
