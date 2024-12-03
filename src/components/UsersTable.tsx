import React from "react";

type User = {
  user_id: number;
  name: string;
  email: string;
  role: string;
};

type UsersTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
};

const UsersTable: React.FC<UsersTableProps> = ({ users, onEdit, onDelete }) => {
  return (
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
                  <button onClick={() => onEdit(user)}>Edit</button>
                  <button onClick={() => onDelete(user.user_id)}>Delete</button>
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
  );
};

export default UsersTable;
