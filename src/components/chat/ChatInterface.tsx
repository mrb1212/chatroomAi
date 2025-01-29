import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Loader, Edit2, Trash2, X, Check } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useParams } from 'react-router-dom';

const quickActions = [
  'تنظیم قرارداد اجاره',
  'مشاوره قانون کار',
  'ثبت شرکت',
  'وکالتنامه رسمی',
];

const systemPrompts = {
  'تنظیم قرارداد اجاره': `لطفاً اطلاعات زیر را برای تنظیم قرارداد اجاره وارد کنید:
1. مشخصات موجر (نام، کد ملی)
2. مشخصات مستأجر
3. آدرس و مشخصات ملک
4. مدت اجاره و مبلغ
5. شرایط خاص قرارداد`,
  'مشاوره قانون کار': `لطفاً موضوع مورد نظر خود را در حوزه قانون کار مطرح کنید. موارد رایج:
1. محاسبه حقوق و مزایا
2. شرایط قرارداد کار
3. بیمه و سوابق
4. مرخصی و ساعات کار`,
  'ثبت شرکت': `برای راهنمایی در مورد ثبت شرکت، لطفاً اطلاعات زیر را مشخص کنید:
1. نوع شرکت (سهامی خاص، مسئولیت محدود و...)
2. موضوع فعالیت
3. میزان سرمایه
4. مشخصات شرکا`,
  'وکالتنامه رسمی': `برای تنظیم وکالتنامه، موارد زیر را مشخص کنید:
1. مشخصات موکل
2. مشخصات وکیل
3. حدود اختیارات
4. مدت وکالت`,
};

interface EditingMessage {
  id: string;
  content: string;
}

export function ChatInterface() {
  const { chatId } = useParams();
  const [input, setInput] = useState('');
  const [editingMessage, setEditingMessage] = useState<EditingMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    loading,
    sendMessage,
    loadChatHistory,
    clearMessages,
    updateMessageContent,
    deleteMessageById,
  } = useChatStore();

  useEffect(() => {
    if (chatId === 'new') {
      clearMessages();
    } else if (chatId) {
      loadChatHistory(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input;
    setInput('');
    await sendMessage(message);
  };

  const handleQuickAction = (action: string) => {
    setInput(systemPrompts[action] || action);
  };

  const handleEditMessage = (message: EditingMessage) => {
    setEditingMessage(message);
  };

  const handleSaveEdit = async () => {
    if (!editingMessage) return;
    await updateMessageContent(editingMessage.id, editingMessage.content);
    setEditingMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('آیا از حذف این پیام اطمینان دارید؟')) {
      await deleteMessageById(messageId);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚖️</div>
              <h2 className="text-2xl font-bold mb-2">دستیار حقوقی هوشمند</h2>
              <p className="text-gray-400">
                سوال حقوقی خود را بپرسید یا از گزینه‌های پیشنهادی استفاده کنید
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-lg transition-all hover:shadow-xl group relative ${
                    message.role === 'user'
                      ? 'bg-primary text-white ml-4'
                      : 'bg-surface text-white mr-4'
                  }`}
                >
                  {editingMessage?.id === message.id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={editingMessage.content}
                        onChange={(e) =>
                          setEditingMessage({
                            ...editingMessage,
                            content: e.target.value,
                          })
                        }
                        className="bg-background text-white p-2 rounded-lg w-full min-h-[100px] resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="p-1 rounded-lg hover:bg-background/20"
                          title="ذخیره"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 rounded-lg hover:bg-background/20"
                          title="انصراف"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {message.content}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => handleEditMessage(message)}
                          className="p-1 rounded-lg hover:bg-background/20"
                          title="ویرایش"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="p-1 rounded-lg hover:bg-background/20"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions and Input */}
      <div className="border-t border-gray-700 bg-surface">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {quickActions.map((action) => (
              <button
                key={action}
                className="px-4 py-2 bg-background text-white rounded-xl whitespace-nowrap hover:bg-primary/10 transition-colors"
                onClick={() => handleQuickAction(action)}
              >
                {action}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <button
              type="button"
              className="p-3 rounded-xl hover:bg-background transition-colors"
              title="پیوست فایل"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="سوال حقوقی خود را بپرسید..."
              className="flex-1 bg-background rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              disabled={loading}
            />
            
            <button
              type="submit"
              className="bg-primary p-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim() || loading}
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}