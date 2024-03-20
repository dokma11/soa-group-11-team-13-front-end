import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { NotifierService } from 'angular-notifier';
import { BlogRecommendationRequest } from '../model/blog-recommendation-request.model';
import { BlogService } from '../../blog/blog.service';

@Component({
  selector: 'xp-share-blog',
  templateUrl: './share-blog.component.html',
  styleUrls: ['./share-blog.component.css']
})
export class ShareBlogComponent {

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialog: MatDialogRef<ShareBlogComponent>,
      private blogService: BlogService,
      private notifier: NotifierService,
  ) { }

  username: string = "";

  login(): void {
      const request: BlogRecommendationRequest = {
          blogId: this.data.blogId,
          recommendationReceiverUsername: this.username || "",
      };
      console.log(request.blogId)

      this.blogService.shareBlog(request).subscribe({
        next: () => {
          this.notifier.notify("success", "Successful recommendation!");
          this.dialog.close();
        },
        error: () => {
          this.notifier.notify("error", "Error: username doesn't exist.")
        }
      })
  }

  onClose(): void {
      this.dialog.close();
  }

  faXmark = faXmark;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
}
