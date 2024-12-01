import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  useEffect(() => {
    // Mock soru verileri
    const mockQuestions = [
      {
        id: 1,
        question: "Aşağıdakilerden hangisinin yazımı doğrudur?",
        options: ["Ahmet", "Mehmet", "Merhaba", "Gpt"],
        correctAnswerIndex: 0,
      },
      {
        id: 2,
        question: "Türkiye'nin başkenti neresidir?",
        options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
        correctAnswerIndex: 1,
      },
    ];
    setQuestions(mockQuestions);
  }, []);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  if (quizFinished) {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <h1 className="text-3xl font-bold mb-8">Sınavınız Bitmiştir</h1>
          <Button
            className="p-4 bg-blue-500 text-white rounded"
            onClick={() => navigate(`/student/courses/${courseId}`)}
          >
            Kursa Dön
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="border p-8 rounded-lg shadow-md w-full max-w-3xl">
          <h1 className="text-2xl font-bold mb-6">
            {currentQuestionIndex + 1}-) {currentQuestion.question}
          </h1>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                className={`p-4 rounded text-black ${
                  selectedOption === index
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedOption(index)}
              >
                {String.fromCharCode(65 + index)}) {option}
              </Button>
            ))}
          </div>
          <Button
            className="p-4 bg-green-500 text-white rounded"
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
          >
            SONRAKİ SORU
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
