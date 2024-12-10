import * as Yup from "yup";

import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { get, post, remove } from "@/services/ApiHelper";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";

const CreateExamPage: React.FC = () => {
  const [questions, setQuestions] = useState<
    {
      question_id: number;
      question_text: string;
      options: { option_text: string; is_correct: boolean }[];
    }[]
  >([]);
  const [examId, setExamId] = useState<number | null>(null);
  const { courseId } = useParams<{ courseId: string }>();

  const fetchExam = async () => {
    try {
      const examResponse = await get(`/Exams/course/${courseId}`);
      setExamId(examResponse.exam_id);
      const questionsResponse: {
        question_id: number;
        question_text: string;
      }[] = await get(`/ExamQuestions/${examResponse.exam_id}`);
      const optionsResponse: {
        option_text: string;
        is_correct: boolean;
      }[][] = await Promise.all(
        questionsResponse.map((q: { question_id: number }) =>
          get(`/QuestionOptions/question/${q.question_id}`)
        )
      );
      const questions = questionsResponse.map((q, i) => ({
        question_id: q.question_id,
        question_text: q.question_text,
        options: optionsResponse[i],
      }));
      setQuestions(questions);
    } catch (error) {
      console.error("Sınav getirilirken hata:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  useEffect(() => {
    fetchExam();
  }, []);

  const examValidationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Başlık en az 3 karakter olmalıdır")
      .max(50, "Başlık en fazla 50 karakter olmalıdır")
      .required("Başlık gerekli"),
    description: Yup.string()
      .min(10, "Açıklama en az 10 karakter olmalıdır")
      .max(500, "Açıklama en fazla 500 karakter olmalıdır")
      .required("Açıklama gerekli"),
  });

  const questionValidationSchema = Yup.object({
    question_text: Yup.string()
      .min(5, "Soru metni en az 5 karakter olmalıdır")
      .max(500, "Soru metni en fazla 500 karakter olmalıdır")
      .required("Soru metni gerekli"),
    options: Yup.array()
      .of(
        Yup.object({
          option_text: Yup.string()
            .max(500, "Seçenek metni en fazla 500 karakter olmalıdır")
            .required("Seçenek metni gerekli"),
          is_correct: Yup.boolean(),
        })
      )
      .min(2, "En az 2 seçenek olmalıdır")
      .max(5, "En fazla 5 seçenek olmalıdır")
      .required("Seçenekler gerekli"),
  });

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-white">
        <h1 className="text-3xl font-bold mb-8">Sınav Oluştur</h1>
        <div className="w-full max-w-4xl space-y-6">
          {!examId && (
            <Formik
              initialValues={{
                title: "",
                description: "",
              }}
              validationSchema={examValidationSchema}
              onSubmit={async (values) => {
                try {
                  const examResponse = await post("/Exams", {
                    course_id: parseInt(courseId!),
                    ...values,
                  });

                  setExamId(examResponse.exam_id);
                  alert("Sınav başarıyla oluşturuldu!");
                  fetchExam();
                } catch (error) {
                  console.error("Sınav oluşturulurken hata:", error);
                  alert("Bir hata oluştu, lütfen tekrar deneyin.");
                }
              }}
            >
              {({ isValid, dirty }) => (
                <Form className="bg-gray-800 p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Sınav Bilgisi</h2>
                  <Field
                    name="title"
                    placeholder="Sınav Başlığı"
                    className="mb-4 bg-gray-700 text-white border border-gray-600 rounded w-full p-2"
                    as={Input}
                  />
                  <ErrorMessage
                    name="title"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                  <Field
                    name="description"
                    placeholder="Sınav Açıklaması"
                    className="mb-4 bg-gray-700 text-white border border-gray-600 rounded w-full p-2"
                    as={Textarea}
                  />
                  <ErrorMessage
                    name="description"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                  <Button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-3 w-full mt-4"
                    disabled={!(isValid && dirty)}
                  >
                    Sınavı Kaydet
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {examId && (
            <Formik
              initialValues={{
                question_text: "",
                options: [
                  { option_text: "", is_correct: false },
                  { option_text: "", is_correct: false },
                ],
              }}
              validationSchema={questionValidationSchema}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const questionResponse = await post("/ExamQuestions", {
                    exam_id: examId,
                    question_text: values.question_text,
                    question_type: "multiple_choice",
                  });

                  const questionId = questionResponse;

                  for (const option of values.options) {
                    await post("/QuestionOptions", {
                      question_id: questionId,
                      option_text: option.option_text,
                      is_correct: option.is_correct ? true : false,
                    });
                  }

                  fetchExam();
                  resetForm();
                  alert("Soru başarıyla eklendi!");
                } catch (error) {
                  console.error("Soru eklenirken hata:", error);
                  alert("Bir hata oluştu, lütfen tekrar deneyin.");
                }
              }}
            >
              {({ isValid, dirty }) => (
                <Form className="bg-gray-800 p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Soru Ekle</h2>
                  <Field
                    name="question_text"
                    placeholder="Soru Metni"
                    className="mb-4 bg-gray-700 text-white border border-gray-600 rounded w-full p-2"
                    as={Input}
                  />
                  <ErrorMessage
                    name="question_text"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                  <FieldArray name="options">
                    {({ remove, push, form }) => (
                      <div>
                        {form.values.options.map((_: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 mb-2"
                          >
                            <Field
                              name={`options.${index}.option_text`}
                              placeholder={`Seçenek ${index + 1}`}
                              className="bg-gray-700 text-white border border-gray-600 rounded w-full p-2"
                              as={Input}
                            />
                            <ErrorMessage
                              name={`options.${index}.option_text`}
                              component="p"
                              className="text-red-500 text-sm"
                            />
                            <Field
                              type="radio"
                              name={`options.${index}.is_correct`}
                              value="true"
                              className="ml-2"
                            />
                            <Button
                              type="button"
                              className="bg-red-500 text-white px-4 py-2"
                              onClick={() => {
                                remove(index);
                              }}
                            >
                              Sil
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          className="bg-blue-500 text-white px-4 py-2 mt-4"
                          onClick={() =>
                            push({ option_text: "", is_correct: false })
                          }
                        >
                          Seçenek Ekle
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                  <Button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 mt-4"
                    disabled={!(isValid && dirty)}
                  >
                    Soruyu Kaydet
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {questions.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Eklenmiş Sorular</h2>
              <ul>
                {questions.map((q, index) => (
                  <li key={q.question_id} className="mb-4">
                    <div className="flex justify-between items-center">
                      <p className="font-bold">
                        {index + 1}. {q.question_text}
                      </p>
                      <Button
                        onClick={() => {
                          remove(`/ExamQuestions/${q.question_id}`);
                          fetchExam();
                        }}
                        className="bg-red-500 text-white px-4 py-2"
                      >
                        Soruyu Sil
                      </Button>
                    </div>
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
