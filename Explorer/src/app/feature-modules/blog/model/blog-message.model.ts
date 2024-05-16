import { BlogRecommendationRequest } from "../../stakeholder/model/blog-recommendation-request.model";
import { Vote } from "./vote.model";

export interface BlogMessage {
  id: number;
  title: string;
  description: string;
  status: number;
  authorId: number;
  comments?: Comment[];
  votes?: Vote[];
  recommendations?: BlogRecommendationRequest[];
}