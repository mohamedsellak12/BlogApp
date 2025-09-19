import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConversationService } from '../services/conversation.service';

@Component({
  selector: 'app-chats',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent implements OnInit {
  conversations:any= [];
  user:any;
  isOpenId:string|null=null;




  constructor(private conversationService:ConversationService){}
  ngOnInit(): void {
    if(!this.user){
      const storedUser=localStorage.getItem('user');
      this.user=storedUser?JSON.parse(storedUser) : null;
    }
    this.conversationService.getConversations(this.user.id).subscribe({
      next: (response) => this.conversations=response.filter((c:any) =>!!c.lastMessage),
      error: (error) => console.log(error)
    })
  }
  toggleDeletePopup(convId:any){
    this.isOpenId = this.isOpenId===convId?null:convId
  }
  isDeletePopupOpen(convId:any):boolean{
    return this.isOpenId===convId;
  }

  deleteConversation(convId:string){
   if(confirm("Are you sure you want to delete this conversation")){
     this.conversationService.softdeleteConversations(convId,this.user.id).subscribe({
       next: (response) => {
         console.log(response)
         this.ngOnInit()
         this.conversationService.deletetheconversation(convId).subscribe({
           next: (response) => this.ngOnInit(),
           error: (error) => console.log(error)
         })
       },
       error: (error) => console.log(error)
     })
   }
  }

}
