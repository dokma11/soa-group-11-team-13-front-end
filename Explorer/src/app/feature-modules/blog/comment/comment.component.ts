import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Comment } from "../model/comment.model";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { Blog } from "../model/blog.model";
import { BlogService } from "../blog.service";
import { TourAuthoringService } from "../../tour-authoring/tour-authoring.service";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { C } from "@angular/cdk/keycodes";

@Component({
    selector: "xp-comment",
    templateUrl: "./comment.component.html",
    styleUrls: ["./comment.component.css"],
})
export class CommentComponent implements OnInit{
    @Input() blog: Blog;
    @Input() comment: Comment;
    @Input() user: User;
    @Output() editComment = new EventEmitter<Comment>();
    @Output() deleteComment = new EventEmitter<Comment>();

    constructor(private blogsService: BlogService,
                private tourAuthoringService: TourAuthoringService,
                private authService: AuthService){
        
    }

    ngOnInit() {
        this.comment.author = this.user;
        console.log(this.comment.authorId);
        console.log(this.comment.author.id);
    }

    isEditMode = false;
    editedText: string;

    toggleEditMode(): void {
        this.isEditMode = !this.isEditMode;
        if (this.isEditMode) {
            this.editedText = this.comment.text;
        }
    }

    saveChanges(): void {
        console.log(this.comment.text);
        console.log(this.comment.id);
        this.comment.text = this.editedText;
        this.comment.updatedAt =  new Date().toISOString();
        this.editComment.emit(this.comment);
        this.isEditMode = false;
    }

    onDeleteComment(): void {
        this.deleteComment.emit(this.comment);
    }
}
