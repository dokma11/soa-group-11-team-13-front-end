import { Component, Input, OnInit } from "@angular/core";
import { Blog } from "../model/blog.model";
import { BlogService } from "../blog.service";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { Vote } from "../model/vote.model";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { Pipe, PipeTransform } from "@angular/core";
import { UpdateBlog } from "../model/blog-update.model";
import { Following } from "../../stakeholder/model/following.model";
import { StakeholderService } from "../../stakeholder/stakeholder.service";
import { trigger, transition, style, animate } from "@angular/animations";
import { UserFollower } from "../../stakeholder/model/user-follower.model";
import { Observable, map, switchMap, tap } from "rxjs";

@Component({
    selector: "xp-blogs",
    templateUrl: "./blogs.component.html",
    styleUrls: ["./blogs.component.css"],
    animations: [
        trigger("fadeIn", [
            transition(":enter", [
                style({ opacity: 0, transform: "translateX(-40px)" }),
                animate(
                    "0.5s ease",
                    style({ opacity: 1, transform: "translateX(0)" }),
                ),
            ]),
        ]),
    ],
})
export class BlogsComponent implements OnInit {
    blogs: Blog[] = [];
    user: User | undefined;
    followings: UserFollower[] = [];
    selectedStatus: number = 5;
    searchName: string = '';
    @Input() clubId: number = -1;
    constructor(
        private service: BlogService,
        private authService: AuthService,
        private serviceUsers: StakeholderService,
    ) {}

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
            this.loadFollowings().pipe(
                switchMap(() => this.getBlogs())
            ).subscribe();
        });
    }

    loadFollowings(): Observable<UserFollower[]> {
        return this.serviceUsers.getFollowings(this.user?.id || 0).pipe(
            map(pagedResult => pagedResult.results), 
            tap(followings => {
                this.followings = followings;
                console.log(this.followings);
            })
        );
    }

    checkIfFollowing(authorId: number): any {
        var found = false;
        this.followings.forEach(function (value) {
            if (value.id == authorId) found = true;
        });
        return found;
    }

    removePrivates(): void {
        this.blogs = this.blogs.filter(
            b =>
                b.authorId == this.user?.id ||
                this.checkIfFollowing(b.authorId),
        );
    }

    filter() {
        this.filterByName();
        this.filterByStatus();
    }

    filterByStatus() {
        this.getBlogs();
    }

    filterByName() {
        this.service.searchByName(this.searchName).subscribe({
            next: (result) => {
                this.blogs = result;
                this.removePrivates();
            },
            error: () => {}
        })
    }

    getBlogs(): Observable<Blog[]> {
        const blogObservable = this.clubId === -1
            ? this.service.getBlogs()
            : this.service.getClubBlogs(this.clubId);

        return blogObservable.pipe(
            map((pagedResult: PagedResults<Blog>) => pagedResult.results), 
            tap((blogs: Blog[]) => {
                this.blogs = blogs;
                this.removePrivates();
            })
        );
    }

    getVote(blog: Blog): Vote | undefined {
        return blog.votes?.find(x => x.userId == this.user?.id);
    }

    upVoteBlog(blogId: number): void {
        this.service.upVoteBlog(blogId).subscribe({
            next: (result: any) => {
                //unblock voting
            },
            error: () => {
                //undo front end vote
            },
        });
    }

    downVoteBlog(blogId: number): void {
        this.service.downVoteBlog(blogId).subscribe({
            next: (result: any) => {
                //unblock voting
            },
            error: () => {
                //undo front end vote
            },
        });
    }
}
