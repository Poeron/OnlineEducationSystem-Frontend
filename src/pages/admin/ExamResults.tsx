// AdminExamResults.tsx

import React, { useEffect, useState } from "react";
import { get, patch, post, remove } from "@/services/ApiHelper";

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";

type ExamResult = {
  result_id: number;
  exam_id: number;
  student_id: number;
  score: number;
  taken_at: string;
};

const AdminExamResults: React.FC = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);

  const fetchResults = async () => {
    try {
      const data = await get("/ExamResults");
      setResults(data);
    } catch (error) {
      console.error("Error fetching results: ", error);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleCreateResult = async (
    newResult: Omit<ExamResult, "result_id">
  ) => {
    try {
      await post("/ExamResults", newResult);
      await fetchResults();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating result: ", error);
    }
  };

  const handleUpdateResult = async (updatedResult: ExamResult) => {
    try {
      await patch(`/ExamResults`, updatedResult);
      await fetchResults();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating result: ", error);
    }
  };

  const handleDeleteResult = async (resultId: number) => {
    try {
      await remove(`/ExamResults/${resultId}`);
      await fetchResults();
    } catch (error) {
      console.error("Error deleting result: ", error);
    }
  };

  return (
    <div className="admin-exam-results">
      <AdminHeader
        title="Exam Results Management"
        onCreate={() => setIsCreateModalOpen(true)}
      />
      <DataTable
        data={results}
        columns={[
          { header: "ID", key: "result_id" },
          { header: "Exam ID", key: "exam_id" },
          { header: "Student ID", key: "student_id" },
          { header: "Score", key: "score" },
          { header: "Taken At", key: "taken_at" },
        ]}
        idKey="result_id"
        onEdit={(result) => {
          setSelectedResult(result);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteResult}
      />
      {isCreateModalOpen && (
        <FormModal
          title="Create Result"
          fields={[
            { label: "Exam ID", key: "exam_id", type: "number" },
            { label: "Student ID", key: "student_id", type: "number" },
            { label: "Score", key: "score", type: "number" },
          ]}
          initialValues={{ exam_id: 0, student_id: 0, score: 0 }}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(values) =>
            handleCreateResult(values as Omit<ExamResult, "result_id">)
          }
        />
      )}
      {isEditModalOpen && selectedResult && (
        <FormModal
          title="Edit Result"
          fields={[
            { label: "Exam ID", key: "exam_id", type: "number" },
            { label: "Student ID", key: "student_id", type: "number" },
            { label: "Score", key: "score", type: "number" },
          ]}
          initialValues={selectedResult}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(values) => handleUpdateResult(values as ExamResult)}
        />
      )}
    </div>
  );
};

export default AdminExamResults;
