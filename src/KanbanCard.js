import React from 'react';
import { HighPriorityIcon, LowPriorityIcon, MediumPriorityIcon, UrgentPriorityIcon, NoPriorityIcon } from './assets/icons';

const KanbanCard = ({ ticket, user }) => {
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

  return (
    <div className="kanban-card">
      <div className="kanban-card-header">
        <span className="kanban-card-id">{ticket.id}</span>
        <div className="kanban-card-avatar" style={{backgroundColor: user?.color || '#ccc'}}>
          {user ? getInitials(user.name) : '?'}
        </div>
      </div>
      <h4 className="kanban-card-title">{ticket.title}</h4>
      <div className="kanban-card-footer">
        {getPriorityIcon(ticket.priority)}
        <span className="kanban-card-tag">
          Feature Request
        </span>
      </div>
    </div>
  );
};

export default KanbanCard;