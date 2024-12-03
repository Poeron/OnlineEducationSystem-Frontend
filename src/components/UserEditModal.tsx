// UserEditModal.tsx
import React, { useState } from "react";
import "@/assets/css/UserEditModal.css";

type User = {
  user_id: number;
  name: string;
  email: string;
  role: string;
};

type UserEditModalProps = {
  user: User;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
};

const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  onClose,
  onUpdate,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  const handleSubmit = () => {
    const updatedUser: User = { ...user, name, email, role };
    // Update user API call
    onUpdate(updatedUser);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit User</h2>
        <div className="modal-content">
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Role:
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </div>
        <div className="modal-actions">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
