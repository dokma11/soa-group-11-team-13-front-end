import { BlogMessage } from "../../blog/model/blog-message.model";

export interface BlogRecommendationMessage {
  id?: number,
  blogId: number,
  recommenderId: number,
  recommendationReceiverId: number,
  //blog?: BlogMessage,
}