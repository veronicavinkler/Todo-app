const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    });
  }
  next();
};

const optionalAuth = (req, res, next) => {
  req.userId = req.session.userId || null;
  next();
};

const adminOnly = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

module.exports = { requireAuth, optionalAuth, adminOnly };