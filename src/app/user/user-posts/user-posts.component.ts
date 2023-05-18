import {Component, OnInit} from '@angular/core';
import {Post} from '../../models/Post';
import {PostService} from '../../service/post.service';
import {ImageUploadService} from '../../service/image-upload.service';
import {CommentService} from '../../service/comment.service';
import {NotificationService} from '../../service/notification.service';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {EditUserComponent} from "../edit-user/edit-user.component";
import {User} from "../../models/User";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {

  isUserDataLoaded = false;
  isUserPostsLoaded = false;
  posts: Post [];
  user: User;
  userProfileImage: File;
  previewImgURL: any;

  constructor(private postService: PostService,
              private imageService: ImageUploadService,
              private commentService: CommentService,
              private dialog: MatDialog,
              private notificationService: NotificationService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.postService.getPostForCurrentUser()
      .subscribe(data => {
        console.log(data);
        this.posts = data;
        this.getImagesToPosts(this.posts);
        this.getCommentsToPosts(this.posts);
        this.isUserPostsLoaded = true;
      });
    this.userService.getCurrentUser()
      .subscribe(data => {
        this.user = data;
        this.isUserDataLoaded = true;
      });

    this.imageService.getProfileImage()
      .subscribe(data => {
        this.userProfileImage = data.imageBytes;
      });
  }

  getImagesToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.imageService.getImageToPost(p.id)
        .subscribe((data: any) => {
          p.image = data.imageBytes;
        });
    });
  }


  getCommentsToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.commentService.getCommentsToPost(p.id)
        .subscribe(data => {
          p.comments = data;
        });
    });
  }

  removePost(post: Post, index: number): void {
    console.log(post);
    const result = confirm('Ви дійсно хочете видалити цей пост?');
    if (result) {
      this.postService.deletePost(post.id)
        .subscribe(() => {
          this.posts.splice(index, 1);
          this.notificationService.showSnackBar('Пост видалено');
        });
    }
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  deleteComment(commentId: number, postIndex: number, commentIndex: number): void {
    const post = this.posts[postIndex];

    this.commentService.deleteComment(commentId)
      .subscribe(() => {
        this.notificationService.showSnackBar('Коментар видалено');
        post.comments.splice(commentIndex, 1);
      });
  }

}
