export interface ChatMessage {
  id: number;
  sender: {
    id: number;
    username: string;
    roles: string[];
  };
  ticket: {
    id: number;
  };
  messageText: string;
  timestamp: Date;
  senderName: string;
  senderRole: string;
  isSender: boolean;
}
