import { create } from 'zustand';
import { getChatGPTResponse } from '../lib/chatgpt';
import type { ChatMessage } from '../types';
import { useNotificationStore } from './notificationStore';
import {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
} from '../api/messages';

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  loadChatHistory: (chatId: string) => Promise<void>;
  updateMessageContent: (messageId: string, content: string) => Promise<void>;
  deleteMessageById: (messageId: string) => Promise<void>;
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
      const userMessage: Omit<ChatMessage, 'id' | 'created_at'> = {
        content,
        role: 'user',
        chat_id: 'current'
      };

      // Save user message to database
      const savedUserMessage = await createMessage(userMessage);

      // Update state with user message
      set(state => ({
        messages: [...state.messages, savedUserMessage]
      }));

      // Get AI response
      const response = await getChatGPTResponse([...get().messages, savedUserMessage]);

      // Create and save AI message
      const aiMessage: Omit<ChatMessage, 'id' | 'created_at'> = {
        content: response,
        role: 'assistant',
        chat_id: 'current'
      };

      const savedAiMessage = await createMessage(aiMessage);

      // Update state with AI message
      set(state => ({
        messages: [...state.messages, savedAiMessage],
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
      const messages = await getMessages(chatId);
      set({ messages, loading: false });
    } catch (error) {
      console.error('Error loading chat history:', error);
      set({ error: 'خطا در بارگذاری تاریخچه گفتگو', loading: false });
      addNotification('خطا در بارگذاری تاریخچه گفتگو', 'error');
    }
  },

  updateMessageContent: async (messageId: string, content: string) => {
    const { addNotification } = useNotificationStore.getState();
    set({ loading: true, error: null });

    try {
      const updatedMessage = await updateMessage(messageId, { content });
      set(state => ({
        messages: state.messages.map(msg =>
          msg.id === messageId ? updatedMessage : msg
        ),
        loading: false
      }));
      addNotification('پیام با موفقیت ویرایش شد', 'success');
    } catch (error) {
      console.error('Error updating message:', error);
      set({ error: 'خطا در ویرایش پیام', loading: false });
      addNotification('خطا در ویرایش پیام', 'error');
    }
  },

  deleteMessageById: async (messageId: string) => {
    const { addNotification } = useNotificationStore.getState();
    set({ loading: true, error: null });

    try {
      await deleteMessage(messageId);
      set(state => ({
        messages: state.messages.filter(msg => msg.id !== messageId),
        loading: false
      }));
      addNotification('پیام با موفقیت حذف شد', 'success');
    } catch (error) {
      console.error('Error deleting message:', error);
      set({ error: 'خطا در حذف پیام', loading: false });
      addNotification('خطا در حذف پیام', 'error');
    }
  },

  clearMessages: () => {
    set({ messages: [], error: null });
  }
}));