import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  urlapi="http://localhost:3000/message"

  constructor(private http:HttpClient) { }

  getMessages(id:any): Observable<any>{
    return this.http.get(`${this.urlapi}/getMessages/${id}`)
  }
  sendMessage(conversationId:any, senderId:any, content:any): Observable<any>{
    return this.http.post(`${this.urlapi}/sendMessage`, {conversationId, senderId, content})
  }
  deleteMessage(msgId:any , userId:any):Observable<any>{
    
    return this.http.delete(`${this.urlapi}/deleteMessage/${msgId}/${userId}` )
  }
}
