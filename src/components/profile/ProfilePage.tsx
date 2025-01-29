import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';

interface Profile {
  full_name: string;
  phone?: string;
  company?: string;
  address?: string;
}

export function ProfilePage() {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    full_name: user?.full_name || '',
  });

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }

    loadProfile();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...profile });

      if (error) throw error;
      addNotification('اطلاعات پروفایل با موفقیت به‌روزرسانی شد', 'success');
    } catch (error) {
      addNotification('خطا در به‌روزرسانی پروفایل', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold">پروفایل کاربری</h1>
        <span className="text-3xl">👤</span>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-surface rounded-xl p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  ایمیل
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={user?.email}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  شماره تماس
                </label>
                <input
                  type="tel"
                  className="input-field"
                  value={profile.phone || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  نام شرکت
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={profile.company || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, company: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? '...' : 'ذخیره تغییرات'}
          </button>
        </form>
      </div>
    </div>
  );
}