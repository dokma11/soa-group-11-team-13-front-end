import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { environment } from "src/env/environment";
import { Observable } from "rxjs";
import { PersonUpdate } from "./model/person-update.model";
import { ProblemComment } from "./model/problem-comment.model";
import { Person } from "./model/person.model";
import { ProblemUser } from "../marketplace/model/problem-with-user.model";
import { ProblemAnswer } from "./model/problem-answer.model";
import { ProblemUpdateDeadline } from "./model/problem-update-deadline.model";
import { ProblemCommentCreate } from "./model/problem-comment-create.model";
import { ProblemResolvingNotification } from "./model/problem-resolving-notification.model";
import { Message, MessageUsernames } from "./model/message.model";
import { Follower } from "./model/follower.model";
import { Following } from "./model/following.model";
import { FollowerCreate } from "./model/follower-create.model";
import { UserFollow } from "./model/user-follow.model";

@Injectable({
    providedIn: "root",
})
export class StakeholderService {
    getProblem(problemId: number, userRole: string): Observable<ProblemUser> {
        return this.http.get<ProblemUser>(
            environment.apiHost + userRole + "/problem/" + problemId,
        );
    }
    getProblemAnswer(
        problemId: number,
        userRole: string,
    ): Observable<ProblemAnswer> {
        return this.http.get<ProblemAnswer>(
            environment.apiHost +
                userRole +
                "/problem/" +
                problemId +
                "/problem-answer",
        );
    }
    constructor(private http: HttpClient) {}

    getPeople(): Observable<PagedResults<Person>> {
        return this.http.get<PagedResults<Person>>(
            environment.apiHost + "people",
        );
    }
    getFollowers(id: number): Observable<PagedResults<Follower>> {
        return this.http.get<PagedResults<Follower>>(
            environment.apiHost + "follower/followers/" + id,
        );
    }
    getFollowings(id: number): Observable<PagedResults<Following>> {
        return this.http.get<PagedResults<Following>>(
            environment.apiHost + "follower/followings/" + id,
        );
    }
    getSearched(searchUsername: string): Observable<PagedResults<UserFollow>> {
        return this.http.get<PagedResults<UserFollow>>(
            environment.apiHost + "follower/search/" + searchUsername,
        );
    }
    deleteFollowing(id: number): Observable<Following> {
        return this.http.delete<Following>(
            environment.apiHost + "follower/" + id,
        );
    }
    addFollowing(follow: FollowerCreate): Observable<FollowerCreate> {
        return this.http.post<FollowerCreate>(
            environment.apiHost + "follower",
            follow,
        );
    }
    getByUserId(userId: number): Observable<Person> {
        return this.http.get<Person>(
            environment.apiHost + "people/person/" + userId,
        );
    }

    updatePerson(person: PersonUpdate): Observable<Person> {
        return this.http.put<Person>(
            environment.apiHost + "people/update/" + person.id,
            person,
        );
    }

    createComment(
        problemComment: ProblemCommentCreate,
        problemId: number,
        userRole: string,
    ): Observable<ProblemComment> {
        return this.http.patch<ProblemComment>(
            environment.apiHost +
                userRole +
                "/problem/" +
                problemId +
                "/problem-comments",
            problemComment,
        );
    }

    createAnswer(
        problemAnswer: ProblemAnswer,
        problemId: number,
    ): Observable<ProblemAnswer> {
        console.log(problemId);
        return this.http.patch<ProblemAnswer>(
            environment.apiHost +
                "author/problem/" +
                problemId +
                "/problem-answer/",
            problemAnswer,
        );
    }

    resolveProblem(
        problemId: number,
        userRole: string,
    ): Observable<ProblemUser> {
        console.log(userRole);
        return this.http.get<ProblemUser>(
            environment.apiHost +
                userRole +
                "/problem/" +
                problemId +
                "/resolve",
        );
    }

    getProblemComments(
        problemId: number,
        userRole: string,
    ): Observable<PagedResults<ProblemComment>> {
        return this.http.get<PagedResults<ProblemComment>>(
            environment.apiHost +
                userRole +
                "/problem/" +
                problemId +
                "/problem-comments",
        );
    }

    getAdminsProblems(): Observable<PagedResults<ProblemUser>> {
        return this.http.get<PagedResults<ProblemUser>>(
            environment.apiHost + "administrator/problem",
        );
    }

    getTouristsProblems(): Observable<PagedResults<ProblemUser>> {
        return this.http.get<PagedResults<ProblemUser>>(
            environment.apiHost + "tourist/problem",
        );
    }

    getAuthorsProblems(): Observable<PagedResults<ProblemUser>> {
        return this.http.get<PagedResults<ProblemUser>>(
            environment.apiHost + "author/problem",
        );
    }

    setDeadline(
        problem: ProblemUpdateDeadline,
    ): Observable<PagedResults<ProblemUser>> {
        console.log(problem);
        return this.http.put<PagedResults<ProblemUser>>(
            environment.apiHost +
                "administrator/problem/set-deadline/" +
                problem.id,
            problem,
        );
    }

    getNotificationsByLoggedInUser(): Observable<
        PagedResults<ProblemResolvingNotification>
    > {
        return this.http.get<PagedResults<ProblemResolvingNotification>>(
            environment.apiHost + "notifications/problems",
        );
    }

    setSeenStatus(
        notificationId: number,
    ): Observable<ProblemResolvingNotification> {
        return this.http.get<ProblemResolvingNotification>(
            environment.apiHost +
                "notifications/problems/set-seen/" +
                notificationId,
        );
    }
    sendMessage(
        message: string,
        senderMessageID: number,
        reciverMessageID: number,
    ) {
        return this.http.post(environment.apiHost + "messages/create", {
            Text: message,
            UserSenderId: senderMessageID,
            UserReciverId: reciverMessageID,
        });
    }

    getMessages(
        page: number,
        pageSize: number,
        receiverId: number,
    ): Observable<PagedResults<MessageUsernames>> {
        return this.http.get<PagedResults<MessageUsernames>>(
            environment.apiHost + "messages/" + receiverId,
        );
    }

    updateMessageStatusOnSeen(updatedMessage: Message): Observable<Message> {
        return this.http.put<Message>(
            environment.apiHost + "messages/update-status",
            updatedMessage,
        );
    }
}