const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');
require('dotenv').config();
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;

// Connect to MongoDB (Use your MongoDB Atlas connection string here)
mongoose.connect(DB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("Could not connect:", err));

// GET all tasks
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// POST a new task
app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
});

// DELETE a task
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
