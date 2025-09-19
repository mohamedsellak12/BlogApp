import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  urlapi:string="http://localhost:3000/post";
  router=inject(Router)

  constructor(private http:HttpClient) { }


  createPost(postData:any): Observable<any>{
    return this.http.post(`${this.urlapi}/addPost`,postData);
  }
  getAllPosts(): Observable<any>{
    return this.http.get(`${this.urlapi}/allPosts`);
  }
  getPostsByUserId(id:any): Observable<any>{
    return this.http.get(`${this.urlapi}/yourposts/${id}`);
  }
  deletePost(id:any): Observable<any>{
    return this.http.delete(`${this.urlapi}/deletepost/${id}`);
  }
  updatePost(id:any , data:any): Observable<any>{
    return this.http.put(`${this.urlapi}/updatePost/${id}`, data)
  }
  likerPost(postId:any,userId:any): Observable<any>{
    return this.http.put(`${this.urlapi}/like/${postId}/`,{userId});
  }

  getPostLikes(postId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlapi}/likeofpost/${postId}`);
  }
  toggleReports(postId: string , userId:string): Observable<any>{
    return this.http.put(`${this.urlapi}/report/${postId}/`,{userId});
  }
  
}
