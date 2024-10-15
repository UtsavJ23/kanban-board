import React, { useEffect, useState } from "react";
import KanbanCard from "./KanbanCard";
import './App.css';
import { DisplayIcon, AddIcon, MenuIcon, BacklogIcon, InProgressIcon, TodoIcon, DoneIcon, CancelledIcon } from './assets/icons';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState("status");
  const [sortBy, setSortBy] = useState("priority");
  const [displayDropdownOpen, setDisplayDropdownOpen] = useState(false);

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

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'backlog': return <BacklogIcon />;
      case 'in progress': return <InProgressIcon />;
      case 'todo': return <TodoIcon />;
      case 'done': return <DoneIcon />;
      case 'cancelled': return <CancelledIcon />;
      default: return null;
    }
  };

  const groupedTickets = groupTickets();

  return (
    <div className="app">
      <div className="controls">
        <div className="display-dropdown">
          <button 
            className="display-dropdown-button" 
            onClick={() => setDisplayDropdownOpen(!displayDropdownOpen)}
          >
            <DisplayIcon /> Display <span>▼</span>
          </button>
          {displayDropdownOpen && (
            <div className="display-dropdown-content">
              <div className="display-option">
                <label htmlFor="grouping">Grouping</label>
                <select 
                  id="grouping" 
                  value={groupBy} 
                  onChange={(e) => setGroupBy(e.target.value)}
                >
                  <option value="status">Status</option>
                  <option value="user">User</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
              <div className="display-option">
                <label htmlFor="ordering">Ordering</label>
                <select 
                  id="ordering" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="kanban-board">
        {Object.entries(groupedTickets).map(([group, tickets]) => (
          <div key={group} className="kanban-column">
            <h3>
              {getStatusIcon(group)}
              {group} {tickets.length}
              <div className="column-actions">
                <AddIcon />
                <MenuIcon />
              </div>
            </h3>
            <div className="kanban-cards">
              {sortedTickets(tickets).map(ticket => (
                <KanbanCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  user={users.find(user => user.id === ticket.userId)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;