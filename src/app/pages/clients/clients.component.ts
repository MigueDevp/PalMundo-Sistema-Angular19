import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonAddComponent } from '../../components/button-add/button-add.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonAddComponent, FontAwesomeModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  // Datos de ejemplo completos
  faUser = faUser;
clients = signal([
  { 
    id: 1, 
    nombre: 'Ana López', 
    fechaNacimiento: '1985-05-15',
    direccion: 'Calle Primavera 123, CDMX',
    telefono: '5512345678', 
    email: 'ana@example.com',
    sexo: 'Femenino',
    edad: this.calcularEdad('1985-05-15')
  },
  { 
    id: 2, 
    nombre: 'Carlos Ruiz', 
    fechaNacimiento: '1990-08-22',
    direccion: 'Av. Reforma 456, Monterrey',
    telefono: '5512345679', 
    email: 'carlos@example.com',
    sexo: 'Masculino',
    edad: this.calcularEdad('1990-08-22')
  },
  { 
    id: 3, 
    nombre: 'María García', 
    fechaNacimiento: '1988-03-10',
    direccion: 'Boulevard Los Ángeles 789, Guadalajara',
    telefono: '3312345678', 
    email: 'maria@example.com',
    sexo: 'Femenino',
    edad: this.calcularEdad('1988-03-10')
  },
  { 
    id: 4, 
    nombre: 'Juan Pérez', 
    fechaNacimiento: '1992-11-30',
    direccion: 'Calle Central 456, Puebla',
    telefono: '2221234567', 
    email: 'juan@example.com',
    sexo: 'Masculino',
    edad: this.calcularEdad('1992-11-30')
  },
  { 
    id: 5, 
    nombre: 'Laura Martínez', 
    fechaNacimiento: '1983-07-18',
    direccion: 'Av. Juárez 789, Tijuana',
    telefono: '6641234567', 
    email: 'laura@example.com',
    sexo: 'Femenino',
    edad: this.calcularEdad('1983-07-18')
  },
  { 
    id: 6, 
    nombre: 'Pedro Sánchez', 
    fechaNacimiento: '1995-04-25',
    direccion: 'Calle Libertad 321, León',
    telefono: '4771234567', 
    email: 'pedro@example.com',
    sexo: 'Masculino',
    edad: this.calcularEdad('1995-04-25')
  },
  { 
    id: 7, 
    nombre: 'Sofía Ramírez', 
    fechaNacimiento: '1987-09-12',
    direccion: 'Av. Hidalgo 654, Querétaro',
    telefono: '4421234567', 
    email: 'sofia@example.com',
    sexo: 'Femenino',
    edad: this.calcularEdad('1987-09-12')
  },
  { 
    id: 8, 
    nombre: 'Diego Herrera', 
    fechaNacimiento: '1991-12-05',
    direccion: 'Calle Morelos 987, Mérida',
    telefono: '9991234567', 
    email: 'diego@example.com',
    sexo: 'Masculino',
    edad: this.calcularEdad('1991-12-05')
  }
]);

  // Variables para el modal
  showModal = false;
  newClient = { 
    nombre: '', 
    fechaNacimiento: '', 
    direccion: '',
    telefono: '', 
    email: '',
    sexo: 'Masculino' // Valor por defecto
  };

  // Calcular edad a partir de la fecha de nacimiento
  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }

  // Abrir modal
  openAddModal() {
    this.showModal = true;
  }

  // Cerrar modal
  closeModal() {
    this.showModal = false;
    this.newClient = { 
      nombre: '', 
      fechaNacimiento: '', 
      direccion: '',
      telefono: '', 
      email: '',
      sexo: 'Masculino'
    };
  }

  // Agregar nuevo cliente
  addClient() {
    if (this.newClient.nombre && this.newClient.fechaNacimiento) {
      this.clients.update(list => [
        ...list,
        {
          id: this.clients().length + 1,
          ...this.newClient,
          edad: this.calcularEdad(this.newClient.fechaNacimiento)
        }
      ]);
      this.closeModal();
    }
  }
}