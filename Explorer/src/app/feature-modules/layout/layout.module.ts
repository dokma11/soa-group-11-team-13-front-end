import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home/home.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { RouterModule } from "@angular/router";
import { TourCardsComponent } from "./tour-cards/tour-cards.component";
import { BlogCardsComponent } from "./blog-cards/blog-cards.component";
import { FooterComponent } from "./footer/footer.component";
import { HomeTabsComponent } from "./home-tabs/home-tabs.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ClubCardsComponent } from "./club-cards/club-cards.component";
import { MatDialogModule } from "@angular/material/dialog";
import { TourCardComponent } from "./tour-card/tour-card.component";
import { BlogCardComponent } from "./blog-card/blog-card.component";
import { ClubCardComponent } from "./club-card/club-card.component";
import { TouristEquipmentSelectionComponent } from "./tourist-equipment-selection/tourist-equipment-selection.component";
import { RequestKeyPointCardComponent } from "./request-key-point-card/request-key-point-card.component";
import { RequestFacilityCardComponent } from "./request-facility-card/request-facility-card.component";
import { ReviewCardComponent } from "./review-cards/review-card.component";
import { PublicKeypointNotificationCardComponent } from "./public-keypoint-notification-card/public-keypoint-notification-card.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    declarations: [
        HomeComponent,
        NavbarComponent,
        TourCardsComponent,
        BlogCardsComponent,
        FooterComponent,
        HomeTabsComponent,
        ClubCardsComponent,
        TourCardComponent,
        BlogCardComponent,
        ClubCardComponent,
        TouristEquipmentSelectionComponent,
        RequestKeyPointCardComponent,
        RequestFacilityCardComponent,
        ReviewCardComponent,
        PublicKeypointNotificationCardComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        FontAwesomeModule,
        MatDialogModule,
        SharedModule,
    ],
    exports: [
        NavbarComponent,
        HomeComponent,
        RequestKeyPointCardComponent,
        RequestFacilityCardComponent,
        FooterComponent,
        TourCardComponent,
        ReviewCardComponent,
        PublicKeypointNotificationCardComponent,
    ],
})
export class LayoutModule {}
