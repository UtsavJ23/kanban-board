import React from 'react';
import { HighPriorityIcon, LowPriorityIcon, MediumPriorityIcon, UrgentPriorityIcon, NoPriorityIcon, BacklogIcon, InProgressIcon, TodoIcon, DoneIcon, CancelledIcon } from './assets/icons';

const KanbanCard = ({ ticket, user, groupBy }) => {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 0: return <NoPriorityIcon />;
      case 1: return <LowPriorityIcon />;
      case 2: return <MediumPriorityIcon />;
      case 3: return <HighPriorityIcon />;
      case 4: return <UrgentPriorityIcon />;
      default: return null;
    }
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

  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06292', '#AED581', '#7986CB', '#4DB6AC', '#9575CD'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const userColor = user ? getRandomColor() : '#ccc';

  return (
    <div className="kanban-card">
      <div className="kanban-card-header">
        <span className="kanban-card-id">{ticket.id}</span>
        {groupBy !== 'user' && (
          <div className="kanban-card-avatar" style={{backgroundColor: userColor}}>
            {user ? getInitials(user.name) : '?'}
          </div>
        )}
      </div>
      <h4 className="kanban-card-title">{ticket.title}</h4>
      <div className="kanban-card-footer">
        {groupBy !== 'priority' && getPriorityIcon(ticket.priority)}
        {groupBy !== 'status' && getStatusIcon(ticket.status)}
        <span className="kanban-card-tag">
          Feature Request
        </span>
      </div>
    </div>
  );
};

export default KanbanCard;