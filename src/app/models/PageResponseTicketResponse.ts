/* tslint:disable */
/* eslint-disable */
import { TicketResponse } from '../models/ticket-response';

export interface PageResponseTicketResponse {
  content?: TicketResponse[];
  first?: boolean;
  last?: boolean;
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}
