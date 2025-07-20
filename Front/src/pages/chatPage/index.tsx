import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Send,
  Paperclip,
  FileText,
  Image,
  X,
  Check,
  Clock,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { sendMessageToBackend } from "@/API";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
  attachments?: Array<{
    id: string;
    name: string;
    type: "image" | "pdf";
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
      id: "1",
      content: "სალამი! რით შემიძლია დაგეხმარო?",
      sender: "bot",
      timestamp: new Date(Date.now() - 60000),
      status: "read",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<
    Array<{
      id: string;
      name: string;
      type: "image" | "pdf";
      file: File;
    }>
  >([]);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const newKeyboardHeight = Math.max(
        0,
        window.innerHeight - document.documentElement.clientHeight
      );
      setKeyboardHeight(newKeyboardHeight);
      setIsKeyboardVisible(newKeyboardHeight > 0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const messagesContainer = messagesEndRef.current?.parentElement;
    if (!messagesContainer) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (isKeyboardVisible) {
        e.preventDefault();
      }
    };

    messagesContainer.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    return () => {
      messagesContainer.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isKeyboardVisible]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";

      if (isImage || isPdf) {
        const newAttachment = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: isImage ? ("image" as const) : ("pdf" as const),
          file,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      }
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() && attachments.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
      status: "sending",
      attachments: attachments.map((att) => ({
        id: att.id,
        name: att.name,
        type: att.type,
        url: URL.createObjectURL(att.file),
        size: att.file.size,
      })),
    };

    // Initial optimistic update (might delete this later)
    setMessages((prev) => [...prev, newMessage]);
    const userQuestion = inputValue.trim();
    setInputValue("");
    setAttachments([]);

    try {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "sent" } : msg
        )
      );

      setIsTyping(true);

      const botAnswer = await sendMessageToBackend(userQuestion);

      setIsTyping(false);

      // lets mark user message as "delivered" when we get the response (I might get rid of this too)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        )
      );

      const botResponse: Message = {
        id: Date.now().toString() + "_bot",
        content: botAnswer,
        sender: "bot",
        timestamp: new Date(),
        status: "read",
      };

      // Add bot response and mark user message as read (I'll keep it for now)
      setMessages((prev) => [
        ...prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: "read" as Message["status"] }
            : msg
        ),
        botResponse,
      ]);
    } catch (error) {
      console.error(error);
      setIsTyping(false);

      const errorResponse: Message = {
        id: Date.now().toString() + "_bot_error",
        content: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        status: "read",
      };

      setMessages((prev) => [
        ...prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: "failed" as Message["status"] }
            : msg
        ),
        errorResponse,
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const MessageStatus = ({ status }: { status?: Message["status"] }) => {
    switch (status) {
      case "sending":
        return (
          <Clock className="w-3 h-3 text-muted-foreground animate-pulse" />
        );
      case "sent":
        return <Check className="w-3 h-3 text-muted-foreground" />;
      case "delivered":
        return (
          <div className="flex">
            <Check className="w-3 h-3 text-muted-foreground" />
            <Check className="w-3 h-3 text-muted-foreground -ml-1" />
          </div>
        );
      case "read":
        return (
          <div className="flex text-main">
            <Check className="w-3 h-3" />
            <Check className="w-3 h-3 -ml-1" />
          </div>
        );
      default:
        return null;
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
        AI
      </div>
      <div
        className="p-3 rounded-[10px] max-w-xs"
        style={{ backgroundColor: "hsl(var(--chat-bot-bubble))" }}
      >
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`w-full ${className}`} style={{ backgroundColor: "none" }}>
      {/* Header */}
      <div className="fixed w-full max-w-[1200px] top-0 right-1/2 translate-x-1/2 z-10 border-b border-border px-6 py-4 bg-background">
        <Link
          to={"/"}
          className="flex w-fit group items-center max-sm:justify-center gap-3"
        >
          <div className="w-11 h-11 group-hover:rotate-360 duration-300 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
            <svg
              className="w-full h-full p-2"
              viewBox="0 0 512 512"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M102.4,469.333c0,4.71,3.814,8.533,8.533,8.533h290.133c4.719,0,8.533-3.823,8.533-8.533s-3.814-8.533-8.533-8.533 H110.933C106.214,460.8,102.4,464.623,102.4,469.333z" />
              <path d="M262.809,263.95l-3.729,19.635l18.85-9.131c2.355-1.143,5.086-1.143,7.441,0l18.859,9.131l-3.746-19.635 c-0.452-2.355,0.12-4.796,1.562-6.716l13.747-18.321l-17.323-0.026c-3.251-0.009-6.212-1.843-7.646-4.762l-9.173-18.577 l-9.173,18.577c-1.434,2.918-4.395,4.753-7.646,4.762l-17.331,0.026l13.747,18.321 C262.689,259.154,263.261,261.594,262.809,263.95z" />
              <path d="M218.45,61.442l20.48,15.36v-76.8h-51.2v76.8l20.489-15.36C211.248,59.163,215.421,59.163,218.45,61.442z" />
              <path d="M443.733,0H256v93.867c0,3.234-1.826,6.187-4.719,7.637c-1.203,0.597-2.517,0.896-3.814,0.896 c-1.809,0-3.618-0.58-5.12-1.707l-29.013-21.76l-29.013,21.76c-2.577,1.946-6.042,2.253-8.934,0.811 c-2.893-1.451-4.719-4.403-4.719-7.637V0h-51.2H102.4C78.874,0,59.733,19.14,59.733,42.667v426.667 C59.733,492.86,78.874,512,102.4,512h341.333c4.719,0,8.533-3.823,8.533-8.533V435.2V8.533C452.267,3.823,448.452,0,443.733,0z M181.555,176.555c-2.756-2.884-3.14-7.305-0.922-10.624l17.067-25.6c1.562-2.33,4.156-3.755,6.955-3.797 c2.62,0,5.444,1.28,7.083,3.567c0.358,0.469,10.496,13.5,35.729,13.5c22.434,0,25.736-10.189,25.856-10.624 c1.126-3.738,5.043-6.468,8.559-6.263c3.806,0.154,7.083,2.637,8.004,6.298c0.247,0.777,3.84,10.59,25.847,10.59 c25.233,0,35.371-13.03,35.789-13.585c1.672-2.202,4.267-3.499,7.091-3.43c2.773,0.085,5.35,1.451,6.886,3.746l17.067,25.6 c2.219,3.319,1.835,7.74-0.922,10.624c-0.444,0.478-11.767,13.039-7.475,32.776c0.145,0.632,0.751,2.594,1.579,5.393 c1.57,5.197,3.917,13.056,6.187,21.316c8.192,29.926-7.398,78.456-40.525,98.611c-0.265,0.162-0.998,0.546-1.297,0.674 l-7.151,3.584c-21.53,9.114-42.069,22.63-42.829,28.066c0,0.128,0,0.247-0.009,0.375c-0.188,4.548-3.934,8.141-8.525,8.141 c-4.719,0-8.533-3.849-8.533-8.559c-0.708-5.376-21.274-18.918-42.325-27.793l-7.731-3.849c-0.213-0.111-1.016-0.521-1.22-0.649 c-33.126-20.147-48.717-68.676-40.525-98.603c2.27-8.26,4.617-16.119,6.187-21.316c0.828-2.799,1.434-4.762,1.604-5.478 C193.399,189.252,181.675,176.683,181.555,176.555z M76.8,42.667c0-14.114,11.486-25.6,25.6-25.6h8.533v409.6H102.4 c-2.714,0-5.342,0.316-7.91,0.802c-0.819,0.154-1.596,0.401-2.398,0.597c-1.732,0.435-3.43,0.947-5.077,1.587 c-0.862,0.333-1.69,0.7-2.526,1.092c-1.545,0.717-3.021,1.527-4.454,2.415c-0.742,0.461-1.485,0.896-2.193,1.399 c-0.333,0.239-0.717,0.418-1.041,0.657V42.667z M435.2,494.933H102.4c-14.114,0-25.6-11.486-25.6-25.6 c0-14.114,11.486-25.6,25.6-25.6h17.067H435.2V494.933z" />
              <path d="M230.659,320.066l7.219,3.575c10.709,4.506,31.881,14.438,43.725,26.547c11.87-12.126,33.161-22.11,44.22-26.778 l6.733-3.388c28.604-17.365,38.605-58.684,32.913-79.471c-2.219-8.115-4.531-15.829-6.059-20.932 c-1.058-3.524-1.766-5.939-1.92-6.639c-4.326-19.925,2.594-34.944,7.535-42.59l-8.149-12.228 c-7.74,5.777-21.06,12.501-41.139,12.501c-17.596,0-28.023-5.18-34.133-10.718c-6.118,5.538-16.546,10.718-34.133,10.718 c-20.087,0-33.399-6.724-41.148-12.501l-8.149,12.228c4.941,7.646,11.87,22.656,7.543,42.564c-0.154,0.725-0.862,3.14-1.92,6.665 c-1.527,5.103-3.849,12.817-6.059,20.932C192.045,261.339,202.038,302.658,230.659,320.066z M222.816,226.592 c1.442-2.893,4.395-4.719,7.629-4.727l29.073-0.034l14.481-29.338c2.867-5.828,12.433-5.828,15.3,0l14.481,29.338l29.082,0.034 c3.226,0.008,6.178,1.835,7.62,4.727c1.442,2.884,1.135,6.349-0.811,8.926l-21.717,28.945l6.212,32.606 c0.597,3.166-0.631,6.409-3.191,8.371c-1.519,1.161-3.354,1.758-5.188,1.758c-1.271,0-2.543-0.273-3.721-0.853l-30.413-14.729 l-30.421,14.729c-2.884,1.417-6.349,1.058-8.909-0.905c-2.56-1.963-3.789-5.197-3.191-8.371l6.212-32.606l-21.717-28.945 C221.682,232.94,221.374,229.476,222.816,226.592z" />
            </svg>
          </div>
          <div>
            <h1 className="font-medium text-2xl luckiest-guy-regular text-main group-hover:tracking-widest duration-300">
              Samartliko
            </h1>
          </div>
        </Link>
      </div>

      <div
        className={`px-4 sm:px-6 max-w-[1200px] m-auto py-4 space-y-6 pb-[150px] sm:pb-[200px] pt-[90px] w-full max-sm:overflow-y-auto sm:min-h-screen`}
        style={{
          paddingBottom: `calc(150px + ${keyboardHeight}px)`,
          touchAction: isKeyboardVisible ? "none" : "auto",
          overscrollBehavior: "contain",
        }}
        ref={(el) => {
          if (el) {
            el.style.touchAction = isKeyboardVisible ? "none" : "auto";
          }
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Message content */}
            <div
              className={`max-w-xs flex flex-col lg:max-w-md ${
                message.sender === "user"
                  ? "text-right items-end"
                  : "items-start"
              }`}
            >
              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mb-2 space-y-2 w-full max-w-50 sm:max-w-fit">
                  {message.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-[10px] border border-border bg-background flex items-center gap-3 ${
                        message.sender === "user" ? "ml-auto" : ""
                      } hover:bg-accent hover:cursor-pointer transition-colors`}
                    >
                      {attachment.type === "image" ? (
                        <Image className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(attachment.size)}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Text message */}
              {message.content && (
                <div
                  className={`p-3 min-w-[57px] w-fit flex justify-center rounded-[10px] ${
                    message.sender === "user"
                      ? "bg-main text-white"
                      : "bg-other"
                  }`}
                >
                  <div>
                    <p
                      className="text-sm text-start whitespace-pre-wrap break-words"
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {message.content}
                    </p>
                  </div>
                </div>
              )}

              {/* Timestamp and status */}
              <div
                className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                <span>{formatTime(message.timestamp)}</span>
                {message.sender === "user" && (
                  <MessageStatus status={message.status} />
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/*input area div*/}
      <div
        className="max-w-[1200px] m-auto border-t border-border bg-background px-6 py-4 fixed left-0 right-0 z-20"
        style={{
          bottom: `${keyboardHeight}px`,
          transition: "bottom 0.2s ease-out",
        }}
      >
        {/* Attachments preview */}
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
                {attachment.type === "image" ? (
                  <Image className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <FileText className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm truncate max-w-32">
                  {attachment.name}
                </span>
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

        <div
          onSubmit={handleSubmit}
          className="flex max-sm:flex-col items-center gap-2"
        >
          <div className="w-full flex relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                // Scroll to bottom when focused to ensure visibility
                setTimeout(() => scrollToBottom(), 100);
              }}
              placeholder="Type a message..."
              className="w-full sm:h-24 resize-none h-fit rounded-[6px] px-4 py-3 pr-12 text-sm focus:outline-none transition-colors border-[rgb(200,200,200)] border-1"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(156, 163, 175) transparent",
              }}
            />
          </div>

          <div className="flex max-sm:w-full justify-start sm:flex-col gap-2">
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
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
