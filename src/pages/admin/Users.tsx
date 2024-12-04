import React, { useEffect, useState } from "react";
import { get, patch, post, remove } from "@/services/ApiHelper";

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";

type User = {
  user_id: number;
  name: string;
  email: string;
  role: string;
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await get("/Users");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (newUser: Omit<User, "user_id">) => {
    try {
      await post("/Users", newUser);
      await fetchUsers();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating user: ", error);
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      await patch(`/Users`, updatedUser);
      await fetchUsers();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await remove(`/Users/${userId}`);
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  return (
    <div className="admin-users">
      <AdminHeader
        title="Users Management"
        onCreate={() => setIsCreateModalOpen(true)}
      />
      <DataTable
        data={users}
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
    </div>
  );
};

export default AdminUsers;
