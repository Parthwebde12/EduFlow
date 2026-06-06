import  { useState, useEffect } from 'react';
import { FileText, BookOpen, CheckSquare, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/Authcontext';
import api from '../services/api';
import StatCard from '../components/ui/Statcard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { format, isPast, isToday } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const { stats, recentActivity } = data || {};

  const priorityColors = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
    urgent: 'priority-urgent'
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-linear-to-r from-primary-600 to-accent-600 rounded-2xl p-6 text-black shadow-lg">
        <h2 className="font-display text-2xl font-bold mb-1">
          {getGreeting()}, {user?.name?.split(' ')[0]}! 
        </h2>
        <p className="opacity-90 text-sm">
          {stats?.pendingTasks > 0
            ? `You have ${stats.pendingTasks} pending task${stats.pendingTasks > 1 ? 's' : ''} , let's crush it!`
            : 'All tasks complete! Great work today.'}
        </p>
        {stats?.taskCompletionRate > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Task completion rate</span>
              <span>{stats.taskCompletionRate}%</span>
            </div>
            <div className="w-full bg-red/40 rounded-full h-2">
              <div
                className=" rounded-full h-2 transition-all duration-500 bg-red-400"
                style={{ width: `${stats.taskCompletionRate}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Notes"
          value={stats?.totalNotes ?? 0}
          icon={FileText}
          color="blue"
          subtitle="Uploaded files"
        />
        <StatCard
          title="Resources"
          value={stats?.totalResources ?? 0}
          icon={BookOpen}
          color="purple"
          subtitle="Shared materials"
        />
        <StatCard
          title="Tasks Done"
          value={`${stats?.completedTasks ?? 0}/${stats?.totalTasks ?? 0}`}
          icon={CheckSquare}
          color="green"
          subtitle={`${stats?.pendingTasks ?? 0} remaining`}
        />
        <StatCard
          title="Completion Rate"
          value={`${stats?.taskCompletionRate ?? 0}%`}
          icon={TrendingUp}
          color="orange"
          subtitle="Overall progress"
        />
      </div>

      {stats?.totalTasks > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Task Overview</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">{stats.tasksByStatus.todo}</div>
              <div className="text-xs text-slate-500 mt-0.5">To Do</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.tasksByStatus.inProgress}</div>
              <div className="text-xs text-slate-500 mt-0.5">In Progress</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.tasksByStatus.done}</div>
              <div className="text-xs text-slate-500 mt-0.5">Completed</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-primary-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Notes</h3>
          </div>
          {recentActivity?.notes?.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.notes.map(note => (
                <div key={note._id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{note.title}</p>
                    <p className="text-xs text-slate-400">{note.subject}</p>
                  </div>
                  <div className="text-xs text-slate-400 shrink-0">
                    {format(new Date(note.createdAt), 'MMM d')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">No notes yet. Upload your first note!</p>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-accent-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Upcoming Tasks</h3>
          </div>
          {recentActivity?.upcomingTasks?.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.upcomingTasks.map(task => (
                <div key={task._id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="w-8 h-8 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center shrink-0">
                    <CheckSquare size={14} className="text-accent-600 dark:text-accent-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{task.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`badge ${priorityColors[task.priority]}`}>{task.priority}</span>
                    </div>
                  </div>
                  {task.dueDate && (
                    <div className={`text-xs shrink-0 flex items-center gap-1 ${
                      isToday(new Date(task.dueDate))
                        ? 'text-orange-500 font-medium'
                        : isPast(new Date(task.dueDate))
                        ? 'text-red-500'
                        : 'text-slate-400'
                    }`}>
                      {isToday(new Date(task.dueDate)) && <AlertCircle size={12} />}
                      {format(new Date(task.dueDate), 'MMM d')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">No upcoming tasks this week!</p>
          )}
        </div>
      </div>
    </div>
  );
}
