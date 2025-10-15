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
  imports: [
    CommonModule,
    FormsModule,
    ButtonAddComponent,
    FontAwesomeModule,
    ActionsbuttonsComponent,
  ],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css',
})
export class TripsComponent implements OnInit, OnDestroy {
  faSuitcase = faSuitcase;
  Array = Array;

  viajes = signal<Trip[]>([]);
  error = signal<string | null>(null);
  isLoading = false;

  showModal = false;
  isEditMode = false;
  isViewMode = false;
  editingViaje: Trip | null = null;
  viewingViaje: Trip | null = null;

  newViaje: Omit<Trip, 'id_viaje'> & { usuario_creacion: string } = {
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
    estado_viaje: 'PROGRAMADO',
    activo: true,
    usuario_creacion: 'admin',
  };

  incluyeTemporal = '';
  noIncluyeTemporal = '';
  incluyeTemporalEdit = '';
  noIncluyeTemporalEdit = '';

  private subscriptions = new Subscription();

  constructor(private tripService: TripService) {
    console.log('TripsComponent initialized - now using TripService');
  }

  ngOnInit(): void {
    this.loadTrips();
    this.subscribeToChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private convertToString(value: any): string {
    if (!value) return '';

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    if (typeof value === 'string') {
      let cleaned = value.trim();
      if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
        cleaned = cleaned.slice(1, -1);
      }

      cleaned = cleaned
        .replace(/"/g, '')
        .replace(/\\/g, '')
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .join(', ');

      return cleaned;
    }

    return '';
  }

  private convertToArray(value: string): string[] {
    if (!value || !value.trim()) return [];

    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  private loadTrips(): void {
    //console.log('Loading trips from service...');
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
        this.error.set(
          'Error cargando la lista de viajes. Por favor intenta de nuevo.'
        );
        this.isLoading = false;
      },
    });

