import { Component, Input, OnInit } from '@angular/core';
import { DashbordComponent } from '../dashbord/dashbord.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [DashbordComponent, CommonModule],
  templateUrl: './ticket-details.component.html',
  styleUrl: './ticket-details.component.css'
})
export class TicketDetailsComponent implements OnInit {
  @Input() ticket: any;

  constructor() { }

  ngOnInit(): void { }
}
