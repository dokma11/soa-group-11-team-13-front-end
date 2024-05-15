import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { NotifierService } from 'angular-notifier';
import { BlogRecommendationRequest } from '../model/blog-recommendation-request.model';
import { BlogService } from '../../blog/blog.service';
import { BlogRecommendationMessage } from '../model/blog-recommendation-message.model';
import { StakeholderService } from '../stakeholder.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { BlogMessage } from '../../blog/model/blog-message.model';

@Component({
  selector: 'xp-share-blog',
  templateUrl: './share-blog.component.html',
  styleUrls: ['./share-blog.component.css']
})
export class ShareBlogComponent {
  user: User | undefined;

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialog: MatDialogRef<ShareBlogComponent>,
      private blogService: BlogService,
      private notifier: NotifierService,
      private stakeHolderService: StakeholderService
  ) { }

  username: string = "";

  login(): void {
    this.stakeHolderService.getSearched(this.username).subscribe({
        next: (result: any) => {
            this.user = result.user;

            setTimeout(() => {
                const blog: BlogMessage = {
                  id: this.data.blog.id,
                  title: this.data.blog.title,
                  description: this.data.blog.description,
                  status: this.data.blog.status,
                  authorId: this.data.blog.authorId,
                  votes: [],
                  comments: [],
                  recommendations: [],
                }
              
                const request: BlogRecommendationMessage = {
                    id: 0,
                    blogId: this.data.blogId,
                    recommendationReceiverId: this.user?.id || -169,
                    recommenderId: this.data.recommenderId,
                    //blog: blog
                };

                console.log(request.blogId);

                this.blogService.shareBlog(request).subscribe({
                    next: () => {
                        this.notifier.notify("success", "Successful recommendation!");
                        this.dialog.close();
                    },
                    error: () => {
                        this.notifier.notify("error", "Error: username doesn't exist.")
                    }
                });
            }, 1000);
        },
        error: (err) => {
            this.notifier.notify("error", "Error fetching user information");
        }
    });
}

  onClose(): void {
      this.dialog.close();
  }

  faXmark = faXmark;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
}
