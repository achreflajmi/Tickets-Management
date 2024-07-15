export interface SendMessageRequest {
  ticket: {
    ticketId: number;
  };
  sender: {
    id: number;
  };
  messageText: string;
}
