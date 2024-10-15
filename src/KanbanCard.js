import React from 'react';

const KanbanCard = ({ ticket, user }) => {
  return (
    <div className="kanban-card">
      <h4>{ticket.title}</h4>
      <p>Priority: {ticket.priority}</p>
      <p>User: {user.name || "Unknown"}</p>
      <p>Status: {ticket.status}</p>
    </div>
  );
};

export default KanbanCard;