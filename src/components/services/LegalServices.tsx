import React from 'react';
import { Phone, Mail, Calendar, FileText } from 'lucide-react';

const services = [
  {
    title: 'مشاوره تلفنی',
    description: 'گفتگوی مستقیم با وکلای مجرب',
    icon: <Phone className="w-6 h-6" />,
    emoji: '📞',
    action: 'رزرو وقت مشاوره',
  },
  {
    title: 'مشاوره آنلاین',
    description: 'پاسخگویی سریع به سوالات حقوقی',
    icon: <Mail className="w-6 h-6" />,
    emoji: '💻',
    action: 'شروع گفتگو',
  },
  {
    title: 'تنظیم قرارداد',
    description: 'تهیه و تنظیم انواع قراردادهای حقوقی',
    icon: <FileText className="w-6 h-6" />,
    emoji: '📋',
    action: 'سفارش قرارداد',
  },
  {
    title: 'وقت ملاقات حضوری',
    description: 'مشاوره حضوری در دفتر وکالت',
    icon: <Calendar className="w-6 h-6" />,
    emoji: '🤝',
    action: 'رزرو وقت',
  },
];

export function LegalServices() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold">خدمات حقوقی</h1>
        <span className="text-3xl">💼</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.title}
            className="bg-surface rounded-xl p-6 hover:border-primary border border-transparent transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                {service.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold">{service.title}</h3>
                  <span className="text-2xl">{service.emoji}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  {service.description}
                </p>
                <button className="btn-primary">
                  {service.action}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}