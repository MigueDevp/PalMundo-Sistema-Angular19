import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faMoneyBillWave, 
  faFileInvoiceDollar, 
  faCoins, 
  faReceipt, 
  faChartLine,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

interface PaymentOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  route: string;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
  // Icons
  faArrowRight = faArrowRight;

  // Payment module options
  paymentOptions: PaymentOption[] = [
    {
      id: 'service-payments',
      title: 'Abonos a Contratos de Servicio',
      description: 'Registra pagos parciales a contratos de servicio activos',
      icon: faMoneyBillWave,
      color: '#3498db',
      route: '/payments/service-payments'
    },
    {
      id: 'full-settlements',
      title: 'Liquidaciones Completas de Contratos',
      description: 'Liquida el saldo total de contratos pendientes',
      icon: faFileInvoiceDollar,
      color: '#2ecc71',
      route: '/payments/full-settlements'
    },
    {
      id: 'misc-income',
      title: 'Ingresos Diversos',
      description: 'Registra ingresos adicionales por contratos individuales',
      icon: faCoins,
      color: '#f39c12',
      route: '/payments/misc-income'
    },
    {
      id: 'apply-payments',
      title: 'Aplicación de Pagos',
      description: 'Aplica pagos a conceptos específicos del contrato',
      icon: faReceipt,
      color: '#9b59b6',
      route: '/payments/apply-payments'
    },
    {
      id: 'account-status',
      title: 'Seguimiento del Estado de Cuenta',
      description: 'Consulta el historial y estado de cuenta de clientes',
      icon: faChartLine,
      color: '#e74c3c',
      route: '/payments/account-status'
    }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    // For now, just log the route since subpages don't exist yet
    console.log('Navigating to:', route);
    // Uncomment when routes are ready:
    // this.router.navigate([route]);
  }
}
