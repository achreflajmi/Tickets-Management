import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../ChatService';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatMessage } from '../models/chat-message';
import { SendMessageRequest } from '../models/chat-request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges {
  @Input() ticketId!: number;
  @Input() ticketStatus!: string;

  messageForm!: FormGroup;
  chatMessages: ChatMessage[] = [];
  newMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      messageText: [{ value: '', disabled: this.ticketStatus === 'Closed' }, Validators.required]
    });
    this.fetchChatMessages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticketId']) {
      this.fetchChatMessages();
    }
    if (changes['ticketStatus'] && this.messageForm) {
      this.updateFormState();
    }
  }
  

  fetchChatMessages(): void {
    if (!this.ticketId) return;

    this.chatService.getChatMessages(this.ticketId).subscribe(
      messages => {
        this.chatMessages = messages;
      },
      error => {
        console.error('Error fetching chat messages', error);
      }
    );
  }

  sendMessage(): void {
    if (this.messageForm.valid) {
      const messageText = this.messageForm.get('messageText')?.value.trim();

      if (messageText) {
        this.authService.getLoggedInUser().subscribe(
          (user) => {
            if (user.id) {
              const sendMessageRequest: SendMessageRequest = {
                ticket: { ticketId: this.ticketId },
                sender: { id: user.id },
                messageText: messageText
              };

              this.chatService.sendMessage(sendMessageRequest).subscribe(
                () => {
                  console.log('Message sent successfully');
                  this.fetchChatMessages();
                  this.messageForm.reset();
                },
                (error) => {
                  console.error('Error sending message', error);
                  let errorMessage = 'Failed to send message';
                  if (error && error.error && error.error.businessErrorDescription) {
                    errorMessage = error.error.businessErrorDescription;
                  } else if (error.status === 200) {
                    console.log('Received 200 OK, treating as success');
                    this.fetchChatMessages();
                    this.messageForm.reset();
                    return;
                  }
                  this.snackBar.open(errorMessage, 'Close', {
                    duration: 3000,
                    verticalPosition: 'top'
                  });
                }
              );
            } else {
              console.error('User ID is null');
              this.snackBar.open('Failed to fetch user ID', 'Close', {
                duration: 3000,
                verticalPosition: 'top'
              });
            }
          },
          (error) => {
            console.error('Error fetching current user', error);
            this.snackBar.open('Failed to fetch current user', 'Close', {
              duration: 3000,
              verticalPosition: 'top'
            });
          }
        );
      } else {
        console.warn('Empty message text');
      }
    } else {
      console.error('Invalid form');
    }
  }

  updateFormState(): void {
    if (this.messageForm) {
      if (this.ticketStatus === 'Closed') {
        this.messageForm.get('messageText')?.disable();
      } else {
        this.messageForm.get('messageText')?.enable();
      }
    }
  }
  
}
