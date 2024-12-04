// AdminAssignmentSubmissions.tsx

import React, { useEffect, useState } from "react";
import { get, patch, post, remove } from "@/services/ApiHelper";

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";

type AssignmentSubmission = {
  submission_id: number;
  assignment_id: number;
  student_id: number;
  submission_url: string;
  grade: number;
  submitted_at: string;
};

const AdminAssignmentSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<AssignmentSubmission | null>(null);

  const fetchSubmissions = async () => {
    try {
      const data = await get("/AssignmentSubmissions");
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions: ", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleCreateSubmission = async (
    newSubmission: Omit<AssignmentSubmission, "submission_id">
  ) => {
    try {
      await post("/AssignmentSubmissions", newSubmission);
      await fetchSubmissions();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating submission: ", error);
    }
  };

  const handleUpdateSubmission = async (
    updatedSubmission: AssignmentSubmission
  ) => {
    try {
      await patch(`/AssignmentSubmissions`, updatedSubmission);
      await fetchSubmissions();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating submission: ", error);
    }
  };

  const handleDeleteSubmission = async (submissionId: number) => {
    try {
      await remove(`/AssignmentSubmissions/${submissionId}`);
      await fetchSubmissions();
    } catch (error) {
      console.error("Error deleting submission: ", error);
    }
  };

  return (
    <div className="admin-assignment-submissions">
      <AdminHeader
        title="Assignment Submissions Management"
        onCreate={() => setIsCreateModalOpen(true)}
      />
      <DataTable
        data={submissions}
        columns={[
          { header: "ID", key: "submission_id" },
          { header: "Assignment ID", key: "assignment_id" },
          { header: "Student ID", key: "student_id" },
          { header: "Submission URL", key: "submission_url" },
          { header: "Grade", key: "grade" },
          { header: "Submitted At", key: "submitted_at" },
        ]}
        idKey="submission_id"
        onEdit={(submission) => {
          setSelectedSubmission(submission);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteSubmission}
      />
      {isCreateModalOpen && (
        <FormModal
          title="Create Submission"
          fields={[
            { label: "Assignment ID", key: "assignment_id", type: "number" },
            { label: "Student ID", key: "student_id", type: "number" },
            { label: "Submission URL", key: "submission_url", type: "text" },
            { label: "Grade", key: "grade", type: "number" },
          ]}
          initialValues={{
            assignment_id: 0,
            student_id: 0,
            submission_url: "",
            grade: 0,
          }}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(values) =>
            handleCreateSubmission(
              values as Omit<AssignmentSubmission, "submission_id">
            )
          }
        />
      )}
      {isEditModalOpen && selectedSubmission && (
        <FormModal
          title="Edit Submission"
          fields={[
            { label: "Assignment ID", key: "assignment_id", type: "number" },
            { label: "Student ID", key: "student_id", type: "number" },
            { label: "Submission URL", key: "submission_url", type: "text" },
            { label: "Grade", key: "grade", type: "number" },
          ]}
          initialValues={selectedSubmission}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(values) =>
            handleUpdateSubmission(values as AssignmentSubmission)
          }
        />
      )}
    </div>
  );
};

export default AdminAssignmentSubmissions;
