import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trips',
  imports: [CommonModule, FormsModule],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent {
 
  viajes = signal([
  { 
    id: 1,
    clave: 'QRO-MAZATLAN-2025',
    nombre: 'Tour Mazatlán Primavera 2025',
    fechaPartida: '2025-03-15T08:00',
    fechaRegreso: '2025-03-22T20:00',
    ultimoDiaPago: '2025-02-28',
    anticipo: 2500
  },
  { 
    id: 2,
    clave: 'QRO-PV-2025',
    nombre: 'Vacaciones Primavera Puerto Vallarta',
    fechaPartida: '2025-04-05T07:30',
    fechaRegreso: '2025-04-12T21:00',
    ultimoDiaPago: '2025-03-20',
    anticipo: 3000
  },
  { 
    id: 3,
    clave: 'QRO-ACAPULCO-2025',
    nombre: 'Escape a Acapulco',
    fechaPartida: '2025-05-10T06:00',
    fechaRegreso: '2025-05-15T22:00',
    ultimoDiaPago: '2025-04-30',
    anticipo: 1800
  },
  { 
    id: 4,
    clave: 'QRO-CANCUN-2025',
    nombre: 'Aventura Caribeña',
    fechaPartida: '2025-06-01T09:00',
    fechaRegreso: '2025-06-08T23:00',
    ultimoDiaPago: '2025-05-15',
    anticipo: 3500
  },
  { 
    id: 5,
    clave: 'QRO-LOSCABOS-2025',
    nombre: 'Experiencia VIP Cabo San Lucas',
    fechaPartida: '2025-07-12T05:00',
    fechaRegreso: '2025-07-19T23:30',
    ultimoDiaPago: '2025-06-25',
    anticipo: 4200
  },
  { 
    id: 6,
    clave: 'QRO-HUATULCO-2025',
    nombre: 'Paraíso Oaxaqueño',
    fechaPartida: '2025-08-08T08:30',
    fechaRegreso: '2025-08-15T21:00',
    ultimoDiaPago: '2025-07-20',
    anticipo: 2900
  },
  { 
    id: 7,
    clave: 'QRO-SANMIGUEL-2025',
    nombre: 'Fin de Semana en San Miguel',
    fechaPartida: '2025-09-05T16:00',
    fechaRegreso: '2025-09-07T20:00',
    ultimoDiaPago: '2025-08-25',
    anticipo: 1200
  },
  { 
    id: 8,
    clave: 'QRO-GUANAJUATO-2025',
    nombre: 'Cultura y Tradición',
    fechaPartida: '2025-10-10T07:00',
    fechaRegreso: '2025-10-12T22:00',
    ultimoDiaPago: '2025-09-30',
    anticipo: 1500
  }
]);

  // Variables para el modal
  showModal = false;
  newViaje = { 
    clave: '',
    nombre: '',
    fechaPartida: '',
    fechaRegreso: '',
    ultimoDiaPago: '',
    anticipo: 0
  };

  // Abrir modal
  openAddModal() {
    this.showModal = true;
  }

  // Cerrar modal
  closeModal() {
    this.showModal = false;
    this.newViaje = { 
      clave: '',
      nombre: '',
      fechaPartida: '',
      fechaRegreso: '',
      ultimoDiaPago: '',
      anticipo: 0
    };
  }

  // Agregar nuevo viaje
  addViaje() {
    if (this.newViaje.clave && this.newViaje.nombre) {
      this.viajes.update(list => [
        ...list,
        {
          id: this.viajes().length + 1,
          ...this.newViaje
        }
      ]);
      this.closeModal();
    }
  }

  // Formatear fecha para mostrar
  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX');
  }

  // Formatear fecha y hora para mostrar
  formatFechaHora(fechaHora: string): string {
    if (!fechaHora) return '';
    const date = new Date(fechaHora);
    return date.toLocaleString('es-MX');
  }
}
