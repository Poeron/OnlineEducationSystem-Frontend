import React from "react";

type Course = {
  course_id: number;
  title: string;
  description: string;
  instructor_id: number;
};

type CoursesTableProps = {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: number) => void;
};

const CoursesTable: React.FC<CoursesTableProps> = ({
  courses,
  onEdit,
  onDelete,
}) => {
  return (
    <section className="data-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Instructor ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course.course_id}>
                <td>{course.course_id}</td>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>{course.instructor_id}</td>
                <td>
                  <button onClick={() => onEdit(course)}>Edit</button>
                  <button onClick={() => onDelete(course.course_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No courses found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default CoursesTable;
