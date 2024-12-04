import "@/assets/css/AdminHomepage.css";

const AdminHomepage = () => {
  return (
    <div className="admin-homepage">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>
      {/* Main Content */}
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
