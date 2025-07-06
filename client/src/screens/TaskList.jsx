import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask, shareTask as shareTaskApi } from '../services/api';
import TaskTable from '../components/TaskTable';



const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Completed', value: 'complete' },
];
const DUE_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Due Today', value: 'today' },
  { label: 'Overdue', value: 'overdue' },
];
const PRIORITY_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

const TaskList = ({ hideTitle }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'medium' });
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dueFilter, setDueFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const TASKS_PER_PAGE = 5;
  const [shareTask, setShareTask] = useState(null);
  const [shareValue, setShareValue] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  // Share task handler
  const handleShare = (task) => {
    setShareTask(task);
    setShareValue('');
    setShareMsg('');
  };

  const submitShare = async (e) => {
    e.preventDefault();
    if (!shareValue) return;
    setShareLoading(true);
    setShareMsg('');
    try {
      const res = await shareTaskApi(shareTask._id, shareValue);
      setShareMsg('Task shared successfully!');
    } catch (err) {
      setShareMsg(err?.response?.data?.message || 'Failed to share');
    }
    setShareLoading(false);
  };


  const loadTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (dueFilter !== 'all') params.due = dueFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      const res = await fetchTasks(params);
      setTasks(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line
  }, [statusFilter, dueFilter, priorityFilter]);

  const handleToggle = async (task) => {
    await updateTask(task._id, { status: task.status === 'open' ? 'complete' : 'open' });
    loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks();
  };


  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    if (editTask) {
      await updateTask(editTask._id, newTask);
    } else {
      await createTask(newTask);
    }
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
    setShowModal(false);
    setEditTask(null);
    loadTasks();
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      priority: task.priority || 'medium',
    });
    setShowModal(true);
  };



  // Search logic only (filtering is now server-side)
  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * TASKS_PER_PAGE, currentPage * TASKS_PER_PAGE);

  return (
    <div className="task-list container-fluid mt-4">
      {!hideTitle && (
        <h2 className="display-5 fw-bold text-primary text-center mb-4 animate__animated animate__fadeInDown" style={{letterSpacing: 1}}>My Tasks</h2>
      )}

      {/* Tabs/Filters */}
      <div className="filters" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 32, marginBottom: 16, padding: '12px 0' }}>
        <span>Status:</span>
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            className={statusFilter === f.value ? 'active' : ''}
            onClick={() => setStatusFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
        <span>Due:</span>
        {DUE_FILTERS.map(f => (
          <button
            key={f.value}
            className={dueFilter === f.value ? 'active' : ''}
            onClick={() => setDueFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
        <span>Priority:</span>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          {PRIORITY_FILTERS.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginLeft: 16 }}
        />
      </div>

      {/* Floating Action Button */}
      <button
        className="fab"
        onClick={() => setShowModal(true)}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#1976d2',
          color: '#fff',
          fontSize: 32,
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        title="Add Task"
      >
        +
      </button>

      {/* Modal for Add/Edit Task */}
      {showModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
        }}
          onClick={() => { setShowModal(false); setEditTask(null); }}
        >
          <form
            className="add-task-form"
            onClick={e => e.stopPropagation()}
            onSubmit={handleAdd}
            style={{
              background: '#fff',
              padding: 24,
              borderRadius: 8,
              minWidth: 320,
              boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
            }}
          >
            <h3>{editTask ? 'Edit Task' : 'Add Task'}</h3>
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <select
              value={newTask.priority}
              onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" onClick={() => { setShowModal(false); setEditTask(null); }} style={{ background: '#eee' }}>Cancel</button>
              <button type="submit" style={{ background: '#1976d2', color: '#fff' }}>{editTask ? 'Update' : 'Add'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Custom floating add-task hint */}
      <div style={{
        position: 'fixed',
        right: 40,
        bottom: 120,
        zIndex: 1200,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}>
        <span className="animate__animated animate__fadeInUp" style={{
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          padding: '12px 28px',
          borderRadius: 22,
          fontWeight: 600,
          fontSize: 20,
          marginBottom: 8,
          letterSpacing: 1,
          boxShadow: '0 2px 12px rgba(0,0,0,0.22)',
          pointerEvents: 'auto',
          transition: 'all 0.3s',
        }}>
          click here to add a task..!!
        </span>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : filteredTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <>
          <TaskTable tasks={paginatedTasks} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} onShare={handleShare} />
          {/* Share Modal */}
          {shareTask && (
            <div className="modal-overlay" style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
              onClick={() => setShareTask(null)}
            >
              <form
                className="add-task-form"
                onClick={e => e.stopPropagation()}
                onSubmit={submitShare}
                style={{
                  background: '#fff',
                  padding: 24,
                  borderRadius: 8,
                  minWidth: 320,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <h4>Share Task: <span style={{ color: '#1976d2' }}>{shareTask.title}</span></h4>
                <input
                  type="email"
                  placeholder="Enter user's email"
                  value={shareValue}
                  onChange={e => setShareValue(e.target.value)}
                  required
                  style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button type="button" onClick={() => setShareTask(null)} style={{ background: '#eee' }}>Cancel</button>
                  <button type="submit" style={{ background: '#1976d2', color: '#fff' }} disabled={shareLoading}>{shareLoading ? 'Sharing...' : 'Share'}</button>
                </div>
                {shareMsg && <div style={{ color: shareMsg.includes('success') ? 'green' : 'red', marginTop: 8 }}>{shareMsg}</div>}
              </form>
            </div>
          )}
          {totalPages > 1 && (
            <nav aria-label="Task pagination" className="d-flex justify-content-center mt-3">
              <ul className="pagination">
                <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i + 1} className={`page-item${currentPage === i + 1 ? ' active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;
