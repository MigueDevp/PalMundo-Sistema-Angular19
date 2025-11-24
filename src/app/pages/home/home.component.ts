import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

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
export class HomeComponent implements AfterViewInit {
  @ViewChild('salesChart') salesChartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

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

  // Chart.js implementation
  ngAfterViewInit(): void {
    this.createSalesChart();
  }

  private createSalesChart(): void {
    if (!this.salesChartCanvas) {
      return;
    }

    const ctx = this.salesChartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    // Sample data for the month (30 days)
    const labels = Array.from({ length: 30 }, (_, i) => `Día ${i + 1}`);
    
    // Generate sample sales data (random values for demonstration)
    const salesData = [
      4500, 5200, 3800, 6100, 5500, 4800, 5900, 6300, 5100, 4700,
      5800, 6200, 5400, 4900, 5600, 6400, 5300, 4600, 5700, 6000,
      5200, 4800, 5500, 6100, 5900, 5300, 4700, 5400, 6200, 5800
    ];

    // Generate sample payments data (abonos)
    const paymentsData = [
      3200, 4100, 2900, 4800, 4200, 3600, 4500, 5100, 3900, 3500,
      4400, 4900, 4100, 3700, 4300, 5200, 4000, 3400, 4400, 4700,
      3900, 3600, 4200, 4800, 4500, 4000, 3500, 4100, 4900, 4400
    ];

    // Create gradients
    const salesGradient = ctx.createLinearGradient(0, 0, 0, 400);
    salesGradient.addColorStop(0, 'rgba(52, 152, 219, 0.8)');
    salesGradient.addColorStop(1, 'rgba(52, 152, 219, 0.2)');

    const paymentsGradient = ctx.createLinearGradient(0, 0, 0, 400);
    paymentsGradient.addColorStop(0, 'rgba(46, 204, 113, 0.8)');
    paymentsGradient.addColorStop(1, 'rgba(46, 204, 113, 0.2)');

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ventas',
            data: salesData,
            backgroundColor: salesGradient,
            borderColor: '#3498db',
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Abonos',
            data: paymentsData,
            backgroundColor: paymentsGradient,
            borderColor: '#2ecc71',
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                family: 'Nunito',
                size: 13,
                weight: 600
              },
              color: '#2c3e50',
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(44, 62, 80, 0.95)',
            titleColor: '#fff',
            bodyColor: '#fff',
            titleFont: {
              family: 'Nunito',
              size: 14,
              weight: 700
            },
            bodyFont: {
              family: 'Nunito',
              size: 13
            },
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN'
                  }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: 'Nunito',
                size: 11
              },
              color: '#7f8c8d',
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              font: {
                family: 'Nunito',
                size: 12
              },
              color: '#7f8c8d',
              callback: function(value) {
                if (typeof value === 'number') {
                  return '$' + value.toLocaleString('es-MX');
                }
                return value;
              }
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart'
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

