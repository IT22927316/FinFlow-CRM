const db = require('../utils/db');
const bcrypt = require('bcrypt');

// Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute("SELECT user_id, username, email, role FROM users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Create a New User (Admin Only)
exports.createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, role]
    );
    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

// Update User (Admin Only)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;

  try {
    await db.execute(
      "UPDATE users SET username = ?, email = ?, role = ? WHERE user_id = ?",
      [username, email, role, id]
    );
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

// Delete User (Admin Only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM users WHERE user_id = ?", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
