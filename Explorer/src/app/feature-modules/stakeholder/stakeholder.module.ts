import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { FormsModule } from "@angular/forms";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { MessageDialogComponent } from "./message-dialog/message-dialog/message-dialog.component";
import { FollowDialogComponent } from "./follow-dialog/follow-dialog.component";
import { UserNotificationsComponent } from "./user-notifications/user-notifications.component";
import { FollowerSearchDialogComponent } from "./follower-search-dialog/follower-search-dialog.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [
        MessageDialogComponent,
        UserProfileComponent,
        EditProfileComponent,
        FollowDialogComponent,
        UserNotificationsComponent,
        FollowerSearchDialogComponent,
    ],
    imports: [CommonModule, MaterialModule, FormsModule, FontAwesomeModule],
    exports: [
        MessageDialogComponent,
        UserProfileComponent,
        EditProfileComponent,
    ],
})
export class StakeholderModule {}
