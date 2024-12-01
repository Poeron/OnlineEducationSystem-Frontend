import "../../assets/css/AdminHomepage.css";
import Navbar from "../../components/Navbar";

const AdminHomepage = () => {
  return (
    <div className="admin-homepage">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <a href="/users">Users</a>
            </li>
            <li>
              <a href="/courses">Courses</a>
            </li>
            <li>
              <a href="/exams">Exams</a>
            </li>
            <li>
              <a href="/assignments">Assignments</a>
            </li>
            <li>
              <a href="/forum-threads">Forum Threads</a>
            </li>
            <li>
              <a href="/certificates">Certificates</a>
            </li>
            {/* Add links for other controllers */}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <Navbar />
      <main className="main-content">
        <header>
          <h1>Dashboard</h1>
        </header>

        {/* Statistics Cards */}
        <section className="stats-cards">
          <div className="card">
            <h3>Total Users</h3>
            <p>123</p> {/* Fetch this data dynamically */}
          </div>
          <div className="card">
            <h3>Total Courses</h3>
            <p>45</p> {/* Fetch this data dynamically */}
          </div>
          <div className="card">
            <h3>Exams Conducted</h3>
            <p>30</p> {/* Fetch this data dynamically */}
          </div>
          <div className="card">
            <h3>Certificates Issued</h3>
            <p>20</p> {/* Fetch this data dynamically */}
          </div>
        </section>

        {/* Data Table Section */}
        <section className="data-table">
          <h2>Recent Users</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample Data */}
              <tr>
                <td>1</td>
                <td>John Doe</td>
                <td>john.doe@example.com</td>
                <td>Student</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jane Smith</td>
                <td>jane.smith@example.com</td>
                <td>Instructor</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
              {/* Add dynamic rows here */}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminHomepage;
