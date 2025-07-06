import React from 'react';

const TaskItem = ({ task, onToggle, onDelete }) => (
  <div className={`task-item ${task.status === 'complete' ? 'completed' : ''}`}> 
    <div>
      <input
        type="checkbox"
        checked={task.status === 'complete'}
        onChange={() => onToggle(task)}
      />
      <span>{task.title}</span>
      <span className="priority">[{task.priority}]</span>
      <span className="due-date">{task.dueDate && new Date(task.dueDate).toLocaleDateString()}</span>
    </div>
    <button onClick={() => onDelete(task._id)}>Delete</button>
  </div>
);

export default TaskItem;
