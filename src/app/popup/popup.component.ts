
import { Component,EventEmitter,Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { TicketPriority, TicketType } from '../dashbord/dashbord.component'; 
import { TicketService } from '../ticket.service';
import { CommonModule } from '@angular/common';
import { TicketRequest } from '../models/ticket-request';
import { TicketStatus } from '../dashbord/dashbord.component'; 
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})

export class PopupComponent implements OnInit{
  editForm: FormGroup;
  ticketTypes: string[] = Object.values(TicketType);
  TicketStatus: string[] = Object.values(TicketStatus);

  submitting: boolean = false;
  @Output() ticketUpdated = new EventEmitter<void>();
   //ticketTypes: string[] = ['incident', 'suggestion', 'question', 'problem'];
  ngOnInit(): void {
    this.editForm = this.fb.group({
      id: [this.data.id],
      subject: [this.data.subject],
      username: [this.data.username],
      type: [this.data.type],
      status: [this.data.status], // Include status if it's expected
      date: [this.data.date],
      priority: TicketPriority.High  
    });
  }

  constructor(
    private ref: MatDialogRef<PopupComponent>, 
    private fb: FormBuilder,private ticketService: TicketService
    , private snackBar: MatSnackBar,private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editForm = this.fb.group({
      id: [this.data.id],
      subject: [this.data.subject],
      username: [this.data.username],
      type: [this.data.type],
      status: [this.data.status],
      date: [this.data.date],
    });
  }
closepopup(){
  this.ref.close('Closed using function');
}

onEdit(): void {
  if (this.editForm.valid) {
    const ticketId = this.editForm.value.id;
    const username = this.editForm.value.username;
    const ticketRequest: TicketRequest = {
      id: ticketId,
      subject: this.editForm.value.subject,
      type: this.editForm.value.type,
      date: new Date(),
      status: this.editForm.value.status,
      username: this.editForm.value.username,
      priority: TicketPriority.Low
    };

    this.ticketService.updateTicket({ id: ticketId, body: ticketRequest }).subscribe(
      (response: number) => {
        console.log('Ticket updated successfully', response);
        this.snackBar.open('Ticket added successfully', 'Close', { duration: 3000 }); // Optional
        this.ref.close(); // Close the dialog upon successful addition
        this.router.navigate(['/dashboard']);
        this.ticketUpdated.emit();
      },
      (error: any) => {
        console.error('Error updating ticket', error);
        console.log('Ticket Request Object:', ticketRequest);
        this.snackBar.open('Error adding ticket', 'Close', { duration: 3000 });

        this.submitting = false;
      }
    );
  }
}

}




