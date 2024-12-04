import React, { useEffect, useState } from "react";
import { get, patch, post, remove } from "@/services/ApiHelper";

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";

type Exam = {
  exam_id: number;
  title: string;
  description: string;
  course_id: number;
};

const AdminExams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const fetchExams = async () => {
    try {
      const data = await get("/Exams");
      setExams(data);
    } catch (error) {
      console.error("Error fetching exams: ", error);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleCreateExam = async (newExam: Omit<Exam, "exam_id">) => {
    try {
      await post("/Exams", newExam);
      await fetchExams();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating exam: ", error);
    }
  };

  const handleUpdateExam = async (updatedExam: Exam) => {
    try {
      await patch(`/Exams`, updatedExam);
      await fetchExams();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating exam: ", error);
    }
  };

  const handleDeleteExam = async (examId: number) => {
    try {
      await remove(`/Exams/${examId}`);
      await fetchExams();
    } catch (error) {
      console.error("Error deleting exam: ", error);
    }
  };

  return (
    <div className="admin-exams">
      <AdminHeader
        title="Exams Management"
        onCreate={() => setIsCreateModalOpen(true)}
      />
      <DataTable
        data={exams}
        columns={[
          { header: "ID", key: "exam_id" },
          { header: "Title", key: "title" },
          { header: "Description", key: "description" },
          { header: "Course ID", key: "course_id" },
        ]}
        idKey="exam_id"
        onEdit={(exam) => {
          setSelectedExam(exam);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteExam}
      />
      {isCreateModalOpen && (
        <FormModal
          title="Create Exam"
          fields={[
            { label: "Title", key: "title", type: "text" },
            { label: "Description", key: "description", type: "text" },
            { label: "Course ID", key: "course_id", type: "number" },
          ]}
          initialValues={{ title: "", description: "", course_id: 0 }}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(values) =>
            handleCreateExam(values as Omit<Exam, "exam_id">)
          }
        />
      )}
      {isEditModalOpen && selectedExam && (
        <FormModal
          title="Edit Exam"
          fields={[
            { label: "Title", key: "title", type: "text" },
            { label: "Description", key: "description", type: "text" },
            { label: "Course ID", key: "course_id", type: "number" },
          ]}
          initialValues={selectedExam}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(values) => handleUpdateExam(values as Exam)}
        />
      )}
    </div>
  );
};

export default AdminExams;
