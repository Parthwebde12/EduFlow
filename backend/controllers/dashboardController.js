const Note = require('../models/Note');
const Resource = require('../models/Resource');
const Task = require('../models/Task');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const [totalNotes, totalResources, totalTasks, completedTasks, recentNotes, recentTasks, tasksByStatus, upcomingTasks] = await Promise.all([
      Note.countDocuments({ owner: userId }),
      Resource.countDocuments({ owner: userId }),
      Task.countDocuments({ owner: userId }),
      Task.countDocuments({ owner: userId, status: 'done' }),
      Note.find({ owner: userId }).sort({ createdAt: -1 }).limit(5),
      Task.find({ owner: userId }).sort({ createdAt: -1 }).limit(5),
      Task.aggregate([{ $match: { owner: userId } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Task.find({ owner: userId, status: { $ne: 'done' }, dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } }).sort({ dueDate: 1 }).limit(5)
    ]);
    const statusMap = {};
    tasksByStatus.forEach(s => { statusMap[s._id] = s.count; });
    res.json({
      success: true,
      stats: {
        totalNotes, totalResources, totalTasks, completedTasks,
        pendingTasks: totalTasks - completedTasks,
        taskCompletionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
        tasksByStatus: { todo: statusMap['todo'] || 0, inProgress: statusMap['in-progress'] || 0, done: statusMap['done'] || 0 }
      },
      recentActivity: { notes: recentNotes, tasks: recentTasks, upcomingTasks }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data.' });
  }
};

module.exports = { getDashboard };