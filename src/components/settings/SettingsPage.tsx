import React, { useState } from 'react';
import { Bell, Moon, Lock, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function SettingsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
  });
  const [darkMode, setDarkMode] = useState(true);

  const handleSaveSettings = async () => {
    // TODO: Implement settings save logic
    console.log('Saving settings...');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">تنظیمات</h1>

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="bg-surface rounded-xl p-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            اطلاعات حساب کاربری
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">نام و نام خانوادگی</label>
              <input
                type="text"
                defaultValue={user?.full_name}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">ایمیل</label>
              <input
                type="email"
                defaultValue={user?.email}
                disabled
                className="input-field opacity-50"
              />
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-surface rounded-xl p-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            تنظیمات اعلان‌ها
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span>دریافت اعلان‌های ایمیلی</span>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications({ ...notifications, email: e.target.checked })
                }
                className="w-4 h-4 accent-primary"
              />
            </label>

            <label className="flex items-center justify-between">
              <span>اعلان‌های مرورگر</span>
              <input
                type="checkbox"
                checked={notifications.browser}
                onChange={(e) =>
                  setNotifications({ ...notifications, browser: e.target.checked })
                }
                className="w-4 h-4 accent-primary"
              />
            </label>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="bg-surface rounded-xl p-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Moon className="w-5 h-5" />
            ظاهر
          </h2>

          <label className="flex items-center justify-between">
            <span>حالت تاریک</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
          </label>
        </section>

        {/* Security Section */}
        <section className="bg-surface rounded-xl p-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            امنیت
          </h2>

          <button className="text-primary hover:underline">
            تغییر رمز عبور
          </button>
        </section>

        <button
          onClick={handleSaveSettings}
          className="btn-primary w-full"
        >
          ذخیره تغییرات
        </button>
      </div>
    </div>
  );
}