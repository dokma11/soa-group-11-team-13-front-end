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

    getBlogs(): Observable<PagedResults<Blog>> {
        return this.http.get<PagedResults<Blog>>(environment.apiHost + "blog");
    }
    getClubBlogs(clubId: number): Observable<PagedResults<Blog>> {
        return this.http.get<PagedResults<Blog>>(environment.apiHost + "blog/getClubBlogs?page=0&pageSize=0&clubId="+clubId);
    }
    getBlog(id: number): Observable<Blog> {
        return this.http.get<Blog>(environment.apiHost + "blog/" + id);
    }

    searchByName(name: string): Observable<Blog[]> {
        return this.http.get<Blog[]>(environment.apiHost + "blog/search/" + name);
    }

    deleteBlog(id: number) : Observable<Blog>{
        console.log('Proba brisanja');
        console.log(id);
        return this.http.delete<Blog>(
            environment.apiHost + "blog/" + id
        );
    }

    getComments(blogId: number): Observable<PagedResults<Comment>> {
        return this.http.get<PagedResults<Comment>>(
            environment.apiHost + "tourist/comment/" + blogId,
        );
    }

    addComment(comment: CreateComment): Observable<Comment> {
        console.log(comment);
        return this.http.post<Comment>(
            environment.apiHost + "tourist/comment",
            comment,
        );
    }

    updateComment(comment: Comment): Observable<Comment> {
        console.log(comment);
        return this.http.put<Comment>(
            environment.apiHost + "tourist/comment/" + comment.id,
            comment,
        );
    }

    deleteComment(id: Number): Observable<Comment> {
        return this.http.delete<Comment>(
            environment.apiHost + "tourist/comment/" + id,
        );
    }

    saveBlog(blog: CreateBlog): Observable<CreateBlog> {
        blog.status = 0;
        return this.http.post<CreateBlog>(
            environment.apiHost + "blog/create",
            blog,
        );
    }

    saveClubBlog(blog: CreateBlog): Observable<CreateBlog> {
        blog.status = 1;
        return this.http.post<CreateBlog>(
            environment.apiHost + "blog/createClubBlog",
            blog,
        );
    }

    updateBlog(blog: UpdateBlog): Observable<UpdateBlog> {
        return this.http.put<UpdateBlog>(
            environment.apiHost + "blog/update",
            blog,
        );
    }

    publishBlog(blogId: number): Observable<any> {
        return this.http.patch<any>(environment.apiHost + "blog/publish/" + blogId, {});
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

    shareBlog(blogRecommendationRequest: BlogRecommendationRequest): Observable<any> {
        return this.http.post<any>(environment.apiHost + "blog/recommendations", blogRecommendationRequest);
    }
}
