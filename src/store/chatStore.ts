import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { getChatGPTResponse } from '../lib/chatgpt';
import type { ChatMessage } from '../types';
import { useNotificationStore } from './notificationStore';

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  loadChatHistory: (chatId: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  error: null,

  sendMessage: async (content: string) => {
    const { addNotification } = useNotificationStore.getState();
    set({ loading: true, error: null });

    try {
      // Create user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        role: 'user',
        created_at: new Date().toISOString(),
        chat_id: 'current'
      };

      // Update state with user message immediately
      set(state => ({
        messages: [...state.messages, userMessage]
      }));

      // Get AI response
      const response = await getChatGPTResponse([...get().messages, userMessage]);

      // Create AI message
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content: response,
        role: 'assistant',
        created_at: new Date().toISOString(),
        chat_id: 'current'
      };

      // Save messages to Supabase
      const { error: dbError } = await supabase
        .from('messages')
        .insert([userMessage, aiMessage]);

      if (dbError) {
        addNotification('پیام‌ها ارسال شدند اما در ذخیره‌سازی خطایی رخ داد', 'error');
        console.error('Supabase error:', dbError);
      }

      // Update state with AI message
      set(state => ({
        messages: [...state.messages, aiMessage],
        loading: false
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      set({ error: 'خطا در ارسال پیام', loading: false });
      addNotification('خطا در ارسال پیام. لطفاً دوباره تلاش کنید.', 'error');
    }
  },

  loadChatHistory: async (chatId: string) => {
    const { addNotification } = useNotificationStore.getState();
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      set({ messages: data || [], loading: false });
    } catch (error) {
      console.error('Error loading chat history:', error);
      set({ error: 'خطا در بارگذاری تاریخچه گفتگو', loading: false });
      addNotification('خطا در بارگذاری تاریخچه گفتگو', 'error');
    }
  },

  clearMessages: () => {
    set({ messages: [], error: null });
  }
}));