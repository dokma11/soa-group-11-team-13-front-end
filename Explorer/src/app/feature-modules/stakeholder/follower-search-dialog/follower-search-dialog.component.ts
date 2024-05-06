import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { UserFollow } from "../model/user-follow.model";
import { StakeholderService } from "../stakeholder.service";
import { Following } from "../model/following.model";
import { FollowerCreate } from "../model/follower-create.model";
import { UserFollower } from "../model/user-follower.model";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { VukasinPrdi } from "../model/vukasin-prdi.model";
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
            const vukasinPrdi: VukasinPrdi = {
                followingId: id.toString(),
                followerId: this.userId.toString(),
            };
            this.service.addFollowing(vukasinPrdi).subscribe({
                next: (result: VukasinPrdi) => {
                   location.reload(); 
                },
            });
        }

    search() {
        this.service.getSearched(this.searchUsername).subscribe({
            next: (result: any) => {
                this.user = result.user;    
            },
        });
    }
}
