import { useState, useEffect, useCallback } from 'react';
import { User, Chat, Message, MessageType } from '../types';

const PREPOPULATED_USERS: User[] = [
  { id: 'alice@echosphere', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice' },
  { id: 'bob@echosphere', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob' },
];

const useChat = (currentUser: User | null) => {
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('chat_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(PREPOPULATED_USERS);
      localStorage.setItem('chat_users', JSON.stringify(PREPOPULATED_USERS));
    }

    const storedChats = localStorage.getItem('chat_chats');
    if (storedChats) {
      setChats(JSON.parse(storedChats));
    }
  }, []);

  const saveUsers = useCallback((updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('chat_users', JSON.stringify(updatedUsers));
  }, []);

  const saveChats = useCallback((updatedChats: Chat[]) => {
    setChats(updatedChats);
    localStorage.setItem('chat_chats', JSON.stringify(updatedChats));
  }, []);
  
  const createUser = (name: string): User | null => {
    if(!name.trim()) return null;
    const uniqueId = `${name.toLowerCase().replace(/\s+/g, '')}${Date.now()}@echosphere`;
    if(users.some(u => u.name.toLowerCase() === name.toLowerCase())) {
        alert("User with this name already exists.");
        return null;
    }
    const newUser: User = {
        id: uniqueId,
        name,
        avatar: `https://i.pravatar.cc/150?u=${uniqueId}`
    };
    saveUsers([...users, newUser]);
    return newUser;
  };

  const startChat = (participantId: string): Chat | null => {
    if (!currentUser || currentUser.id === participantId) return null;

    const participant = users.find(u => u.id === participantId);
    if (!participant) {
        alert("User not found!");
        return null;
    }

    const sortedIds = [currentUser.id, participantId].sort();
    const chatId = sortedIds.join('--');

    const existingChat = chats.find(c => c.id === chatId);
    if (existingChat) {
      return existingChat;
    }

    const newChat: Chat = {
      id: chatId,
      participantIds: sortedIds,
      messages: [],
    };
    saveChats([...chats, newChat]);
    return newChat;
  };

  const sendMessage = (chatId: string, content: string, type: MessageType, fileName?: string, fileType?: string) => {
    if (!currentUser) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content,
      timestamp: Date.now(),
      type,
      fileName,
      fileType,
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, messages: [...chat.messages, newMessage] };
      }
      return chat;
    });

    saveChats(updatedChats);
  };
  
  return { users, chats, sendMessage, startChat, createUser };
};

export default useChat;
