import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Paperclip, Image, Globe } from 'lucide-react';

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Adjust theme as needed

import { Typewriter } from '../common/Typewriter';
import './ChatInterface.scss';
import { LogoAnimation } from '../common/LogoAnimation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/redux/stores/store';
import { ChatRoomList } from './ChatRoomList';
import { useParams, useNavigate } from 'react-router-dom';

import { ListMessages, updateChatRoom, updateMessage,lawRag } from '@/src/redux/actions/chatActions';

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
    content: 'ه،بله، حتما. چه سوالی در مورد قرارده،بله، حتما. چه سوالی در مورد قرارده،بله، حتما. چه سوالی در مورد قرارد حتما. چه سوالی در مورد قرارداد اجاره دارید؟',
    sender: 'bot',
    timestamp: new Date('2024-03-10T10:01:30')
  }, {
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
    content: 'ه،بله، حتما. چه سوالی در مورد قرارده،بله، حتما. چه سوالی در مورد قرارده،بله، حتما. چه سوالی در مورد قرارد حتما. چه سوالی در مورد قرارداد اجاره دارید؟',
    sender: 'bot',
    timestamp: new Date('2024-03-10T10:01:30')
  }, {
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
  }, {
    id: 2,
    content: 'سلام. من میخوام در مورد قرارداد اجاره سوال بپرسم',
    sender: 'user',
    timestamp: new Date('2024-03-10T10:01:00')
  }, {
    id: 2,
    content: 'سلام. من میخوام در مورد قرارداد اجاره سوال بپرسم',
    sender: 'user',
    timestamp: new Date('2024-03-10T10:01:00')
  },
  {
    id: 3,
    content: 'ه،بله، حتما. چه سوالی در مورد قرارده،بله، حتما. چه سوالی در مورد قرارده،بله، حتما. چه سوالی در مورد قرارد حتما. چه سوالی در مورد قرارداد اجاره دارید؟',
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

  const { id } = useParams();
  var roomId = id;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [messages, setMessages]: any = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentWelcomeIndex, setCurrentWelcomeIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [botWaiting, setBotWaiting] = useState(false);

  const auth = useSelector((state: RootState) => state.auth);
  const { listMessagesData, listMessagesStatus } = useSelector((state: RootState) => state.chat);
  const { updateMessageStatus } = useSelector((state: RootState) => state.chat);
  const listMessages = listMessagesData?.list;
  const { listChatRoomsData } = useSelector((state: RootState) => state.chat);
  // user send the message 1. it is showed in the chat 2. it is saved in the database updateMessage INS 3. the user should wait for the response of the bot

  const { lawRagStatus, lawRagLoading, lawRagData, lawRagError } = useSelector((state: RootState) => state.chat);

  // Simulate loading messages
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    async function fetchMessages() {

      if (roomId) {
        await dispatch(await ListMessages({ chatRoomId: roomId }));
      }
    }
    fetchMessages();

    // return () => {
    //   dispatch({ type: "LIST_MESSAGES_CLEAR" });
    // }
  }, [roomId, dispatch]);

  useEffect(() => {
    if (listMessagesStatus === 'REQUEST') {
      setIsLoading(true);
    }
    if (listMessagesStatus === 'SUCCESS' && listMessages.length > 0) {
      var timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [listMessagesStatus]);

  useEffect(() => {
    var lastMessage = listMessages[listMessages.length - 1];
    var lastMessageExists = messages.find((message: any) => message?.content === lastMessage?.content);
    
    if(!lastMessageExists) {
      setMessages(listMessages);
    }
  }, [listMessages]);

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
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleNewChat = async (message: string) => {

    var theRoom = listChatRoomsData?.list.find((room: any) => room._id === roomId);

    var filteredMessage = message.split(' ').slice(0, 4).join(' ');

    // if room is not found, create a new room
    if (!theRoom) {
      await dispatch(await updateChatRoom({ mode: "INS", name: filteredMessage }));
      return
    }
    if (theRoom && theRoom.name === "گفتگوی جدید") {
      await dispatch(await updateChatRoom({ mode: "UPD", roomId: roomId, name: filteredMessage }));
    }
    return
  }


  useEffect(() => {
    if (!roomId || roomId === "undefined") {
      // and add the new message to the room function
      let roomId = listChatRoomsData?.list[0]?._id;
      const addMessageToRoom = async () => {
        var userMessage = {
          id: messages.length + 1,
          content: newMessage,
          senderId: auth.user._id,
          timestamp: new Date()
        };
        await dispatch(await updateMessage({ mode: "INS", chatRoomId: roomId, content: newMessage }));
        navigate(`/chat/${roomId}`);
      }
      addMessageToRoom();
    }
  }, [listChatRoomsData]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setBotWaiting(true);

    const userMessage = {
      id: messages.length + 1,
      content: newMessage,
      senderId: auth.user._id,
      timestamp: new Date()
    };

    if (roomId) {
      await dispatch(await updateMessage({ mode: "INS", chatRoomId: roomId, content: newMessage }));
    }
    setMessages(prev => [userMessage, ...prev]);

  

    // const botMessage = {
    //   id: messages.length + 1 + "bot",
    //   content: "در حال پاسخ به پیام شما...",
    //   senderId: 'bot',
    //   timestamp: new Date(),
    //   status: "loading"
    // };

    // setMessages(prev => [botMessage, ...prev]);

    await handleNewChat(newMessage);

    setBotWaiting(true);
  };

  useEffect(() => {
    if (updateMessageStatus === "SUCCESS") {
      // setMessages(prev => [...prev, listMessagesData.list[0]]);
      const fetchLawRag = async () => {
        await dispatch(await lawRag({ chatRoomId: roomId, message: newMessage }));
      }
      fetchLawRag();
      setNewMessage('');
    }
  }, [updateMessageStatus]);

  useEffect(() => {
    if (lawRagStatus === "REQUEST") {
      setBotWaiting(true);
    }
    if (lawRagStatus === "SUCCESS") {
      const botMessage = {
        id: messages.length + 1 + "bot",
        content: lawRagData,
        senderId: 'bot',
        timestamp: new Date(),
        status: "done"
      };
      setMessages(prev => [botMessage, ...prev]);
      setBotWaiting(false);
    }
  }, [lawRagStatus]);

  const handleExampleClick = (prompt: { title: string, description: string }) => {
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
                onClick={() => handleExampleClick({ title: prompt.title, description: prompt.description })}
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
          <LogoAnimation size={48} />
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
            <LogoAnimation size={48} className="welcome-logo" />
            <h2>دستیار حقوقی هوشمند</h2>
            <Typewriter
              text={auth.user?.firstName ? `سلام ${auth.user?.firstName}، چطور میتونم کمکتون کنم؟` : 'سلام، چطور میتونم کمکتون کنم؟'}
              speed={50}
              className="color-text-secondary"
            />            
          </div>
          {renderExamples()}
        </div>
      );
    }

    return (
      messages.map((message) => {

        if (message?.senderId === auth.user._id) {
          var sender = "user";
        } else {
          var sender = "bot";
        }


        return (
          <div
            key={message._id ? message._id : message.id}
            className={`message ${sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-avatar">
              {sender === 'user' ?
                <User size={20} /> :
                <Bot size={20} />
              }
            </div>

            
              <div className="message-content">
                <div className={sender === 'user' ? "message-text" : "message-bot-text"}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{message.content}</ReactMarkdown>
                </div>
                <div className="message-time">
                  {/* Time display code */}
                </div>
              </div>
          
          </div>
        )
      }
      )
    );
  };

  const renderBotWaiting = () => {
    return (
      <div
            key="bot-waiting"
            className={`message bot-message`}
          >
            <div className="message-avatar">
              <Bot size={20} />
            </div>

            <div className="message-content particles-container">
                <div className="message-text">
                  <div className="loading-content">
                    {/* <span className="loading-dots">در حال پاسخ به پیام شما</span> */}
                    <Typewriter
                      text="در حال پاسخ به پیام شما..."
                      speed={100}
                      className="loading-text"
                    />
                  </div>
                </div>
              </div>
          </div>
    )
  }

  return (
    <div className="chat-container">


      <div className="messages-container">
        <div className="particles-container">
            {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>

        <div className="messages-wrapper">
          <div ref={messagesEndRef} />
          {botWaiting &&  renderBotWaiting()}
          {renderContent()}
        </div>

      </div>

      {!isLoading && <div className={`input-container ${messages.length === 0 ? 'new-chat' : ''}`}>
        <form onSubmit={handleSubmit} className="input-wrapper">
          <textarea
            value={newMessage}
            onChange={(e) => {
              const textarea = e.target;
              if (e.target.value.length === 0) {
                textarea.style.height = '44px';
                textarea.style.overflow = 'hidden';
              }
              if (e.target.value.length > 0) {
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
      </div>}
    </div>
  );
}