import React from 'react';
import { MessageCircle, FileText, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useChatStore } from '../../store/chatStore';

export function Dashboard() {
  const { messages } = useChatStore();

  const recentChats = messages.slice(-3).reverse();

  const quickStats = [
    {
      title: 'گفتگوهای امروز',
      value: '3',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'text-blue-500',
    },
    {
      title: 'اسناد ذخیره شده',
      value: '12',
      icon: <FileText className="w-5 h-5" />,
      color: 'text-green-500',
    },
    {
      title: 'زمان باقیمانده',
      value: '25 روز',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-yellow-500',
    },
    {
      title: 'امتیاز کاربری',
      value: '4.8',
      icon: <Star className="w-5 h-5" />,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">داشبورد</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat) => (
          <div
            key={stat.title}
            className="bg-surface rounded-xl p-6 hover:shadow-lg transition-all"
          >
            <div className={`${stat.color} mb-4`}>{stat.icon}</div>
            <div className="text-2xl font-bold mb-2">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.title}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Chats */}
        <div className="bg-surface rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            گفتگوهای اخیر
          </h2>
          <div className="space-y-4">
            {recentChats.map((chat) => (
              <div
                key={chat.id}
                className="border-b border-gray-700 last:border-0 pb-4 last:pb-0"
              >
                <div className="text-sm text-gray-400 mb-1">
                  {new Date(chat.created_at).toLocaleDateString('fa-IR')}
                </div>
                <div className="line-clamp-2">{chat.content}</div>
              </div>
            ))}
          </div>
          <Link
            to="/chat"
            className="text-primary hover:underline block mt-4 text-center"
          >
            مشاهده همه گفتگوها
          </Link>
        </div>

        {/* Saved Templates */}
        <div className="bg-surface rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            قالب‌های ذخیره شده
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>قرارداد اجاره مسکونی</div>
              <button className="text-primary hover:underline">دانلود</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>وکالتنامه رسمی</div>
              <button className="text-primary hover:underline">دانلود</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>قرارداد استخدام</div>
              <button className="text-primary hover:underline">دانلود</button>
            </div>
          </div>
          <Link
            to="/templates"
            className="text-primary hover:underline block mt-4 text-center"
          >
            مشاهده همه قالب‌ها
          </Link>
        </div>
      </div>
    </div>
  );
}