import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "@/assets/css/AdminHomepage.css";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <h2>Admin Panel</h2>
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
            <a onClick={() => navigate("/admin/assignments")}>Assignments</a>
          </li>
          <li>
            <a onClick={() => navigate("/admin/forum-threads")}>
              Forum Threads
            </a>
          </li>
          <li>
            <a onClick={() => navigate("/admin/certificates")}>Certificates</a>
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
