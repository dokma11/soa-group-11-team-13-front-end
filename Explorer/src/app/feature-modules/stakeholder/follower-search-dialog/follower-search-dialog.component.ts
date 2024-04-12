import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { UserFollow } from "../model/user-follow.model";
import { StakeholderService } from "../stakeholder.service";
import { Following } from "../model/following.model";
import { FollowerCreate } from "../model/follower-create.model";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { UserFollower } from "../model/user-follower.model";
import { PagedResults } from "src/app/shared/model/paged-results.model";
export interface ModalData {
    userId: number;
}
@Component({
    selector: "xp-follower-search-dialog",
    templateUrl: "./follower-search-dialog.component.html",
    styleUrls: ["./follower-search-dialog.component.css"],
})
export class FollowerSearchDialogComponent implements OnInit {
    userId: number;
    faSearch = faSearch;
    users: UserFollow[] = [];
    followings: Following[] = [];
    userFollowings: UserFollower[] = [];
    searchUsername: string;
    user: UserFollower;
    constructor(
        private service: StakeholderService,
        @Inject(MAT_DIALOG_DATA) public data: ModalData,
    ) {}

    ngOnInit(): void {
        this.userId = this.data.userId;
        this.loadFollowings();
    }

    loadFollowings() {
        this.service.getFollowings(this.userId).subscribe({
            next: (result: PagedResults<UserFollower>) => {
                if (Array.isArray(result)) {
                    this.userFollowings = result;
                }
            },
        });
    }

    follow(id: number) {
            const followCreate: FollowerCreate = {
                userId: id,
                followedById: this.userId,
            };
            this.service.addFollowing(followCreate).subscribe({
                next: (result: FollowerCreate) => {
                   location.reload(); 
                },
            });
        }

    search() {
        this.service.getSearched(this.searchUsername).subscribe({
            next: (result: UserFollower) => {
                this.user = result;    
            },
            //this.users = result.results;
            // this.users.forEach(user => {
            //     if (this.followings.some(f => user.id === f.following.id)) {
            //         user.followingStatus = true;
            //     } else {
            //         user.followingStatus = false;
            //     }
            // });
        });
    }
}
