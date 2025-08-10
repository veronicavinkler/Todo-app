import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  // Test backend connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/test`);
        setConnectionStatus(response.data.message);
      } catch (error) {
        console.error('Connection error:', error);
        setConnectionStatus('Failed to connect to backend');
      }
    };

    testConnection();
  }, []);

  // Fetch todos from backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/todos`);
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo,
        completed: false
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo App</h1>
        <p>Status: {connectionStatus}</p>
        
        <div className="todo-container">
          <div className="add-todo">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter a new todo"
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <button onClick={addTodo}>Add Todo</button>
          </div>

          <div className="todo-list">
            {todos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span>{todo.text}</span>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;