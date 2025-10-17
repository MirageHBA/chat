import React from 'react';
import { Message, MessageType } from '../types';
import { AudioIcon, DocumentIcon, VideoIcon } from './icons';

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSender }) => {
  const alignment = isSender ? 'justify-end' : 'justify-start';
  const bubbleColor = isSender ? 'bg-cyan-600' : 'bg-slate-700';
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderContent = () => {
    switch (message.type) {
      case MessageType.AUDIO:
        return (
          <div className="flex items-center space-x-2">
            <AudioIcon className="w-5 h-5 flex-shrink-0" />
            <audio controls src={message.content} className="max-w-full h-10"></audio>
          </div>
        );
      case MessageType.VIDEO:
        return (
            <div className='space-y-2'>
                <p className='flex items-center gap-2'><VideoIcon className='w-5 h-5' /><span>{message.fileName}</span></p>
                <video controls src={message.content} className="rounded-lg max-w-xs max-h-64"></video>
            </div>
        );
      case MessageType.DOCUMENT:
        return (
          <a
            href={message.content}
            download={message.fileName}
            className="flex items-center space-x-3 bg-slate-600/50 p-3 rounded-lg hover:bg-slate-500/50"
          >
            <DocumentIcon className="w-8 h-8 text-slate-300" />
            <div>
                <p className="font-medium">{message.fileName}</p>
                <p className="text-xs text-slate-300">{message.fileType}</p>
            </div>
          </a>
        );
      case MessageType.TEXT:
      default:
        return <p className="text-white whitespace-pre-wrap break-words">{message.content}</p>;
    }
  };

  return (
    <div className={`flex ${alignment} w-full`}>
      <div className={`flex flex-col max-w-lg lg:max-w-xl`}>
        <div className={`${bubbleColor} rounded-xl px-4 py-2`}>
            {renderContent()}
        </div>
        <span className={`text-xs text-slate-500 mt-1 ${isSender ? 'text-right' : 'text-left'}`}>{time}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
