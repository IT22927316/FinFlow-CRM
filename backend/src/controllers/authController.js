const db = require('../utils/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER USER
exports.registerUser = async (req, res) => {
  const {
    username,
    password,
    role,
    email,
    security_question,
    security_answer
  } = req.body;

  try {
    const [existingUser] = await db.execute(
      'SELECT user_id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existingUser.length) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(security_answer, 10);

    await db.execute(
      `INSERT INTO users (username, password, role, email, security_question, security_answer)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, role, email, security_question, hashedAnswer]
    );

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const [user] = await db.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [emailOrUsername, emailOrUsername]
    );

    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    const token = jwt.sign(
      { id: user[0].user_id, role: user[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, message: 'Login successful.' });

  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// FORGOT PASSWORD - GET SECURITY QUESTION
exports.getSecurityQuestion = async (req, res) => {
  const { emailOrUsername } = req.body;

  try {
    const [user] = await db.execute(
      'SELECT user_id, security_question FROM users WHERE username = ? OR email = ?',
      [emailOrUsername, emailOrUsername]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      user_id: user[0].user_id,
      security_question: user[0].security_question
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// RESET PASSWORD (VERIFY SECURITY ANSWER)
exports.resetPassword = async (req, res) => {
  const { user_id, security_answer, new_password } = req.body;

  try {
    const [user] = await db.execute('SELECT security_answer FROM users WHERE user_id = ?', [user_id]);

    if (user.length === 0 || !(await bcrypt.compare(security_answer, user[0].security_answer))) {
      return res.status(400).json({ message: 'Incorrect security answer.' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await db.execute('UPDATE users SET password = ? WHERE user_id = ?', [hashedPassword, user_id]);

    res.json({ message: 'Password reset successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};
