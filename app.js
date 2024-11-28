const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const path = require('path');
const conn = require('./dbc.js')
// Load environment variables
require('dotenv').config();
const mongoose = require('mongoose');
// point my mongoose to the URI
mongoose.connect(conn.MONGO_URI);
let mongoDB = mongoose.connection;
mongoDB.on('error',console.error.bind(console,'Connection Error'))
mongoDB.once('open',()=>{
  console.log('MongoDB Connected')
})
mongoose.connect(conn.MONGO_URI,{useNewURIParser:true,
  useUnifiedTopology:true
})

// Initialize Express app
const app = express();

// Middleware
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', path.join(__dirname, 'views')); // Set views directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded data from forms
app.use(express.static('public')); // Serve static files (e.g., CSS)
app.use('/nodemodules', express.static('node_modules'));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use('/fontawesome', express.static(path.join(__dirname, 'node_modules', '@fortawesome', 'fontawesome-free', 'css')));
app.use('/webfonts', express.static(path.join(__dirname, 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts')));

// Routes
const tripRoutes = require('./routes/tripRoutes');
const activityRoutes = require('./routes/activityRoutes');
// to home
app.get('/', (req, res) => {
    res.render('home');
});

// Redirect root to the dashboard
app.get('/', (req, res) => {
    res.redirect('/trips/dashboard');
});

// Routes for trips and activities
app.use('/', tripRoutes);
app.use('/trips', tripRoutes);
app.use('/trips/:id/activities', activityRoutes);

// Handle 404 errors
app.use((req, res) => {
    res.status(404).render('404', { message: 'Page Not Found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
