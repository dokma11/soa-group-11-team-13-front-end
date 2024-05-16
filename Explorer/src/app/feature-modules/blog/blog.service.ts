import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { environment } from "src/env/environment";
import { Blog } from "./model/blog.model";
import { Comment, CreateComment } from "./model/comment.model";
import { Vote } from "./model/vote.model";
import { CreateBlog } from "./model/blog-create.model";
import { UpdateBlog } from "./model/blog-update.model";
import { BlogRecommendationRequest } from "../stakeholder/model/blog-recommendation-request.model";
import { BlogMessage } from "./model/blog-message.model";
import { BlogRecommendationMessage } from "../stakeholder/model/blog-recommendation-message.model";

@Injectable({
    providedIn: "root",
})
export class BlogService {
    constructor(private http: HttpClient) {}

    getVotedBlogs(userId: number): Observable<PagedResults<Vote>> {
        return this.http.get<PagedResults<Vote>>(
            environment.apiHost + "blog/votedBlogs/user/" + userId,
        );
    }

    getBlogs(): Observable<BlogMessage[]> {
        return this.http.get<BlogMessage[]>(`${environment.host}blogs/all`);
    }

    getClubBlogs(clubId: number): Observable<PagedResults<Blog>> {
        return this.http.get<PagedResults<Blog>>(environment.apiHost + "blog/getClubBlogs?page=0&pageSize=0&clubId="+clubId);
    }

    getBlog(id: number): Observable<BlogMessage> {
        return this.http.get<BlogMessage>(`${environment.host}blogs/id/?ID=${id}`);
    }

    searchByName(name: string): Observable<Blog[]> {
        return this.http.get<Blog[]>(`${environment.host}blogs/search/?Title=${name}`);
    }

    deleteBlog(id: number) : Observable<Blog>{
        return this.http.delete<Blog>(`${environment.host}blogs/?ID=${id}`);
    }

    getComments(blogId: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${environment.host}comments/blogId/?BlogId=${blogId}`,);
    }

    addComment(comment: CreateComment): Observable<Comment> {
        return this.http.post<Comment>(`${environment.host}comments`, { comment });
    }

    updateComment(comment: Comment): Observable<Comment> {
        return this.http.put<Comment>(`${environment.host}comments`, { comment },);
    }

    deleteComment(id: Number): Observable<Comment> {
        return this.http.delete<Comment>(`${environment.host}comments/?ID=${id}`);
    }

    saveBlog(blog: BlogMessage): Observable<BlogMessage> {
        blog.status = 0;
        return this.http.post<BlogMessage>(`${environment.host}blogs`, { blog });
    }

    saveClubBlog(blog: CreateBlog): Observable<CreateBlog> {
        blog.status = 1;
        return this.http.post<CreateBlog>(
            environment.apiHost + "blog/createClubBlog",
            blog,
        );
    }

    updateBlog(blog: UpdateBlog): Observable<UpdateBlog> {
        return this.http.put<UpdateBlog>(environment.apiHost + "blog/update", blog);
    }

    publishBlog(blog: Blog): Observable<number> {
        console.log('blogId : ' + blog.id)
        return this.http.put<number>(`${environment.host}blogs`, { blog });
    }

    upVoteBlog(blogId: number): Observable<any> {
        return this.http.get<any>(
            environment.apiHost + "blog/upvote/" + blogId,
        );
    }

    downVoteBlog(blogId: number): Observable<any> {
        return this.http.get<any>(
            environment.apiHost + "blog/downvote/" + blogId,
        );
    }

    shareBlog(recommendation: BlogRecommendationMessage): Observable<BlogRecommendationMessage> {
        console.log(recommendation)
        return this.http.post<BlogRecommendationMessage>(`${environment.host}recommendations`, { recommendation });
    }
}
