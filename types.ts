export interface User {
  id: string;
  name: string;
  avatar: string;
}

export enum MessageType {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: MessageType;
  fileName?: string;
  fileType?: string;
}

export interface Chat {
  id: string;
  participantIds: string[];
  messages: Message[];
}
