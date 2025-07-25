import { Routes } from '@angular/router';
import { ClientsComponent } from './pages/clients/clients.component';
import { MyTransportComponent } from './pages/my-transport/my-transport.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SalesComponent } from './pages/sales/sales.component';
import { TransportComponent } from './pages/transport/transport.component';
import { TripCatalogComponent } from './pages/trip-catalog/trip-catalog.component';
import { TripsComponent } from './pages/trips/trips.component';
import { HomeComponent } from './pages/home/home.component';
import { ContractViewComponent } from './pages/administration/contract-view/contract-view.component';
import { ContractServiceComponent } from './pages/trip-catalog/contract-service/contract-service.component';

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
    path: 'reports',
    component: ReportsComponent,
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
    path: '**',
    redirectTo: '',
  },
];
