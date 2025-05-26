
const jwt = require('jsonwebtoken');
const User = require('../userModel')

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expect Bearer TOKEN

  if (!token) return res.status(401).json({ 
    message: 'Access denied. No token provided.'
 })

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)
    const user = await User.findById(decoded.user.id)
    if (!user) throw new Error('User not found')
    req.user = { id: user._id, role: user.role }
    next()
  } catch (err) {
    res.status(401).json({ 
        message: 'Invalid token' 
    })
  }
}

module.exports = authenticateUser
