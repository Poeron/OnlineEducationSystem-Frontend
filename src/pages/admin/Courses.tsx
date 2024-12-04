import React, { useEffect, useState } from "react";
import { get, patch, post, remove } from "@/services/ApiHelper";

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";

type Course = {
  course_id: number;
  title: string;
  description: string;
  instructor_id: number;
};

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const fetchCourses = async () => {
    try {
      const data = await get("/Courses");
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses: ", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (newCourse: Omit<Course, "id">) => {
    try {
      await post("/Courses", newCourse);
      await fetchCourses();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating course: ", error);
    }
  };

  const handleUpdateCourse = async (updatedCourse: Course) => {
    try {
      await patch(`/Courses`, updatedCourse);
      await fetchCourses();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating course: ", error);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    try {
      await remove(`/Courses/${courseId}`);
      await fetchCourses();
    } catch (error) {
      console.error("Error deleting course: ", error);
    }
  };

  return (
    <div className="admin-courses">
      <AdminHeader
        title="Courses Management"
        onCreate={() => setIsCreateModalOpen(true)}
      />
      <DataTable
        data={courses}
        columns={[
          { header: "ID", key: "course_id" },
          { header: "Title", key: "title" },
          { header: "Description", key: "description" },
          { header: "Instructor ID", key: "instructor_id" },
        ]}
        idKey="course_id"
        onEdit={(course) => {
          setSelectedCourse(course);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteCourse}
      />
      {isCreateModalOpen && (
        <FormModal
          title="Create Course"
          fields={[
            { label: "Title", key: "title", type: "text" },
            { label: "Description", key: "description", type: "text" },
            { label: "Instructor ID", key: "instructor_id", type: "number" },
          ]}
          initialValues={{
            title: "",
            description: "",
            instructor_id: 0,
          }}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(values) =>
            handleCreateCourse(values as Omit<Course, "id">)
          }
        />
      )}
      {isEditModalOpen && selectedCourse && (
        <FormModal
          title="Edit Course"
          fields={[
            { label: "Title", key: "title", type: "text" },
            { label: "Description", key: "description", type: "text" },
            { label: "Instructor ID", key: "instructor_id", type: "number" },
          ]}
          initialValues={selectedCourse}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(values) => handleUpdateCourse(values as Course)}
        />
      )}
    </div>
  );
};

export default AdminCourses;