    this.subscriptions.add(subscription);
  }

  private subscribeToChanges(): void {
    const subscription = this.tripService.trips$.subscribe({
      next: (trips) => {
        if (JSON.stringify(this.viajes()) !== JSON.stringify(trips)) {
          console.log('Changes detected in trips list');
          this.viajes.set(trips);
        }
      },
    });

    this.subscriptions.add(subscription);
  }

  openAddModal(): void {
    this.showModal = true;
    this.isEditMode = false;
    this.isViewMode = false;
    this.error.set(null);
    this.resetForm();
  }

  openEditModal(viaje: Trip): void {
    //console.log('✏️ Opening edit modal for trip:', viaje);

    this.editingViaje = { ...viaje };
    this.isEditMode = true;
    this.isViewMode = false;
    this.showModal = true;
    this.error.set(null);

    this.incluyeTemporalEdit = this.convertToString(viaje.servicios_incluidos);
    this.noIncluyeTemporalEdit = this.convertToString(
      viaje.servicios_no_incluidos
    );
  }

  formatServiciosPreview(servicios: any): string {
    if (!servicios) return 'Sin servicios';

    const serviciosArray = this.convertToArray(this.convertToString(servicios));

    if (serviciosArray.length === 0) return 'Sin servicios';
    if (serviciosArray.length <= 2) return serviciosArray.join(', ');

    return (
      serviciosArray.slice(0, 2).join(', ') +
      `... (+${serviciosArray.length - 2})`
    );
  }

  formatServicios(servicios: any): string {
    if (!servicios) return 'Sin servicios';

    const serviciosArray = this.convertToArray(this.convertToString(servicios));

    return serviciosArray.length > 0
      ? serviciosArray.join(', ')
      : 'Sin servicios';
  }

  openViewModal(viaje: Trip): void {
    //console.log('👁️ Opening view modal for trip:', viaje);

    this.viewingViaje = { ...viaje };
    this.isViewMode = true;
    this.isEditMode = false;
    this.showModal = true;
    this.error.set(null);
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.isViewMode = false;
    this.editingViaje = null;
    this.viewingViaje = null;
    this.resetForm();
  }

  addViaje(): void {
    if (!this.validateForm()) {
      this.error.set('Por favor completa todos los campos requeridos');
      return;
    }

    // console.log('📤 Enviando nuevo viaje al servicio');
    this.isLoading = true;
    this.error.set(null);

    // Convertir strings a arrays limpios
    const viajeToSend = {
      ...this.newViaje,
      servicios_incluidos: this.convertToArray(this.incluyeTemporal),
      servicios_no_incluidos: this.convertToArray(this.noIncluyeTemporal),
    };

    //console.log('📦 Datos a enviar:', viajeToSend);

    const subscription = this.tripService.createTrip(viajeToSend).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('✅ Viaje creado exitosamente:', response.data);
          this.closeModal();
          this.loadTrips();
        } else {
          this.error.set(response.message || 'Error creando viaje');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creando viaje:', error);
        this.error.set('Error: ' + error.message);
        this.isLoading = false;
      },
    });

    this.subscriptions.add(subscription);
  }

  updateViaje(): void {
    if (!this.editingViaje || !this.editingViaje.id_viaje) {
      this.error.set('Viaje no válido para editar');
      return;
    }

    if (!this.validateEditForm()) {
      this.error.set('Por favor completa todos los campos requeridos');
      return;
    }

    console.log('📤 Actualizando viaje');
    this.isLoading = true;
    this.error.set(null);

    // Convertir strings a arrays limpios - ESTO ES CLAVE
    const viajeToUpdate = {
      ...this.editingViaje,
      servicios_incluidos: this.convertToArray(this.incluyeTemporalEdit),
      servicios_no_incluidos: this.convertToArray(this.noIncluyeTemporalEdit),
    };

    console.log('📦 Datos a actualizar:', viajeToUpdate);
    console.log(
      '🔍 Servicios incluidos como array:',
      viajeToUpdate.servicios_incluidos
    );
    console.log(
      '🔍 Servicios NO incluidos como array:',
      viajeToUpdate.servicios_no_incluidos
    );

    const subscription = this.tripService
      .updateTrip(this.editingViaje.id_viaje, viajeToUpdate)
      .subscribe({
        next: (response) => {
          if (response.success) {
            console.log('✅ Viaje actualizado exitosamente:', response.data);
            this.closeModal();
            this.loadTrips();
          } else {
            this.error.set(response.message || 'Error actualizando viaje');
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error actualizando viaje:', error);
          this.error.set('Error: ' + error.message);
          this.isLoading = false;
        },
      });

    this.subscriptions.add(subscription);
  }

  deleteViaje(id: number): void {
    if (!confirm('¿Estás seguro de que quieres eliminar este viaje?')) {
      return;
    }

    this.isLoading = true;
    const subscription = this.tripService.deleteTrip(id).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('✅ Viaje eliminado exitosamente');
          this.loadTrips();
        } else {
          this.error.set(response.message || 'Error eliminando viaje');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error eliminando viaje:', error);
        this.error.set('Error eliminando viaje');
        this.isLoading = false;
      },
    });

    this.subscriptions.add(subscription);
  }

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

  private validateEditForm(): boolean {
    if (!this.editingViaje) return false;

    return !!(
      this.editingViaje.clave?.trim() &&
      this.editingViaje.nombre_viaje?.trim() &&
      this.editingViaje.fecha_partida &&
      this.editingViaje.fecha_regreso &&
      this.editingViaje.ultimo_dia_pagar &&
      this.editingViaje.cantidad_anticipo >= 0 &&
      this.editingViaje.precio_adulto >= 0
    );
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
      estado_viaje: 'PROGRAMADO',
      activo: true,
      usuario_creacion: 'admin',
    };
    this.incluyeTemporal = '';
    this.noIncluyeTemporal = '';
    this.error.set(null);
  }

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

  calcularDuracion(fechaPartida: string, fechaRegreso: string): number {
    if (!fechaPartida || !fechaRegreso) return 0;

    const partida = new Date(fechaPartida);
    const regreso = new Date(fechaRegreso);
    const diffTime = Math.abs(regreso.getTime() - partida.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
}
