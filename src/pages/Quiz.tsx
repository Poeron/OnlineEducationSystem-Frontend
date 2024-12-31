import React, { useEffect, useState } from "react";
import { get, patch, post } from "@/services/ApiHelper";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";

interface QuestionOptions {
  option_id: number;
  question_id: number;
  option_text: string;
  is_correct: boolean;
}
interface Question {
  question_id: number;
  exam_id: string;
  question_text: string;
  question_options: QuestionOptions[];
}
interface DecodedToken {
  user_id: string;
}

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);

  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  window.history.pushState(null, document.title, location.pathname);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const exam = await get(`/Exams/course/${courseId}`);
        if (exam === null) {
          console.error("Sınav bulunamadı");
          return;
        }
        const examId = exam.exam_id;
        let examQuestions = await get(`/ExamQuestions/${examId}`);
        if (!Array.isArray(examQuestions)) {
          examQuestions = [examQuestions];
        }
        const questionsWithOptions: Question[] = await Promise.all(
          examQuestions.map(async (question: Question) => {
            const options = await get(
              `/QuestionOptions/question/${question.question_id}`
            );
            return {
              ...question,
              question_options: Array.isArray(options) ? options : [],
            };
          })
        );
        setQuestions(questionsWithOptions);
      } catch (error) {
        console.error("Sınav verileri yüklenirken hata oluştu:", error);
      }
    };
    fetchQuestions();
  }, [courseId]);

  const handleResult = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken: DecodedToken = jwtDecode(token);
        const studentId = decodedToken.user_id;
        const data = {
          student_id: parseInt(studentId),
          exam_id: questions[0].exam_id,
          score: (points / questions.length) * 100,
        };
        await patch("/ExamResults", data);
        if ((points / questions.length) * 100 >= 50) {
          console.log("Sınavı geçtiniz, sertifika oluşturuluyor...");
          await CreateCertificate();
        }
      }
    } catch (error) {
      console.error("Sonuç gönderilirken hata oluştu:", error);
    }
  };

  const CreateCertificate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken: DecodedToken = jwtDecode(token);
        const studentId = decodedToken.user_id;
        const data = {
          student_id: parseInt(studentId),
          course_id: parseInt(courseId!),
        };
        await post("/Certificates", data);
      }
    } catch (error) {
      console.error("Sertifika oluşturulurken hata oluştu:", error);
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion.question_options[selectedOption].is_correct) {
        setPoints((prevPoints) => prevPoints + 1);
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizFinished(true);
    }
    setSelectedOption(null);
  };

  useEffect(() => {
    if (quizFinished) {
      handleResult();
    }
  }, [quizFinished]);

  if (quizFinished) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <h1 className="text-3xl font-bold mb-8">
            Sınavınız Bitmiştir, Puanınız: {(points / questions.length) * 100}
          </h1>
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
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <p className="text-2xl font-bold">
          Soru bulunamadı. Lütfen tekrar deneyin.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="border p-8 rounded-lg shadow-md w-full max-w-3xl">
          <h1 className="text-2xl font-bold mb-6">
            {currentQuestionIndex + 1}-) {currentQuestion.question_text}
          </h1>
          {currentQuestion.question_options.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {currentQuestion.question_options.map((option, index) => (
                <Button
                  key={option.option_id}
                  className={`p-4 rounded text-black ${
                    selectedOption === index
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setSelectedOption(index)}
                >
                  {String.fromCharCode(65 + index)}) {option.option_text}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-red-500">
              Bu soru için seçenek bulunmamaktadır.
            </p>
          )}
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
