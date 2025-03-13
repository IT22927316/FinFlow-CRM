import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "financial_planner" });
  const [editMode, setEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/auth/users/${selectedUserId}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/auth/users", formData);
      }
      fetchUsers();
      setFormData({ username: "", email: "", password: "", role: "financial_planner" });
      setEditMode(false);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleEdit = (user) => {
    setFormData({ username: user.username, email: user.email, role: user.role });
    setSelectedUserId(user.user_id);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">User Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="border p-2 w-full"/>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="border p-2 w-full"/>
        {!editMode && <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="border p-2 w-full"/>}
        <select name="role" value={formData.role} onChange={handleChange} className="border p-2 w-full">
          <option value="admin">Admin</option>
          <option value="financial_planner">Financial Planner</option>
          <option value="mortgage_broker">Mortgage Broker</option>
        </select>
        <button type="submit" className="bg-indigo-500 text-white p-2 w-full">{editMode ? "Update User" : "Add User"}</button>
      </form>

      {/* User List */}
      <ul className="mt-6">
        {users.map((user) => (
          <li key={user.user_id} className="flex justify-between items-center p-2 border">
            {user.username} - {user.email} ({user.role})
            <div>
              <button onClick={() => handleEdit(user)} className="bg-yellow-500 p-2 text-white">Edit</button>
              <button onClick={() => handleDelete(user.user_id)} className="bg-red-500 p-2 text-white ml-2">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsers;
