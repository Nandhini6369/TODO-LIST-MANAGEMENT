import React from 'react';
import '../action-buttons.css';



const TaskTable = ({ tasks, onToggle, onDelete, onEdit, onShare }) => (
  <div className="table-responsive animate__animated animate__fadeInUp d-flex flex-row justify-content-center align-items-start gap-4">
    <table className="table table-hover align-middle shadow-sm rounded bg-white flex-fill" style={{ border: '2px solid #111', maxWidth: '900px', minWidth: '600px' }}>
      <thead className="table-primary" style={{ borderBottom: '2px solid #111' }}>
        <tr>
          <th>Status</th>
          <th>Title</th>
          <th>Description</th>
          <th>Due Date</th>
          <th>Priority</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody style={{ borderTop: '2px solid #111' }}>
        {tasks.map(task => (
          <tr key={task._id} className={task.status === 'complete' ? 'table-success' : ''} style={{ borderBottom: '1.5px solid #111' }}>
            <td className="text-center">
              <input
                type="checkbox"
                checked={task.status === 'complete'}
                onChange={() => onToggle(task)}
                className="form-check-input"
              />
            </td>
            <td className="fw-bold">{task.title}</td>
            <td>{task.description}</td>
            <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</td>
            <td>
              <span className={`badge px-3 py-2 ${task.priority === 'high' ? 'bg-danger' : task.priority === 'medium' ? 'bg-warning text-dark' : 'bg-success'}`}
                style={{ fontSize: '1em', textTransform: 'capitalize', letterSpacing: 1 }}>
                {task.priority}
              </span>
            </td>
            <td>
              <div className="action-buttons">
                <button onClick={() => onEdit(task)} className="btn btn-info btn-sm animate__animated animate__pulse animate__faster">Edit</button>
                <button onClick={() => onDelete(task._id)} className="btn btn-danger btn-sm animate__animated animate__shakeX animate__faster">Delete</button>
                <button onClick={() => onShare(task)} className="btn btn-dark btn-sm animate__animated animate__fadeIn">Share</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TaskTable;
