import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, FileText, Image, X, Check, Clock } from 'lucide-react';

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
    {
      id: '2',
      content: 'I need help with analyzing this document.',
      sender: 'user',
      timestamp: new Date(Date.now() - 30000),
      status: 'read'
    },
    {
      id: '3',
      content: 'I\'d be happy to help you analyze your document. Please upload the file and I\'ll take a look at it.',
      sender: 'bot',
      timestamp: new Date(Date.now() - 15000),
      status: 'read'
    }
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
        return <div className="flex text-blue-500"><Check className="w-3 h-3" /><Check className="w-3 h-3 -ml-1" /></div>;
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
    <div className={`min-h-screen ${className}`} style={{ backgroundColor: 'hsl(var(--chat-background))' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
            AI
          </div>
          <div>
            <h1 className="font-medium text-foreground">Chat Assistant</h1>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="px-6 py-4 space-y-4 pb-32">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                message.sender === 'user' ? '' : 'bg-muted text-muted-foreground'
              }`}
              style={message.sender === 'user' ? {
                backgroundColor: 'hsl(var(--chat-user-bubble))',
                color: 'hsl(var(--chat-user-text))'
              } : {}}
            >
              {message.sender === 'user' ? 'You' : 'AI'}
            </div>

            {/* Message content */}
            <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'text-right' : ''}`}>
              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mb-2 space-y-2">
                  {message.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className={`p-3 rounded-[10px] border border-border bg-background flex items-center gap-3 ${
                        message.sender === 'user' ? 'ml-auto' : ''
                      }`}
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
                    </div>
                  ))}
                </div>
              )}

              {/* Text message */}
              {message.content && (
                <div
                  className="p-3 rounded-[10px]"
                  style={{
                    backgroundColor: message.sender === 'user' 
                      ? 'hsl(var(--chat-user-bubble))' 
                      : 'hsl(var(--chat-bot-bubble))',
                    color: message.sender === 'user' 
                      ? 'hsl(var(--chat-user-text))' 
                      : 'hsl(var(--chat-bot-text))'
                  }}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
      <div className="fixed max-w-[1192px] m-auto bottom-0 left-0 right-0 z-20 border-t border-border bg-background px-6 py-4">
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 bg-muted p-2 rounded-lg"
              >
                {attachment.type === 'image' ? (
                  <Image className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <FileText className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm truncate max-w-32">{attachment.name}</span>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="w-full flex relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full resize-none border h-fit rounded-[10px] px-4 py-3 pr-12 text-sm focus:outline-none transition-colors"
              rows={1}
              style={{
                minHeight: '44px',
                maxHeight: '120px',
                backgroundColor: 'hsl(var(--chat-input-background))',
                borderColor: 'hsl(var(--chat-input-border))'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'hsl(var(--chat-input-focus))';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'hsl(var(--chat-input-border))';
              }}
            />
            
            {/* File upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute hover:cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          
          <Button
            type="submit"
            size="sm"
            className="h-11 w-11 rounded-[10px]"
            disabled={!inputValue.trim() && attachments.length === 0}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;