import React, { useState, useMemo } from 'react';
import { User, Chat, Message, MessageType } from '../types';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { LogoIcon } from './icons';

interface ChatLayoutProps {
  currentUser: User;
  users: User[];
  chats: Chat[];
  onSendMessage: (chatId: string, content: string, type: MessageType, fileName?: string, fileType?: string) => void;
  startChat: (participantId: string) => Chat | null;
  onLogout: () => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  currentUser,
  users,
  chats,
  onSendMessage,
  startChat,
  onLogout,
}) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const userChats = useMemo(() => {
    return chats
      .filter(chat => chat.participantIds.includes(currentUser.id))
      .sort((a, b) => {
        const lastMsgA = a.messages[a.messages.length - 1];
        const lastMsgB = b.messages[b.messages.length - 1];
        if (!lastMsgA) return 1;
        if (!lastMsgB) return -1;
        return lastMsgB.timestamp - lastMsgA.timestamp;
      });
  }, [chats, currentUser.id]);

  const activeChat = useMemo(() => {
    return userChats.find(chat => chat.id === activeChatId);
  }, [userChats, activeChatId]);

  const handleStartChat = (participantId: string) => {
    const chat = startChat(participantId);
    if (chat) {
      setActiveChatId(chat.id);
    }
  };

  return (
    <div className="h-screen w-full flex bg-slate-800">
      <Sidebar
        currentUser={currentUser}
        users={users}
        chats={userChats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onStartChat={handleStartChat}
        onLogout={onLogout}
      />
      <main className="flex-1 flex flex-col">
        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            currentUser={currentUser}
            users={users}
            onSendMessage={onSendMessage}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center bg-slate-800 text-slate-400 p-4">
            <LogoIcon className="w-24 h-24 text-cyan-500 opacity-50" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-300">Welcome to EchoSphere, {currentUser.name}!</h2>
            <p>Select a conversation or start a new one to begin chatting.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatLayout;
