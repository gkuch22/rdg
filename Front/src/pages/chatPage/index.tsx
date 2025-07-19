import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, FileText, Image, X, Check, Clock } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  attachments?: Array<{
    id: string;
    name: string;
    type: 'image' | 'pdf';
    url: string;
    size: number;
  }>;
}

interface ChatInterfaceProps {
  className?: string;
}



const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(Date.now() - 60000),
      status: 'read'
    },
  ]);




  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<Array<{
    id: string;
    name: string;
    type: 'image' | 'pdf';
    file: File;
  }>>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

const scrollToBottom = () => {
  setTimeout(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center' // Changed from default 'start'
    });
  }, 0);
};


// New state for tracking keyboard visibility
  const [keyboardVisible, setKeyboardVisible] = useState(false);

   // Handle viewport changes for mobile keyboard
  useEffect(() => {
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const viewport = window.visualViewport;
        const isKeyboardOpen = viewport.height < window.innerHeight * 0.75;
        setKeyboardVisible(isKeyboardOpen);
        
        if (isKeyboardOpen && textareaRef.current) {
          // Small delay to ensure the keyboard is fully open
          setTimeout(() => {
            textareaRef.current?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'nearest' 
            });
          }, 100);
        }
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => {
        window.visualViewport?.removeEventListener('resize', handleViewportChange);
      };
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    }); 
  }; 

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      
      if (isImage || isPdf) {
        const newAttachment = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: isImage ? 'image' as const : 'pdf' as const,
          file
        };
        setAttachments(prev => [...prev, newAttachment]);
      }
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() && attachments.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
      attachments: attachments.map(att => ({
        id: att.id,
        name: att.name,
        type: att.type,
        url: URL.createObjectURL(att.file),
        size: att.file.size
      }))
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setAttachments([]);

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
      ));
    }, 500);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    // Simulate bot typing and response
    setTimeout(() => {
      setIsTyping(true);
    }, 1500);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse: Message = {
        id: Date.now().toString() + '_bot',
        content: 'I can see your message' + (newMessage.attachments && newMessage.attachments.length > 0 ? ' and attachments' : '') + '. Let me analyze this for you.',
        sender: 'bot',
        timestamp: new Date(),
        status: 'read'
      };
      setMessages(prev => [...prev, botResponse]);
      
      // Mark user message as read
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const MessageStatus = ({ status }: { status?: Message['status'] }) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-muted-foreground animate-pulse" />;
      case 'sent':
        return <Check className="w-3 h-3 text-muted-foreground" />;
      case 'delivered':
        return <div className="flex"><Check className="w-3 h-3 text-muted-foreground" /><Check className="w-3 h-3 text-muted-foreground -ml-1" /></div>;
      case 'read':
        return <div className="flex text-main"><Check className="w-3 h-3" /><Check className="w-3 h-3 -ml-1" /></div>;
      default:
        return null;
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
        AI
      </div>
      <div className="p-3 rounded-[10px] max-w-xs" style={{ backgroundColor: 'hsl(var(--chat-bot-bubble))' }}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`w-full ${className}`} style={{ backgroundColor: 'none' }}>
      
      {/* Header */}
      <div className="fixed w-full max-w-[1200px] top-0 right-1/2 translate-x-1/2 z-10 border-b border-border px-6 py-4 bg-background">
        <Link to={"/"} className="flex w-fit group items-center max-sm:justify-center gap-3">
          <div className="w-10 h-10 group-hover:rotate-360 duration-300 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#000000">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path style={{ fill: "#AEADB3" }} d="M425.347,468.992c-2.692,0-5.415-0.544-8.001-1.675c-17.573-7.7-81.137-32.815-161.348-32.815 s-143.772,25.117-161.344,32.814c-8.728,3.823-19.019,0.927-24.47-6.881c-5.453-7.809-4.623-18.466,1.968-25.341 C186.457,315.937,237.211,92.289,237.211,27.393h37.579c0,64.896,50.753,288.544,165.057,407.7 c6.594,6.876,7.422,17.533,1.969,25.342C437.978,465.931,431.746,468.992,425.347,468.992z M256,396.922 c45.128,0,85.512,7.323,116.679,15.573c-43.826-61.302-73.867-132.096-92.604-185.955c-9.769-28.08-17.756-55.189-24.076-80.274 c-6.32,25.085-14.306,52.194-24.076,80.274c-18.737,53.859-48.775,124.654-92.604,185.955 C170.489,404.247,210.872,396.922,256,396.922z"></path>
                <path style={{ fill: "#56545A" }} d="M439.847,435.093C325.543,315.937,274.79,92.289,274.79,27.393H256v118.872l0,0 c6.32,25.085,14.306,52.194,24.076,80.274c18.737,53.859,48.777,124.654,92.604,185.955c-31.168-8.25-71.551-15.573-116.679-15.573 l0,0V434.5l0,0c80.209,0,143.773,25.117,161.348,32.815c2.584,1.131,5.307,1.675,8.001,1.675c6.397,0,12.63-3.061,16.469-8.557 C447.267,452.626,446.439,441.969,439.847,435.093z"></path>
                <rect x="237.213" y="27.393" style={{ fill: "#88888F" }} width="37.579" height="457.214"></rect>
                <path style={{ fill: "#FF4F19" }} d="M510.695,132.83c-5.431-20.27-26.265-32.299-46.536-26.868l-26.215,7.024l-7.025-26.215 c-5.431-20.27-26.267-32.299-46.536-26.868c-20.27,5.431-32.299,26.267-26.868,46.536l26.693,99.619l99.619-26.693 C504.099,173.935,516.126,153.099,510.695,132.83z"></path>
                <g>
                  <path style={{ fill: "#AF2E08" }} d="M510.696,132.83c-5.431-20.27-26.267-32.299-46.536-26.868l-26.215,7.025l-53.735,93.071 l99.619-26.693C504.099,173.935,516.128,153.099,510.696,132.83z"></path>
                  <path style={{ fill: "#AF2E08" }} d="M127.617,59.904c-20.27-5.431-41.104,6.598-46.536,26.868l-7.025,26.215l8.478,54.1l45.258,38.971 l26.693-99.619C159.916,86.169,147.887,65.336,127.617,59.904z"></path>
                </g>
                <path style={{ fill: "#FF4F19" }} d="M1.304,132.83c5.431-20.27,26.267-32.299,46.536-26.868l26.215,7.025l53.735,93.071l-99.618-26.693 C7.902,173.935-4.127,153.099,1.304,132.83z"></path>
              </g>
            </svg>
          </div>
          <div>
            <h1 className="font-medium text-2xl luckiest-guy-regular text-main group-hover:tracking-widest duration-300">Guidee</h1>
          </div>
        </Link>
      </div>

      {/* Messages */}
      <div className="px-4 sm:px-6 max-w-[1200px] m-auto py-4 space-y-6 pb-[200px] pt-[90px] min-h-screen w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
           

            {/* Message content */}
            <div className={`max-w-xs flex flex-col lg:max-w-md ${message.sender === 'user' ? 'text-right items-end' : 'items-start'}`}>
              
              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
  <div className="mb-2 space-y-2 w-full max-w-fit">
    {message.attachments.map((attachment) => (
      <a 
        key={attachment.id} 
        href={attachment.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`p-3 rounded-[10px] border border-border bg-background flex items-center gap-3 ${
          message.sender === 'user' ? 'ml-auto' : ''
        } hover:bg-accent hover:cursor-pointer transition-colors`}
      >
        {attachment.type === 'image' ? (
          <Image className="w-4 h-4 text-muted-foreground" />
        ) : (
          <FileText className="w-4 h-4 text-muted-foreground" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.name}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
        </div>
      </a>
    ))}
  </div>
)}

              {/* Text message */}
              {message.content && (
                <div
                  className={`p-3 min-w-[57px] w-fit flex justify-center rounded-[10px] ${message.sender === 'user' ? "bg-main text-white" : "bg-other" }`}
                
                >
                  <div>
                  <p className="text-sm text-start whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              )}

              {/* Timestamp and status */}
              <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                message.sender === 'user' ? 'justify-end' : ''
              }`}>
                <span>{formatTime(message.timestamp)}</span>
                {message.sender === 'user' && <MessageStatus status={message.status} />}
              </div>
            </div>
          </div>
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
 <div 
        className={`max-w-[1200px] m-auto border-t border-border bg-background px-6 py-4 transition-all duration-200 ${
          keyboardVisible 
            ? 'fixed bottom-0 left-0 right-0 z-20' 
            : 'fixed bottom-0 left-0 right-0 z-20'
        }`}
        style={{
          transform: keyboardVisible ? 'translateY(0)' : 'translateY(0)'
        }}
      >        {/* Attachments preview */}
        {attachments.length > 0 && (
  <div className="mb-3 flex flex-wrap gap-2">
    {attachments.map((attachment) => (
      <a
        key={attachment.id}
        href={URL.createObjectURL(attachment.file)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-muted p-2 rounded-lg hover:bg-accent hover:cursor-pointer transition-colors"
      >
        {attachment.type === 'image' ? (
          <Image className="w-4 h-4 text-muted-foreground" />
        ) : (
          <FileText className="w-4 h-4 text-muted-foreground" />
        )}
        <span className="text-sm truncate max-w-32">{attachment.name}</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            removeAttachment(attachment.id);
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 hover:cursor-pointer" />
        </button>
      </a>
    ))}
  </div>
)}
        
        <form onSubmit={handleSubmit} className="flex max-sm:flex-col items-center gap-2">
          <div className="w-full flex relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full sm:h-24 resize-none h-fit rounded-[6px] px-4 py-3 pr-12 text-sm focus:outline-none transition-colors border-[rgb(200,200,200)] border-1"
              style={{
               scrollbarWidth: "thin",
                scrollbarColor: "rgba(156, 163, 175) transparent",
              }}
            />
            
          
          
          </div>
<div className='flex max-sm:w-full justify-start sm:flex-col gap-2'>

    <Button
            type="submit"
            className="h-11 w-11 rounded-[10px] group hover:cursor-pointer"
            disabled={!inputValue.trim() && attachments.length === 0}
          >
            <Send className="w-5 h-5 group-hover:scale-120 duration-200" />
          </Button>
          <div>
              <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-11 w-11 rounded-[10px] group text-main justify-center bg-other items-center hover:cursor-pointer hover:bg-[rgb(210,210,210)] transition-colors"
            >
              <Paperclip className="w-5 h-5 group-hover:scale-120 duration-200" />
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;