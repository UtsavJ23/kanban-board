import React, { useEffect, useState } from "react";
import './App.css';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState("status");
  const [sortBy, setSortBy] = useState("priority");

  // Fetch data from the API on mount
  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then(response => response.json())
      .then(data => {
        setTickets(data.tickets);
        setUsers(data.users);
      })
      .catch(err => console.error(err));
  }, []);

  // Load previous view state from localStorage
  useEffect(() => {
    const savedGroupBy = localStorage.getItem("groupBy");
    const savedSortBy = localStorage.getItem("sortBy");
    if (savedGroupBy) setGroupBy(savedGroupBy);
    if (savedSortBy) setSortBy(savedSortBy);
  }, []);

  // Save current view state to localStorage
  useEffect(() => {
    localStorage.setItem("groupBy", groupBy);
    localStorage.setItem("sortBy", sortBy);
  }, [groupBy, sortBy]);

  // Group tickets based on user's selection
  const groupTickets = () => {
    if (groupBy === "status") {
      return tickets.reduce((acc, ticket) => {
        if (!acc[ticket.status]) acc[ticket.status] = [];
        acc[ticket.status].push(ticket);
        return acc;
      }, {});
    } else if (groupBy === "user") {
      return users.reduce((acc, user) => {
        acc[user.name] = tickets.filter(ticket => ticket.userId === user.id);
        return acc;
      }, {});
    } else if (groupBy === "priority") {
      return tickets.reduce((acc, ticket) => {
        const priorityLevels = ["No priority", "Low", "Medium", "High", "Urgent"];
        const priority = priorityLevels[ticket.priority];
        if (!acc[priority]) acc[priority] = [];
        acc[priority].push(ticket);
        return acc;
      }, {});
    }
    return {};
  };

  // Sort tickets based on user's selection
  const sortedTickets = (ticketsGroup) => {
    return ticketsGroup.sort((a, b) => {
      if (sortBy === "priority") {
        return b.priority - a.priority;
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const groupedTickets = groupTickets();

  return (
    <div className="app">
      <div className="controls">
        <label htmlFor="group-by">Group by:</label>
        <select id="group-by" value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
          <option value="status">Status</option>
          <option value="user">User</option>
          <option value="priority">Priority</option>
        </select>

        <label htmlFor="sort-by">Sort by:</label>
        <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className="kanban-board">
        {Object.keys(groupedTickets).map(group => (
          <div key={group} className="kanban-column">
            <h3>{group}</h3>
            <div className="kanban-cards">
              {sortedTickets(groupedTickets[group]).map(ticket => (
                <div key={ticket.id} className="kanban-card">
                  <h4>{ticket.title}</h4>
                  <p>Priority: {ticket.priority}</p>
                  <p>User: {users.find(user => user.id === ticket.userId)?.name || "Unknown"}</p>
                  <p>Status: {ticket.status}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;