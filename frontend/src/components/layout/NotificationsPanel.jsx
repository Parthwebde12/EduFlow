import { useEffect, useRef } from 'react';
import { Check, Trash2, Bell, CheckCircle2 } from 'lucide-react';
import { markAsRead, markAllAsRead, deleteNotification } from '../../services/notifications';

const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

export default function NotificationsPanel({ onClose, notifications, setNotifications }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const onMarkAsRead = async (id) => {
    markAsRead(id)
      .then(() => {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif._id === id ? { ...notif, isRead: true } : notif
          )
        );
      })
      .catch((error) => {
        console.error('Error marking notification as read:', error);
      });
  };

  const onMarkAllRead = async () => {
    markAllAsRead()
      .then(() => {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) => ({ ...notif, isRead: true }))
        );
      })
      .catch((error) => {
        console.error('Error marking all notifications as read:', error);
      });   
  };

  const onDelete = async (id) => {
    deleteNotification(id)
      .then(() => {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notif) => notif._id !== id)
        );
      })
      .catch((error) => {
        console.error('Error deleting notification:', error);
      });
  };

  return (
    <div 
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-red-950 rounded-xl shadow-2xl z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-red-950/50">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Bell size={16} /> Notifications
        </h3>
        {notifications.length > 0 && (
          <button 
            onClick={onMarkAllRead}
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <CheckCircle2 size={14} /> Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-[24rem] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <p>You're all caught up!</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-red-950/30">
            {notifications.map((notif) => (
              <li 
                key={notif._id}
                className={`p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 group ${
                  !notif.isRead ? 'bg-slate-50/80 dark:bg-slate-800/80' : ''
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <h4 className={`text-sm font-semibold ${!notif.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {notif.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notif.isRead && (
                      <button 
                        onClick={() => onMarkAsRead(notif._id)} 
                        className="text-slate-400 hover:text-blue-500 transition-colors p-1" 
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => onDelete(notif._id)} 
                      className="text-slate-400 hover:text-red-500 transition-colors p-1" 
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}