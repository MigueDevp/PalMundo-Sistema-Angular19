import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faBus, 
  faCalendarAlt, 
  faUsers, 
  faChair, 
  faDollarSign, 
  faChartLine,
  faFileContract,
  faArrowUp,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';

interface Trip {
  name: string;
  departureDate: string;
  occupiedSeats: number;
  totalSeats: number;
  availableSeats: number;
}

interface Contract {
  id: string;
  clientName: string;
  type: string;
  date: string;
  amount: number;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Icons
  faBus = faBus;
  faCalendarAlt = faCalendarAlt;
  faUsers = faUsers;
  faChair = faChair;
  faDollarSign = faDollarSign;
  faChartLine = faChartLine;
  faFileContract = faFileContract;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  // Upcoming trips data
  upcomingTrips: Trip[] = [
    {
      name: 'QRO-MAZATLÁN-2025',
      departureDate: '2025-12-15',
      occupiedSeats: 35,
      totalSeats: 50,
      availableSeats: 15
    },
    {
      name: 'CDMX-GUADALAJARA-2025',
      departureDate: '2025-12-20',
      occupiedSeats: 42,
      totalSeats: 50,
      availableSeats: 8
    },
    {
      name: 'MONTERREY-CANCÚN-2025',
      departureDate: '2025-12-28',
      occupiedSeats: 28,
      totalSeats: 50,
      availableSeats: 22
    }
  ];

  // Financial data
  monthlyFinances = {
    totalSold: 125000,
    totalCollected: 98000,
    totalPending: 27000,
    salesGrowth: 12.5,
    collectionGrowth: 8.3
  };

  // Recent contracts
  recentContracts: Contract[] = [
    {
      id: 'CT-2025-001',
      clientName: 'Juan Pérez García',
      type: 'Viaje',
      date: '2025-11-20',
      amount: 15000
    },
    {
      id: 'CT-2025-002',
      clientName: 'María López Sánchez',
      type: 'Servicio Individual',
      date: '2025-11-21',
      amount: 3500
    },
    {
      id: 'CT-2025-003',
      clientName: 'Carlos Ramírez Torres',
      type: 'Viaje',
      date: '2025-11-22',
      amount: 18000
    },
    {
      id: 'CT-2025-004',
      clientName: 'Ana Martínez Flores',
      type: 'Servicio Individual',
      date: '2025-11-22',
      amount: 4200
    },
    {
      id: 'CT-2025-005',
      clientName: 'Roberto González Díaz',
      type: 'Viaje',
      date: '2025-11-23',
      amount: 12500
    }
  ];

  // Calculate occupation percentage
  getOccupationPercentage(trip: Trip): number {
    return (trip.occupiedSeats / trip.totalSeats) * 100;
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  }

  // Format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}
