import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  urlapi="http://localhost:3000/conversation"
  constructor(private http:HttpClient) { }


  createConversation(senderId:any,recipientId:any ,userId:any):Observable<any>{
    return this.http.post(`${this.urlapi}/createConversation/${userId}`,{senderId,recipientId});
  }

  getConversations(id:any):Observable<any>{
    return this.http.get(`${this.urlapi}/getConversations/${id}`);
  }
  softdeleteConversations(conversationId:any,userId:any):Observable<any>{
    return this.http.put(`${this.urlapi}/deleteConversation/${conversationId}`,{userId});
  }

  deletetheconversation(conversationId:string):Observable<any>{
    return this.http.delete(`${this.urlapi}/deleteConversationPermanently/${conversationId}`)
  }

}
