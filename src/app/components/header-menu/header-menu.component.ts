import { Component } from '@angular/core';
import { KpiBadgeComponent } from './kpi-badge/kpi-badge.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@Component({
  selector: 'app-header-menu',
  imports: [KpiBadgeComponent, NotificationsComponent, UserProfileComponent],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css'
})
export class HeaderMenuComponent {
notificationCount = 4;
  dailySales = 3800;
  
  currentUser = {
    avatar: '👤',
    fullName: 'Mariana Rangel ',
    email: 'ceomariana@palmundo.com',
    role: 'Admin'
  };

  
}