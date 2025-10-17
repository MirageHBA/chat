import React, { useState, useEffect } from 'react';
import { User } from './types';
import useChat from './hooks/useChat';
import AuthScreen from './components/AuthScreen';
import ChatLayout from './components/ChatLayout';
import { LoadingIcon } from './components/icons';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const chatHook = useChat(currentUser);

  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUser');
    if (savedUserId) {
      const user = chatHook.users.find(u => u.id === savedUserId);
      if (user) {
        setCurrentUser(user);
      }
    }
    setIsInitializing(false);
  }, [chatHook.users]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', user.id);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <LoadingIcon className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen font-sans">
      {!currentUser ? (
        <AuthScreen onLogin={handleLogin} users={chatHook.users} createUser={chatHook.createUser} />
      ) : (
        <ChatLayout
          currentUser={currentUser}
          users={chatHook.users}
          chats={chatHook.chats}
          onSendMessage={chatHook.sendMessage}
          startChat={chatHook.startChat}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
