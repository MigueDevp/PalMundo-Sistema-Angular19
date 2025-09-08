import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBus, faUser, faMapMarkerAlt, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

interface Passenger {
  id: string;
  nombre: string;
  edad: number;
  tipo: 'titular' | 'acompañante';
  asientoAsignado?: number;
  puntoAbordaje?: string;
}

interface Seat {
  numero: number;
  ocupado: boolean;
  seleccionado: boolean;
  pasajero?: string;
  tipo?: 'ventana' | 'pasillo' | 'centro';
}

interface ContractData {
  viaje: any;
  cliente: any;
  acompañantes: any[];
}

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
  // Icons
  faBus = faBus;
  faUser = faUser;
  faMapMarkerAlt = faMapMarkerAlt;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;

  // Current phase of the process
  currentPhase = signal<'seats' | 'boarding'>('seats');
  
  // Contract data from previous component
  contractData: ContractData = {
    viaje: {
      nombre: 'Mazatlán Premium: Todo Incluido',
      clave: 'QRO-MAZ-0325',
      fechaPartida: '2025-03-15T08:00:00',
      puntosAbordaje: [
        'Terminal Central Querétaro - 08:00 AM',
        'Plaza San Javier - 08:20 AM',
        'Centro Histórico - 08:40 AM',
        'Juriquilla - 09:00 AM'
      ]
    },
    cliente: {
      nombre: 'Juan Pérez García',
      edad: 35
    },
    acompañantes: [
      { nombre: 'María Pérez', edad: 32 },
      { nombre: 'Luis Pérez', edad: 8 },
      { nombre: 'Ana Pérez', edad: 5 }
    ]
  };

  // Passengers list including main client and companions
  passengers = signal<Passenger[]>([]);
  
  // Bus seats (54 seats total)
  seats = signal<Seat[]>([]);
  
  // Currently selected passenger for seat assignment
  selectedPassenger = signal<Passenger | null>(null);
  
  // Boarding point assignments
  boardingAssignments = signal<Map<string, string>>(new Map());
  
  // Loading states
  isLoading = false;
  error = signal<string | null>(null);

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializePassengers();
    this.initializeSeats();
  }

  private initializePassengers(): void {
    const passengerList: Passenger[] = [
      {
        id: 'titular',
        nombre: this.contractData.cliente.nombre,
        edad: this.contractData.cliente.edad,
        tipo: 'titular'
      }
    ];

    // Add companions
    this.contractData.acompañantes.forEach((acompañante, index) => {
      passengerList.push({
        id: `acompañante_${index}`,
        nombre: acompañante.nombre,
        edad: acompañante.edad,
        tipo: 'acompañante'
      });
    });

    this.passengers.set(passengerList);
  }

  private initializeSeats(): void {
    const seatList: Seat[] = [];
    
    // Create 54 seats with realistic bus layout
    for (let i = 1; i <= 54; i++) {
      const row = Math.ceil(i / 4);
      const position = i % 4;
      
      let tipo: 'ventana' | 'pasillo' | 'centro' = 'centro';
      if (position === 1 || position === 0) tipo = 'ventana';
      if (position === 2 || position === 3) tipo = 'pasillo';

      seatList.push({
        numero: i,
        ocupado: Math.random() > 0.7, // Simulate some occupied seats
        seleccionado: false,
        tipo
      });
    }

    this.seats.set(seatList);
  }

  selectSeat(seatNumber: number): void {
    const currentPassenger = this.selectedPassenger();
    if (!currentPassenger) {
      this.error.set('Por favor selecciona un pasajero primero');
      return;
    }

    const seats = this.seats();
    const seat = seats.find(s => s.numero === seatNumber);
    
    if (!seat || seat.ocupado) {
      this.error.set('Este asiento no está disponible');
      return;
    }

    // Clear previous seat assignment for this passenger
    const passengers = this.passengers();
    const passengerIndex = passengers.findIndex(p => p.id === currentPassenger.id);
    
    if (passengers[passengerIndex].asientoAsignado) {
      const previousSeat = seats.find(s => s.numero === passengers[passengerIndex].asientoAsignado);
      if (previousSeat) {
        previousSeat.seleccionado = false;
        previousSeat.pasajero = undefined;
      }
    }

    // Assign new seat
    seat.seleccionado = true;
    seat.pasajero = currentPassenger.nombre;
    passengers[passengerIndex].asientoAsignado = seatNumber;

    this.seats.set([...seats]);
    this.passengers.set([...passengers]);
    
    // Auto-select next passenger without seat
    this.selectNextPassengerWithoutSeat();
    
    this.error.set(null);
  }

  selectPassenger(passenger: Passenger): void {
    this.selectedPassenger.set(passenger);
    this.error.set(null);
  }

  private selectNextPassengerWithoutSeat(): void {
    const passengers = this.passengers();
    const nextPassenger = passengers.find(p => !p.asientoAsignado);
    this.selectedPassenger.set(nextPassenger || null);
  }

  getPassengersWithoutSeats(): Passenger[] {
    return this.passengers().filter(p => !p.asientoAsignado);
  }

  getPassengersWithSeats(): Passenger[] {
    return this.passengers().filter(p => p.asientoAsignado);
  }

  canProceedToBoarding(): boolean {
    return this.passengers().every(p => p.asientoAsignado);
  }

  proceedToBoarding(): void {
    if (!this.canProceedToBoarding()) {
      this.error.set('Todos los pasajeros deben tener un asiento asignado');
      return;
    }
    
    this.currentPhase.set('boarding');
    this.error.set(null);
    
    // Initialize boarding assignments
    const assignments = new Map<string, string>();
    this.passengers().forEach(p => {
      assignments.set(p.id, '');
    });
    this.boardingAssignments.set(assignments);
  }

  backToSeats(): void {
    this.currentPhase.set('seats');
  }

  updateBoardingPoint(passengerId: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      const assignments = this.boardingAssignments();
      assignments.set(passengerId, target.value);
      this.boardingAssignments.set(new Map(assignments));
    }
  }

  canGenerateContract(): boolean {
    const assignments = this.boardingAssignments();
    return this.passengers().every(p => assignments.get(p.id)?.trim());
  }

  generateContract(): void {
    if (!this.canGenerateContract()) {
      this.error.set('Todos los pasajeros deben tener un punto de abordaje asignado');
      return;
    }

    this.isLoading = true;
    
    // Simulate contract generation
    setTimeout(() => {
      console.log('Contract Data:', {
        passengers: this.passengers(),
        boardingAssignments: Object.fromEntries(this.boardingAssignments()),
        contractData: this.contractData
      });
      
      this.isLoading = false;
      // Navigate to contract preview or success page
      this.router.navigate(['/contract-preview']);
    }, 2000);
  }

  getSeatClass(seat: Seat | undefined): string {
    // Verificar si el asiento existe
    if (!seat) return 'seat';
    
    const classes = ['seat'];
    
    if (seat.ocupado) {
      classes.push('occupied');
    } else if (seat.seleccionado) {
      classes.push('selected');
    } else {
      classes.push('available');
    }
    
    if (seat.tipo) {
      classes.push(seat.tipo);
    }
    
    return classes.join(' ');
  }

  getSeatRows(): Seat[][] {
    const seats = this.seats();
    const rows: Seat[][] = [];
    
    for (let i = 0; i < seats.length; i += 4) {
      const row = seats.slice(i, i + 4);
      // Pad the row with empty Seat objects if it's not complete
      while (row.length < 4) {
        row.push({
          numero: 0,
          ocupado: false,
          seleccionado: false,
          tipo: 'centro'
        });
      }
      rows.push(row);
    }
    
    return rows;
  }
}