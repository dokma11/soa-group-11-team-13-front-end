import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Comment } from "../model/comment.model";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { Blog } from "../model/blog.model";

@Component({
    selector: "xp-comment",
    templateUrl: "./comment.component.html",
    styleUrls: ["./comment.component.css"],
})
export class CommentComponent {
    @Input() blog: Blog;
    @Input() comment: Comment;
    @Input() user: User;
    @Output() editComment = new EventEmitter<Comment>();
    @Output() deleteComment = new EventEmitter<Comment>();

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
