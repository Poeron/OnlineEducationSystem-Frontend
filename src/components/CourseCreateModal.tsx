import React, { useState } from "react";

import { post } from "@/services/ApiHelper";

type Course = {
  title: string;
  description: string;
  instructor_id: number;
};

type CourseCreateModalProps = {
  onClose: () => void;
  onCreate: () => void;
};

const CourseCreateModal: React.FC<CourseCreateModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructorId, setInstructorId] = useState<number | "">("");

  const handleSubmit = () => {
    if (instructorId !== "") {
      const newCourse: Course = {
        instructor_id: instructorId as number,
        title,
        description,
      };
      const createCourse = async (newCourse: Course) => {
        try {
          await post("/Courses", newCourse);
        } catch (error) {
          console.error("Error creating Course: ", error);
        }
      };
      createCourse(newCourse);
      onCreate();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create Course</h2>
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
          <button onClick={handleSubmit}>Create</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CourseCreateModal;
