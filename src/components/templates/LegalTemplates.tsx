import React, { useState } from 'react';
import { Search, FileText } from 'lucide-react';

const categories = [
  'قراردادها',
  'دادخواست‌ها',
  'وکالتنامه‌ها',
  'اسناد تجاری',
  'قوانین کار',
];

const templates = [
  {
    id: '1',
    title: 'قرارداد اجاره مسکونی',
    description: 'قرارداد اجاره استاندارد برای املاک مسکونی',
    category: 'قراردادها',
  },
  {
    id: '2',
    title: 'دادخواست طلاق توافقی',
    description: 'فرم استاندارد دادخواست طلاق توافقی',
    category: 'دادخواست‌ها',
  },
  {
    id: '3',
    title: 'وکالتنامه رسمی',
    description: 'وکالتنامه رسمی برای امور حقوقی و قضایی',
    category: 'وکالتنامه‌ها',
  },
  // Add more templates...
];

export function LegalTemplates() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    const matchesSearch = template.title.includes(searchQuery) || 
                         template.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">قالب‌های حقوقی</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg ${
            !selectedCategory ? 'bg-primary' : 'bg-surface'
          }`}
        >
          همه
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category ? 'bg-primary' : 'bg-surface'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="relative mb-8">
        <Search className="absolute right-4 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="جستجو در قالب‌ها..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface rounded-lg pr-12 pl-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-surface rounded-xl p-6 hover:border-primary border border-transparent transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">{template.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                <button className="text-primary hover:underline">
                  مشاهده و دانلود
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}