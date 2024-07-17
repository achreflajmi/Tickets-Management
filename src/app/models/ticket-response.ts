/* tslint:disable */
/* eslint-disable */
// ticket-response.model.ts
import { TicketPriority, TicketType, TicketStatus } from '../User/dashbord/dashbord.component'; 
export interface TicketResponse {
  id: number;
  subject: string;
  username: string;
  type: TicketType;
  date: Date;
  status: TicketStatus;
  priority: TicketPriority;
  locked: boolean; 
}
  