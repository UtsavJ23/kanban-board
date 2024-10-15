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

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDisplayDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  const groupTickets = () => {
    if (groupBy === "status") {
      const statusOrder = ['Backlog', 'Todo', 'In progress', 'Done', 'Cancelled'];
      return statusOrder.reduce((acc, status) => {
        acc[status] = tickets.filter(ticket => ticket.status === status);
        return acc;
      }, {});
    } else if (groupBy === "user") {
      return users.reduce((acc, user) => {
        acc[user.name] = tickets.filter(ticket => ticket.userId === user.id);
        return acc;
      }, {});
    } else if (groupBy === "priority") {
      const priorityLevels = ["No priority", "Urgent", "High", "Medium", "Low"];
      return priorityLevels.reduce((acc, priority, index) => {
        acc[priority] = tickets.filter(ticket => ticket.priority === index);
        return acc;
      }, {});
    }
    return {};
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

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getColorFromName = (name) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06292', '#AED581', '#7986CB', '#4DB6AC', '#9575CD'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    return colors[hash % colors.length];
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
            <div className="kanban-column-header">
              <div className="kanban-column-title">
                {groupBy === 'user' ? (
                  <div className="user-avatar" style={{backgroundColor: getColorFromName(group)}}>
                    {getInitials(group)}
                  </div>
                ) : (
                  getColumnIcon(group)
                )}
                <strong>{group}</strong>
                <span>{tickets.length}</span>
              </div>
              <div className="column-actions">
                <AddIcon />
                <MenuIcon />
              </div>
            </div>
            <div className="kanban-cards">
              {sortedTickets(tickets).map(ticket => (
                <KanbanCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  user={users.find(user => user.id === ticket.userId)}
                  groupBy={groupBy}
                  getColorFromName={getColorFromName}
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