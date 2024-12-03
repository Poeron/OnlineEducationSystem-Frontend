// AdminUsers.tsx
import React, { useEffect, useState } from "react";
import "@/assets/css/AdminUsers.css";
import { get, remove, patch } from "@/services/ApiHelper";
import UserEditModal from "@/components/UserEditModal";
import UserCreateModal from "@/components/UserCreateModal";

type User = {
  user_id: number;
  name: string;
  email: string;
  role: string;
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateUser = () => {
    setIsCreateModalOpen(true);
  };
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };
  const handleUserCreate = async () => {
    closeCreateModal();
    await fetchUsers();
  };
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (userId: number) => {
    // Delete user logic
    const deleteUser = async () => {
      try {
        await remove(`/Users/${userId}`);
        const updatedUsers = users.filter((user) => user.user_id !== userId);
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    };
    deleteUser();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdate = (updatedUser: User) => {
    // Update user API call
    const updateUser = async () => {
      try {
        await patch(`/Users`, updatedUser);
        const updatedUsers = users.map((user) =>
          user.user_id === updatedUser.user_id ? updatedUser : user
        );
        setUsers(updatedUsers);
        closeModal();
      } catch (error) {
        console.error("Error updating user: ", error);
      }
    };
    updateUser();
  };

  const fetchUsers = async () => {
    try {
      const users = await get("/Users");
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-users">
      <header>
        <h1>Users Management</h1>
        <button onClick={handleCreateUser} className="create-user-btn">
          Create New User
        </button>
      </header>

      <section className="data-table">
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
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.user_id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      {isModalOpen && selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={closeModal}
          onUpdate={handleUserUpdate}
        />
      )}
      {isCreateModalOpen && (
        <UserCreateModal
          onClose={closeCreateModal}
          onCreate={handleUserCreate}
        />
      )}
    </div>
  );
};

export default AdminUsers;
