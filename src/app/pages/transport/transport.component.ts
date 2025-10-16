import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonAddComponent } from '../../components/button-add/button-add.component';
import { ActionsbuttonsComponent } from '../../components/actionsbuttons/actionsbuttons.component';


@Component({
  selector: 'app-transport',
  imports: [FormsModule, CommonModule, ButtonAddComponent, ActionsbuttonsComponent],
  standalone: true,
  templateUrl: './transport.component.html',
  styleUrl: './transport.component.css',
})
export class TransportComponent {
  transportesViaje = signal([
    {
      id: 1,
      nombreViaje: 'Tour Mazatlán Primavera 2025',
      puntoSalida: 'Terminal QRO Norte',
      fechaSalida: '2025-03-15',
      fechaRegreso: '2025-03-22',
      transporteElegido: 'Autobús de Lujo Volvo (PM2025-01)',
      conductor: 'Juan Pérez Martínez',
      horaSalida: '08:00',
      horaRegreso: '20:00',
    },
    {
      id: 2,
      nombreViaje: 'Vacaciones Primavera Puerto Vallarta',
      puntoSalida: 'Terminal QRO Centro',
      fechaSalida: '2025-04-05',
      fechaRegreso: '2025-04-12',
      transporteElegido: 'Sprinter Mercedes (PM2025-02)',
      conductor: 'Carlos Sánchez López',
      horaSalida: '07:30',
      horaRegreso: '21:00',
    },
    {
      id: 3,
      nombreViaje: 'Escape a Acapulco',
      puntoSalida: 'Aeropuerto QRO',
      fechaSalida: '2025-05-10',
      fechaRegreso: '2025-05-15',
      transporteElegido: 'Autobús Ejecutivo (PM2025-08)',
      conductor: 'María Fernanda Castro',
      horaSalida: '06:00',
      horaRegreso: '22:00',
    },
    {
      id: 4,
      nombreViaje: 'Aventura Caribeña',
      puntoSalida: 'Terminal QRO Sur',
      fechaSalida: '2025-06-01',
      fechaRegreso: '2025-06-08',
      transporteElegido: 'Autobús Dos Pisos (PM2025-05)',
      conductor: 'Pedro Vargas Fernández',
      horaSalida: '09:00',
      horaRegreso: '23:00',
    },
  ]);

  showModal = false;
  newTransporteViaje = {
    nombreViaje: '',
    puntoSalida: '',
    fechaSalida: '',
    fechaRegreso: '',
    transporteElegido: '',
    conductor: '',
    horaSalida: '08:00',
    horaRegreso: '20:00',
  };

  puntosSalida = [
    'Coppel Rio Moctezuma SJR',
    'La comer SJR',
    'Pedro Escobedo',
    'Tequisquiapan',
    'Gomez Morin QRO',
  ];

  transportesDisponibles = [
    'Autobús de Lujo Volvo (PM2025-01)',
    'Sprinter Mercedes (PM2025-02)',
    'Autobús Escolar (PM2025-03)',
    'Van Ejecutiva (PM2025-04)',
    'Autobús Dos Pisos (PM2025-05)',
    'Minibús Turístico (PM2025-06)',
    'Autocaravana (PM2025-07)',
    'Autobús Ejecutivo (PM2025-08)',
  ];

  conductoresDisponibles = [
    'Juan Pérez Martínez',
    'Carlos Sánchez López',
    'Miguel Ángel Ramírez',
    'Ana Laura Gómez',
    'Pedro Vargas Fernández',
    'Luisa María Hernández',
    'Roberto Jiménez Díaz',
    'María Fernanda Castro',
  ];

  openAddModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  addTransporteViaje() {
    if (
      this.newTransporteViaje.nombreViaje &&
      this.newTransporteViaje.fechaSalida
    ) {
      this.transportesViaje.update((list) => [
        ...list,
        {
          id: this.transportesViaje().length + 1,
          ...this.newTransporteViaje,
        },
      ]);
      this.closeModal();
    }
  }

  private resetForm() {
    this.newTransporteViaje = {
      nombreViaje: '',
      puntoSalida: '',
      fechaSalida: '',
      fechaRegreso: '',
      transporteElegido: '',
      conductor: '',
      horaSalida: '08:00',
      horaRegreso: '20:00',
    };
  }
}
