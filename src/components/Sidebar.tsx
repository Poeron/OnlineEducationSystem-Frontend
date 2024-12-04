import "@/assets/css/AdminHomepage.css";

import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <h2>
        <a onClick={() => navigate("/admin")}>Admin Panel </a>
      </h2>
      <nav>
        <ul>
          <li>
            <a onClick={() => navigate("/admin/users")}>Users</a>
          </li>
          <li>
            <a onClick={() => navigate("/admin/courses")}>Courses</a>
          </li>
          <li>
            <a onClick={() => navigate("/admin/exams")}>Exams</a>
          </li>
          <li>
            <a onClick={() => navigate("/admin/certificates")}>Certificates</a>
          </li>
          <li>
            <a onClick={() => navigate("/admin/assignments")}>Assignments</a>
          </li>
          <li>
            <a onClick={() => navigate("/admin/assignment-submissions")}>
              Assignment Submissions
            </a>
          </li>
          <li>
            <a onClick={() => navigate("/admin/course-enrollments")}>
              Course Enrollments
            </a>
          </li>
          <li>
            <a onClick={() => navigate("/admin/course-materials")}>
              Course Materials
            </a>
          </li>
          <li>
            <a onClick={() => navigate("/admin/exam-questions")}>
              Exam Questions
            </a>
          </li>
          <li>
            <a onClick={() => navigate("/admin/exam-results")}>Exam Results</a>
          </li>
          <li>
            <a onClick={() => navigate("/admin/forum-comments")}>
              Forum Comments
            </a>
          </li>
          <li>
            <a onClick={() => navigate("/admin/question-options")}>
              Question Options
            </a>
          </li>
        </ul>
        <button onClick={logout} className="px-4 py-2 bg-red-600 rounded">
          Çıkış Yap
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
