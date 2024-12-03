import React, { useState } from "react";
import "@/assets/css/UserEditModal.css";
import { post } from "@/services/ApiHelper";

type User = {
  name: string;
  email: string;
  password: string;
  role: string;
};

type UserCreateModalProps = {
  onClose: () => void;
  onCreate: () => void;
};

const UserCreateModal: React.FC<UserCreateModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSubmit = () => {
    const newUser: User = {
      name,
      email,
      password,
      role,
    };
    // Create user API call
    const createUser = async (newUser: User) => {
      try {
        await post("/Users", newUser);
      } catch (error) {
        console.error("Error creating user: ", error);
      }
    };
    createUser(newUser);
    onCreate();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create User</h2>
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
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <button onClick={handleSubmit}>Create</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UserCreateModal;
