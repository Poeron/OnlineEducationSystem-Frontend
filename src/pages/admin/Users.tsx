import "@/assets/css/AdminUsers.css";

import React, { useEffect, useState } from "react";
import { get, patch, remove } from "@/services/ApiHelper";

import Header from "@/components/AdminHeader";
import UserCreateModal from "@/components/UserCreateModal";
import UserEditModal from "@/components/UserEditModal";
import UsersTable from "@/components/UsersTable";

type User = {
  user_id: number;
  name: string;
  email: string;
  role: string;
};

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof User | "">("");

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

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = sortKey
    ? [...filteredUsers].sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1))
    : filteredUsers;

  return (
    <div className="admin-users">
      <Header title="Users Management" onCreate={handleCreateUser} />
      <div className="search-and-sort">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setSortKey(e.target.value as keyof User)}>
          <option value="">Sort by...</option>
          <option value="user_id">ID</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="role">Role</option>
        </select>
      </div>
      <UsersTable
        users={sortedUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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

export default Users;
