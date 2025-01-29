import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useNotificationStore } from '../../store/notificationStore';
import { useAuthStore } from '../../store/authStore';

type AuthMode = 'signin' | 'signup' | 'reset';

interface FormData {
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  email: '',
  password: '',
  fullName: '',
  confirmPassword: '',
};

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      throw new Error('لطفاً تمام فیلدها را پر کنید');
    }

    if (!formData.email.includes('@')) {
      throw new Error('لطفاً یک ایمیل معتبر وارد کنید');
    }

    if (formData.password.length < 6) {
      throw new Error('رمز عبور باید حداقل ۶ کاراکتر باشد');
    }

    if (mode === 'signup') {
      if (!formData.fullName) {
        throw new Error('لطفاً نام و نام خانوادگی خود را وارد کنید');
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error('رمز عبور و تکرار آن مطابقت ندارند');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured()) {
      addNotification('لطفاً ابتدا Supabase را پیکربندی کنید', 'error');
      return;
    }

    setLoading(true);

    try {
      validateForm();

      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        });

        if (error) throw error;
        addNotification('حساب کاربری با موفقیت ایجاد شد', 'success');
        navigate('/chat');
      } else if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        addNotification('خوش آمدید', 'success');
        navigate('/chat');
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email);
        if (error) throw error;
        addNotification('لینک بازیابی رمز عبور به ایمیل شما ارسال شد', 'success');
        setMode('signin');
      }
    } catch (err) {
      addNotification(
        err instanceof Error ? err.message : 'خطایی رخ داد',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-surface p-8 rounded-2xl w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-primary/10 p-4 rounded-full">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-8">
          {mode === 'signin' ? 'ورود به حساب کاربری' : 
           mode === 'signup' ? 'ثبت نام' : 
           'بازیابی رمز عبور'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm mb-2">نام و نام خانوادگی</label>
              <input
                type="text"
                className="input-field"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-2">ایمیل</label>
            <input
              type="email"
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-sm mb-2">رمز عبور</label>
              <input
                type="password"
                className="input-field"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-sm mb-2">تکرار رمز عبور</label>
              <input
                type="password"
                className="input-field"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? '...' : 
             mode === 'signin' ? 'ورود' : 
             mode === 'signup' ? 'ثبت نام' : 
             'ارسال لینک بازیابی'}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          {mode === 'signin' && (
            <>
              <button
                onClick={() => setMode('signup')}
                className="text-primary hover:underline block w-full"
              >
                ثبت نام کنید
              </button>
              <button
                onClick={() => setMode('reset')}
                className="text-primary hover:underline block w-full"
              >
                فراموشی رمز عبور
              </button>
            </>
          )}
          {(mode === 'signup' || mode === 'reset') && (
            <button
              onClick={() => setMode('signin')}
              className="text-primary hover:underline block w-full"
            >
              بازگشت به صفحه ورود
            </button>
          )}
        </div>
      </div>
    </div>
  );
}