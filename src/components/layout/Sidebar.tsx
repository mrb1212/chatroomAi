import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MessageCircle,
  FileText,
  CreditCard,
  Settings,
  Plus,
  BookOpen,
  User,
  Moon,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuthStore();

  const menuItems = [
    {
      title: 'دستیار حقوقی هوشمند',
      icon: <MessageCircle className="w-5 h-5" />,
      emoji: '⚖️',
      path: '/chat',
    },
    {
      title: 'قالب‌های حقوقی',
      icon: <FileText className="w-5 h-5" />,
      emoji: '📋',
      path: '/templates',
    },
    {
      title: 'خدمات حقوقی',
      icon: <BookOpen className="w-5 h-5" />,
      emoji: '💼',
      path: '/services',
    },
    {
      title: 'اشتراک‌ها',
      icon: <CreditCard className="w-5 h-5" />,
      emoji: '💳',
      path: '/subscriptions',
    },
    {
      title: 'حساب کاربری',
      icon: <User className="w-5 h-5" />,
      emoji: '👤',
      path: '/profile',
    },
    {
      title: 'تنظیمات',
      icon: <Settings className="w-5 h-5" />,
      emoji: '⚙️',
      path: '/settings',
    },
  ];

  return (
    <aside className="w-64 h-screen bg-surface p-4 flex flex-col shadow-xl transition-all">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <span>دستیار حقوقی</span>
          <span className="text-2xl">🤖</span>
        </h1>
        <button className="p-2 rounded-xl hover:bg-background transition-colors">
          <Moon className="w-5 h-5" />
        </button>
      </div>

      <Link
        to="/chat/new"
        className="btn-primary flex items-center justify-center gap-2 mb-6 group"
      >
        <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
        <span>گفتگوی جدید</span>
        <span className="text-xl">💬</span>
      </Link>

      <nav className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item group ${
              location.pathname.startsWith(item.path) ? 'active' : ''
            }`}
          >
            <span className="group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <span>{item.title}</span>
            <span className="text-xl ml-auto group-hover:scale-110 transition-transform">
              {item.emoji}
            </span>
          </Link>
        ))}
      </nav>

      <button
        onClick={() => signOut()}
        className="mt-4 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors group"
      >
        <span>خروج</span>
        <span className="text-xl group-hover:translate-x-1 transition-transform">
          🚪
        </span>
      </button>
    </aside>
  );
}