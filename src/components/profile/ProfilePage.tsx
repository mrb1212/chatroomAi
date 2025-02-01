import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/redux/stores/store';
import { AppDispatch } from '@/src/redux/stores/store';
import { User, Mail, Phone, Calendar, Shield, Award, X, Check } from 'lucide-react';
import { LogoAnimation } from '../common/LogoAnimation';
import { updateAuthUser } from '../../redux/actions/authActions';
import './ProfilePage.scss';
import { useSnackbar } from 'notistack';
import { Typewriter } from '../common/Typewriter';
import { Loading } from '../common/Loading';

export const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.user;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const userStats = [
    { 
      icon: Calendar, 
      label: 'تاریخ عضویت', 
      value: '۱۴۰۲/۱۲/۲۰' 
    },
    { 
      icon: Shield, 
      label: 'نوع اشتراک', 
      value: 'حرفه‌ای' 
    },
    { 
      icon: Award, 
      label: 'امتیاز کاربری', 
      value: '۴.۸/۵' 
    },
  ];

  const handleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
 
    // Basic validation
    if (!editData.firstName.trim() || !editData.lastName.trim()) {
      enqueueSnackbar('لطفا نام و نام خانوادگی را وارد کنید', { 
        variant: 'error',

      });
      return;
    }

    if (editData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      enqueueSnackbar('لطفا ایمیل معتبر وارد کنید', { 
        variant: 'error',

      });
      return;
    }

    try {
      setIsLoading(true);
      
      await dispatch(await updateAuthUser({
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email
      }));

      enqueueSnackbar('اطلاعات با موفقیت بروزرسانی شد', { 
        variant: 'success',
      });
      setIsEditing(false);
    } catch (err: any) {
      enqueueSnackbar(err.message || 'خطا در بروزرسانی اطلاعات', { 
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
      
        <div className="user-info">
          <div className="avatar">
            {editData.firstName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <h1>{editData.firstName} {editData.lastName}</h1>
            <span className="user-type">کاربر حرفه‌ای</span>
          </div>
        </div>
        
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button 
                className="cancel-edit-btn"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X size={18} />
                انصراف
              </button>
              <button 
                className="save-profile-btn"
                onClick={handleEdit}
                disabled={isLoading}
              >
                <Check size={18} />
                {isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </button>
            </>
          ) : (
            <button 
              className="edit-profile-btn"
              onClick={handleEdit}
            >
              ویرایش پروفایل
            </button>
          )}
        </div>
        
      </div>

      <div className="profile-content">
        <div className="info-section">
      {isEditing && (
          <div style = {{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
            <LogoAnimation size={32} showParticles={false} showCircle={false} />
            <Typewriter 
              text="اکنون می‌توانید اطلاعات خود را ویرایش کنید"
              speed={50}
            />
          </div>
        )}
          <h2>اطلاعات شخصی</h2>
          <div className="info-grid">
            <div className="info-item">
              <User size={20} />
              <div className="info-text">
                <label>نام</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      firstName: e.target.value
                    }))}
                    className="edit-input"
                    placeholder="نام"
                  />
                ) : (
                  <span>{editData.firstName}</span>
                )}
              </div>
            </div>
            <div className="info-item">
              <User size={20} />
              <div className="info-text">
                <label>نام خانوادگی</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      lastName: e.target.value
                    }))}
                    className="edit-input"
                    placeholder="نام خانوادگی"
                  />
                ) : (
                  <span>{editData.lastName}</span>
                )}
              </div>
            </div>
            <div className="info-item">
              <Mail size={20} />
              <div className="info-text">
                <label>ایمیل</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                    className="edit-input"
                    placeholder="ایمیل"
                  />
                ) : (
                  <span>{editData.email || '---'}</span>
                )}
              </div>
            </div>
            <div className="info-item">
              <Phone size={20} />
              <div className="info-text">
                <label>شماره تماس</label>
                <span>{user?.phoneNumber || '---'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h2>آمار کاربری</h2>
          <div className="stats-grid">
            {userStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <stat.icon size={24} />
                <div className="stat-text">
                  <label>{stat.label}</label>
                  <span>{stat.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="activity-section">
          <h2>فعالیت‌های اخیر</h2>
          <div className="activity-list">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <LogoAnimation size={32} showParticles={false} showCircle={false} />
                </div>
                <div className="activity-details">
                  <h3>گفتگو با دستیار حقوقی</h3>
                  <p>مشاوره در مورد قرارداد اجاره</p>
                  <span className="activity-time">۲ ساعت پیش</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};