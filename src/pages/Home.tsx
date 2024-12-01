import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-2 gap-4 p-8">
        <Button
          color="blue"
          className="text-5xl p-44 bg-blue-500 text-white rounded"
          onClick={() => navigate("/student/mycourses")}
        >
          Kurslarım
        </Button>
        <Button
          color="green"
          className="text-5xl p-44 bg-green-500 text-white rounded"
          onClick={() => navigate("/student/allcourses")}
        >
          Tüm Kurslar
        </Button>
        <Button
          color="yellow"
          className="text-5xl p-44 bg-yellow-500 text-white rounded"
          onClick={() => navigate("/student/assignments")}
        >
          Ödevler
        </Button>
        <Button
          color="red"
          className="text-5xl p-44 bg-red-500 text-white rounded"
          onClick={() => navigate("/student/certificates")}
        >
          Sertifikalar
        </Button>
      </div>
    </div>
  );
};

export default Home;
