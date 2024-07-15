import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TicketService } from '../ticket.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { AddTicketComponent } from '../add-ticket/add-ticket.component';
import { TicketResponse } from '../models/ticket-response';
import { Observable } from 'rxjs';
import { PageResponseTicketResponse } from '../models/PageResponseTicketResponse';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TokenService } from '../token/token.service';
import { HttpClientModule } from '@angular/common/http';
import { TicketDetailsComponent } from '../ticket-details/ticket-details.component';
import { ChatComponent } from '../chat/chat.component';
import { FormsModule } from '@angular/forms';

export enum TicketType {
  Incident = 'Incident',
  Suggestion = 'Suggestion',
  Question = 'Question',
  Problem = 'Problem',
}

export enum TicketStatus {
  New = 'New',
  InProgress = 'InProgress',
  Resolved = 'Resolved',
  Closed = 'Closed',
}
export enum TicketPriority {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
}



@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, MatDialogModule, TicketDetailsComponent, HttpClientModule, ChatComponent, RouterModule],
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css'],
  providers: [TicketService, TokenService]
})
export class DashbordComponent implements OnInit {
  tickets: TicketResponse[] = [];
  filteredTickets: TicketResponse[] = [];
  selectedTicket: any;
  searchQuery: string = '';
  selectedStatus: string = '';
  selectedPriority: string = '';
  selectedDate: string = '';

  constructor(
    private _ticketService: TicketService,
    private tokenService: TokenService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this._ticketService.loadTickets().subscribe(
      (response) => {
        this.tickets = response.content;
        this.filteredTickets = this.tickets;
      },
      (error) => {
        console.error('Error loading tickets:', error);
      }
    );
  }

  filterTickets(): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      const matchesQuery = ticket.subject.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.selectedStatus ? ticket.status === this.selectedStatus : true;
      const matchesPriority = this.selectedPriority ? ticket.priority === this.selectedPriority : true;
      const matchesDate = this.selectedDate ? new Date(ticket.date).toDateString() === new Date(this.selectedDate).toDateString() : true;

      return matchesQuery && matchesStatus && matchesPriority && matchesDate;
    });
  }

  closeTicket(ticketId: number): void {
    this._ticketService.closeTicket(ticketId).subscribe(
      (response) => {
        const ticketIndex = this.tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex !== -1) {
          this.tickets[ticketIndex].status = TicketStatus.Closed;
          this.tickets[ticketIndex].priority = TicketPriority.Low;

          this.cdr.detectChanges();
          this.filterTickets();
        }
      },
      (error) => {
        console.error('Error closing ticket:', error);
      }
    );
  }

  onSelectTicket(ticket: any): void {
    this.selectedTicket = ticket;
    this.cdr.detectChanges();
  }

  openPopup(ticket: TicketResponse) {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '60%',
      height: '400px',
      data: ticket
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadTickets();
    });
  }

  openAddTicketDialog() {
    const dialogRef = this.dialog.open(AddTicketComponent, {
      width: '60%',
      height: '400px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadTickets();
    });
  }
}