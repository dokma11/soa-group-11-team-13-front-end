import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { StakeholderService } from "../stakeholder.service";
import { FollowerCreate } from "../model/follower-create.model";
import { UserFollower } from "../model/user-follower.model";
export interface ModalData {
    followers: UserFollower[];
    followings: UserFollower[];
    // followers: Follower[];
    // followings: Following[];
    showFollowers: boolean;
    showFollowings: boolean;
    user: User;
    followingsCount: number;
}
@Component({
    selector: "xp-follow-dialog",
    templateUrl: "./follow-dialog.component.html",
    styleUrls: ["./follow-dialog.component.css"],
})
export class FollowDialogComponent implements OnInit {
    userId: number;
    // followers: Follower[] = [];
    // followings: Following[] = [];
    followers: UserFollower[] = [];
    followings: UserFollower[] = [];
    showFollowers: boolean = false;
    showFollowings: boolean = false;
    f: FollowerCreate;
    constructor(
        private service: StakeholderService,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: ModalData,
    ) {}

    ngOnInit(): void {
        this.followers = this.data.followers;
        this.followings = this.data.followings;
        this.showFollowers = this.data.showFollowers;
        this.showFollowings = this.data.showFollowings;
        this.userId = this.data.user.id;
    }

    unfollowOrFollow(id: number): void {
        console.log(id);
        var clicked = this.followings.find(f => f.ID == id);
        if (clicked != undefined) {
            this.service.deleteFollowing(clicked.ID, this.userId).subscribe({
                    next: () => {
                        location.reload();
                    },
                });
        }
    }

    addFollowing(following: UserFollower): void {
        
    }

    removeOrFollow(id: number): void {
        var clicked = this.followers.find(f => f.ID == id);
    }

    addFollower(id: number, follwer: UserFollower): void {
        
    }
}
