import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonAddComponent } from '../../components/button-add/button-add.component';
import { Subscription } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSuitcase } from '@fortawesome/free-solid-svg-icons';
import { TripService, Trip } from '../../services/trip/trip.service';
import { ActionsbuttonsComponent } from '../../components/actionsbuttons/actionsbuttons.component';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonAddComponent, FontAwesomeModule, ActionsbuttonsComponent],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent implements OnInit, OnDestroy {
  // Tabs y estados
  activeTab: 'general' | 'precios' | 'detalles' = 'general';
  showModal = false;
  showDetailModal = false;
  isLoading = false;
  
  // Signals y datos
  viajes = signal<Trip[]>([]);
  error = signal<string | null>(null);
  selectedViaje: Trip | null = null;
  
  // Variables temporales para el formulario
  incluyeTemporal = '';
  noIncluyeTemporal = '';
  
  // Icono
  faSuitcase = faSuitcase;
  
  // Nuevo viaje (actualizado según la base de datos)
  newViaje: Omit<Trip, 'id_viaje'> = {
    clave: '',
    nombre_viaje: '',
    fecha_partida: '',
    fecha_regreso: '',
    ultimo_dia_pagar: '',
    cantidad_anticipo: 0,
    precio_adulto: 0,
    precio_menor: 0,
    precio_infante: 0,
    servicios_incluidos: [],
    servicios_no_incluidos: [],
    itinerario: '',
    estado_viaje: 'programado',
    activo: true
  };

  private subscriptions = new Subscription();

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadTrips(): void {
    this.isLoading = true;
    this.error.set(null);

    const subscription = this.tripService.getTrips().subscribe({
      next: (trips) => {
        this.viajes.set(trips);
        this.isLoading = false;
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading = false;
      }
    });

    this.subscriptions.add(subscription);
  }

  addViaje(): void {
    if (!this.validateForm()) {
      this.error.set('Por favor complete todos los campos requeridos');
      return;
    }

    const processedViaje = {
      ...this.newViaje,
      servicios_incluidos: this.incluyeTemporal.split(',').map(item => item.trim()).filter(Boolean),
      servicios_no_incluidos: this.noIncluyeTemporal.split(',').map(item => item.trim()).filter(Boolean)
    };

    this.isLoading = true;
    this.error.set(null);

    this.tripService.createTrip(processedViaje).subscribe({
      next: (response) => {
        if (response.success) {
          this.closeModal();
          this.loadTrips();
        } else {
          this.error.set(response.message || 'Error al crear el viaje');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading = false;
      }
    });
  }

  // Métodos auxiliares
  private validateForm(): boolean {
    return !!(
      this.newViaje.clave?.trim() &&
      this.newViaje.nombre_viaje?.trim() &&
      this.newViaje.fecha_partida &&
      this.newViaje.fecha_regreso &&
      this.newViaje.ultimo_dia_pagar &&
      this.newViaje.cantidad_anticipo >= 0 &&
      this.newViaje.precio_adulto >= 0
    );
  }

  // Métodos de UI
  openModal(): void {
    this.showModal = true;
    this.resetForm();
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  private resetForm(): void {
    this.newViaje = {
      clave: '',
      nombre_viaje: '',
      fecha_partida: '',
      fecha_regreso: '',
      ultimo_dia_pagar: '',
      cantidad_anticipo: 0,
      precio_adulto: 0,
      precio_menor: 0,
      precio_infante: 0,
      servicios_incluidos: [],
      servicios_no_incluidos: [],
      itinerario: '',
      estado_viaje: 'programado',
      activo: true
    };
    this.incluyeTemporal = '';
    this.noIncluyeTemporal = '';
    this.error.set(null);
  }

  // Métodos de formato
  formatFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-MX');
  }

  getEstadoClass(estado: string): string {
  switch (estado?.toLowerCase()) {
    case 'programado':
      return 'programado';
    case 'en_curso':
      return 'en-curso';
    case 'completado':
      return 'completado';
    case 'cancelado':
      return 'cancelado';
    default:
      return 'programado';
  }
}
}