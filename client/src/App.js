import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// The URL where your backend is running
const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // 1. GET: Fetch tasks from server when the app loads
  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    getTasks();
  }, []);

  // 2. POST: Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      const res = await axios.post(API_URL, { text: inputValue });
      setTasks([...tasks, res.data]); // Update UI locally
      setInputValue(""); // Clear input
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // 3. PATCH: Toggle Complete status
  const toggleComplete = async (id, currentStatus) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, { completed: !currentStatus });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // 4. DELETE: Remove a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="todo-container">
      <h1>Task Master</h1>
      
      <form className="input-group" onSubmit={handleAddTask}>
        <input 
          type="text" 
          placeholder="Add a new task..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="add-btn">Add</button>
      </form>

      <div className="todo-list">
        {tasks.map((task) => (
          <div key={task._id} className="task-item">
            <span 
              className={`task-text ${task.completed ? 'completed' : ''}`}
              onClick={() => toggleComplete(task._id, task.completed)}
            >
              {task.text}
            </span>
            <button className="delete-btn" onClick={() => deleteTask(task._id)}>
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;