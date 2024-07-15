/* tslint:disable */
/* eslint-disable */
import { TicketPriority, TicketStatus, TicketType } from '../dashbord/dashbord.component'; 


export interface TicketRequest {
    id: number;
    subject: string;
    date?: Date;
    type: TicketType;
    status: TicketStatus;
    priority: TicketPriority;
    username?: string;
  }
  