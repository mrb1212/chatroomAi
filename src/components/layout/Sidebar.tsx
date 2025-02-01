import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  MessageSquare, 
  FileText, 
  Briefcase, 
  CreditCard,
  User,
  Settings,
  LogOut,
  LogIn,
  Plus,
  Menu,
  X,
  Scale,
  ChevronDown
} from 'lucide-react';
import './Sidebar.scss'; 
import { RootState } from '../../redux/stores/store';
import { Typewriter } from '../common/Typewriter';
import { LogoAnimation } from '../common/LogoAnimation';

const menuItems = [
  { 
    path: '/chat', 
    icon: MessageSquare, 
    label: 'چت',
    emoji: '💬',
    children: [
      { path: '/chat/new', label: 'گفتگوی جدید' },
      { path: '/chat/saved', label: 'گفتگو های ذخیره شده' },
    ]
  },
  { 
    path: '/templates', 
    icon: FileText, 
    label: 'قالب‌ها', 
    emoji: '📄',
    children: [
      { path: '/templates/legal', label: 'قالب های حقوقی' },
      { path: '/templates/business', label: 'قالب های تجاری' },
    ]
  },
  { 
    path: '/services', 
    icon: Briefcase, 
    label: 'خدمات', 
    emoji: '💼',
    children: [
      { path: '/services/consultation', label: 'مشاوره حقوقی' },
      { path: '/services/documents', label: 'تنظیم اسناد' },
    ]
  },
  { path: '/plans', icon: CreditCard, label: 'اشتراک', emoji: '✨' },
];

const footerMenuItems = [
  { path: '/profile', icon: User, label: 'پروفایل کاربری'},
  // { path: '/settings', icon: Settings, label: 'تنظیمات' },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const dispatch = useDispatch();
  const isMobile = window.innerWidth <= 768;
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const toggleExpand = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  useEffect(() => {
    if (!isOpen) {
      setExpandedItems([]);
    }
  }, [isOpen]);


  const renderMenuItem = (item: typeof menuItems[0]) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.path);

    return (
      <div key={item.path} className="menu-item-container">
        <div 
          className={`sidebar-item ${isExpanded ? 'expanded' : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.path);
              setIsOpen(true);
            }
          }}
        >
          <item.icon size={18} strokeWidth={2} />
          {isOpen && (
            <>
              <span className="item-label">{item.label}</span>
              {/* <span className="emoji">{item.emoji}</span> */}
              {hasChildren && (
                <ChevronDown 
                  size={16} 
                  className="expand-icon"
                />
              )}
            </>
          )}
        </div>

        {hasChildren && isExpanded && isOpen && (
          <div className="submenu">
            {item.children.map(child => (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) => 
                  `submenu-item ${isActive ? 'active' : ''}`
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isMobile && !isOpen && (
        <button 
          className="toggle-btn"
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 50
          }}
          onClick={toggleSidebar}
          aria-label={isOpen ? 'بستن منو' : 'باز کردن منو'}
        >
          <Menu size={20} />
        </button>
      )}
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Add glow lines */}
   
        
        <div className="sidebar-header">
        {isOpen && (
          <>
            <LogoAnimation size={32} className="sidebar-logo" showParticles = {false} showCircle ={false} />
            <h1 style = {{flex:"1"}}>دستیار حقوقی</h1>
          </> 
        )}
          <button 
            className="toggle-btn"
            onClick={toggleSidebar}
            aria-label={isOpen ? 'بستن منو' : 'باز کردن منو'}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

    

          <NavLink
            to="/chat/new"
            className="new-chat-btn"
          >
            <Plus size={22}  />
            {isOpen && (
              <Typewriter text="گفتگوی جدید" speed={100} />
            )}
          </NavLink>
  

        <nav className="sidebar-nav">
          {menuItems.map(renderMenuItem)}
        </nav>

        <div className="sidebar-footer">
          {isAuthenticated && footerMenuItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => 
                `footer-btn ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} strokeWidth={2} />
              {isOpen && <span>{label}</span>}
            </NavLink>
          ))}
          
          {isAuthenticated ? (
            <button 
              className="logout-btn"
              onClick={() => {
                // dispatch logout action
                dispatch({ type: 'LOGOUT_USER_SUCCESS' });
              }}
            >
              <LogOut size={18} strokeWidth={2} />
              {isOpen && <span>خروج از حساب</span>}
            </button>
          ) : (
            <NavLink 
              to="/auth"
              className="login-btn"
            >
              <LogIn size={18} strokeWidth={2} />
              {isOpen && <span>ورود به حساب</span>}
            </NavLink>
          )}
        </div>
      </aside>
      <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />
    </>
  );
};