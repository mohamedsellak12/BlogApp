import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  url:string="http://localhost:3000/comment"
  constructor(private http:HttpClient , private router:Router) { }



  addComment(comment:any):Observable<any>{
    return this.http.post(`${this.url}/addComment`, comment)
  }
  getCommentsOfPost(id:any):Observable<any>{
    return this.http.get(`${this.url}/getCommentsOfPost/${id}`)
  }
  deleteComment(commentId:any):Observable<any>{
    return this.http.delete(`${this.url}/deleteComment/${commentId}`)
  }
  getNumberOfComments(postId:any):Observable<any>{
    return this.http.get(`${this.url}/numberOfComments/${postId}`)
  }
  updateComment(id:any,comment:any):Observable<any>{
    const body={content:comment}
    return this.http.put(`${this.url}/updateComment/${id}`, body)
  }




}
