import { Routes } from '@angular/router';
import { ClientsComponent } from './pages/clients/clients.component';
import { MyTransportComponent } from './pages/my-transport/my-transport.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { PassengerReportComponent } from './pages/reports/passenger-report/passenger-report.component';
import { DebtorPassengerComponent } from './pages/reports/debtor-passenger/debtor-passenger.component';
import { SalesComponent } from './pages/sales/sales.component';
import { TransportComponent } from './pages/transport/transport.component';
import { TripCatalogComponent } from './pages/trip-catalog/trip-catalog.component';
import { TripsComponent } from './pages/trips/trips.component';
import { HomeComponent } from './pages/home/home.component';
import { MoneyReportComponent } from './pages/reports/money-report/money-report.component';
import { ContractViewComponent } from './pages/administration/contract-view/contract-view.component';
import { ContractServiceComponent } from './pages/trip-catalog/contract-service/contract-service.component';
import { SeatSelectionComponent } from './pages/trip-catalog/contract-service/seat-selection/seat-selection.component';

export const routes: Routes = [
  {
    path: 'inicio',
    component: HomeComponent,
  },
  {
    path: 'clients',
    component: ClientsComponent,
  },
  {
    path: 'my-transport',
    component: MyTransportComponent,
  },

  {
    path: 'payments',
    component: PaymentsComponent,
  },
  {
    path: 'passenger-report',
    component: PassengerReportComponent,
  },
  {
    path: 'debtor-passenger',
    component: DebtorPassengerComponent,
  },
  {
    path: 'money-report',
    component: MoneyReportComponent,
  },
  {
    path: 'sales',
    component: SalesComponent,
  },
  {
    path: 'transport',
    component: TransportComponent,
  },
  {
    path: 'trip-catalog',
    component: TripCatalogComponent,
  },
  {
    path: 'trips',
    component: TripsComponent,
  },
  {
    path: 'contract-service',
    component: ContractServiceComponent,
  },
  {
    path: 'contract-view',
    component: ContractViewComponent,
  },
  {
    path: 'seat-selection',
    component: SeatSelectionComponent,
  },

  {
    path: '**',
    redirectTo: '',
  },
];
