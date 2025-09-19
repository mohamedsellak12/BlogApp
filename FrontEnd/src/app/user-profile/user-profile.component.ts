import { Component, inject, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostService } from '../services/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../services/comment.service';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  id:any='';
  User:any;
  user:any;
  userService=inject(UserServiceService)
  numberOfcomments: any;
  isOpenZoneLikesId: string |null=null;
  postLikes: any[]=[];
  
  constructor( private route:ActivatedRoute) { }
  posts:any=[];
  Comments: any=[];
  Comment: any={
    content: '',
    postId: '',
    userId: ''
  };
  isEditCommentPopupOpen = false;
  selectedComment: any = {};
  openCommentPostById:string|null=null ;

  openMenuPostById:string|null=null ;
  updateOpenId:string|null=null ;
  updatedTitle:string=''
  updatedContent:string=''
  selectedPhoto: File | null = null;
  emptyMessage:string|null=null;
  postService=inject(PostService)
  commentService=inject(CommentService)



  onSelectPhoto(event:any):void{
    this.selectedPhoto=event.target.files[0];
    console.log(this.selectedPhoto)
  }
  closeUpdateForm(){
    this.updateOpenId=null;
  }

  toggleMenu(postId:any){
    this.openMenuPostById=this.openMenuPostById===postId?null:postId;
  }
  openUpdateForm(post:any){
    this.updateOpenId=post._id;
    this.updatedTitle=post.title;
    this.updatedContent=post.content;

  }
  isMenuOpen(postId:string):boolean{
    return this.openMenuPostById===postId ;
  }
  openCommentArea(postId:any){
    this.openCommentPostById=this.openCommentPostById===postId?null:postId;
    this.commentService.getCommentsOfPost(postId).subscribe({
      next: (response) => {
        console.log('Comments of post:', response);
        this.Comments=response.comments;
        this.numberOfcomments=this.Comments.length; // Update the number of comments for the post
      },
      error: (error) => {
        console.error('Error fetching comments of post:', error);
      }
    })

  }
  isCommentAreaOpen(postId:any){
    return this.openCommentPostById===postId ;
 }
 closeEditPopup(){
  this.isEditCommentPopupOpen=false;
  this.selectedComment={};
}
openEditCommentPopup(comment:any){
  this.isEditCommentPopupOpen=true;
  this.selectedComment=comment;
}
 onUpdateComment(){
  this.commentService.updateComment(this.selectedComment._id ,this.selectedComment.content)
  .subscribe({
    next: (response) => {
      const commentIndex = this.Comments.findIndex((c:any) => c._id === this.selectedComment._id);
      if (commentIndex > -1) {
        this.Comments[commentIndex] = { ...this.Comments[commentIndex], ...response.comment };
      }

      // Fermer le popup
      this.isEditCommentPopupOpen = false;
      this.selectedComment = {};
      console.log('Comment updated successfully:', response.message);
      
    },
    error: (error) => {
      console.error('Error updating comment:', error);
    }

  })
}
  
  onAddComment(idPost:any){
    // console.log(this.Comment)
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.id) {
        this.Comment.userId = user.id;
      } else {
        console.error('User ID is missing in localStorage.');
        return; // Prevent the post from being submitted without an author.
      }
    } else {
      console.error('LocalStorage is not available.');
      return;
    }
    this.Comment.postId=idPost;
   

    this.commentService.addComment(this.Comment).subscribe({
      next: (response) => {
        this.Comments.push(response.comment)
        this.Comment={
          content: '',
          postId: '',
          userId: '',
        }
        // Add the new comment to the corresponding post
        alert(response.message)
      },
      error: (error) => {
        console.error('Error adding comment:', error);
      }

    })
  }
  onDeleteComment(id:any){
    if(confirm('Are you sure you want to delete this comment')){
      this.commentService.deleteComment(id).subscribe({
        next: (response) => {
          console.log('Comment deleted successfully');
          this.Comments=this.Comments.filter((comment :any)=>comment._id!==id); // Remove the deleted comment from the comments array
        },
        error: (error) => {
          console.error('Error deleting comment:', error);
        }
      })

    }


  }
  ngOnInit(): void {
    this.id=this.route.paramMap.subscribe(params=>{
      this.id=params.get('id')!;
      this.userService.getUserById(this.id).subscribe({
        next: (data) => {
          this.User=data;
        },
        error: (err) => {
          console.error('Error retrieving user data', err);
        }
      });

      this.postService.getPostsByUserId(this.id).subscribe({
        next:( response )=>{
          this.posts=response
          if(this.posts.length===0){
            this.emptyMessage='No posts found for this user'
          }
        },
        error:( error )=> {
          console.error('Error:', error)
        }})
    }
    );
   

    if(!this.user){
      const storedUser=localStorage.getItem('user');
      this.user=storedUser?JSON.parse(storedUser) : null;
    }
    console.log(this.user.id)
   
    
  }
  openZoneLikes(postId:string):void{
    this.isOpenZoneLikesId=postId;
    this.postService.getPostLikes(postId).subscribe({
      next:(likes)=>{
        this.postLikes=likes
      },
      error:(error)=>{
        console.error('Error fetching likes of post:', error)
      }
    })
  }
  closeZoneLikes(){
    this.isOpenZoneLikesId=null;
  }
  isOpenZoneLikes(postId:any):boolean{
    return this.isOpenZoneLikesId===postId;
  }

  LikerPost(postId:any){
    this.postService.likerPost(postId,this.user.id).subscribe({
      next: (response) => {
        console.log('Post liked successfully:', response.message);
        const post=this.posts.find((p:any)=>p._id===postId)
        if(post){
          if(post.likes.includes(this.user.id)){
            post.likes = post.likes.filter((id: string) => id !== this.user.id);
          }else{
            post.likes.push(this.user.id)
          }
        }
      },
      error: (error) => {
        console.error('Error liking post:', error);
      }
    })
  }
  animateLike(event: Event): void {
    const button = event.target as HTMLElement;
    button.classList.add('scale-110'); // Agrandit légèrement l'élément.
    setTimeout(() => button.classList.remove('scale-110'), 400); // Réinitialise après 200ms.
  }
  toggleReportPost(postId:any){
    this.postService.toggleReports(postId,this.user.id).subscribe({
      next: (response) => {
        console.log(response.message)
       const post=this.posts.find((p:any)=>p._id===postId)
       if(post){
        if(post.reports.includes(this.user.id)){
          post.reports = post.reports.filter((id: string) => id!== this.user.id);
        }else{
          post.reports.push(this.user.id)
        }
       }
      },
      error: (error) => {
        console.error('Error reporting post:', error);
      }
    })
  }


  Ondelete(id:string){
    if(confirm('Are you sure you want to delete this post?')){
      this.postService.deletePost(id).subscribe({
        next: (response) => {
          console.log('Post deleted successfully');
          this.posts=this.posts.filter((post :any)=>post._id!==id); // Remove the deleted post from the posts array
          alert(response.message)
        },
        error: (error) => {
          console.error('Error deleting post:', error);
        }
      })
    }
  }
  
  onSubmit(id: string ,event:Event){
    event.preventDefault()
    const formData = new FormData();
    formData.append('title', this.updatedTitle);
    formData.append('content', this.updatedContent);
    if(this.selectedPhoto){
      formData.append('photo', this.selectedPhoto);
    }
    this.postService.updatePost(id,formData).subscribe({
        next: (response) => {
          console.log('Post updated successfully');
          const updatedPost=response;
          // Find and update the post in the posts array
          const index = this.posts.findIndex((post :any) => post._id === id);
          if (index !== -1) {
            this.posts[index] = { ...this.posts[index], ...updatedPost.post };
          } // Replace the old post with the updated one in the posts array
          this.closeUpdateForm();
          alert(response.message)
        },
        error: (error) => {
          console.error('Error updating post:', error);
        }
      })
  }


}



