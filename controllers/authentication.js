const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
try {
const { name, email, password } = req.body;
const user = await User.create({ name, email, password });
res.redirect('/login');
} catch (error) {
res.status(500).send('Error: Unable to register');
}
};

exports.login = async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user || !(await bcrypt.compare(password, user.password))) {
return res.status(400).send('Invalid credentials');
}
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
res.cookie('token', token).redirect('/dashboard');
} catch (error) {
res.status(500).send('Error: Unable to login');
}
};

exports.logout = (req, res) => {
res.clearCookie('token').redirect('/');
};
