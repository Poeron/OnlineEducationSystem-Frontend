import "@/assets/css/AdminHomepage.css";

import { get, patch, post, remove } from "@/services/ApiHelper";
import { useEffect, useState } from "react";

import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";

type User = {
  user_id: number;
  name: string;
  email: string;
  role: string;
};

const AdminHomepage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [userCount, setUserCount] = useState<number>(0);
  const [courseCount, setCourseCount] = useState<number>(0);
  const [examCount, setExamCount] = useState<number>(0);
  const [certificateCount, setCertificateCount] = useState<number>(0);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  // Fetch data from API
  const fetchData = async () => {
    try {
      const users = await get("/Dashboard/UserCount");
      const courses = await get("/Dashboard/CourseCount");
      const exams = await get("/Dashboard/ExamCount");
      const certificates = await get("/Dashboard/CertificateCount");
      const recentUsers = await get("/Dashboard/RecentUsers");

      setUserCount(users);
      setCourseCount(courses);
      setExamCount(exams);
      setCertificateCount(certificates);
      setRecentUsers(recentUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleCreateUser = async (newUser: Omit<User, "user_id">) => {
    try {
      await post("/Users", newUser);
      await fetchData();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating user: ", error);
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      await patch(`/Users`, updatedUser);
      await fetchData();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await remove(`/Users/${userId}`);
      await fetchData();
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="admin-homepage">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>
      {/* Main Content */}
      <main className="main-content">
        <br />
        {/* Statistics Cards */}
        <section className="stats-cards">
          <div className="card">
            <h3>Total Users</h3>
            <p>{userCount}</p> {/* Fetch this data dynamically */}
          </div>
          <div className="card">
            <h3>Total Courses</h3>
            <p>{courseCount}</p> {/* Fetch this data dynamically */}
          </div>
          <div className="card">
            <h3>Exams Conducted</h3>
            <p>{examCount}</p> {/* Fetch this data dynamically */}
          </div>
          <div className="card">
            <h3>Certificates Issued</h3>
            <p>{certificateCount}</p> {/* Fetch this data dynamically */}
          </div>
        </section>

        {/* Data Table Section */}
        <section className="data-table">
          <DataTable
            data={recentUsers}
            columns={[
              { header: "ID", key: "user_id" },
              { header: "Name", key: "name" },
              { header: "Email", key: "email" },
              { header: "Role", key: "role" },
            ]}
            idKey="user_id"
            onEdit={(user) => {
              setSelectedUser(user);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDeleteUser}
          />
          {isCreateModalOpen && (
            <FormModal
              title="Create User"
              fields={[
                { label: "Name", key: "name", type: "text" },
                { label: "Email", key: "email", type: "text" },
                { label: "Role", key: "role", type: "text" },
              ]}
              initialValues={{ name: "", email: "", role: "" }}
              onClose={() => setIsCreateModalOpen(false)}
              onSubmit={(values) =>
                handleCreateUser(values as Omit<User, "user_id">)
              }
            />
          )}
          {isEditModalOpen && selectedUser && (
            <FormModal
              title="Edit User"
              fields={[
                { label: "Name", key: "name", type: "text" },
                { label: "Email", key: "email", type: "text" },
                { label: "Role", key: "role", type: "text" },
              ]}
              initialValues={selectedUser}
              onClose={() => setIsEditModalOpen(false)}
              onSubmit={(values) => handleUpdateUser(values as User)}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminHomepage;
