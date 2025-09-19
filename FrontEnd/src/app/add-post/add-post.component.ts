import { CommonModule } from '@angular/common';
import { Component, inject, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-add-post',
  imports: [FormsModule , CommonModule  ,RouterModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css'
})
export class AddPostComponent {

  Post: any = {
    title: '',
    content: '',
    photo: null,
    userId: ''
  };
  router=inject(Router)

  constructor(private postService: PostService) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.Post.photo = file;
  }

  addPost(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.id) {
        this.Post.userId = user.id;
      } else {
        console.error('User ID is missing in localStorage.');
        return; // Prevent the post from being submitted without an author.
      }
    } else {
      console.error('LocalStorage is not available.');
      return;
    }
  
    console.log('Post before submission:', this.Post);
  
    const formData = new FormData();
    formData.append('title', this.Post.title);
    formData.append('content', this.Post.content);
    formData.append('userId', this.Post.userId);
    if (this.Post.photo) {
      formData.append('photo', this.Post.photo);
    }
  
    this.postService.createPost(formData).subscribe({
      next: (post) => {
        console.log('Post created successfully:', post);
        this.Post = { title: '', content: '', photo: null, userId: '' };
        alert(post.message);
        if(post.message=='Post created successfully'){
          this.router.navigate(['/dashboard/posts']);

        }else{
          this.router.navigate(['/dashboard/addpost']);

        }
       
      },
      error: (error) => {
        console.error('Error creating post:', error);
      },
    });
  }
  

}
