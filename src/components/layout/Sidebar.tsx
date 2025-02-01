import React, { useEffect, useState } from 'react';
import { AppDispatch } from '@/src/redux/stores/store';

import { NavLink, useNavigate } from 'react-router-dom';
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
  ChevronDown,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import './Sidebar.scss'; 
import { RootState } from '../../redux/stores/store';
import { Typewriter } from '../common/Typewriter';
import { LogoAnimation } from '../common/LogoAnimation';
import { ListChatRooms, updateChatRoom } from '@/src/redux/actions/chatActions';
import { Modal } from '../common/Modal';
import { enqueueSnackbar } from 'notistack';

const menuItems = [
  { 
    path: '/chat', 
    icon: MessageSquare, 
    label: 'چت های اخیر',
    emoji: '💬',
    children: [

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
  const [activeOptions, setActiveOptions] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingChat, setEditingChat] = useState<{id: string, name: string} | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = window.innerWidth <= 768;
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const { updateChatRoomStatus, updateChatRoomLoading } = useSelector((state: RootState) => state.chat);

  const { listChatRoomsData } = useSelector((state: RootState) => state.chat);

  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const toggleExpand = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  // Add notification handler
const showNotification = (message: string, type: 'success' | 'error') => {
  enqueueSnackbar(message, {
    variant: type,
    autoHideDuration: 3000,
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'center'
    }
  });
};

  useEffect(() => {
    if (!isOpen) {
      setExpandedItems([]);
    }
  }, [isOpen]);

  useEffect(() => {
    // getting the chatrooms
    const fetchChatRooms = async () => {
      await dispatch(await ListChatRooms());
    };
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if(listChatRoomsData) {
        var chatRooms = listChatRoomsData?.list

        if(chatRooms) {
          menuItems[0].children = chatRooms.map(room => ({
            path: `/chat/${room._id}`,
            label: room.name,
          }));
        }
    }
  }, [listChatRoomsData.list,updateChatRoomStatus]);

  const handleNewChat = async () => {
    if(listChatRoomsData?.list[0]?.name === "گفتگوی جدید"  ) {
      navigate(`/chat/${listChatRoomsData.list[0]._id}`);
      showNotification('گفتگوی جدید قبلا ایجاد شده است', 'error');
      return
    }

    const newChatData = {
      mode: 'INS',
      name: `گفتگوی جدید`,
      participants: []
    };

    try {
      await dispatch(await updateChatRoom(newChatData));
      showNotification('گفتگوی جدید با موفقیت ایجاد شد', 'success');
      if(isMobile) {
        setIsOpen(false); // Close sidebar on mobile after creating new chat
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      showNotification('خطایی در ایجاد گفتگو رخ داد', 'error');
    }
  };

  useEffect(() => {
    if(listChatRoomsData?.list[0]?.name === "گفتگوی جدید"  ) {
      navigate(`/chat/${listChatRoomsData?.list[0]?._id}`);
      return
    }
  }, [listChatRoomsData.list,updateChatRoomStatus]);

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await dispatch(await updateChatRoom({
        mode: 'DEL',
        roomId: chatId
      }));
      showNotification('گفتگو با موفقیت حذف شد', 'success');
      let index = listChatRoomsData?.list.findIndex(chat => chat._id === chatId);
      navigate(`/chat/${listChatRoomsData?.list[index - 1]?._id || listChatRoomsData?.list[index + 1]?._id}`); // previous chat id
      setActiveOptions(null);
    } catch (error) {
      console.error('Error deleting chat:', error);
      showNotification('خطایی در حذف گفتگو رخ داد', 'error');
    }
  };

  const handleEditChat = async (chatId: string, currentName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingChat({ id: chatId, name: currentName });
    setEditModalOpen(true);
  };

  const handleConfirmEdit = async (newName: string) => {
    if (editingChat) {
      try {
        await dispatch(await updateChatRoom({
          mode: 'UPD',
          roomId: editingChat.id,
          name: newName
        }));
        setActiveOptions(null);
        showNotification('نام گفتگو با موفقیت تغییر کرد', 'success');
      } catch (error) {
        console.error('Error updating chat:', error);
        showNotification('خطایی در ویرایش گفتگو رخ داد', 'error');
      }
    }
    setEditingChat(null);
    setEditModalOpen(false);
  };

  const renderNewChatButton = () => (
    <button
      onClick={handleNewChat}
      className="new-chat-btn"
      disabled={updateChatRoomLoading === "sending"}
    >
      {updateChatRoomLoading === "sending" ? (
        <div className="loading-wrapper">
          <div className="loading-spinner" />
          {isOpen && <span>در حال ساخت گفتگو...</span>}
        </div>
      ) : (
        <>
          <Plus size={22} />
          {isOpen && (
            <Typewriter text="گفتگوی جدید" speed={100} />
          )}
        </>
      )}
    </button>
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeOptions && !(event.target as Element).closest('.chat-options-menu, .options-trigger')) {
        setActiveOptions(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeOptions]);

  const renderSubmenuItems = (children: any[], parentPath: string) => (
    <div className="submenu">
      {children.map(child => {
        if (parentPath === '/chat') {
          return (
            <div 
              key={child.path} 
              className={`submenu-item-wrapper ${activeOptions === child.path ? 'show-options' : ''}`}
              onMouseLeave={() => {
                if (!activeOptions) setActiveOptions(null);
              }}
            >
              <NavLink
                to={child.path}
                className={({ isActive }) => 
                  `submenu-item ${isActive ? 'active' : ''}`
                }
              >
                <p>{child.label}</p>
              </NavLink>
              <button
                className="options-trigger"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveOptions(activeOptions === child.path ? null : child.path);
                }}
              >
                <MoreVertical size={16} />
              </button>
              {activeOptions === child.path && (
                <div className="chat-options-menu">
                  <button onClick={(e) => handleEditChat(child.path.split('/').pop()!, child.label, e)}>
                    <Edit size={16} />
                    ویرایش نام
                  </button>
                  <button onClick={(e) => handleDeleteChat(child.path.split('/').pop()!, e)}>
                    <Trash2 size={16} />
                    حذف گفتگو
                  </button>
                </div>
              )}
            </div>
          );
        }
        
        return (
          <NavLink
            key={child.path}
            to={child.path}
            className={({ isActive }) => 
              `submenu-item ${isActive ? 'active' : ''}`
            }
          >
            {child.label}
          </NavLink>
        );
      })}
    </div>
  );

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
              <span className="item-label" style = {{flex:"1"}}>{item.label}</span>
              {item.path === "/chat" && (
                <span className="item-label" style = {{backgroundColor:"rgba(255, 166, 0, 0.2)",color:"var(--primary)", borderRadius:"50%", padding:"0.25rem",width:"1.5rem",height:"1.5rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{listChatRoomsData?.list.length}</span>
              )}
              
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

        {hasChildren && isExpanded && isOpen && renderSubmenuItems(item.children, item.path)}
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

        {renderNewChatButton()}

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
      {editModalOpen && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="ویرایش نام چت"
        >
          <div className="modal-content">
            <input
              type="text"
              value={editingChat?.name || ''}
              onChange={(e) => setEditingChat(prev => ({...prev!, name: e.target.value}))}
              className="modal-input"
              placeholder="نام چت را وارد کنید"
            />
            <div className="modal-buttons">
              <button 
                onClick={() => setEditModalOpen(false)}
                className="modal-button secondary"
              >
                انصراف
              </button>
              <button
                onClick={() => handleConfirmEdit(editingChat?.name || '')}
                className="modal-button primary"
              >
                ذخیره
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};