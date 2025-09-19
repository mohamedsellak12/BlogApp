import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ConversationService } from '../services/conversation.service';
import { MessageService } from '../services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-conversation',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css'
})
export class ConversationComponent implements OnInit {
  recipientId:any;
  user:any;
  User:any;
  conversationId:any;
  messageSent:string='';
  messages:any=[];
  openMenuId:string|null=null
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  isOpenId: any;
  constructor(private route:ActivatedRoute 
    ,private conversationService:ConversationService
    , private messageService:MessageService ,
    private userService:UserServiceService
  ){
  }


  scrollToBottom(): void {
    setTimeout(() => {
      try {
        if (this.chatContainer) {
          this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
        }
      } catch (err) {
        console.error('Error during scroll:', err);
      }
    });
  }
  ngOnInit(): void {
    this.recipientId=this.route.snapshot.paramMap.get('id');
    if(!this.user){
      const storedUser=localStorage.getItem('user');
      this.user=storedUser?JSON.parse(storedUser) : null;
    }
    this.userService.getUserById(this.recipientId).subscribe({
      next: (response) => {
        this.User=response;
      },
      error: (error) => {
        console.error(error);
      }
    })
    this.conversationService.createConversation(this.user.id,this.recipientId ,this.user.id).subscribe({
      next: (response) => {
        // console.log(response._id);
        this.conversationId=response._id;
        this.messageService.getMessages(this.conversationId).subscribe({
          next: (response) => {
            
            this.messages = response;

          },
          error: (error) => {
            console.error(error);
          }
        })
       
    

      },
      error: (error) => {
        console.error(error);
      }

    })
    this.scrollToBottom()
    
  }

  sendMessage(){
    this.messageService.sendMessage(this.conversationId,this.user.id,this.messageSent).subscribe({
      next: (response) => {
        this.messageSent='';
        if(response==""){
          console.error("Failed to send message")
          return;
        }
        this.messages.push(response);
      },
      error: (error) => {
        console.error(error);
      }
    })
    this.scrollToBottom();


  }
  OpenMenu(msgId: string){
    this.openMenuId=msgId;
  }
  toggleDeleteEditPopup(msgId:any){
    this.isOpenId = this.isOpenId===msgId?null:msgId
  }
  isDeleteEditPopupOpen(msgId:any):boolean{
    return this.isOpenId===msgId;
  }
  closeMenu(){
    this.openMenuId=null;
  }
  isMenuOpen(msgId: string):boolean{
    return this.openMenuId===msgId;
  }
  OnDeleteMessage(msgId: string){
    this.messageService.deleteMessage(msgId ,this.user.id).subscribe({
      next: (response) => {
        this.messages=this.messages.filter((msg:any)=>msg._id!=msgId);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }


}
