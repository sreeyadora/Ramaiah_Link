import React, { useState, useEffect } from 'react';
import { UserRole, User } from './types';
import { backend } from './services/mockBackend';
import { SkillAnalyzer } from './components/SkillAnalyzer';
import { AdminDashboard } from './components/AdminDashboard';
import { MentorshipBoard } from './components/MentorshipBoard';
import { ChatSystem } from './components/ChatSystem';
import { Forum } from './components/Forum';
import { VoiceSearch } from './components/VoiceSearch';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  GraduationCap, 
  MessageSquare,
  MessageCircle,
  Menu, 
  X,
  Building2
} from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize Data and User
  useEffect(() => {
    const init = async () => {
        backend.init();
        const users = await backend.getUsers();
        setCurrentUser(users[0]); // Default to first user
    };
    init();
  }, []);

  // Simple function to switch simulated users for the demo
  const switchUser = async (role: UserRole) => {
    const users = await backend.getUsers();
    const user = users.find(u => u.role === role);
    if (user) {
        setCurrentUser(user);
        setActiveTab('dashboard');
    }
  };

  if (!currentUser) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Loading Ramaiah Link...</div>;

  const renderContent = () => {
    if (activeTab === 'dashboard') {
        if (currentUser.role === UserRole.ADMIN) return <AdminDashboard />;
        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
                        <p className="opacity-90 mb-6">
                            {currentUser.role === UserRole.STUDENT 
                            ? "Ready to bridge the gap between academia and industry?" 
                            : "Thank you for guiding the next generation of innovators."}
                        </p>
                        <VoiceSearch onSearch={(q) => { setSearchQuery(q); alert(`Searching for: ${q}`); }} />
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 transform skew-x-12"></div>
                </div>
                
                {currentUser.role === UserRole.STUDENT && (
                    <SkillAnalyzer currentSkills={currentUser.skills} />
                )}
                
                <MentorshipBoard currentUser={currentUser} />
            </div>
        );
    }
    if (activeTab === 'mentorship') return <MentorshipBoard currentUser={currentUser} />;
    if (activeTab === 'chat') return <ChatSystem currentUser={currentUser} />;
    if (activeTab === 'forum') return <Forum currentUser={currentUser} />;
    if (activeTab === 'admin') return <AdminDashboard />;
    
    return <div className="text-center py-20 text-slate-400">Module under construction</div>;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col shadow-xl`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-1.5 rounded-lg">
                    <Building2 className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                    <h1 className="font-bold text-lg text-white tracking-tight leading-tight">RAMAIAH<br/>LINK</h1>
                </div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
            </button>
        </div>

        <nav className="p-4 space-y-1 flex-1">
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
            >
                <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            
            <button 
                onClick={() => setActiveTab('mentorship')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'mentorship' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
            >
                <Users className="w-5 h-5" /> Mentorship & Jobs
            </button>

            <button 
                onClick={() => setActiveTab('chat')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
            >
                <MessageSquare className="w-5 h-5" /> Direct Chat
            </button>

            <button 
                onClick={() => setActiveTab('forum')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'forum' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
            >
                <MessageCircle className="w-5 h-5" /> Student Forum
            </button>

            {currentUser.role === UserRole.ADMIN && (
                <button 
                    onClick={() => setActiveTab('admin')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'admin' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                    <GraduationCap className="w-5 h-5" /> Faculty Admin
                </button>
            )}
        </nav>

        <div className="p-4 bg-slate-950 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4 px-2">
                <img src={currentUser.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-blue-500" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
                </div>
            </div>
            
            {/* Role Switcher for Demo */}
            <div className="bg-slate-800 rounded-lg p-2">
                <p className="text-[10px] text-slate-400 mb-2 text-center uppercase font-bold tracking-wider">Demo: Switch Role</p>
                <div className="grid grid-cols-3 gap-1">
                    <button onClick={() => switchUser(UserRole.STUDENT)} className={`text-[10px] py-1.5 rounded font-medium transition ${currentUser.role === UserRole.STUDENT ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>Student</button>
                    <button onClick={() => switchUser(UserRole.ALUMNI)} className={`text-[10px] py-1.5 rounded font-medium transition ${currentUser.role === UserRole.ALUMNI ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>Alumni</button>
                    <button onClick={() => switchUser(UserRole.ADMIN)} className={`text-[10px] py-1.5 rounded font-medium transition ${currentUser.role === UserRole.ADMIN ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>Admin</button>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex md:hidden justify-between items-center sticky top-0 z-40 shadow-sm">
             <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-slate-800">RAMAIAH LINK</span>
             </div>
             <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600">
                <Menu className="w-6 h-6" />
             </button>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;