import React, { useState } from 'react';
import { User } from '../types';
import { LogoIcon } from './icons';

interface AuthScreenProps {
  onLogin: (user: User) => void;
  users: User[];
  createUser: (name: string) => User | null;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, users, createUser }) => {
  const [newUsername, setNewUsername] = useState('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername.trim()) {
      const newUser = createUser(newUsername);
      if (newUser) {
        onLogin(newUser);
        setNewUsername('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-8">
        <div className="text-center">
            <LogoIcon className="w-20 h-20 mx-auto text-cyan-400" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">Welcome to EchoSphere</h1>
          <p className="mt-2 text-slate-400">Connect and chat in real-time.</p>
        </div>

        {users.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-center text-lg font-medium text-slate-300">Login as an existing user</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => onLogin(user)}
                  className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors duration-200"
                >
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                  <span className="font-semibold text-white">{user.name}</span>
                </button>
              ))}
            </div>
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-800 text-slate-400">Or</span>
                </div>
            </div>
          </div>
        )}

        <form onSubmit={handleCreateUser} className="space-y-6">
          <h2 className="text-center text-lg font-medium text-slate-300">Create a new account</h2>
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-slate-600 bg-slate-900 placeholder-slate-500 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
              placeholder="Enter a new username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors duration-200"
            >
              Sign Up & Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
