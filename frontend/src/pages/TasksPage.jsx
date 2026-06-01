import { useState, useEffect } from 'react';
import {
  Plus, CheckSquare, AlertCircle,
  Trash2, Edit2, Check,
} from 'lucide-react';
import { tasksService } from '../services/tasks';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { format, isPast, isToday } from 'date-fns';

const STATUSES = ['todo', 'in-progress', 'done'];
const STATUS_LABELS = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const priorityClasses = {
  low: 'priority-low',
  medium: 'priority-medium',
  high: 'priority-high',
  urgent: 'priority-urgent',
};

function TaskCard({ task, onEdit, onDelete, onStatusToggle, listView }) {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';
  const dueSoon   = task.dueDate && isToday(new Date(task.dueDate));

  return (
    <div
      className={`
        bg-white dark:bg-slate-800 rounded-xl p-3.5
        border border-slate-100 dark:border-slate-700
        hover:shadow-sm transition-all
        ${task.status === 'done' ? 'opacity-70' : ''}
        ${listView ? 'flex items-center gap-3' : ''}
      `}
    >
      <button
        onClick={() => onStatusToggle(task)}
        title="Toggle status"
        className={`
          shrink-0 ${listView ? '' : 'mb-2'}
          w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
          ${task.status === 'done'
            ? 'bg-green-500 border-green-500'
            : task.status === 'in-progress'
            ? 'border-blue-400'
            : 'border-slate-300 dark:border-slate-600'}
        `}
      >
        {task.status === 'done' && <Check size={11} className="text-white" />}
        {task.status === 'in-progress' && (
          <div className="w-2 h-2 rounded-full bg-blue-400" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            task.status === 'done'
              ? 'line-through text-slate-400 dark:text-slate-500'
              : 'text-slate-800 dark:text-slate-200'
          }`}
        >
          {task.title}
        </p>

        {task.description && !listView && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <span className={`badge ${priorityClasses[task.priority]}`}>
            {task.priority}
          </span>

          {task.subject && (
            <span className="badge bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
              {task.subject}
            </span>
          )}

          {task.dueDate && (
            <span
              className={`badge flex items-center gap-0.5 ${
                isOverdue
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : dueSoon
                  ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
              }`}
            >
              {isOverdue && <AlertCircle size={10} />}
              {format(new Date(task.dueDate), 'MMM d')}
            </span>
          )}
        </div>
      </div>

      <div
        className={`flex items-center gap-1 ${
          listView ? '' : 'mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50'
        }`}
      >
        <button
          onClick={() => onEdit(task)}
          className="btn-ghost p-1.5 text-slate-400 hover:text-slate-600"
        >
          <Edit2 size={13} />
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="btn-ghost p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [modal, setModal]               = useState(false);
  const [editTask, setEditTask]         = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium',
    status: 'todo', dueDate: '', subject: '',
  });

  useEffect(() => {
    let cancelled = false;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const params = activeFilter !== 'all' ? { status: activeFilter } : {};
        const res = await tasksService.getAll(params);
        if (!cancelled) setTasks(res.data.tasks);
      } catch {
        if (!cancelled) toast.error('Failed to load tasks');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTasks();
    return () => { cancelled = true; };
  }, [activeFilter]);

  const openCreate = () => {
    setEditTask(null);
    setForm({ title: '', description: '', priority: 'medium', status: 'todo', dueDate: '', subject: '' });
    setModal(true);
  };

  const openEdit = (task) => {
    setEditTask(task);
    setForm({
      title:       task.title,
      description: task.description || '',
      priority:    task.priority,
      status:      task.status,
      dueDate:     task.dueDate ? task.dueDate.substring(0, 10) : '',
      subject:     task.subject || '',
    });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editTask) {
        const res = await tasksService.update(editTask._id, form);
        toast.success('Task updated!');
        setTasks(prev => prev.map(t => t._id === editTask._id ? res.data.task : t));
      } else {
        const res = await tasksService.create(form);
        toast.success('Task created!');
        setTasks(prev => [res.data.task, ...prev]);
      }
      setModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = async (task) => {
    const nextStatus =
      task.status === 'done' ? 'todo' :
      task.status === 'todo' ? 'in-progress' : 'done';
    try {
      await tasksService.update(task._id, { status: nextStatus });
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: nextStatus } : t));
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteRequest = (id) => setConfirmDeleteId(id);

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;
    try {
      await tasksService.delete(confirmDeleteId);
      toast.success('Task deleted');
      setTasks(prev => prev.filter(t => t._id !== confirmDeleteId));
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const tasksByStatus = STATUSES.reduce((acc, s) => {
    acc[s] = tasks.filter(t => t.status === s);
    return acc;
  }, {});

  const countFor = (s) => s === 'all' ? tasks.length : tasksByStatus[s]?.length ?? 0;

  return (
    <div className="space-y-5 max-w-7xl">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Task Manager</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tasks.filter(t => t.status === 'done').length}/{tasks.length} tasks completed
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setActiveFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeFilter === s
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {s === 'all' ? 'All Tasks' : STATUS_LABELS[s]}
            <span className="ml-1.5 text-xs opacity-70">{countFor(s)}</span>
          </button>
        ))}
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner size="lg" />
        </div>

      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Create your first task to start tracking your study progress."
          action={
            <button onClick={openCreate} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Create Task
            </button>
          }
        />

      ) : activeFilter === 'all' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATUSES.map(status => (
            <div key={status} className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {STATUS_LABELS[status]}
                </h3>
                <span className="text-xs bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                  {tasksByStatus[status].length}
                </span>
              </div>
              <div className="space-y-2">
                {tasksByStatus[status].length === 0 ? (
                  <div className="text-center py-6 text-sm text-slate-400">Empty</div>
                ) : (
                  tasksByStatus[status].map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={openEdit}
                      onDelete={handleDeleteRequest}
                      onStatusToggle={handleStatusToggle}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={openEdit}
              onDelete={handleDeleteRequest}
              onStatusToggle={handleStatusToggle}
              listView
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modal}
        onClose={() => setModal(false)}
        title={editTask ? 'Edit Task' : 'New Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input
              className="input"
              placeholder="e.g. Read Chapter 5 — Algorithms"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="label">Subject</label>
            <input
              className="input"
              placeholder="e.g. Data Structures"
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Additional details..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Priority</label>
              <select
                className="input"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Due Date</label>
            <input
              type="date"
              className="input"
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {submitting
                ? <LoadingSpinner size="sm" />
                : editTask ? 'Save Changes' : 'Create Task'
              }
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Delete Task"
        size="sm"
      >
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
          Are you sure you want to delete this task? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setConfirmDeleteId(null)}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>

    </div>
  );
}