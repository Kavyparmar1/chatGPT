import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Plus, 
  MessageSquare, 
  Menu, 
  X, 
  User, 
  Bot, 
  Trash2,
  Edit2,
  MoreVertical,
  Sun,
  Moon
} from 'lucide-react';
import { io } from "socket.io-client";
import axios from 'axios';

const ChatInterface = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [Socket, setSocket] = useState(null)
  // Sample chat data with history
  const [chats, setChats] = useState([
    {
      id: 1,
      title: "Getting Started with React",
      messages: [
        {
          id: 1,
          type: 'user',
          content: 'How do I create a React component?',
          timestamp: new Date('2024-08-27T10:30:00')
        },
        {
          id: 2,
          type: 'ai',
          content: 'To create a React component, you can use either function components or class components. Here\'s a simple function component example:\n\n```jsx\nfunction MyComponent() {\n  return (\n    <div>\n      <h1>Hello World!</h1>\n    </div>\n  );\n}\n```\n\nFunction components are the modern preferred way to create components in React.',
          timestamp: new Date('2024-08-27T10:30:15')
        }
      ]
    },
    {
      id: 2,
      title: "JavaScript Async/Await",
      messages: [
        {
          id: 1,
          type: 'user',
          content: 'Explain async/await in JavaScript',
          timestamp: new Date('2024-08-26T15:20:00')
        },
        {
          id: 2,
          type: 'ai',
          content: 'Async/await is a syntax that makes it easier to work with promises in JavaScript. It allows you to write asynchronous code that looks and behaves more like synchronous code.\n\nHere\'s how it works:\n\n```javascript\nasync function fetchData() {\n  try {\n    const response = await fetch(\'https://api.example.com/data\');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error(\'Error:\', error);\n  }\n}\n```',
          timestamp: new Date('2024-08-26T15:20:30')
        }
      ]
    },
    {
      id: 3,
      title: "CSS Grid Layout",
      messages: [
        {
          id: 1,
          type: 'user',
          content: 'What is CSS Grid?',
          timestamp: new Date('2024-08-25T09:15:00')
        }
      ]
    }
  ]); 
  
  


      // 🔹 Setup socket
  useEffect(() => {
    const newSocket = io("https://chatgpt-h38f.onrender.com", { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to server:", newSocket.id);
    });

    // 🔹 Listen for AI responses (attach once)
    newSocket.on("ai-response", (data) => {
      // data -> { content, chat }
      console.log('received ai-response', data);
      const aiMessage = {
        id: Date.now(),
        type: 'ai',
        content: data?.content || '',
        timestamp: new Date()
      };

      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === data.chat 
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );

      setIsTyping(false);
    });

    return () => {
      newSocket.off("ai-response");
      newSocket.disconnect();
    };
  }, []);

  const currentChat = chats.find(chat => chat.id === currentChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
 

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;


  
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };   
   
     
    Socket.emit("user-message",{
      chat:currentChatId,
      content:inputMessage
    }) 
  
     

    // Add user message
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, newUserMessage] }
          : chat
      )
    );

  setInputMessage('');
  // show typing indicator until server responds
  setIsTyping(true);
  };


  const createNewChat = async () => {
    const chatTitle = prompt("Enter chat title:");
    if (!chatTitle) return;

  try {
      const response = await axios.post("https://chatgpt-h38f.onrender.com/api/chat", {
      title: chatTitle
    }, {
      withCredentials:true
  });
      const newChat = {
      id: response.data.chat.id,
      title: chatTitle,
      messages: []
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
    setIsSidebarOpen(false);
   console.log(response.data);
  } catch (error) {
    
    console.error("Error creating chat:", error);
  }
   

  };

  const deleteChat = (chatId) => {
    setChats(chats.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId && chats.length > 1) {
      setCurrentChatId(chats.find(chat => chat.id !== chatId).id);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  const sidebarClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  return (
    <div className={`h-screen flex ${themeClasses} transition-colors duration-200`}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-50 lg:z-0 w-80 h-full transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarClasses} border-r flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700 lg:border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-8 h-8 text-blue-500" />
              <h1 className="text-xl font-bold">AI Chat</h1>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-700 lg:hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={createNewChat}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-colors
              ${isDarkMode 
                ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }
            `}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {chats.map(chat => (
              <div key={chat.id} className="group relative">
                <button
                  onClick={() => {
                    setCurrentChatId(chat.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                    ${currentChatId === chat.id 
                      ? (isDarkMode ? 'bg-gray-700' : 'bg-blue-50 text-blue-700')
                      : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                    }
                  `}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate text-sm font-medium">
                    {chat.title}
                  </span>
                </button>
                
                {/* Chat Options */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => deleteChat(chat.id)}
                    className={`
                      p-1.5 rounded hover:bg-red-500 hover:text-white transition-colors
                      ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`
              flex items-center gap-3 w-full p-3 rounded-lg transition-colors
              ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
            `}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className={`
          p-4 border-b flex items-center justify-between
          ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}
        `}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-700 lg:hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-semibold text-lg truncate">
              {currentChat?.title || 'Select a chat'}
            </h2>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentChat?.messages.map(message => (
            <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'ai' && (
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'}
                `}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`
                max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                }
              `}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className={`
                  text-xs mt-2 opacity-70 
                  ${message.type === 'user' ? 'text-blue-100' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}
                `}>
                  {formatTime(message.timestamp)}
                </div>
              </div>

              {message.type === 'user' && (
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}
                `}>
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'}
              `}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className={`
                max-w-[70%] rounded-2xl px-4 py-3
                ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
              `}>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className={`
          p-4 border-t
          ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}
        `}>
          <div className={`
            flex items-end gap-3 max-w-4xl mx-auto rounded-2xl border p-3
            ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}
          `}>
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                rows={1}
                className={`
                  w-full resize-none border-none outline-none bg-transparent
                  ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}
                `}
                style={{
                  minHeight: '24px',
                  maxHeight: '120px'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className={`
                p-2 rounded-xl transition-all duration-200 flex-shrink-0
                ${inputMessage.trim() && !isTyping
                  ? 'bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105' 
                  : (isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500')
                }
                disabled:cursor-not-allowed disabled:transform-none
              `}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;