import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { MaterialModule } from "src/app/infrastructure/material/material.module";
import { FormsModule } from "@angular/forms";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { NotificationTabsComponent } from "./notification-tabs/notification-tabs.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MarketplaceModule } from "../marketplace/marketplace.module";
import { ShoppingCartComponent } from "./shopping-cart/shopping-cart.component";

@NgModule({
    declarations: [
        UserProfileComponent,
        EditProfileComponent,
        NotificationTabsComponent,
        ShoppingCartComponent,
    ],
    imports: [CommonModule, MaterialModule, FormsModule],
    exports: [
        UserProfileComponent,
        EditProfileComponent,
        NotificationTabsComponent,
        ShoppingCartComponent,
    ],
})
export class StakeholderModule {}
