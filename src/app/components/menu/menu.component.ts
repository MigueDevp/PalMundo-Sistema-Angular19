import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faHome, faUsers, faRoute, faListAlt, faCashRegister,
  faBus, faBusAlt, faChartBar, faMoneyBillWave, faUserCog, 
  faSignOutAlt, faChevronDown, faChevronUp 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent {
  // Iconos
  faHome = faHome;
  faUsers = faUsers;
  faRoute = faRoute;
  faListAlt = faListAlt;
  faCashRegister = faCashRegister;
  faBus = faBus;
  faBusAlt = faBusAlt;
  faChartBar = faChartBar;
  faMoneyBillWave = faMoneyBillWave;
  faUserCog = faUserCog;
  faSignOutAlt = faSignOutAlt;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;

  // Estados de los submenús
  isSalesOpen = false;
  isReportsOpen = false;
  isAdminOpen = false;

  toggleSales() {
    this.isSalesOpen = !this.isSalesOpen;
  }

  toggleReports() {
    this.isReportsOpen = !this.isReportsOpen;
  }

  toggleAdmin(){
    this.isAdminOpen = !this.isAdminOpen;
  }
}