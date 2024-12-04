import React, { useEffect, useState } from "react";
import { get, patch, post, remove } from "@/services/ApiHelper";

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";

type Assignment = {
  assignment_id: number;
  title: string;
  description: string;
  due_date: string;
  course_id: number;
};

const AdminAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const fetchAssignments = async () => {
    try {
      const data = await get("/Assignments");
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments: ", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreateAssignment = async (
    newAssignment: Omit<Assignment, "assignment_id">
  ) => {
    try {
      await post("/Assignments", newAssignment);
      await fetchAssignments();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating assignment: ", error);
    }
  };

  const handleUpdateAssignment = async (
    updatedAssignment: Omit<Assignment, "due_date, course_id">
  ) => {
    try {
      await patch(`/Assignments`, updatedAssignment);
      await fetchAssignments();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating assignment: ", error);
    }
  };

  const handleDeleteAssignment = async (assignmentId: number) => {
    try {
      await remove(`/Assignments/${assignmentId}`);
      await fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignment: ", error);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="admin-assignments">
      <AdminHeader
        title="Assignments Management"
        onCreate={() => setIsCreateModalOpen(true)}
      />
      <DataTable
        data={assignments.map((assignment) => ({
          ...assignment,
          due_date: formatDate(assignment.due_date),
        }))}
        columns={[
          { header: "ID", key: "assignment_id" },
          { header: "Title", key: "title" },
          { header: "Description", key: "description" },
          { header: "Due Date", key: "due_date" },
          { header: "Course ID", key: "course_id" },
        ]}
        idKey="assignment_id"
        onEdit={(assignment) => {
          setSelectedAssignment(assignment);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteAssignment}
      />
      {isCreateModalOpen && (
        <FormModal
          title="Create Assignment"
          fields={[
            { label: "Title", key: "title", type: "text" },
            { label: "Description", key: "description", type: "text" },
            { label: "Due Date", key: "due_date", type: "text" },
            { label: "Course ID", key: "course_id", type: "number" },
          ]}
          initialValues={{
            title: "",
            description: "",
            due_date: "",
            course_id: 0,
          }}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(values) =>
            handleCreateAssignment(values as Omit<Assignment, "assignment_id">)
          }
        />
      )}
      {isEditModalOpen && selectedAssignment && (
        <FormModal
          title="Edit Assignment"
          fields={[
            { label: "Title", key: "title", type: "text" },
            { label: "Description", key: "description", type: "text" },
            { label: "Due Date", key: "due_date", type: "text" },
          ]}
          initialValues={selectedAssignment}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(values) => handleUpdateAssignment(values as Assignment)}
        />
      )}
    </div>
  );
};

export default AdminAssignments;
