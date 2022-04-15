const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./mongoDB/connectDB.js');
const fileRoutes = require('./routes/filesRoutes.js');
const path = require('path');

// Static File
app.use(express.static('public'));
app.use(express.json());

// Connect DB
connectDB(process.env.DB_URL);

// Template Engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// File Routes
app.use('/api/files', fileRoutes);

// Show File Routes
app.use('/files', require('./routes/showRoutes.js'));

const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`Server is Running at: http://localhost:${port}/`);
});