import React, { useState } from 'react';
import { User, Chat } from '../types';
import Modal from './Modal';
import { NewChatIcon, LogoutIcon } from './icons';

interface SidebarProps {
  currentUser: User;
  users: User[];
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onStartChat: (participantId:string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  users,
  chats,
  activeChatId,
  onSelectChat,
  onStartChat,
  onLogout
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatUserId, setNewChatUserId] = useState('');

  const handleStartChat = () => {
    if (newChatUserId) {
        onStartChat(newChatUserId);
        setIsModalOpen(false);
        setNewChatUserId('');
    }
  };

  const otherUsers = users.filter(u => u.id !== currentUser.id);

  return (
    <>
      <aside className="w-80 bg-slate-900 flex flex-col h-full border-r border-slate-700">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold text-white">{currentUser.name}</p>
              <p className="text-xs text-slate-400 truncate">{currentUser.id}</p>
            </div>
          </div>
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
            <LogoutIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-700">
            <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center space-x-2 bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors">
                <NewChatIcon className="w-5 h-5"/>
                <span>New Chat</span>
            </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => {
            const otherParticipantId = chat.participantIds.find(id => id !== currentUser.id);
            const otherParticipant = users.find(u => u.id === otherParticipantId);
            const lastMessage = chat.messages[chat.messages.length - 1];

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`flex items-center p-3 cursor-pointer border-l-4 ${activeChatId === chat.id ? 'bg-slate-700/50 border-cyan-500' : 'border-transparent hover:bg-slate-800'}`}
              >
                <img src={otherParticipant?.avatar} alt={otherParticipant?.name} className="w-12 h-12 rounded-full mr-4" />
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold text-white">{otherParticipant?.name}</p>
                  <p className="text-sm text-slate-400 truncate">
                    {lastMessage ? lastMessage.content : 'No messages yet'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4 text-white">Start a new chat</h2>
        <p className="text-slate-400 mb-6">Enter the User ID of the person you want to chat with.</p>
        <div className="space-y-4">
            <input 
                type="text" 
                value={newChatUserId} 
                onChange={e => setNewChatUserId(e.target.value)} 
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="user@echosphere"
            />
            <p className="text-xs text-slate-500">Or select from existing users:</p>
            <div className="max-h-40 overflow-y-auto space-y-2">
                {otherUsers.map(user => (
                    <button key={user.id} onClick={() => setNewChatUserId(user.id)} className="w-full text-left flex items-center p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
                        <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.id}</p>
                        </div>
                    </button>
                ))}
            </div>
            <button onClick={handleStartChat} className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors">
                Start Chat
            </button>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
