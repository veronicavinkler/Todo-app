import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [loading, setLoading] = useState(false);

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
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.apiUrl}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    
    try {
      const response = await axios.post(`${config.apiUrl}/todos`, {
        text: newTodo
      });
      setTodos([response.data, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const response = await axios.put(`${config.apiUrl}/todos/${id}`, {
        completed: !completed
      });
      setTodos(todos.map(todo => 
        todo.id === id ? response.data : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${config.apiUrl}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
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
            <button onClick={addTodo} disabled={loading}>
              {loading ? 'Adding...' : 'Add Todo'}
            </button>
          </div>

          <div className="todo-list">
            {loading && todos.length === 0 ? (
              <p>Loading todos...</p>
            ) : (
              todos.map(todo => (
                <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                  />
                  <span>{todo.text}</span>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
              ))
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;