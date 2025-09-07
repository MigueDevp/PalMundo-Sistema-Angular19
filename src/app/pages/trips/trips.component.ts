import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonAddComponent } from '../../components/button-add/button-add.component';
import { Subscription } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSuitcase } from '@fortawesome/free-solid-svg-icons';

// Import our service and interfaces
import { TripService, Trip, TripResponse, Itinerario, InformacionAdicional } from '../../services/trip/trip.service';

@Component({
  selector: 'app-trips',
  imports: [CommonModule, FormsModule, ButtonAddComponent, FontAwesomeModule],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css',
})
export class TripsComponent implements OnInit, OnDestroy {
  activeTab: 'general' | 'precios' | 'detalles' = 'general';
  incluyeTemporal: string = '';
  noIncluyeTemporal: string = '';
  puntosSalidaTemporal: string = '';

  selectedViaje: Trip | null = null;
  showDetailModal = false;

  // Instead of signal with fixed data, use the service
  viajes = signal<Trip[]>([]);
  isLoading = false;
  error = signal<string | null>(null);

  faSuitcase = faSuitcase;
  
  private subscriptions = new Subscription();

  // Variables for the new trip form
  showModal = false;
  newViaje: Omit<Trip, 'id' | 'estado' | 'asientosDisponibles'> = {
    clave: '',
    nombre: '',
    fechaPartida: '',
    fechaRegreso: '',
    ultimoDiaPago: '',
    anticipo: 0,
    precioAdulto: 0,
    precioInfante: 0,
    precioMenor: 0,
    incluye: [''],
    noIncluye: [''],
    itinerario: [{ dia: 1, titulo: '', descripcion: '' }],
    informacionAdicional: {
      puntosSalida: [''],
      formasPago: [''],
      politicas: '',
    }
  };

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.loadTrips();
    this.subscribeToChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public loadTrips(): void {
    console.log('Loading trips from service...');
    this.isLoading = true;
    this.error.set(null);

    const subscription = this.tripService.getTrips().subscribe({
      next: (trips) => {
        console.log('Trips loaded successfully:', trips.length);
        this.viajes.set(trips);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trips:', error);
        this.error.set('Error loading trip list. Please try again.');
        this.isLoading = false;
      }
    });

    this.subscriptions.add(subscription);
  }

  private subscribeToChanges(): void {
    const subscription = this.tripService.trips$.subscribe({
      next: (trips) => {
        if (JSON.stringify(this.viajes()) !== JSON.stringify(trips)) {
          console.log('Changes detected in trip list');
          this.viajes.set(trips.map(trip => this.tripService['enrichTripData'](trip)));
        }
      }
    });

    this.subscriptions.add(subscription);
  }

  openDetailModal(viaje: Trip) {
    this.selectedViaje = viaje;
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedViaje = null;
  }

  openAddModal() {
    this.showModal = true;
    this.activeTab = 'general';
    this.incluyeTemporal = '';
    this.noIncluyeTemporal = '';
    this.puntosSalidaTemporal = '';
    this.error.set(null);
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  nextTab() {
    if (this.activeTab === 'general') {
      this.activeTab = 'precios';
    } else if (this.activeTab === 'precios') {
      this.activeTab = 'detalles';
    }
  }

  addViaje() {
    if (!this.validateForm()) {
      this.error.set('Please complete all required fields');
      return;
    }

    console.log('Sending new trip to service:', this.newViaje);
    this.isLoading = true;
    this.error.set(null);

    // Process text fields to arrays
    const processedViaje = {
      ...this.newViaje,
      incluye: this.incluyeTemporal
        .split(',')
        .map(item => item.trim())
        .filter(item => item),
      noIncluye: this.noIncluyeTemporal
        .split(',')
        .map(item => item.trim())
        .filter(item => item),
      informacionAdicional: {
        ...this.newViaje.informacionAdicional,
        puntosSalida: this.puntosSalidaTemporal
          .split('\n')
          .map(item => item.trim())
          .filter(item => item),
        formasPago: this.newViaje.informacionAdicional.formasPago.filter(item => item),
        politicas: this.newViaje.informacionAdicional.politicas || 'Políticas básicas del viaje',
      },
      itinerario: this.newViaje.itinerario.filter(item => item.titulo || item.descripcion)
    };

    const subscription = this.tripService.createTrip(processedViaje).subscribe({
      next: (response: TripResponse) => {
        if (response.success) {
          console.log('Trip created successfully:', response.data);
          this.closeModal();
          console.log('✅ Trip added successfully');
        } else {
          console.error('Service error:', response.message);
          this.error.set(response.message || 'Error creating trip');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Unexpected error creating trip:', error);
        this.error.set('Unexpected error. Please try again.');
        this.isLoading = false;
      }
    });

    this.subscriptions.add(subscription);
  }

  private validateForm(): boolean {
    return !!(
      this.newViaje.clave?.trim() &&
      this.newViaje.nombre?.trim() &&
      this.newViaje.fechaPartida &&
      this.newViaje.fechaRegreso &&
      this.newViaje.ultimoDiaPago &&
      this.newViaje.anticipo >= 0 &&
      this.newViaje.precioAdulto >= 0
    );
  }

  private resetForm(): void {
    this.newViaje = {
      clave: '',
      nombre: '',
      fechaPartida: '',
      fechaRegreso: '',
      ultimoDiaPago: '',
      anticipo: 0,
      precioAdulto: 0,
      precioInfante: 0,
      precioMenor: 0,
      incluye: [''],
      noIncluye: [''],
      itinerario: [{ dia: 1, titulo: '', descripcion: '' }],
      informacionAdicional: {
        puntosSalida: [''],
        formasPago: [''],
        politicas: '',
      }
    };
    this.error.set(null);
  }

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX');
  }

  formatFechaHora(fechaHora: string): string {
    if (!fechaHora) return '';
    const date = new Date(fechaHora);
    return date.toLocaleString('es-MX');
  }

  // Future methods to implement:
  updateTrip(trip: Trip): void {
    // Similar to addViaje but using tripService.updateTrip()
  }

  deleteTrip(id: number): void {
    // Similar to addViaje but using tripService.deleteTrip()
  }

  searchTrips(term: string): void {
    // Use tripService.searchTrips()
  }
}