import React from "react";
import Navbar from "../components/Navbar";

const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-2 gap-4 p-8">
        <button className="p-8 bg-blue-500 text-white rounded">
          Kurslarım
        </button>
        <button className="p-8 bg-green-500 text-white rounded">
          Tüm Kurslar
        </button>
        <button className="p-8 bg-yellow-500 text-white rounded">
          Ödevler
        </button>
        <button className="p-8 bg-red-500 text-white rounded">
          Sertifikalar
        </button>
      </div>
    </div>
  );
};

export default Home;
