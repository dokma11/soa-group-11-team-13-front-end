import { Component, Inject } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { UserFollower } from '../model/user-follower.model';
import { StakeholderService } from '../stakeholder.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { FollowerCreate } from '../model/follower-create.model';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

export interface ModalData {
  userId: number;
}

@Component({
  selector: 'xp-recommended-users-dialogue',
  templateUrl: './recommended-users-dialogue.component.html',
  styleUrls: ['./recommended-users-dialogue.component.css']
})
export class RecommendedUsersDialogueComponent {
  users: UserFollower[] = [];
  userId: number;

  constructor(private stakeholderService: StakeholderService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ModalData){
    this.userId = data.userId;
    
    this.stakeholderService.getRecommendedUsers(this.userId).subscribe({
      next: (result: PagedResults<UserFollower>) => { 
        if(result && Array.isArray(result.results)){ 
          this.users = result.results; 
        }
      }
    });
  }

  unfollowOrFollow(id: number) {
    
    const follow: FollowerCreate = {
      userId: id,
      followedById: this.userId
    };

    this.stakeholderService.addFollowing(follow).subscribe({
      next: () => {
        location.reload();
      }
    });
  }
  
}
