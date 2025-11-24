import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonAddComponent } from '../../components/button-add/button-add.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBus } from '@fortawesome/free-solid-svg-icons';
import { ActionsbuttonsComponent } from '../../components/actionsbuttons/actionsbuttons.component';

@Component({
  selector: 'app-my-transport',
  imports: [FormsModule, CommonModule, ButtonAddComponent, FontAwesomeModule, ActionsbuttonsComponent],
  templateUrl: './my-transport.component.html',
  styleUrl: './my-transport.component.css'
})


export class MyTransportComponent {
  faBus = faBus;
 transportes = signal([
    { 
      id: 1,
      clave: 'PM2025-01',
      nombre: 'Autobús de Lujo Volvo',
      asientos: 45,
      chofer: 'Juan Pérez Martínez',
      bano: 'Sí',
      aire: 'Sí',
      rentado: 'No'
    },
    { 
      id: 2,
      clave: 'PM2025-02',
      nombre: 'Sprinter Mercedes',
      asientos: 18,
      chofer: 'Carlos Sánchez López',
      bano: 'No',
      aire: 'Sí',
      rentado: 'Sí'
    },
    { 
      id: 3,
      clave: 'PM2025-03',
      nombre: 'Autobús Escolar',
      asientos: 56,
      chofer: 'Miguel Ángel Ramírez',
      bano: 'No',
      aire: 'No',
      rentado: 'No'
    },
    { 
      id: 4,
      clave: 'PM2025-04',
      nombre: 'Van Ejecutiva',
      asientos: 12,
      chofer: 'Ana Laura Gómez',
      bano: 'No',
      aire: 'Sí',
      rentado: 'No'
    },
    { 
      id: 5,
      clave: 'PM2025-05',
      nombre: 'Autobús Dos Pisos',
      asientos: 72,
      chofer: 'Pedro Vargas Fernández',
      bano: 'Sí',
      aire: 'Sí',
      rentado: 'Sí'
    },
    { 
      id: 6,
      clave: 'PM2025-06',
      nombre: 'Minibús Turístico',
      asientos: 24,
      chofer: 'Luisa María Hernández',
      bano: 'Sí',
      aire: 'Sí',
      rentado: 'No'
    },
    { 
      id: 7,
      clave: 'PM2025-07',
      nombre: 'Autocaravana',
      asientos: 8,
      chofer: 'Roberto Jiménez Díaz',
      bano: 'Sí',
      aire: 'Sí',
      rentado: 'No'
    },
    { 
      id: 8,
      clave: 'PM2025-08',
      nombre: 'Autobús Ejecutivo',
      asientos: 32,
      chofer: 'María Fernanda Castro',
      bano: 'Sí',
      aire: 'Sí',
      rentado: 'Sí'
    }
  ]);

  showModal = false;
  newTransporte = { 
    clave: '',
    nombre: '',
    asientos: 0,
    chofer: '',
    bano: 'No',
    aire: 'No',
    rentado: 'No'
  };

  openAddModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.newTransporte = { 
      clave: '',
      nombre: '',
      asientos: 0,
      chofer: '',
      bano: 'No',
      aire: 'No',
      rentado: 'No'
    };
  }

  addTransporte() {
    if (this.newTransporte.clave && this.newTransporte.nombre) {
      this.transportes.update(list => [
        ...list,
        {
          id: this.transportes().length + 1,
          ...this.newTransporte
        }
      ]);
      this.closeModal();
    }
  }

  // Métodos para las acciones de los botones
  viewTransporte(transporte: any) {
    console.log('Ver transporte:', transporte);
    // Aquí puedes implementar la lógica para ver detalles
    alert(`Detalles del transporte:\n\nClave: ${transporte.clave}\nNombre: ${transporte.nombre}\nAsientos: ${transporte.asientos}\nChofer: ${transporte.chofer}`);
  }

  editTransporte(transporte: any) {
    console.log('Editar transporte:', transporte);
    // Aquí puedes implementar la lógica para editar
    alert(`Editar transporte: ${transporte.nombre}`);
  }

  deleteTransporte(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este transporte?')) {
      this.transportes.update(list => list.filter(t => t.id !== id));
      console.log('Transporte eliminado:', id);
    }
  }
}
