import { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Wand2, Mic, Video, Users, Image, FileText, Film, Settings,
  Search, Bell, ChevronLeft, ChevronRight, Menu, X, Plus, Download, Play,
  Pause, RefreshCw, Check, Loader2, Upload, History, Crop, Eraser, ZoomIn,
  Sparkles, Palette, Type, Music, Volume2, Instagram, Youtube, Twitter,
  CreditCard, Shield, User, LogOut, ChevronDown, CheckCircle2, Circle,
  AlertCircle, Star, TrendingUp, FolderOpen, Link2, FileAudio, Gauge, Smile,
  Zap, Briefcase, Camera, Box
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar,
  CartesianGrid, Legend
} from 'recharts';

// ====================== TYPES & MOCK DATA ======================
interface Project {
  id: string;
  title: string;
  thumbnail: string;
  status: 'Selesai' | 'Diproses' | 'Draft';
  duration: string;
  updatedAt: string;
  type: string;
}

interface Voice {
  id: string;
  name: string;
  language: string;
  accent: string;
  gender: 'Male' | 'Female';
  previewUrl?: string;
  avatarColor: string;
}

interface Template {
  id: string;
  title: string;
  image: string;
  category: string;
  usageCount: number;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const mockProjects: Project[] = [
  { id: '1', title: 'Review Serum Glowing - TikTok', thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop', status: 'Selesai', duration: '0:45', updatedAt: '2 jam lalu', type: 'UGC Video' },
  { id: '2', title: 'Iklan Native Kopi Nusantara', thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop', status: 'Diproses', duration: '1:20', updatedAt: '5 jam lalu', type: 'Video Generator' },
  { id: '3', title: 'Voice Over Explainer Produk', thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=200&fit=crop', status: 'Draft', duration: '0:30', updatedAt: '1 hari lalu', type: 'Voice Over' },
  { id: '4', title: 'Lipsync Testimoni Skincare', thumbnail: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=300&h=200&fit=crop', status: 'Selesai', duration: '0:52', updatedAt: '2 hari lalu', type: 'Lipsync' },
  { id: '5', title: 'Foto Produk Background AI', thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop', status: 'Selesai', duration: '-', updatedAt: '3 hari lalu', type: 'Image Edit' },
  { id: '6', title: 'Skrip Iklan Storytelling', thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop', status: 'Draft', duration: '2 hal', updatedAt: '4 hari lalu', type: 'Script' },
];

const mockVoices: Voice[] = [
  { id: 'v1', name: 'Aruna', language: 'Indonesia', accent: 'Jakarta', gender: 'Female', avatarColor: '#8B5CF6' },
  { id: 'v2', name: 'Bima', language: 'Indonesia', accent: 'Sunda', gender: 'Male', avatarColor: '#06B6D4' },
  { id: 'v3', name: 'Citra', language: 'Indonesia', accent: 'Jawa', gender: 'Female', avatarColor: '#EC4899' },
  { id: 'v4', name: 'Dimas', language: 'English', accent: 'American', gender: 'Male', avatarColor: '#F59E0B' },
  { id: 'v5', name: 'Erika', language: 'English', accent: 'British', gender: 'Female', avatarColor: '#10B981' },
  { id: 'v6', name: 'Farhan', language: 'Indonesia', accent: 'Batak', gender: 'Male', avatarColor: '#3B82F6' },
  { id: 'v7', name: 'Gita', language: 'Indonesia', accent: 'Bali', gender: 'Female', avatarColor: '#EF4444' },
  { id: 'v8', name: 'Hiro', language: 'Japanese', accent: 'Tokyo', gender: 'Male', avatarColor: '#8B5CF6' },
];

const mockTemplates: Template[] = [
  { id: 't1', title: 'UGC Review Produk', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=200&fit=crop', category: 'UGC', usageCount: 12893 },
  { id: 't2', title: 'Iklan Storytelling', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop', category: 'Video', usageCount: 9842 },
  { id: 't3', title: 'Voice Over Energik', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=200&fit=crop', category: 'Audio', usageCount: 7561 },
  { id: 't4', title: 'Lipsync Testimoni', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop', category: 'Lipsync', usageCount: 6234 },
  { id: 't5', title: 'Foto Produk AI', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop', category: 'Image', usageCount: 5120 },
];

const activityData = [
  { day: 'Sen', generates: 42 },
  { day: 'Sel', generates: 65 },
  { day: 'Rab', generates: 38 },
  { day: 'Kam', generates: 78 },
  { day: 'Jum', generates: 95 },
  { day: 'Sab', generates: 55 },
  { day: 'Min', generates: 70 },
];

const monthlyData = [
  { day: '1', video: 12, audio: 8, image: 5 },
  { day: '5', video: 18, audio: 10, image: 7 },
  { day: '10', video: 15, audio: 12, image: 9 },
  { day: '15', video: 25, audio: 15, image: 11 },
  { day: '20', video: 30, audio: 18, image: 14 },
  { day: '25', video: 28, audio: 20, image: 16 },
  { day: '30', video: 35, audio: 22, image: 18 },
];

// ====================== CONTEXT ======================
interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

const useToast = () => useContext(ToastContext);

// ====================== UTILITY COMPONENTS ======================
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`skeleton ${className || ''}`} />
);

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: { icon: any, title: string, description: string, actionLabel?: string, onAction?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-20 h-20 rounded-full bg-gradient-primary-soft flex items-center justify-center mb-6">
      <Icon size={36} className="text-primary-light" />
    </div>
    <h3 className="text-xl font-semibold text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-400 max-w-md mb-6">{description}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="btn-primary flex items-center gap-2">
        <Plus size={18} /> {actionLabel}
      </button>
    )}
  </div>
);

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-surface-700 rounded-full h-2 overflow-hidden">
    <div
      className="h-full bg-gradient-primary transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const StatusBadge = ({ status }: { status: Project['status'] }) => {
  const styles = {
    'Selesai': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Diproses': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Draft': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
  const icons = {
    'Selesai': <Check size={12} />,
    'Diproses': <Loader2 size={12} className="animate-spin" />,
    'Draft': <Circle size={12} />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  );
};

// ====================== LAYOUT COMPONENTS ======================
interface SidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar = ({ collapsed, toggleCollapse }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/ugc-tool', label: 'UGC Tool', icon: Users },
    { path: '/voice-over', label: 'Voice Over Tool', icon: Mic },
    { path: '/video-generator', label: 'Video Generator', icon: Video },
    { path: '/lipsync-studio', label: 'Lipsync Studio', icon: Wand2 },
    { path: '/image-editing', label: 'Image Editing', icon: Image },
    { path: '/script-generator', label: 'Script Generator', icon: FileText },
    { path: '/filmmaker', label: 'Filmmaker', icon: Film },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-surface-900 border-r border-surface-700 transition-all duration-300 z-50 ${collapsed ? 'w-16' : 'w-60'}`}>
      <div className="flex items-center justify-between p-4 border-b border-surface-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary-light to-accent-light bg-clip-text text-transparent">
              CreatorForge
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 mx-auto rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className="p-1 rounded-lg hover:bg-surface-700 text-gray-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="py-4 px-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-gradient-primary-soft text-primary-light' : 'text-gray-400 hover:bg-surface-700 hover:text-gray-200'}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
              {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </nav>

      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-surface-700 ${collapsed ? 'text-center' : ''}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
            AK
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">Andi Kurniawan</p>
              <p className="text-xs text-gray-500">Pro Plan</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

interface TopbarProps {
  collapsed: boolean;
  onMenuClick: () => void;
}

const Topbar = ({ collapsed, onMenuClick }: TopbarProps) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { showToast } = useToast();

  const notifications = [
    { id: 1, title: 'Render video selesai', desc: 'Review Serum Glowing - TikTok', time: '2 menit lalu', unread: true },
    { id: 2, title: 'Kredit AI hampir habis', desc: 'Sisa 120 kredit dari 500', time: '1 jam lalu', unread: true },
    { id: 3, title: 'Template baru tersedia', desc: 'UGC Review Produk v2', time: '3 jam lalu', unread: false },
  ];

  return (
    <header className="fixed top-0 right-0 left-0 z-40 glass border-b border-surface-700" style={{ marginLeft: collapsed ? '64px' : '240px' }}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-surface-700 text-gray-400">
            <Menu size={20} />
          </button>
          <div className="relative hidden md:block w-80">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Cari project, template, atau tool..."
              className="input-field pl-10 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-lg hover:bg-surface-700 text-gray-400 hover:text-white relative"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 card p-2 z-50">
                <div className="flex items-center justify-between px-3 py-2 border-b border-surface-700">
                  <h3 className="font-medium text-gray-200">Notifikasi</h3>
                  <button className="text-xs text-primary-light hover:text-primary">Tandai semua dibaca</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3 rounded-lg hover:bg-surface-700 cursor-pointer ${n.unread ? 'bg-surface-800' : ''}`}>
                      <div className="flex items-start gap-2">
                        {n.unread && <div className="w-2 h-2 mt-1.5 rounded-full bg-primary flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-200">{n.title}</p>
                          <p className="text-xs text-gray-400">{n.desc}</p>
                          <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-700"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                AK
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 card p-2 z-50">
                <div className="px-3 py-2 border-b border-surface-700">
                  <p className="text-sm font-medium text-gray-200">Andi Kurniawan</p>
                  <p className="text-xs text-gray-500">andi@creatorforge.ai</p>
                </div>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-surface-700 rounded-lg" onClick={() => showToast('Fitur profil segera hadir', 'info')}>
                  <User size={16} /> Profil
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-surface-700 rounded-lg" onClick={() => showToast('Pengaturan dibuka', 'info')}>
                  <Settings size={16} /> Pengaturan
                </button>
                <div className="border-t border-surface-700 my-1" />
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg" onClick={() => showToast('Anda telah keluar', 'success')}>
                  <LogOut size={16} /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// ====================== TOAST COMPONENT ======================
const ToastContainer = ({ toasts }: { toasts: Toast[] }) => (
  <div className="fixed bottom-4 right-4 z-[100] space-y-2">
    {toasts.map(toast => (
      <div key={toast.id} className={`card px-4 py-3 flex items-center gap-3 animate-in slide-in-from-right ${toast.type === 'success' ? 'border-green-500/30 bg-green-500/10' : toast.type === 'error' ? 'border-red-500/30 bg-red-500/10' : 'border-primary/30 bg-primary/10'}`}>
        {toast.type === 'success' ? <CheckCircle2 size={18} className="text-green-400" /> : toast.type === 'error' ? <AlertCircle size={18} className="text-red-400" /> : <Bell size={18} className="text-primary-light" />}
        <span className="text-sm text-gray-200">{toast.message}</span>
      </div>
    ))}
  </div>
);

// ====================== QUICK CREATE MODAL ======================
const QuickCreateModal = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  const navigate = useNavigate();
  if (!open) return null;
  const options = [
    { label: 'UGC Video', desc: 'Buat video UGC dengan AI avatar', icon: Users, path: '/ugc-tool' },
    { label: 'Voice Over', desc: 'Narasi AI berkualitas studio', icon: Mic, path: '/voice-over' },
    { label: 'Video Generator', desc: 'Text-to-video dengan AI', icon: Video, path: '/video-generator' },
    { label: 'Lipsync', desc: 'Sinkronkan bibir dengan audio', icon: Wand2, path: '/lipsync-studio' },
    { label: 'Edit Gambar', desc: 'Edit foto dengan AI', icon: Image, path: '/image-editing' },
    { label: 'Script', desc: 'Tulis skrip konten', icon: FileText, path: '/script-generator' },
  ];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="card w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-100">Quick Create</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-700 text-gray-400"><X size={20} /></button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {options.map(opt => (
            <button
              key={opt.path}
              onClick={() => { navigate(opt.path); onClose(); }}
              className="p-4 rounded-xl bg-surface-800 border border-surface-600 hover:border-primary/50 hover:bg-surface-700 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-primary-soft flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <opt.icon size={20} className="text-primary-light" />
              </div>
              <p className="font-medium text-gray-200">{opt.label}</p>
              <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ====================== DASHBOARD PAGE ======================
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Total Project', value: '128', change: '+12%', icon: FolderOpen, color: 'text-primary-light' },
    { label: 'Kredit AI', value: '342 / 500', change: '68%', icon: Zap, color: 'text-yellow-400' },
    { label: 'Video Bulan Ini', value: '45', change: '+8%', icon: Video, color: 'text-accent-light' },
    { label: 'Storage', value: '18.4 GB', change: '36%', icon: TrendingUp, color: 'text-green-400' },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
          <p className="text-gray-500">Selamat datang kembali, Andi 👋</p>
        </div>
        <button onClick={() => setQuickCreateOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Quick Create
        </button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-80 lg:col-span-2" />
            <Skeleton className="h-80" />
          </div>
          <Skeleton className="h-64" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="card p-5 hover:border-primary/30 transition-all group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-2">{stat.change} dari bulan lalu</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-surface-700 ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="card p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-200">Aktivitas Generate 7 Hari Terakhir</h3>
                <button className="text-xs text-primary-light hover:text-primary">Lihat detail</button>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D2D3D" />
                    <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#1C1C28', border: '1px solid #2D2D3D', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="generates" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#06B6D4', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-gray-200 mb-4">Distribusi Konten</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D2D3D" />
                    <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#1C1C28', border: '1px solid #2D2D3D', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="video" fill="#8B5CF6" radius={[4,4,0,0]} />
                    <Bar dataKey="audio" fill="#06B6D4" radius={[4,4,0,0]} />
                    <Bar dataKey="image" fill="#EC4899" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-200">Recent Projects</h3>
              <button className="text-sm text-primary-light hover:text-primary">Lihat semua</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockProjects.slice(0, 4).map(project => (
                <div key={project.id} className="card overflow-hidden group cursor-pointer hover:border-primary/30 transition-all">
                  <div className="aspect-video bg-surface-700 relative overflow-hidden">
                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30">
                        <Play size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-200 truncate">{project.title}</p>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{project.type}</span>
                      <span>{project.updatedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Templates */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-200">Template Populer</h3>
              <button className="text-sm text-primary-light hover:text-primary">Jelajahi</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {mockTemplates.map(template => (
                <div key={template.id} className="card min-w-[250px] overflow-hidden cursor-pointer hover:border-primary/30 transition-all flex-shrink-0">
                  <div className="aspect-video bg-surface-700 relative">
                    <img src={template.image} alt={template.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                      <Star size={12} className="text-yellow-400" /> {template.usageCount.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-200">{template.title}</p>
                    <p className="text-xs text-gray-500">{template.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <QuickCreateModal open={quickCreateOpen} onClose={() => setQuickCreateOpen(false)} />
    </div>
  );
};

// ====================== UGC TOOL PAGE ======================
const UGCTool = () => {
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [speakingStyle, setSpeakingStyle] = useState('santai');
  const [platform, setPlatform] = useState('TikTok');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { showToast } = useToast();

  const avatars = [
    { id: 'a1', name: 'Sarah', age: 24, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
    { id: 'a2', name: 'Budi', age: 28, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
    { id: 'a3', name: 'Maya', age: 26, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
    { id: 'a4', name: 'Rizky', age: 30, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
    { id: 'a5', name: 'Lina', age: 22, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
    { id: 'a6', name: 'Andre', age: 27, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
  ];

  const speakingStyles = [
    { id: 'santai', label: 'Santai', desc: 'Natural & friendly', icon: Smile },
    { id: 'energik', label: 'Energik', desc: 'High energy & fun', icon: Zap },
    { id: 'profesional', label: 'Profesional', desc: 'Formal & trustworthy', icon: Briefcase },
  ];

  const platforms = [
    { id: 'TikTok', ratio: '9:16', width: 270, height: 480 },
    { id: 'Instagram Reels', ratio: '9:16', width: 270, height: 480 },
    { id: 'YouTube Shorts', ratio: '9:16', width: 270, height: 480 },
  ];

  const selectedPlatformObj = platforms.find(p => p.id === platform) || platforms[0];

  const handleGenerate = () => {
    if (!productName || !selectedAvatar) {
      showToast('Mohon isi nama produk dan pilih avatar', 'error');
      return;
    }
    setGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setGenerating(false);
          showToast('Video UGC berhasil dibuat!', 'success');
          return 100;
        }
        return prev + Math.random() * 8;
      });
    }, 300);
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-2">UGC Tool</h1>
      <p className="text-gray-500 mb-8">Buat video konten UGC dengan AI avatar yang realistis.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-200 mb-4">Informasi Produk</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Nama Produk</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="Contoh: Serum Vitamin C GlowUp"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Deskripsi Produk</label>
                <textarea
                  className="input-field w-full h-28 resize-none"
                  placeholder="Jelaskan manfaat, keunggulan, dan target pengguna..."
                  value={productDesc}
                  onChange={e => setProductDesc(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Upload Gambar Produk (Opsional)</label>
                <div className="border-2 border-dashed border-surface-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload size={24} className="mx-auto text-gray-500 mb-2" />
                  <p className="text-sm text-gray-400">Drag & drop atau klik untuk upload</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-200 mb-4">Pilih Avatar AI</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {avatars.map(avatar => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${selectedAvatar === avatar.id ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-surface-500'}`}
                >
                  <img src={avatar.img} alt={avatar.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur px-1 py-0.5">
                    <p className="text-xs text-white text-center">{avatar.name}</p>
                  </div>
                  {selectedAvatar === avatar.id && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-200 mb-4">Gaya Bicara</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {speakingStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSpeakingStyle(style.id)}
                  className={`p-4 rounded-lg border transition-all text-left ${speakingStyle === style.id ? 'border-primary bg-primary/10' : 'border-surface-600 hover:border-surface-500'}`}
                >
                  <style.icon size={20} className={`mb-2 ${speakingStyle === style.id ? 'text-primary-light' : 'text-gray-400'}`} />
                  <p className="font-medium text-gray-200">{style.label}</p>
                  <p className="text-xs text-gray-500">{style.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-200 mb-4">Platform Target</h3>
            <div className="flex flex-wrap gap-3">
              {platforms.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`px-4 py-2 rounded-lg border transition-all ${platform === p.id ? 'border-primary bg-primary/10 text-primary-light' : 'border-surface-600 text-gray-400 hover:border-surface-500'}`}
                >
                  {p.id}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Aspek rasio otomatis: {selectedPlatformObj.ratio}</p>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-semibold text-gray-200 mb-4">Preview</h3>
            <div className="flex justify-center mb-4">
              <div
                className="bg-surface-950 rounded-xl overflow-hidden border border-surface-600 relative"
                style={{ width: selectedPlatformObj.width, height: selectedPlatformObj.height, maxWidth: '100%' }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Users size={40} className="mx-auto text-gray-600 mb-2" />
                    <p className="text-gray-600 text-sm">Preview Video</p>
                    {selectedAvatar && (
                      <img
                        src={avatars.find(a => a.id === selectedAvatar)?.img}
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                        alt="avatar"
                      />
                    )}
                  </div>
                </div>
                {generating && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur p-3">
                    <ProgressBar progress={progress} />
                    <p className="text-xs text-center text-gray-300 mt-2">Rendering... {Math.round(progress)}%</p>
                  </div>
                )}
                {!generating && !selectedAvatar && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur p-2 text-center">
                    <p className="text-xs text-gray-400">Pilih avatar untuk preview</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${generating ? 'bg-surface-600 text-gray-400 cursor-not-allowed' : 'btn-primary'}`}
            >
              {generating ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
              {generating ? 'Generating...' : 'Generate Video UGC'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">Estimasi 2-3 menit • 1 kredit AI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================== VOICE OVER TOOL PAGE ======================
const VoiceOverTool = () => {
  const [script, setScript] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<string | null>('v1');
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [emotion, setEmotion] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState([
    { id: 'h1', title: 'Intro Podcast - Episode 12', voice: 'Aruna', duration: '0:45', date: '2 jam lalu' },
    { id: 'h2', title: 'Iklan Produk Skincare', voice: 'Bima', duration: '1:10', date: '5 jam lalu' },
    { id: 'h3', title: 'Narasi Video YouTube', voice: 'Citra', duration: '3:22', date: '1 hari lalu' },
  ]);
  const { showToast } = useToast();

  const handleGenerate = () => {
    if (!script.trim()) {
      showToast('Tulis naskah terlebih dahulu', 'error');
      return;
    }
    showToast('Voice over sedang diproses...', 'info');
    // Simulasi
    setTimeout(() => {
      const newItem = {
        id: Date.now().toString(),
        title: script.slice(0, 40) + '...',
        voice: mockVoices.find(v => v.id === selectedVoice)?.name || 'Aruna',
        duration: '0:32',
        date: 'Baru saja',
      };
      setHistory([newItem, ...history]);
      showToast('Voice over selesai!', 'success');
    }, 2000);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-2">Voice Over Tool</h1>
      <p className="text-gray-500 mb-8">Ubah naskah menjadi suara AI berkualitas studio.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-200 mb-4">Naskah</h3>
            <textarea
              className="input-field w-full h-40 resize-none"
              placeholder="Tulis atau tempel naskah voice over di sini..."
              value={script}
              onChange={e => setScript(e.target.value)}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">{script.length} karakter</span>
              <button className="text-xs text-primary-light hover:text-primary flex items-center gap-1">
                <FileText size={14} /> Import dari Script Generator
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-200 mb-4">Library Suara AI</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockVoices.map(voice => (
                <div
                  key={voice.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${selectedVoice === voice.id ? 'border-primary bg-primary/10' : 'border-surface-600 hover:border-surface-500'}`}
                  onClick={() => setSelectedVoice(voice.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: voice.avatarColor }}>
                      {voice.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-200">{voice.name}</p>
                      <p className="text-xs text-gray-500">{voice.language} • {voice.accent} • {voice.gender}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                      className="p-2 rounded-full bg-surface-700 text-gray-300 hover:text-white"
                    >
                      {isPlaying && selectedVoice === voice.id ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                  </div>
                  {isPlaying && selectedVoice === voice.id && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-surface-600 rounded-full overflow-hidden">
                          <div className="h-full w-1/2 bg-gradient-primary animate-pulse" />
                        </div>
                        <Volume2 size={14} className="text-primary-light" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-200 mb-4">Pengaturan Suara</h3>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 flex items-center justify-between">
                  <span>Kecepatan Bicara</span>
                  <span className="text-primary-light font-medium">{speed.toFixed(1)}x</span>
                </label>
                <input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="w-full accent-primary" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 flex items-center justify-between">
                  <span>Nada (Pitch)</span>
                  <span className="text-primary-light font-medium">{pitch > 0 ? '+' : ''}{pitch}%</span>
                </label>
                <input type="range" min="-20" max="20" step="1" value={pitch} onChange={e => setPitch(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 flex items-center justify-between">
                  <span>Intensitas Emosi</span>
                  <span className="text-primary-light font-medium">{emotion}%</span>
                </label>
                <input type="range" min="0" max="100" step="1" value={emotion} onChange={e => setEmotion(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>
            </div>
          </div>

          <button onClick={handleGenerate} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            <Mic size={18} /> Generate Voice Over
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-200 mb-4">Riwayat</h3>
            <div className="space-y-3">
              {history.map(item => (
                <div key={item.id} className="p-3 rounded-lg bg-surface-800 border border-surface-600">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-full bg-surface-700 text-gray-300 hover:text-white">
                      <Play size={14} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.voice} • {item.duration} • {item.date}</p>
                    </div>
                    <button className="p-1.5 rounded hover:bg-surface-700 text-gray-400" title="Download">
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {history.length === 0 && (
              <EmptyState icon={FileAudio} title="Belum ada voice over" description="Voice over yang Anda buat akan muncul di sini." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================== VIDEO GENERATOR PAGE ======================
const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState('9:16');
  const [duration, setDuration] = useState('5 detik');
  const [style, setStyle] = useState('realistic');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([
    { id: 'r1', title: 'Sunset di pantai', status: 'Selesai', thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop', duration: '5 dtk' },
    { id: 'r2', title: 'Kota futuristik', status: 'Diproses', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=200&fit=crop', duration: '8 dtk' },
  ]);
  const { showToast } = useToast();

  const styles = [
    { id: 'realistic', label: 'Realistic', icon: Camera },
    { id: 'cinematic', label: 'Cinematic', icon: Film },
    { id: 'animasi', label: 'Animasi', icon: Sparkles },
    { id: '3d', label: '3D', icon: Box },
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) {
      showToast('Masukkan prompt deskripsi adegan', 'error');
      return;
    }
    setGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setGenerating(false);
          const newResult = {
            id: Date.now().toString(),
            title: prompt.slice(0, 30) + '...',
            status: 'Diproses' as const,
            thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop',
            duration: duration,
          };
          setResults([newResult, ...results]);
          showToast('Video berhasil digenerate!', 'success');
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 400);
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-2">Video Generator</h1>
      <p className="text-gray-500 mb-8">Ubah teks menjadi video sinematik dengan AI.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-200 mb-4">Prompt Deskripsi Adegan</h3>
            <textarea
              className="input-field w-full h-28 resize-none"
              placeholder="Contoh: Seorang wanita berjalan di pantai saat matahari terbenam, sinematik, cahaya hangat..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Rasio Aspek</label>
                <select className="input-field w-full" value={ratio} onChange={e => setRatio(e.target.value)}>
                  <option value="9:16">9:16 (Vertical)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="16:9">16:9 (Horizontal)</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Durasi</label>
                <select className="input-field w-full" value={duration} onChange={e => setDuration(e.target.value)}>
                  <option value="5 detik">5 detik</option>
                  <option value="8 detik">8 detik</option>
                  <option value="10 detik">10 detik</option>
                  <option value="15 detik">15 detik</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Gaya Visual</label>
                <select className="input-field w-full" value={style} onChange={e => setStyle(e.target.value)}>
                  <option value="realistic">Realistic</option>
                  <option value="cinematic">Cinematic</option>
                  <option value="animasi">Animasi</option>
                  <option value="3d">3D</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm text-gray-400 mb-2 block">Gambar Referensi (Opsional)</label>
              <div
                className="border-2 border-dashed border-surface-600 rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setReferenceImage('reference-uploaded.jpg')}
              >
                <Upload size={20} className="mx-auto text-gray-500 mb-1" />
                <p className="text-sm text-gray-400">
                  {referenceImage ? `File terpilih: ${referenceImage}` : 'Upload gambar untuk image-to-video'}
                </p>
              </div>
            </div>
            <button onClick={handleGenerate} disabled={generating} className={`mt-4 w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${generating ? 'bg-surface-600 text-gray-400' : 'btn-primary'}`}>
              {generating ? <Loader2 size={18} className="animate-spin" /> : <Video size={18} />}
              {generating ? 'Generating...' : 'Generate Video'}
            </button>
            {generating && <div className="mt-4"><ProgressBar progress={progress} /></div>}
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-gray-200 mb-4">Hasil Generate</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map(result => (
                <div key={result.id} className="card overflow-hidden group">
                  <div className="aspect-video bg-surface-700 relative">
                    <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
                    {result.status === 'Selesai' ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-3 rounded-full bg-white/20 backdrop-blur text-white"><Play size={20} /></button>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 size={24} className="text-primary-light animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-200 truncate">{result.title}</p>
                      <p className="text-xs text-gray-500">{result.duration}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-lg bg-surface-700 text-gray-400 hover:text-white" title="Regenerate"><RefreshCw size={14} /></button>
                      <button className="p-1.5 rounded-lg bg-surface-700 text-gray-400 hover:text-white" title="Download"><Download size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-semibold text-gray-200 mb-4">Tips Prompt</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-2"><Sparkles size={16} className="text-primary-light flex-shrink-0" /> Gunakan deskripsi visual yang spesifik</li>
              <li className="flex gap-2"><Sparkles size={16} className="text-primary-light flex-shrink-0" /> Tambahkan gaya sinematik atau mood</li>
              <li className="flex gap-2"><Sparkles size={16} className="text-primary-light flex-shrink-0" /> Sertakan pencahayaan dan suasana</li>
              <li className="flex gap-2"><Sparkles size={16} className="text-primary-light flex-shrink-0" /> Referensi gambar membantu hasil lebih akurat</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================== LIPSYNC STUDIO PAGE ======================
const LipsyncStudio = () => {
  const [step, setStep] = useState(1);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [audioUploaded, setAudioUploaded] = useState(false);
  const [accuracy, setAccuracy] = useState('fast');
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const { showToast } = useToast();

  const steps = [
    { id: 1, label: 'Upload Video/Foto' },
    { id: 2, label: 'Upload Audio' },
    { id: 3, label: 'Preview & Render' },
  ];

  const handleNext = () => {
    if (step === 1 && !videoUploaded) {
      showToast('Upload video atau foto wajah terlebih dahulu', 'error');
      return;
    }
    if (step === 2 && !audioUploaded) {
      showToast('Upload atau pilih audio', 'error');
      return;
    }
    setStep(Math.min(step + 1, 3));
    if (step === 3) {
      setRendering(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setRendering(false);
            showToast('Lipsync berhasil dirender!', 'success');
            return 100;
          }
          return prev + 5;
        });
      }, 200);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-2">Lipsync Studio</h1>
      <p className="text-gray-500 mb-8">Sinkronkan gerakan bibir dengan audio secara otomatis.</p>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s.id ? 'bg-gradient-primary text-white' : 'bg-surface-700 text-gray-500'}`}>
              {step > s.id ? <Check size={16} /> : s.id}
            </div>
            <span className={`ml-2 text-sm ${step >= s.id ? 'text-gray-200 font-medium' : 'text-gray-500'}`}>{s.label}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-4 ${step > s.id ? 'bg-gradient-primary' : 'bg-surface-700'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-200 mb-4">Upload Video atau Foto Wajah</h3>
              <div className="border-2 border-dashed border-surface-600 rounded-xl p-8 text-center">
                <Upload size={32} className="mx-auto text-gray-500 mb-3" />
                <p className="text-gray-400 mb-2">Drag & drop file di sini atau klik untuk upload</p>
                <p className="text-xs text-gray-500">Format: MP4, MOV, JPG, PNG • Maks 100MB</p>
                <button onClick={() => setVideoUploaded(true)} className="btn-secondary mt-4">Pilih File</button>
              </div>
              {videoUploaded && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400">
                  <CheckCircle2 size={18} /> File berhasil diupload: wajah_testimoni.mp4
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-200 mb-4">Upload atau Rekam Audio</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-surface-600 rounded-xl p-6 text-center">
                  <Mic size={28} className="mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-400 mb-3">Upload file audio atau pilih dari Voice Over Tool</p>
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => setAudioUploaded(true)} className="btn-secondary flex items-center gap-2"><Upload size={16} /> Upload Audio</button>
                    <button onClick={() => setAudioUploaded(true)} className="btn-secondary flex items-center gap-2"><FileAudio size={16} /> Pilih dari VO Library</button>
                  </div>
                </div>
                {audioUploaded && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400">
                    <CheckCircle2 size={18} /> Audio dipilih: voice_aruna_review.mp3
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-200 mb-4">Preview & Render</h3>
              <div className="aspect-video bg-surface-950 rounded-lg overflow-hidden border border-surface-600 relative flex items-center justify-center">
                {videoUploaded ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-surface-800 to-surface-900" />
                    <Users size={48} className="text-gray-600" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {/* Waveform placeholder */}
                      <div className="flex items-center gap-0.5 h-12">
                        {[...Array(40)].map((_, i) => (
                          <div key={i} className="flex-1 bg-primary/60 rounded-full" style={{ height: `${Math.random() * 100}%` }} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 text-center mt-2">Audio waveform</p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600">Preview akan muncul di sini</p>
                )}
              </div>
              <div className="mt-4">
                <label className="text-sm text-gray-400 mb-2 block">Akurasi Lipsync</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setAccuracy('fast')}
                    className={`flex-1 p-3 rounded-lg border text-center ${accuracy === 'fast' ? 'border-primary bg-primary/10' : 'border-surface-600'}`}
                  >
                    <Zap size={18} className="mx-auto mb-1 text-primary-light" />
                    <p className="text-sm font-medium text-gray-200">Cepat</p>
                    <p className="text-xs text-gray-500">~2 menit</p>
                  </button>
                  <button
                    onClick={() => setAccuracy('high')}
                    className={`flex-1 p-3 rounded-lg border text-center ${accuracy === 'high' ? 'border-primary bg-primary/10' : 'border-surface-600'}`}
                  >
                    <Gauge size={18} className="mx-auto mb-1 text-primary-light" />
                    <p className="text-sm font-medium text-gray-200">Kualitas Tinggi</p>
                    <p className="text-xs text-gray-500">~10 menit</p>
                  </button>
                </div>
              </div>
              {rendering && <div className="mt-4"><ProgressBar progress={progress} /></div>}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            {step > 1 && <button onClick={() => setStep(step - 1)} className="btn-secondary">Kembali</button>}
            <button onClick={handleNext} className="btn-primary ml-auto">
              {step === 3 ? 'Render Lipsync' : 'Lanjut'}
            </button>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-200 mb-4">Tips</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-400 flex-shrink-0" /> Gunakan video dengan wajah menghadap kamera</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-400 flex-shrink-0" /> Pencahayaan yang baik meningkatkan akurasi</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-400 flex-shrink-0" /> Audio jernih tanpa noise</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-400 flex-shrink-0" /> Durasi optimal 10-60 detik</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================== IMAGE EDITING PAGE ======================
const ImageEditing = () => {
  const [activeTool, setActiveTool] = useState('crop');
  const [history, setHistory] = useState<string[]>([
    'Original Upload',
    'Background Removed',
    'Brightness +10',
    'Sharpness +15',
    'Current State',
  ]);
  const [beforeAfter, setBeforeAfter] = useState(50);
  const { showToast } = useToast();

  const tools = [
    { id: 'crop', label: 'Crop', icon: Crop },
    { id: 'remove-bg', label: 'Remove BG', icon: Eraser },
    { id: 'upscale', label: 'Upscale', icon: ZoomIn },
    { id: 'retouch', label: 'Retouch', icon: Sparkles },
    { id: 'replace-bg', label: 'Ganti BG', icon: Image },
    { id: 'generative-fill', label: 'Generative Fill', icon: Wand2 },
  ];

  const handleToolAction = (tool: string) => {
    showToast(`${tools.find(t => t.id === tool)?.label} berhasil diterapkan`, 'success');
    setHistory(prev => [...prev, `${tools.find(t => t.id === tool)?.label} Applied`]);
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-2">Image Editing</h1>
      <p className="text-gray-500 mb-8">Edit foto produk dan konten dengan AI canggih.</p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Toolbar */}
        <div className="card p-4 lg:col-span-1">
          <h3 className="font-semibold text-gray-200 mb-3">Tools</h3>
          <div className="space-y-2">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => { setActiveTool(tool.id); if (tool.id !== 'crop') handleToolAction(tool.id); }}
                className={`w-full flex items-center gap-2 p-2.5 rounded-lg transition-all ${activeTool === tool.id ? 'bg-primary/10 text-primary-light border border-primary/30' : 'text-gray-400 hover:bg-surface-700 border border-transparent'}`}
              >
                <tool.icon size={18} />
                <span className="text-sm">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="card p-4 lg:col-span-2">
          <div className="aspect-square bg-surface-950 rounded-lg overflow-hidden border border-surface-600 relative flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"
              alt="Product"
              className="w-full h-full object-cover"
            />
            {/* Before/After overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ clipPath: `inset(0 ${100 - beforeAfter}% 0 0)` }}>
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&sat=-100"
                alt="Before"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4">
              <input
                type="range"
                min="0"
                max="100"
                value={beforeAfter}
                onChange={e => setBeforeAfter(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Before</span>
                <span>After</span>
              </div>
            </div>
          </div>
        </div>

        {/* History & Export */}
        <div className="card p-4 lg:col-span-1">
          <h3 className="font-semibold text-gray-200 mb-3">Riwayat Perubahan</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
            {history.map((item, i) => (
              <div key={i} className={`p-2 rounded-lg text-sm flex items-center gap-2 ${i === history.length - 1 ? 'bg-primary/10 text-primary-light' : 'text-gray-400'}`}>
                {i === history.length - 1 ? <Check size={14} /> : <History size={14} />}
                {item}
              </div>
            ))}
          </div>
          <div className="border-t border-surface-700 pt-4 space-y-3">
            <label className="text-sm text-gray-400 block">Export</label>
            <select className="input-field w-full">
              <option>PNG - High Quality</option>
              <option>JPG - Web Optimized</option>
              <option>WebP - Modern</option>
            </select>
            <button className="btn-primary w-full flex items-center justify-center gap-2">
              <Download size={18} /> Export Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================== SCRIPT GENERATOR PAGE ======================
const ScriptGenerator = () => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('storytelling');
  const [length, setLength] = useState('medium');
  const [contentType, setContentType] = useState('iklan');
  const [generating, setGenerating] = useState(false);
  const [script, setScript] = useState('');
  const { showToast } = useToast();

  const tones = [
    { id: 'storytelling', label: 'Storytelling' },
    { id: 'edukasi', label: 'Edukasi' },
    { id: 'humor', label: 'Humor' },
    { id: 'profesional', label: 'Profesional' },
    { id: 'inspiratif', label: 'Inspiratif' },
  ];

  const contentTypes = [
    { id: 'iklan', label: 'Iklan' },
    { id: 'storytelling', label: 'Storytelling' },
    { id: 'edukasi', label: 'Edukasi' },
    { id: 'review', label: 'Review' },
  ];

  const handleGenerate = () => {
    if (!topic.trim()) {
      showToast('Masukkan topik atau produk', 'error');
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setScript(`HOOK:
Pernahkah Anda merasa kulit kusam dan lelah setiap pagi? ✨

ISI:
Perkenalkan Serum Vitamin C GlowUp dari CreatorForge Beauty. Diformulasikan dengan 10% Vitamin C murni, niacinamide, dan hyaluronic acid yang bekerja sinergis mencerahkan dan melembapkan kulit Anda.

Dalam 14 hari, 92% pengguna melaporkan kulit tampak lebih cerah dan kenyal. Teksturnya ringan, cepat meresap, dan cocok untuk semua jenis kulit.

CALL-TO-ACTION:
Klik link di bio untuk dapatkan diskon 30% hari ini! Stok terbatas. 🛍️`);
      setGenerating(false);
      showToast('Skrip berhasil digenerate!', 'success');
    }, 2000);
  };

  const handleRegenerateSection = (section: string) => {
    showToast(`Bagian ${section} sedang diregenerasi...`, 'info');
    setTimeout(() => {
      showToast(`Bagian ${section} berhasil diperbarui`, 'success');
    }, 1500);
  };

  const handleSendToVO = () => {
    showToast('Skrip dikirim ke Voice Over Tool!', 'success');
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-2">Script Generator</h1>
      <p className="text-gray-500 mb-8">Buat skrip konten yang menarik dengan AI.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-200 mb-4">Parameter Skrip</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Topik / Produk</label>
                <input type="text" className="input-field w-full" placeholder="Contoh: Serum Vitamin C" value={topic} onChange={e => setTopic(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Target Audiens</label>
                <input type="text" className="input-field w-full" placeholder="Contoh: Wanita 20-35 tahun" value={audience} onChange={e => setAudience(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Tone of Voice</label>
                <select className="input-field w-full" value={tone} onChange={e => setTone(e.target.value)}>
                  {tones.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Panjang Naskah</label>
                <select className="input-field w-full" value={length} onChange={e => setLength(e.target.value)}>
                  <option value="short">Pendek (30 detik)</option>
                  <option value="medium">Sedang (1 menit)</option>
                  <option value="long">Panjang (2-3 menit)</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Jenis Konten</label>
                <select className="input-field w-full" value={contentType} onChange={e => setContentType(e.target.value)}>
                  {contentTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
              <button onClick={handleGenerate} disabled={generating} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
                {generating ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                {generating ? 'Generating...' : 'Generate Script'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-200 mb-4">Hasil Skrip</h3>
            {script ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-purple-400 uppercase">Hook</span>
                    <button onClick={() => handleRegenerateSection('Hook')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1"><RefreshCw size={12} /> Regenerate</button>
                  </div>
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{script.split('ISI:')[0].replace('HOOK:', '').trim()}</p>
                </div>
                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-cyan-400 uppercase">Isi</span>
                    <button onClick={() => handleRegenerateSection('Isi')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1"><RefreshCw size={12} /> Regenerate</button>
                  </div>
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{script.split('ISI:')[1]?.split('CALL-TO-ACTION:')[0].trim()}</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-green-400 uppercase">Call-to-Action</span>
                    <button onClick={() => handleRegenerateSection('CTA')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1"><RefreshCw size={12} /> Regenerate</button>
                  </div>
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{script.split('CALL-TO-ACTION:')[1]?.trim()}</p>
                </div>
                <div className="flex justify-end">
                  <button onClick={handleSendToVO} className="btn-secondary flex items-center gap-2">
                    <Mic size={16} /> Kirim ke Voice Over Tool
                  </button>
                </div>
              </div>
            ) : (
              <EmptyState icon={FileText} title="Belum ada skrip" description="Isi parameter di kiri dan klik Generate untuk membuat skrip konten." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================== FILMMAKER PAGE ======================
const Filmmaker = () => {
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const { showToast } = useToast();

  const mediaLibrary = [
    { id: 'm1', title: 'UGC Review Serum', type: 'video', duration: '0:45', thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&h=100&fit=crop' },
    { id: 'm2', title: 'VO Aruna - Review', type: 'audio', duration: '0:30', color: '#8B5CF6' },
    { id: 'm3', title: 'B-roll Produk', type: 'video', duration: '0:20', thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=100&fit=crop' },
    { id: 'm4', title: 'Musik Latar', type: 'audio', duration: '1:00', color: '#06B6D4' },
    { id: 'm5', title: 'Caption Text', type: 'text', duration: '-', color: '#EC4899' },
  ];

  const timelineTracks = [
    { type: 'video', label: 'Video', clips: [
      { id: 'c1', title: 'UGC Review Serum', start: '00:00', duration: '00:45', color: 'bg-purple-500/30 border-purple-500/50' },
      { id: 'c2', title: 'B-roll Produk', start: '00:45', duration: '00:20', color: 'bg-cyan-500/30 border-cyan-500/50' },
    ]},
    { type: 'audio', label: 'Audio', clips: [
      { id: 'c3', title: 'VO Aruna', start: '00:00', duration: '00:30', color: 'bg-green-500/30 border-green-500/50' },
      { id: 'c4', title: 'Musik Latar', start: '00:00', duration: '01:00', color: 'bg-yellow-500/30 border-yellow-500/50' },
    ]},
    { type: 'text', label: 'Teks/Caption', clips: [
      { id: 'c5', title: 'Caption Text', start: '00:05', duration: '00:10', color: 'bg-pink-500/30 border-pink-500/50' },
    ]},
  ];

  const handleExport = () => {
    showToast('Video sedang diexport...', 'info');
    setExportOpen(false);
    setTimeout(() => showToast('Export selesai! Video siap diunduh', 'success'), 3000);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Filmmaker</h1>
          <p className="text-gray-500">Editor video timeline profesional.</p>
        </div>
        <button onClick={() => setExportOpen(true)} className="btn-primary flex items-center gap-2">
          <Download size={18} /> Export
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Media Library */}
        <div className="card p-4 lg:col-span-1">
          <h3 className="font-semibold text-gray-200 mb-3">Media Library</h3>
          <div className="space-y-2">
            {mediaLibrary.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedClip(item.id)}
                className={`p-2 rounded-lg cursor-pointer transition-all ${selectedClip === item.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-surface-700 border border-transparent'}`}
              >
                {item.type === 'video' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-10 rounded bg-surface-700 overflow-hidden flex-shrink-0">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-200 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.duration}</p>
                    </div>
                  </div>
                ) : item.type === 'audio' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color }}>
                      <Music size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-200 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.duration}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color }}>
                      <Type size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-200 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">Text</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-surface-800 rounded-lg">
            <p className="text-xs text-gray-500 text-center">Drag & drop media ke timeline</p>
          </div>
        </div>

        {/* Timeline & Preview */}
        <div className="lg:col-span-3 space-y-4">
          {/* Preview */}
          <div className="card p-4">
            <div className="aspect-video bg-surface-950 rounded-lg border border-surface-600 flex items-center justify-center relative">
              <Play size={40} className="text-gray-600" />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">00:00 / 01:05</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-200 mb-3">Timeline</h3>
            <div className="space-y-3">
              {timelineTracks.map(track => (
                <div key={track.type} className="flex gap-2">
                  <div className="w-16 flex-shrink-0">
                    <p className="text-xs text-gray-500">{track.label}</p>
                  </div>
                  <div className="flex-1 relative h-10 bg-surface-800 rounded-lg overflow-hidden">
                    {track.clips.map(clip => (
                      <div
                        key={clip.id}
                        className={`absolute top-0 h-full rounded border ${clip.color} flex items-center px-2 text-xs text-white truncate cursor-pointer hover:opacity-80 transition-opacity`}
                        style={{
                          left: `calc(${parseFloat(clip.start) * 100 / 65}% )`,
                          width: `calc(${parseFloat(clip.duration) * 100 / 65}% )`,
                        }}
                        title={clip.title}
                      >
                        {clip.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <span>00:00</span>
              <div className="flex-1 mx-4 h-1 bg-surface-700 rounded-full relative">
                <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full cursor-pointer" />
              </div>
              <span>01:05</span>
            </div>
          </div>

          {/* Properties */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-200 mb-3">Properti Clip</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Transisi</label>
                <select className="input-field w-full text-sm">
                  <option>None</option>
                  <option>Fade</option>
                  <option>Slide</option>
                  <option>Zoom</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Teks Overlay</label>
                <input type="text" className="input-field w-full text-sm" placeholder="Tambahkan teks..." />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Filter Warna</label>
                <select className="input-field w-full text-sm">
                  <option>Original</option>
                  <option>Warm</option>
                  <option>Cool</option>
                  <option>Vintage</option>
                  <option>B&W</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {exportOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setExportOpen(false)}>
          <div className="card w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Export Video</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Resolusi</label>
                <select className="input-field w-full">
                  <option>1080p (Full HD)</option>
                  <option>4K (Ultra HD)</option>
                  <option>720p (HD)</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Platform Target</label>
                <select className="input-field w-full">
                  <option>TikTok / Reels / Shorts (9:16)</option>
                  <option>YouTube (16:9)</option>
                  <option>Instagram Feed (1:1)</option>
                </select>
              </div>
              <button onClick={handleExport} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2">
                <Download size={18} /> Mulai Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ====================== SETTINGS PAGE ======================
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profil');
  const { showToast } = useToast();

  const tabs = [
    { id: 'profil', label: 'Profil Akun', icon: User },
    { id: 'langganan', label: 'Langganan & Kredit', icon: CreditCard },
    { id: 'brand', label: 'Preferensi Brand', icon: Palette },
    { id: 'integrasi', label: 'Integrasi', icon: Link2 },
    { id: 'keamanan', label: 'Keamanan', icon: Shield },
  ];

  const integrations = [
    { name: 'TikTok', status: true, icon: Music },
    { name: 'Instagram', status: true, icon: Instagram },
    { name: 'YouTube', status: false, icon: Youtube },
    { name: 'Twitter/X', status: false, icon: Twitter },
  ];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-8">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tab Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card p-2 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all ${activeTab === tab.id ? 'bg-primary/10 text-primary-light' : 'text-gray-400 hover:bg-surface-700'}`}
              >
                <tab.icon size={18} />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === 'profil' && (
            <div className="card p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-100">Profil Akun</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                  AK
                </div>
                <button className="btn-secondary">Ganti Foto</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Nama Lengkap</label>
                  <input type="text" className="input-field w-full" defaultValue="Andi Kurniawan" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email</label>
                  <input type="email" className="input-field w-full" defaultValue="andi@creatorforge.ai" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Perusahaan</label>
                  <input type="text" className="input-field w-full" defaultValue="CreatorForge Studio" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Role</label>
                  <select className="input-field w-full">
                    <option>Content Creator</option>
                    <option>Agency</option>
                    <option>Brand</option>
                  </select>
                </div>
              </div>
              <button onClick={() => showToast('Profil berhasil disimpan', 'success')} className="btn-primary">Simpan Perubahan</button>
            </div>
          )}

          {activeTab === 'langganan' && (
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-2">Paket Aktif</h3>
                <div className="flex items-center justify-between p-4 bg-gradient-primary-soft rounded-lg border border-primary/30">
                  <div>
                    <p className="font-medium text-gray-200">Pro Plan</p>
                    <p className="text-sm text-gray-400">$29/bulan • Diperbarui 12 hari lagi</p>
                  </div>
                  <button className="btn-secondary text-sm">Kelola</button>
                </div>
              </div>
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Kredit AI</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">342 dari 500 kredit digunakan</span>
                  <span className="text-sm font-medium text-primary-light">68%</span>
                </div>
                <ProgressBar progress={68} />
                <button className="btn-primary mt-4">Tambah Kredit</button>
              </div>
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="card p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-100">Preferensi Brand</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Logo Brand</label>
                  <div className="border-2 border-dashed border-surface-600 rounded-lg p-4 text-center">
                    <Upload size={20} className="mx-auto text-gray-500 mb-1" />
                    <p className="text-xs text-gray-500">Upload logo</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Warna Brand</label>
                  <div className="flex gap-2">
                    <input type="color" className="w-10 h-10 rounded bg-surface-700 border-none cursor-pointer" defaultValue="#8B5CF6" />
                    <input type="color" className="w-10 h-10 rounded bg-surface-700 border-none cursor-pointer" defaultValue="#06B6D4" />
                    <input type="color" className="w-10 h-10 rounded bg-surface-700 border-none cursor-pointer" defaultValue="#EC4899" />
                    <button className="btn-secondary text-xs">+ Tambah</button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Font Default</label>
                  <select className="input-field w-full">
                    <option>Inter</option>
                    <option>Poppins</option>
                    <option>Montserrat</option>
                    <option>Plus Jakarta Sans</option>
                  </select>
                </div>
              </div>
              <button onClick={() => showToast('Preferensi brand disimpan', 'success')} className="btn-primary">Simpan</button>
            </div>
          )}

          {activeTab === 'integrasi' && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Integrasi Platform</h3>
              <div className="space-y-3">
                {integrations.map(integration => (
                  <div key={integration.name} className="flex items-center justify-between p-4 rounded-lg bg-surface-800 border border-surface-600">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-700 flex items-center justify-center">
                        <integration.icon size={20} className="text-gray-300" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-200">{integration.name}</p>
                        <p className="text-xs text-gray-500">{integration.status ? 'Terhubung' : 'Belum terhubung'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast(`${integration.name} ${integration.status ? 'diputus' : 'terhubung'}`, 'success')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${integration.status ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-surface-700 text-gray-300'}`}
                    >
                      {integration.status ? <CheckCircle2 size={16} /> : <Link2 size={16} />}
                      {integration.status ? 'Terhubung' : 'Hubungkan'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'keamanan' && (
            <div className="card p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-100">Keamanan</h3>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Password Saat Ini</label>
                <input type="password" className="input-field w-full" placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Password Baru</label>
                  <input type="password" className="input-field w-full" placeholder="Minimal 8 karakter" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Konfirmasi Password</label>
                  <input type="password" className="input-field w-full" placeholder="Ulangi password baru" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-surface-800 border border-surface-600">
                <div>
                  <p className="font-medium text-gray-200">Autentikasi Dua Faktor (2FA)</p>
                  <p className="text-sm text-gray-500">Tambahkan lapisan keamanan ekstra</p>
                </div>
                <button className="btn-secondary">Aktifkan</button>
              </div>
              <button onClick={() => showToast('Password berhasil diperbarui', 'success')} className="btn-primary">Perbarui Password</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ====================== MAIN APP ======================
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const location = useLocation();

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="min-h-screen bg-surface-950">
        <Sidebar collapsed={collapsed} toggleCollapse={() => setCollapsed(!collapsed)} />
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] bg-black/70 lg:hidden" onClick={() => setMobileOpen(false)}>
            <div className="w-60 h-full" onClick={e => e.stopPropagation()}>
              <Sidebar collapsed={false} toggleCollapse={() => {}} />
            </div>
          </div>
        )}
        <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
          <Topbar collapsed={collapsed} onMenuClick={() => setMobileOpen(true)} />
          <main className="pt-20 min-h-screen">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ugc-tool" element={<UGCTool />} />
              <Route path="/voice-over" element={<VoiceOverTool />} />
              <Route path="/video-generator" element={<VideoGenerator />} />
              <Route path="/lipsync-studio" element={<LipsyncStudio />} />
              <Route path="/image-editing" element={<ImageEditing />} />
              <Route path="/script-generator" element={<ScriptGenerator />} />
              <Route path="/filmmaker" element={<Filmmaker />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
        <ToastContainer toasts={toasts} />
      </div>
    </ToastContext.Provider>
  );
};

export default App;