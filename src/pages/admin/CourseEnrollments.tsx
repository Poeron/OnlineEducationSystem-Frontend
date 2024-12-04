// AdminCourseEnrollments.tsx

import React, { useEffect, useState } from "react";
import { get, patch, post, remove } from "@/services/ApiHelper";

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";

type CourseEnrollment = {
  enrollment_id: number;
  course_id: number;
  student_id: number;
  enrollment_date: string;
};

const AdminCourseEnrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<CourseEnrollment | null>(null);

  const fetchEnrollments = async () => {
    try {
      const data = await get("/CourseEnrollments");
      setEnrollments(data);
    } catch (error) {
      console.error("Error fetching enrollments: ", error);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleCreateEnrollment = async (
    newEnrollment: Omit<CourseEnrollment, "enrollment_id" | "enrollment_date">
  ) => {
    try {
      await post("/CourseEnrollments", newEnrollment);
      await fetchEnrollments();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating enrollment: ", error);
    }
  };

  const handleUpdateEnrollment = async (
    updatedEnrollment: CourseEnrollment
  ) => {
    try {
      await patch(`/CourseEnrollments`, updatedEnrollment);
      await fetchEnrollments();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating enrollment: ", error);
    }
  };

  const handleDeleteEnrollment = async (enrollmentId: number) => {
    try {
      await remove(`/CourseEnrollments/${enrollmentId}`);
      await fetchEnrollments();
    } catch (error) {
      console.error("Error deleting enrollment: ", error);
    }
  };

  return (
    <div className="admin-course-enrollments">
      <AdminHeader
        title="Course Enrollments Management"
        onCreate={() => setIsCreateModalOpen(true)}
      />
      <DataTable
        data={enrollments}
        columns={[
          { header: "ID", key: "enrollment_id" },
          { header: "Course ID", key: "course_id" },
          { header: "Student ID", key: "student_id" },
          { header: "Enrollment Date", key: "enrollment_date" },
        ]}
        idKey="enrollment_id"
        onEdit={(enrollment) => {
          setSelectedEnrollment(enrollment);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteEnrollment}
      />
      {isCreateModalOpen && (
        <FormModal
          title="Create Enrollment"
          fields={[
            { label: "Course ID", key: "course_id", type: "number" },
            { label: "Student ID", key: "student_id", type: "number" },
            { label: "Enrollment Date", key: "enrollment_date", type: "text" },
          ]}
          initialValues={{ course_id: 0, student_id: 0 }}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(values) =>
            handleCreateEnrollment(
              values as Omit<
                CourseEnrollment,
                "enrollment_id" | "enrollment_date"
              >
            )
          }
        />
      )}
      {isEditModalOpen && selectedEnrollment && (
        <FormModal
          title="Edit Enrollment"
          fields={[
            { label: "Course ID", key: "course_id", type: "number" },
            { label: "Student ID", key: "student_id", type: "number" },
            { label: "Enrollment Date", key: "enrollment_date", type: "text" },
          ]}
          initialValues={selectedEnrollment}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(values) =>
            handleUpdateEnrollment(values as CourseEnrollment)
          }
        />
      )}
    </div>
  );
};

export default AdminCourseEnrollments;
