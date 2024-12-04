// AdminExamQuestions.tsx

import React, { useEffect, useState } from "react";
import { get, patch, post, remove } from "@/services/ApiHelper";

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";

type ExamQuestion = {
  question_id: number;
  exam_id: number;
  question_text: string;
  question_type: string;
  created_at: string;
};

const AdminExamQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<ExamQuestion | null>(
    null
  );

  const fetchQuestions = async () => {
    try {
      const data = await get("/ExamQuestions");
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleCreateQuestion = async (
    newQuestion: Omit<ExamQuestion, "question_id" | "created_at">
  ) => {
    try {
      await post("/ExamQuestions", newQuestion);
      await fetchQuestions();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating question: ", error);
    }
  };

  const handleUpdateQuestion = async (updatedQuestion: ExamQuestion) => {
    try {
      await patch(`/ExamQuestions`, updatedQuestion);
      await fetchQuestions();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating question: ", error);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await remove(`/ExamQuestions/${questionId}`);
      await fetchQuestions();
    } catch (error) {
      console.error("Error deleting question: ", error);
    }
  };

  return (
    <div className="admin-exam-questions">
      <AdminHeader
        title="Exam Questions Management"
        onCreate={() => setIsCreateModalOpen(true)}
      />
      <DataTable
        data={questions}
        columns={[
          { header: "ID", key: "question_id" },
          { header: "Exam ID", key: "exam_id" },
          { header: "Question Text", key: "question_text" },
          { header: "Question Type", key: "question_type" },
          { header: "Created At", key: "created_at" },
        ]}
        idKey="question_id"
        onEdit={(question) => {
          setSelectedQuestion(question);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteQuestion}
      />
      {isCreateModalOpen && (
        <FormModal
          title="Create Question"
          fields={[
            { label: "Exam ID", key: "exam_id", type: "number" },
            { label: "Question Text", key: "question_text", type: "text" },
            { label: "Question Type", key: "question_type", type: "text" },
          ]}
          initialValues={{ exam_id: 0, question_text: "", question_type: "" }}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(values) =>
            handleCreateQuestion(
              values as Omit<ExamQuestion, "question_id" | "created_at">
            )
          }
        />
      )}
      {isEditModalOpen && selectedQuestion && (
        <FormModal
          title="Edit Question"
          fields={[
            { label: "Exam ID", key: "exam_id", type: "number" },
            { label: "Question Text", key: "question_text", type: "text" },
            { label: "Question Type", key: "question_type", type: "text" },
          ]}
          initialValues={selectedQuestion}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(values) => handleUpdateQuestion(values as ExamQuestion)}
        />
      )}
    </div>
  );
};

export default AdminExamQuestions;
