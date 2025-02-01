import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Paperclip, Image, Globe } from 'lucide-react';
import { Typewriter } from '../common/Typewriter';
import './ChatInterface.scss';
import { LogoAnimation } from '../common/LogoAnimation';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux/stores/store';

type Message = {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const welcomeMessages = [
  'سلام! من دستیار هوشمند حقوقی شما هستم.',
  'می‌توانم در موارد زیر به شما کمک کنم:',
  '• مشاوره حقوقی اولیه',
  '• تنظیم قراردادها',
  '• پاسخ به سوالات حقوقی',
  '• راهنمایی در مورد قوانین',
  'لطفاً سوال خود را مطرح کنید.'
];

const staticMessages: Message[] = [
  {
    id: 1,
    content: 'سلام، من دستیار حقوقی هوشمند هستم. چطور میتونم کمکتون کنم؟',
    sender: 'bot',
    timestamp: new Date('2024-03-10T10:00:00')
  },
  {
    id: 2,
    content: 'سلام. من میخوام در مورد قرارداد اجاره سوال بپرسم',
    sender: 'user',
    timestamp: new Date('2024-03-10T10:01:00')
  },
  {
    id: 3,
    content: 'ه،بله، حتما. چه سوالی در مورد قرارده،بله، حتما. چه سوالی در مورد قرارده،بله، حتما. چه سوالی در مورد قرارد حتما. چه سوالی در مورد قرارداد اجاره دارید؟' ,
    sender: 'bot',
    timestamp: new Date('2024-03-10T10:01:30')
  },  {
    id: 1,
    content: 'سلام، من دستیار حقوقی هوشمند هستم. چطور میتونم کمکتون کنم؟',
    sender: 'bot',
    timestamp: new Date('2024-03-10T10:00:00')
  },
  {
    id: 2,
    content: 'سلام. من میخوام در مورد قرارداد اجاره سوال بپرسم',
    sender: 'user',
    timestamp: new Date('2024-03-10T10:01:00')
  },
  {
    id: 3,
    content: 'ه،بله، حتما. چه سوالی در مورد قرارده،بله، حتما. چه سوالی در مورد قرارده،بله، حتما. چه سوالی در مورد قرارد حتما. چه سوالی در مورد قرارداد اجاره دارید؟' ,
    sender: 'bot',
    timestamp: new Date('2024-03-10T10:01:30')
  } , {
    id: 1,
    content: 'سلام، من دستیار حقوقی هوشمند هستم. چطور میتونم کمکتون کنم؟',
    sender: 'bot',
    timestamp: new Date('2024-03-10T10:00:00')
  },
  {
    id: 2,
    content: 'سلام. من میخوام در مورد قرارداد اجاره سوال بپرسم',
    sender: 'user',
    timestamp: new Date('2024-03-10T10:01:00')
  },  {
    id: 2,
    content: 'سلام. من میخوام در مورد قرارداد اجاره سوال بپرسم',
    sender: 'user',
    timestamp: new Date('2024-03-10T10:01:00')
  },  {
    id: 2,
    content: 'سلام. من میخوام در مورد قرارداد اجاره سوال بپرسم',
    sender: 'user',
    timestamp: new Date('2024-03-10T10:01:00')
  },
  {
    id: 3,
    content: 'ه،بله، حتما. چه سوالی در مورد قرارده،بله، حتما. چه سوالی در مورد قرارده،بله، حتما. چه سوالی در مورد قرارد حتما. چه سوالی در مورد قرارداد اجاره دارید؟' ,
    sender: 'bot',
    timestamp: new Date('2024-03-10T10:01:30')
  }
];

const examplePrompts = [
  {
    category: 'قراردادها',
    items: [
      {
        title: 'قرارداد اجاره',
        description: 'راهنمایی برای تنظیم قرارداد اجاره ملک'
      },
      {
        title: 'قرارداد کار',
        description: 'نمونه قرارداد کار و نکات مهم آن'
      },
      {
        title: 'قرارداد خرید و فروش',
        description: 'راهنمای تنظیم مبایعه‌نامه و قولنامه'
      }
    ]
  },
  {
    category: 'دعاوی حقوقی',
    items: [
      {
        title: 'مطالبه خسارت',
        description: 'نحوه طرح دعوای مطالبه خسارت'
      },
      {
        title: 'دعاوی ملکی',
        description: 'راهنمایی در مورد دعاوی تصرف و مالکیت'
      },
      {
        title: 'دعاوی خانواده',
        description: 'مشاوره در امور طلاق، نفقه و حضانت'
      }
    ]
  },
  {
    category: 'امور مالی و مالیاتی',
    items: [
      {
        title: 'مالیات بر درآمد',
        description: 'محاسبه و قوانین مالیات بر درآمد'
      },
      {
        title: 'مالیات بر ارث',
        description: 'راهنمای محاسبه و پرداخت مالیات بر ارث'
      },
      {
        title: 'عوارض شهرداری',
        description: 'اطلاعات در مورد عوارض نوسازی و کسب و کار'
      }
    ]
  },
  {
    category: 'کسب و کار',
    items: [
      {
        title: 'ثبت شرکت',
        description: 'مراحل و مدارک لازم برای ثبت شرکت'
      },
      {
        title: 'قوانین کار',
        description: 'حقوق و تکالیف کارگر و کارفرما'
      },
      {
        title: 'مجوزهای کسب',
        description: 'راهنمای دریافت پروانه کسب'
      }
    ]
  }
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentWelcomeIndex, setCurrentWelcomeIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const auth = useSelector((state: RootState) => state.auth);

  // Simulate loading messages
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle welcome messages for new chat
  useEffect(() => {
    if (!isLoading && messages.length === 0) {
      const timer = setTimeout(() => {
        setMessages([]);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
  };

  const handleExampleClick = (prompt: {title: string, description: string}) => {
    setNewMessage(prompt.title + '\n' + prompt.description);
  };

  const renderExamples = () => (
    <div className="examples-section">
      {examplePrompts.map((category, idx) => (
        <div key={idx} className="example-category">
          <h3 className="category-title">{category.category}</h3>
          <div className="examples-grid">
            {category.items.map((prompt, index) => (
              <button
                key={index}
                className="example-card"
                onClick={() => handleExampleClick({title: prompt.title, description: prompt.description})}
              >
                <h4>{prompt.title}</h4>
                <p>{prompt.description}</p>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <LogoAnimation size={48}  />
          <Typewriter 
            text="در حال آماده‌سازی دستیار حقوقی..."
            speed={100}
            className="loading-text"
          />
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className="new-chat-container">
          <div className="welcome-section">
            <LogoAnimation size={48} className="welcome-logo"   />
            <h2>دستیار حقوقی هوشمند</h2>
            <p>{auth.user?.firstName ? `سلام ${auth.user?.firstName}، چطور میتونم کمکتون کنم؟` : 'سلام، چطور میتونم کمکتون کنم؟'}</p>
          </div>
          {renderExamples()}
        </div>
      );
    }

  return (
            messages.map((message) => (
              <div
                key={message.id}
          className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
        >
          <div className="message-avatar">
            {message.sender === 'user' ? 
              <User size={20} /> : 
              <Bot size={20} />
            }
          </div>
          <div className="message-content">
            <div className="message-text">{message.content}</div>
            <div className="message-time">
              {new Intl.DateTimeFormat('fa-IR', {
                hour: '2-digit',
                minute: '2-digit'
              }).format(message.timestamp)}
                      </div>
                </div>
              </div>
            ))
    );
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
        
        <div className="messages-wrapper">
          {renderContent()}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={`input-container ${messages.length === 0 ? 'new-chat' : ''}`}>
        <form onSubmit={handleSubmit} className="input-wrapper">
          <textarea
            value={newMessage}
            onChange={(e) => {
              const textarea = e.target;
              if(e.target.value.length === 0){
                textarea.style.height = '44px';
                textarea.style.overflow = 'hidden';
              }
              if(e.target.value.length > 0){
                textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
              }
              setNewMessage(e.target.value);
            }}
            onKeyDown={(e) => {
              const textarea = e.target as HTMLTextAreaElement;
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (newMessage.trim()) {
                  handleSubmit(e as any);
                textarea.style.height = '44px';
                }
              }
            }}
            placeholder={messages.length === 0 ? 
              'سوال خود را بپرسید یا از نمونه‌ها انتخاب کنید' : 
              'با دستیار حقوقی خودتون صحبت کنید' 
            }
            className="message-input"
            disabled={isLoading}
          />
          <div className="input-actions-row">
            <div className="input-actions">
              <button type="button" className="action-button">
                <Paperclip size={20} />
              </button>
              <button type="button" className="action-button">
                <Image size={20} />
              </button>
              <button type="button" className="action-button">
                <Globe size={20} />
              </button>
          </div>
            <button
              type="submit"
              className="send-button"
              disabled={isLoading || !newMessage.trim()}
            >
              <Send size={20} />
            </button>
          </div>
          </form>
      </div>
    </div>
  );
}