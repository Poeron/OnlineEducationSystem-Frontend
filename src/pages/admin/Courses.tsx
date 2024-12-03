import "@/assets/css/AdminCourses.css";

import React, { useEffect, useState } from "react";
import { get, patch, remove } from "@/services/ApiHelper";

import CourseCreateModal from "@/components/CourseCreateModal";
import CourseEditModal from "@/components/CourseEditModal";
import CoursesTable from "@/components/CoursesTable";
import Header from "@/components/AdminHeader";

type Course = {
  course_id: number;
  title: string;
  description: string;
  instructor_id: number;
};

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof Course | "">("");

  const handleCreateCourse = () => {
    setIsCreateModalOpen(true);
  };
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };
  const handleCourseCreate = async () => {
    closeCreateModal();
    await fetchCourses();
  };
  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (courseId: number) => {
    const deleteCourse = async () => {
      try {
        await remove(`/Courses/${courseId}`);
        const updatedCourses = courses.filter(
          (course) => course.course_id !== courseId
        );
        setCourses(updatedCourses);
      } catch (error) {
        console.error("Error deleting course: ", error);
      }
    };
    deleteCourse();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleCourseUpdate = (updatedCourse: Course) => {
    const updateCourse = async () => {
      try {
        await patch(`/Courses`, updatedCourse);
        const updatedCourses = courses.map((course) =>
          course.course_id === updatedCourse.course_id ? updatedCourse : course
        );
        setCourses(updatedCourses);
        closeModal();
      } catch (error) {
        console.error("Error updating course: ", error);
      }
    };
    updateCourse();
  };

  const fetchCourses = async () => {
    try {
      const courses = await get("/Courses");
      setCourses(courses);
    } catch (error) {
      console.error("Error fetching courses: ", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCourses = sortKey
    ? [...filteredCourses].sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1))
    : filteredCourses;

  return (
    <div className="admin-courses">
      <Header title="Courses Management" onCreate={handleCreateCourse} />
      <div className="search-and-sort">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setSortKey(e.target.value as keyof Course)}>
          <option value="">Sort by...</option>
          <option value="course_id">ID</option>
          <option value="title">Title</option>
          <option value="instructor_id">Instructor ID</option>
        </select>
      </div>
      <CoursesTable
        courses={sortedCourses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isModalOpen && selectedCourse && (
        <CourseEditModal
          course={selectedCourse}
          onClose={closeModal}
          onUpdate={handleCourseUpdate}
        />
      )}
      {isCreateModalOpen && (
        <CourseCreateModal
          onClose={closeCreateModal}
          onCreate={handleCourseCreate}
        />
      )}
    </div>
  );
};

export default Courses;
