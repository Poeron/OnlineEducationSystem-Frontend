import React, { useState } from "react";

type Course = {
  course_id: number;
  title: string;
  description: string;
  instructor_id: number;
};

type CourseEditModalProps = {
  course: Course;
  onClose: () => void;
  onUpdate: (updatedCourse: Course) => void;
};

const CourseEditModal: React.FC<CourseEditModalProps> = ({
  course,
  onClose,
  onUpdate,
}) => {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [instructorId, setInstructorId] = useState(course.instructor_id);

  const handleSubmit = () => {
    onUpdate({ ...course, title, description, instructor_id: instructorId });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Course</h2>
        <div className="modal-content">
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            Instructor ID:
            <input
              type="number"
              value={instructorId}
              onChange={(e) => setInstructorId(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="modal-actions">
          <button onClick={handleSubmit}>Update</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CourseEditModal;
