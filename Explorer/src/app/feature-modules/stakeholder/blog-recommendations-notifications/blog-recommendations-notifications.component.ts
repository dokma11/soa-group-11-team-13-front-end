import { Component, OnInit } from '@angular/core';
import { StakeholderService } from '../stakeholder.service';
import { faBlog } from "@fortawesome/free-solid-svg-icons";
import { BlogRecommendationNotification } from '../model/blog-recommendation.model';

@Component({
  selector: 'xp-blog-recommendations-notifications',
  templateUrl: './blog-recommendations-notifications.component.html',
  styleUrls: ['./blog-recommendations-notifications.component.css']
})
export class BlogRecommendationsNotificationsComponent implements OnInit {
  notifications: BlogRecommendationNotification[] = []

  constructor(private service: StakeholderService){}

  ngOnInit(): void{
      this.service.getBlogRecommendationNotifications().subscribe(result =>{
        this.notifications = result;
      })
  }

  faBlog = faBlog;

}
