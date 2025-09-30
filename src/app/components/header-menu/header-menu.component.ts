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
notificationCount = 2;
  dailySales = 15234.50;
  
  currentUser = {
    avatar: '👤',
    fullName: 'Ana García',
    email: 'ana.garcia@palmunido.com',
    role: 'Admin'
  };
}
