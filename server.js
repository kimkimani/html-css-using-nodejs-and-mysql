const express = require('express');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

// Create a Sequelize instance
// connect to MySQL
const sequelize = new Sequelize('your-database', 'database-username', 'database password', {
    host: 'localhost',
    dialect: 'mysql',
  });
  
// Define a Sequelize model
const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
// Synchronize the model with the database (create the table if it doesn't exist)
sequelize.sync();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle POST requests
app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = await Task.create({ title, description });
        res.status(201).json({ message: 'Task saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// A GET endpoint to Fetch data from the database
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
