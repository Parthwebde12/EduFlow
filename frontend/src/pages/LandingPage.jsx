import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  GraduationCap,
  Menu,
  X,
  FileText,
  CheckSquare,
  BookOpen,
  TrendingUp,
  ArrowRight,
  LayoutDashboard,
  Plus,
  Upload,
  Calendar,
  Flame,
  Clock,
  Sparkles,
  ChevronRight,
  Moon,
  Sun,
  Stars
} from 'lucide-react';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <FileText className="w-6 h-6 text-red-500" />,
      title: 'Notes',
      description: 'Organize lecture notes and study material effortlessly.',
    },
    {
      icon: <CheckSquare className="w-6 h-6 text-orange-500" />,
      title: 'Tasks',
      description: 'Track assignments and deadlines with ease.',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      title: 'Resources',
      description: 'Store useful links and study resources in one place.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: 'Productivity',
      description: 'Monitor progress and stay focused throughout your semester.',
    },
  ];


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-red-500/30">

      {/* Background gradients similar to Login Page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl opacity-60 animate-fade-in" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-accent-100 dark:bg-accent-900/20 rounded-full blur-3xl opacity-60 animate-fade-in" />
      </div>

      {/* Navbar */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3 shadow-sm'
          : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-linear-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-md">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">EduFlow</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">About</a>
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
            <div>
              {/* Toggle theme button */}
              <button
                onClick={toggleTheme}
                className="
                  group
                  relative
                  flex
                  h-10 w-20
                  sm:h-11 sm:w-22
                  items-center
                  rounded-full
                  border border-white/20
                  bg-white/10
                  backdrop-blur-xl
                  p-1
                  shadow-lg
                  transition-all
                  duration-500
                  hover:scale-105
                  hover:shadow-cyan-500/20
                  dark:bg-white/5
                  overflow-hidden
                "
              >
                {/* Background Glow */}
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-500
                    ${isDark
                      ? "bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900"
                      : "bg-gradient-to-r from-white via-slate-100 to-cyan-100"
                    }
                  `}
                />

                {/* Floating Stars */}
                <Stars
                  className={`absolute right-3 h-3.5 w-3.5 text-white transition-all duration-500
                    ${isDark ? "opacity-100 rotate-0" : "opacity-0 rotate-180"}
                  `}
                />

                {/* Sliding Circle */}
                <div
                  className={`
                    absolute z-10
                    flex h-8 w-8
                    items-center 
                    justify-center
                    rounded-full
                    bg-white
                    shadow-md
                    transition-all
                    duration-500
                    ease-in-out
                    ${isDark ? "translate-x-10" : "translate-x-0"}
                  `}
                >
                  {isDark ? 
                    (<Moon className="h-4.5 w-4.5 text-slate-800 transition-transform duration-300 group-hover:rotate-12" />) 
                    : (<Sun className="h-4.5 w-4.5 text-amber-500 transition-transform duration-500 group-hover:rotate-180" />)
                  }
                </div>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg animate-fade-in">
            <div className="px-4 py-6 flex flex-col gap-4">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-800 dark:text-slate-200">Features</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-800 dark:text-slate-200">About</a>
              <hr className="border-slate-100 dark:border-slate-800 my-2" />
              <Link to="/login" className="text-base font-medium text-slate-800 dark:text-slate-200">Sign In</Link>
              <Link to="/register" className="btn-primary justify-center w-full mt-2">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 pt-32 pb-16">

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 md:pt-20 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl animate-slide-in-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
                The ultimate student workspace
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
                Your Student <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500">Productivity Hub</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-lg">
                Manage notes, resources, and tasks in one place so you can focus on learning instead of managing multiple apps.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary py-3 px-6 text-base shadow-red-500/25 hover:shadow-red-500/40 w-full sm:w-auto justify-center"
                >
                  Get Started <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-secondary py-3 px-6 text-base w-full sm:w-auto justify-center"
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Hero Illustration / Detailed Dashboard Preview */}
            <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl animate-scale-in flex items-center justify-center text-left">
              <div className="absolute inset-0 bg-linear-to-tr from-red-500/10 to-orange-500/10 dark:from-red-500/5 dark:to-orange-500/5 rounded-3xl transform rotate-3 scale-105 transition-transform duration-700 hover:rotate-6"></div>

              <div className="relative w-full h-full glass rounded-2xl border border-white/60 dark:border-slate-800/60 shadow-2xl flex overflow-hidden group bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl animate-tilt-glow">

                {/* Mock Sidebar */}
                <div className="hidden sm:flex w-48 lg:w-56 flex-col border-r border-slate-200/50 dark:border-slate-700/30 bg-white/50 dark:bg-slate-900/50 p-4">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-linear-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                      <GraduationCap className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">EduFlow</span>
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </div>
                    {['Notes', 'Tasks', 'Resources', 'Schedule'].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 text-sm font-medium rounded-lg">
                        <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded-sm"></div> {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center gap-3 px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800"></div>
                    <div className="flex-1">
                      <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded-full mb-1.5"></div>
                      <div className="h-2 w-10 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Mock Main Content */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  {/* Header */}
                  <div className="h-16 border-b border-slate-200/50 dark:border-slate-700/30 flex items-center justify-between px-6 bg-white/30 dark:bg-slate-900/30">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                    </div>
                  </div>

                  {/* Dashboard Body */}
                  <div className="flex-1 p-6 overflow-y-auto custom-scroll space-y-6">

                    {/* Hero Greeting */}
                    <div className="bg-linear-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group-hover:scale-[1.01] transition-transform duration-500">
                      <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-1">Good morning, Alex! 👋</h2>
                        <p className="text-white/80 text-sm flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> "The secret of getting ahead is getting started."
                        </p>
                      </div>
                      <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-10 -mr-10"></div>
                    </div>

                    {/* Quick Actions & Streak */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Actions */}
                      <div className="md:col-span-3 grid grid-cols-3 gap-3">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all group/card">
                          <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center group-hover/card:scale-110 transition-transform">
                            <Plus className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Create Note</span>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all group/card">
                          <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center group-hover/card:scale-110 transition-transform">
                            <CheckSquare className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Add Task</span>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all group/card">
                          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center group-hover/card:scale-110 transition-transform">
                            <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Upload</span>
                        </div>
                      </div>

                      {/* Study Streak */}
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-500/10 rounded-full blur-xl"></div>
                        <Flame className="w-8 h-8 text-orange-500 mb-1" />
                        <div className="text-xl font-bold text-slate-800 dark:text-white">5 Days</div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Study Streak</div>
                      </div>
                    </div>

                    {/* Bottom Split: Activity & Deadlines */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                      {/* Empty State / Recent Activity */}
                      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm p-5 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-sm text-slate-800 dark:text-white">Recent Activity</h3>
                          <ChevronRight className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                        </div>
                        {/* Empty State Mock */}
                        <div className="flex-1 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center p-6 text-center group-hover:border-slate-200 transition-colors">
                          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-3 shadow-inner">
                            <FileText className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                          </div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">It's quiet here...</p>
                          <p className="text-xs text-slate-500 mb-3">Your recent notes and uploads will appear here.</p>
                          <button className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer">
                            Create First Note
                          </button>
                        </div>
                      </div>

                      {/* Deadlines / Progress */}
                      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-sm text-slate-800 dark:text-white">Upcoming Deadlines</h3>
                          <Calendar className="w-4 h-4 text-slate-400" />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100/50 dark:border-slate-700/50 hover:border-orange-200 dark:hover:border-orange-900 transition-colors cursor-pointer">
                            <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Calculus Assignment</p>
                              <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mt-0.5">
                                <Clock className="w-3 h-3" /> Tomorrow, 11:59 PM
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100/50 dark:border-slate-700/50 hover:border-red-200 dark:hover:border-red-900 transition-colors cursor-pointer">
                            <div className="w-2 h-8 bg-red-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">History Essay Draft</p>
                              <div className="flex items-center gap-1 text-[10px] font-medium text-red-500 mt-0.5">
                                <Clock className="w-3 h-3" /> Today, 8:00 PM
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-slate-600 dark:text-slate-400">Weekly Progress</span>
                            <span className="text-red-500">65%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-linear-to-r from-red-500 to-orange-500 h-full rounded-full w-[65%]"></div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Floating decor */}
                <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-orange-400/20 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute -left-12 top-1/3 w-32 h-32 bg-red-400/20 blur-3xl rounded-full pointer-events-none"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Everything Students Need</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                A complete suite of tools designed specifically to help you manage your academic journey.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="card-hover p-6 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-slate-100 dark:border-slate-700">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why EduFlow Section */}
        <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 rounded-3xl transform -rotate-3 scale-105"></div>
              <div className="card p-8 relative glass border border-white/60 dark:border-slate-800 shadow-xl animate-tilt-glow">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <LayoutDashboard className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Unified Workspace</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Everything in one place</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Organize notes by subject', progress: '100%' },
                    { label: 'Track pending assignments', progress: '85%' },
                    { label: 'Save useful study links', progress: '92%' }
                  ].map((item, i) => (
                    <div key={i} className="group cursor-default">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000 ease-out group-hover:opacity-80"
                          style={{ width: item.progress }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Why Choose EduFlow?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                EduFlow combines note-taking, task management, and educational resources into one beautifully organized workspace, helping students stay productive and focused without the clutter of multiple applications.
              </p>
              <ul className="space-y-3">
                {[
                  'Eliminate app context switching',
                  'Clean, distraction-free interface',
                  'Built specifically for students'
                ].map((point, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden glass border border-slate-200/60 dark:border-slate-800/60 p-12 text-center shadow-xl">
            <div className="absolute inset-0 bg-linear-to-br from-red-500/5 via-orange-500/5 to-transparent"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Ready to organize your academic life?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                Create your free account today and start managing everything from one perfectly designed place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary py-3 px-8 text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-secondary py-3 px-8 text-base"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 z-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-xl text-slate-900 dark:text-white">EduFlow</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                Student Productivity Platform designed to help you manage notes, tasks, and resources all in one seamless experience.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-wider">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">Features</a></li>
                <li><a href="#about" className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">About</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-wider">Account</h4>
              <ul className="space-y-3">
                <li><Link to="/login" className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">Register</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} EduFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
