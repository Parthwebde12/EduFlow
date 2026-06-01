// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || '/api',
//   headers: { 'Content-Type': 'application/json' }
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('studysync_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('studysync_token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));


//added mock data tp understand UI and debugg it

const mockUser = {
  _id: '1',
  name: 'Alex Johnson',
  email: 'alex@university.edu',
  college: 'MIT',
  bio: 'Computer Science student',
  skills: ['React', 'Python', 'Data Structures'],
  profilePhoto: null,
};

const api = {
  get: async (url) => {
    await delay();

    if (url === '/auth/me') {
      return { data: { user: mockUser } };
    }

    if (url === '/dashboard') {
      return {
        data: {
          stats: {
            totalNotes: 4,
            totalResources: 6,
            completedTasks: 3,
            totalTasks: 7,
            pendingTasks: 4,
            taskCompletionRate: 43,
            tasksByStatus: { todo: 2, inProgress: 2, done: 3 },
          },
          recentActivity: {
            notes: [
              { _id: '1', title: 'Calculus Notes',    subject: 'Mathematics', createdAt: new Date() },
              { _id: '2', title: 'OS Concepts',       subject: 'CS301',       createdAt: new Date() },
              { _id: '3', title: 'Linear Algebra',    subject: 'Mathematics', createdAt: new Date() },
            ],
            upcomingTasks: [
              { _id: '1', title: 'Assignment 3',   priority: 'high',   dueDate: new Date().toISOString(), status: 'todo' },
              { _id: '2', title: 'Study for quiz', priority: 'urgent', dueDate: new Date().toISOString(), status: 'todo' },
            ],
          },
        },
      };
    }

    if (url === '/notes') {
      return {
        data: {
          notes: [
            { _id: '1', title: 'Calculus Chapter 3', subject: 'Mathematics', description: 'Derivatives and integrals', tags: ['exam', 'calculus'], file: { fileType: 'pdf', size: 204800, url: '#' }, downloads: 5, createdAt: new Date() },
            { _id: '2', title: 'OS Lecture Slides',  subject: 'CS301',       description: 'Process scheduling',       tags: ['lecture'],           file: { fileType: 'pdf', size: 512000, url: '#' }, downloads: 2, createdAt: new Date() },
            { _id: '3', title: 'Graph Theory',       subject: 'Mathematics', description: 'BFS and DFS algorithms',   tags: ['graphs', 'exam'],    file: { fileType: 'image', size: 102400, url: '#' }, downloads: 8, createdAt: new Date() },
          ],
        },
      };
    }

    if (url === '/resources') {
      return {
        data: {
          resources: [
            { _id: '1', title: 'MIT OpenCourseWare',  subject: 'Mathematics', category: 'Websites',   description: 'Free MIT courses online',       tags: ['free', 'online'], resourceType: 'link', link: 'https://ocw.mit.edu', likes: [],    owner: mockUser, createdAt: new Date() },
            { _id: '2', title: 'CLRS Algorithm Book', subject: 'CS',          category: 'Textbooks',  description: 'Classic algorithms textbook',   tags: ['algorithms'],     resourceType: 'link', link: '#',                  likes: ['1'], owner: mockUser, createdAt: new Date() },
            { _id: '3', title: 'Khan Academy',        subject: 'General',     category: 'Videos',     description: 'Free video lessons on any topic', tags: ['free', 'video'], resourceType: 'link', link: 'https://khanacademy.org', likes: ['1', '2'], owner: mockUser, createdAt: new Date() },
          ],
        },
      };
    }

    if (url === '/tasks') {
      return {
        data: {
          tasks: [
            { _id: '1', title: 'Read Chapter 5',      subject: 'Algorithms',  priority: 'high',   status: 'todo',        dueDate: new Date().toISOString(), description: 'Focus on dynamic programming' },
            { _id: '2', title: 'Complete Lab 3',      subject: 'OS',          priority: 'urgent', status: 'in-progress', dueDate: new Date().toISOString(), description: 'Memory management section' },
            { _id: '3', title: 'Submit Assignment',   subject: 'Mathematics', priority: 'medium', status: 'done',        dueDate: null,                     description: '' },
            { _id: '4', title: 'Revise Graph Theory', subject: 'CS',          priority: 'low',    status: 'todo',        dueDate: null,                     description: 'BFS, DFS, Dijkstra' },
          ],
        },
      };
    }

    return { data: {} };
  },

  post: async (url, data) => {
    await delay();

    if (url === '/auth/login' || url === '/auth/register') {
      localStorage.setItem('studysync_token', 'mock-token-123');
      return {
        data: {
          token: 'mock-token-123',
          user: {
            ...mockUser,
            name:  data?.name  || mockUser.name,
            email: data?.email || mockUser.email,
          },
          message: url.includes('register') ? 'Account created!' : 'Welcome back!',
        },
      };
    }

    if (url.includes('/download')) {
      return { data: { downloadUrl: '#' } };
    }

    if (url.includes('/like')) {
      return { data: { liked: true } };
    }

    if (url === '/notes') {
      return {
        data: {
          message: 'Note uploaded!',
          note: {
            _id: Date.now().toString(),
            title:       data?.get?.('title')       || 'Untitled',
            subject:     data?.get?.('subject')     || 'General',
            description: data?.get?.('description') || '',
            tags: [],
            file: { fileType: 'pdf', size: 100000, url: '#' },
            downloads: 0,
            createdAt: new Date(),
          },
        },
      };
    }

    if (url === '/resources') {
      return {
        data: {
          message: 'Resource shared!',
          resource: {
            _id: Date.now().toString(),
            title:        data?.get?.('title')       || 'Untitled',
            subject:      data?.get?.('subject')     || 'General',
            description:  data?.get?.('description') || '',
            category:     data?.get?.('category')    || 'Other',
            resourceType: data?.get?.('resourceType') || 'link',
            link:         data?.get?.('link')        || '#',
            tags: [],
            likes: [],
            owner: mockUser,
            createdAt: new Date(),
          },
        },
      };
    }

    if (url === '/tasks') {
      return {
        data: {
          message: 'Task created!',
          task: {
            _id: Date.now().toString(),
            ...data,
            createdAt: new Date(),
          },
        },
      };
    }

    return { data: {} };
  },

  put: async (url, data) => {
    await delay();

    if (url === '/users/profile') {
      return { data: { user: { ...mockUser, ...data } } };
    }

    if (url === '/users/profile/photo') {
      return { data: { user: { ...mockUser } } };
    }

    if (url === '/users/password') {
      return { data: { message: 'Password changed!' } };
    }

    if (url.includes('/tasks/')) {
      const id = url.split('/tasks/')[1];
      return { data: { task: { _id: id, ...data } } };
    }

    if (url.includes('/notes/')) {
      const id = url.split('/notes/')[1];
      return { data: { note: { _id: id, ...data } } };
    }

    return { data: {} };
  },

  delete: async () => {
    await delay();
    return { data: { message: 'Deleted successfully' } };
  },
};

export default api;