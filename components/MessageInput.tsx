import React, { useState, useRef } from 'react';
import { MessageType } from '../types';
import { SendIcon, AttachmentIcon } from './icons';
import AudioRecorder from './AudioRecorder';

interface MessageInputProps {
  onSendMessage: (content: string, type: MessageType, file?: File) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendText = () => {
    if (text.trim()) {
      onSendMessage(text, MessageType.TEXT);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      let type: MessageType;
      if (file.type.startsWith('video/')) {
        type = MessageType.VIDEO;
      } else {
        type = MessageType.DOCUMENT;
      }
      onSendMessage(fileUrl, type, file);
    }
  };
  
  const handleSendAudio = (audioUrl: string, audioBlob: Blob) => {
    const audioFile = new File([audioBlob], `audio-recording-${Date.now()}.wav`, { type: audioBlob.type });
    onSendMessage(audioUrl, MessageType.AUDIO, audioFile);
  }

  return (
    <div className="p-4 bg-slate-900 border-t border-slate-700">
      <div className="flex items-center bg-slate-700 rounded-lg px-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-transparent p-3 text-white placeholder-slate-400 focus:outline-none resize-none"
          style={{maxHeight: '120px'}}
        />
        <AudioRecorder onSendAudio={handleSendAudio} />
        <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-cyan-400 transition-colors">
          <AttachmentIcon className="w-6 h-6" />
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button onClick={handleSendText} className="p-3 text-cyan-500 hover:text-cyan-400 transition-colors disabled:text-slate-600 disabled:cursor-not-allowed" disabled={!text.trim()}>
          <SendIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
