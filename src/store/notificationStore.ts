import { create } from 'zustand';
import { ToastType } from '../components/ui/Toast';

interface Notification {
  id: string;
  message: string;
  type: ToastType;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (message: string, type: ToastType) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (message, type) => {
    const id = Date.now().toString();
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }],
    }));
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));