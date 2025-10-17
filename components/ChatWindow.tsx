import React, { useRef, useEffect } from 'react';
import { Chat, User, MessageType } from '../types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  chat: Chat;
  currentUser: User;
  users: User[];
  onSendMessage: (chatId: string, content: string, type: MessageType, fileName?: string, fileType?: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, currentUser, users, onSendMessage }) => {
  const otherParticipantId = chat.participantIds.find(id => id !== currentUser.id);
  const otherParticipant = users.find(u => u.id === otherParticipantId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);
  
  const handleSendMessage = (content: string, type: MessageType, file?: File) => {
    onSendMessage(chat.id, content, type, file?.name, file?.type);
  };

  if (!otherParticipant) return <div className="flex-1 flex items-center justify-center">User not found</div>;

  return (
    <div className="flex-1 flex flex-col bg-slate-800">
      <header className="p-4 bg-slate-900 border-b border-slate-700 flex items-center space-x-4 sticky top-0 z-10">
        <img src={otherParticipant.avatar} alt={otherParticipant.name} className="w-10 h-10 rounded-full" />
        <div>
            <h2 className="text-lg font-bold text-white">{otherParticipant.name}</h2>
            <p className="text-sm text-slate-400">Online</p>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chat.messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            isSender={message.senderId === currentUser.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
