import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { TicketType } from '../dashbord/dashbord.component'; 
import { TicketPriority } from '../dashbord/dashbord.component'; 
import { TicketService } from '../ticket.service';
import { CommonModule, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { TicketRequest } from '../models/ticket-request';
import { SaveTicket$Params } from '../fn/ticket/save-ticket';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { TokenService } from '../token/token.service';

@Component({
  selector: 'app-add-ticket',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatSelectModule, MatFormFieldModule, MatInputModule],
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css']
})
export class AddTicketComponent implements OnInit {
  ticketRequest: any = {}; 
  connectedUsername: string | null = null;

  addForm: FormGroup;
  ticketTypes: string[] = Object.values(TicketType);
  ticketPriority: string[] = Object.values(TicketPriority);
  statuses: string[] = ['New', 'InProgress', 'Resolved', 'Canceled'];
  submitting: boolean = false;
  @Output() ticketAdded: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private ref: MatDialogRef<AddTicketComponent>,
    private fb: FormBuilder,
    private ticketService: TicketService,    
    private snackBar: MatSnackBar,
    private router: Router,
    private tokenService: TokenService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.addForm = this.fb.group({
      subject: ['', Validators.required],
      username: [{ value: '', disabled: true }, Validators.required],
      type: ['', Validators.required],
      date: [currentDate, Validators.required],
      status: ['New', Validators.required],
      priority: ['HIGH', Validators.required]
    });
  }

  ngOnInit(): void {
    this.connectedUsername = this.tokenService.getConnectedUsername(); // Fetch the username from the token service
    if (this.connectedUsername) {
      this.addForm.patchValue({
        username: this.connectedUsername
      });
    }
  }

  closePopup() {
    this.ref.close('Closed using function');
  }

  onAdd(): void {
    if (this.addForm.valid) {
      const ticketRequest: TicketRequest = this.addForm.getRawValue(); // Use getRawValue() to include disabled fields

      this.ticketService.saveTicket({ body: ticketRequest }).subscribe(
        (response: number) => {
          console.log('Ticket added successfully', response);
          this.snackBar.open('Ticket added successfully', 'Close', { duration: 3000 }); // Optional
          this.ref.close(); // Close the dialog upon successful addition
          this.router.navigate(['/dashboard']); // Navigate to dashboard
          this.ticketAdded.emit(); // Optional: Emit event for other components
        },
        (error: any) => {
          console.error('Error adding ticket', error);
          this.snackBar.open('Error adding ticket', 'Close', { duration: 3000 });
          this.submitting = false;
        }
      );
    }
  }
}
