
const validateTodo = (req, res, next) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'Todo text is required and must be a non-empty string' });
  }
  if (text.length > 255) {
    return res.status(400).json({ error: 'Todo text must be less than 255 characters' });
  }
  next();
};

const validateUserRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || typeof username !== 'string' || username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
  }
  if (username.length > 50) {
    return res.status(400).json({ error: 'Username must be less than 50 characters' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  if (password.length > 128) {
    return res.status(400).json({ error: 'Password must be less than 128 characters' });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  next();
};

module.exports = {
  validateTodo,
  validateUserRegistration,
  validateLogin
};