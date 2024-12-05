import React, { useEffect, useState } from "react";
import { get, post } from "@/services/ApiHelper";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "../components/Navbar";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";

const CreateExamPage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [questions, setQuestions] = useState<
    {
      question_text: string;
      options: { option_text: string; is_correct: boolean }[];
    }[]
  >([]);
  const [examId, setExamId] = useState<number | null>(null);
  const [currentQuestionText, setCurrentQuestionText] = useState<string>("");
  const [currentOptions, setCurrentOptions] = useState<
    { option_text: string; is_correct: boolean }[]
  >([{ option_text: "", is_correct: false }]);
  const { courseId } = useParams<{ courseId: string }>();

  const handleCreateExam = async () => {
    try {
      const examResponse = await post("/Exams", {
        course_id: parseInt(courseId!),
        title,
        description,
      });

      const newExamId = examResponse;
      setExamId(newExamId);
      alert("Sınav oluşturuldu! Şimdi soruları ekleyebilirsiniz.");
    } catch (error) {
      console.error("Sınav oluşturulurken hata:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  const handleAddOption = () => {
    setCurrentOptions([
      ...currentOptions,
      { option_text: "", is_correct: false },
    ]);
  };

  const handleRemoveOption = (index: number) => {
    setCurrentOptions(currentOptions.filter((_, i) => i !== index));
  };

  const handleAddQuestion = async () => {
    if (!examId) {
      alert("Lütfen önce sınavı oluşturun.");
      return;
    }

    try {
      // Soruyu oluştur
      const questionResponse = await post("/ExamQuestions", {
        exam_id: examId,
        question_text: currentQuestionText,
        question_type: "multiple_choice",
      });

      const questionId = questionResponse;

      // Seçenekleri ekle
      for (const option of currentOptions) {
        await post("/QuestionOptions", {
          question_id: questionId,
          option_text: option.option_text,
          is_correct: option.is_correct,
        });
      }

      setQuestions([
        ...questions,
        { question_text: currentQuestionText, options: currentOptions },
      ]);

      // Alanları sıfırla
      setCurrentQuestionText("");
      setCurrentOptions([{ option_text: "", is_correct: false }]);
      alert("Soru başarıyla kaydedildi!");
    } catch (error) {
      console.error("Soru eklenirken hata:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const examResponse = await get(`/Exams/course/${courseId}`);
        setExamId(examResponse.exam_id);
      } catch (error) {
        console.error("Sınav getirilirken hata:", error);
        alert("Bir hata oluştu, lütfen tekrar deneyin.");
      }
    };

    fetchExam();
  });

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-white">
        <h1 className="text-3xl font-bold mb-8">Sınav Oluştur</h1>
        <div className="w-full max-w-4xl space-y-6">
          {/* Sınav Bilgisi */}
          {!examId && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Sınav Bilgisi</h2>
              <Input
                placeholder="Sınav Başlığı"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-4"
              />
              <Textarea
                placeholder="Sınav Açıklaması"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button
                onClick={handleCreateExam}
                className="bg-blue-500 text-white px-6 py-3 w-full mt-4"
              >
                Sınavı Kaydet
              </Button>
            </div>
          )}

          {/* Soru ve Seçenekler */}
          {examId && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Soru Ekle</h2>
              <Input
                placeholder="Soru Metni"
                value={currentQuestionText}
                onChange={(e) => setCurrentQuestionText(e.target.value)}
                className="mb-4"
              />
              {currentOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <Input
                    placeholder={`Seçenek ${index + 1}`}
                    value={option.option_text}
                    onChange={(e) => {
                      const newOptions = [...currentOptions];
                      newOptions[index].option_text = e.target.value;
                      setCurrentOptions(newOptions);
                    }}
                  />
                  <input
                    type="radio"
                    name="correctOption"
                    checked={option.is_correct}
                    onChange={() => {
                      const newOptions = currentOptions.map((opt, idx) => ({
                        ...opt,
                        is_correct: idx === index,
                      }));
                      setCurrentOptions(newOptions);
                    }}
                  />
                  <Button
                    onClick={() => handleRemoveOption(index)}
                    className="bg-red-500 text-white px-4 py-2"
                  >
                    Sil
                  </Button>
                </div>
              ))}
              <Button
                onClick={handleAddOption}
                className="bg-blue-500 text-white px-4 py-2 mt-4"
              >
                Seçenek Ekle
              </Button>
              <Button
                onClick={handleAddQuestion}
                className="bg-green-500 text-white px-4 py-2 mt-4"
              >
                Soruyu Kaydet
              </Button>
            </div>
          )}

          {/* Eklenmiş Sorular */}
          {questions.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Eklenmiş Sorular</h2>
              <ul>
                {questions.map((q, index) => (
                  <li key={index} className="mb-4">
                    <p className="font-bold">{q.question_text}</p>
                    <ul className="ml-4 list-disc">
                      {q.options.map((o, i) => (
                        <li
                          key={i}
                          className={`${
                            o.is_correct ? "text-green-500" : "text-white"
                          }`}
                        >
                          {o.option_text}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateExamPage;
