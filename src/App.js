import React, { useEffect, useState, useRef } from "react";
import KanbanCard from "./KanbanCard";
import './App.css';
import { DisplayIcon, AddIcon, MenuIcon, BacklogIcon, InProgressIcon, TodoIcon, DoneIcon, CancelledIcon, HighPriorityIcon, MediumPriorityIcon, LowPriorityIcon, NoPriorityIcon, UrgentPriorityIcon } from './assets/icons';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState("status");
  const [sortBy, setSortBy] = useState("priority");
  const [displayDropdownOpen, setDisplayDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then(response => response.json())
      .then(data => {
        const updatedTickets = data.tickets.map(ticket => ({
          ...ticket,
          status: ['Backlog', 'Todo', 'In progress', 'Done', 'Cancelled'].includes(ticket.status) 
            ? ticket.status 
            : 'Todo'
        }));
        setTickets(updatedTickets);
        setUsers(data.users);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const savedGroupBy = localStorage.getItem("groupBy");
    const savedSortBy = localStorage.getItem("sortBy");
    if (savedGroupBy) setGroupBy(savedGroupBy);
    if (savedSortBy) setSortBy(savedSortBy);
  }, []);

  useEffect(() => {
    localStorage.setItem("groupBy", groupBy);
    localStorage.setItem("sortBy", sortBy);
  }, [groupBy, sortBy]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDisplayDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const groupTickets = () => {
    let groups = {};
    if (groupBy === "status") {
      groups = {
        "Backlog": [],
        "Todo": [],
        "In progress": [],
        "Done": [],
        "Cancelled": []
      };
    } else if (groupBy === "user") {
      users.forEach(user => {
        groups[user.name] = [];
      });
    } else if (groupBy === "priority") {
      groups = {
        "Urgent": [],
        "High": [],
        "Medium": [],
        "Low": [],
        "No priority": []
      };
    }

    tickets.forEach(ticket => {
      if (groupBy === "status") {
        groups[ticket.status].push(ticket);
      } else if (groupBy === "user") {
        const user = users.find(u => u.id === ticket.userId);
        if (user) {
          groups[user.name].push(ticket);
        }
      } else if (groupBy === "priority") {
        const priorityLevels = ["No priority", "Low", "Medium", "High", "Urgent"];
        groups[priorityLevels[ticket.priority]].push(ticket);
      }
    });

    return groups;
  };

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

  const getColumnIcon = (group) => {
    switch (group.toLowerCase()) {
      case 'backlog': return <BacklogIcon />;
      case 'in progress': return <InProgressIcon />;
      case 'todo': return <TodoIcon />;
      case 'done': return <DoneIcon />;
      case 'cancelled': return <CancelledIcon />;
      case 'no priority': return <NoPriorityIcon />;
      case 'low': return <LowPriorityIcon />;
      case 'medium': return <MediumPriorityIcon />;
      case 'high': return <HighPriorityIcon />;
      case 'urgent': return <UrgentPriorityIcon />;
      default: return null;
    }
  };

  const groupedTickets = groupTickets();

  return (
    <div className="app">
      <div className="controls">
        <div className="display-dropdown" ref={dropdownRef}>
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
                  onChange={(e) => {
                    setGroupBy(e.target.value);
                    setDisplayDropdownOpen(false);
                  }}
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
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setDisplayDropdownOpen(false);
                  }}
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
              {getColumnIcon(group)}
              <b>{group}</b> {tickets.length}
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
                  groupBy={groupBy}
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