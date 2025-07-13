import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Viaje {
  id: number;
  clave: string;
  nombre: string;
  fechaPartida: string;
  fechaRegreso: string;
  ultimoDiaPago: string;
  anticipo: number;
  descripcion: string;
  incluye: string;
  noIncluye: string;
  requisitos: string;
  itinerario: string;
}

interface Cliente {
  nombre: string;
  fechaNacimiento: Date;
  direccion: string;
  telefono: string;
  email: string;
  sexo: string;
}

interface Acompanante {
  nombre: string;
  edad: number;
}

@Component({
  selector: 'app-contract-service',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contract-service.component.html',
  styleUrls: ['./contract-service.component.css']
})
export class ContractServiceComponent {
  // Datos del viaje seleccionado (simulados)
  viajeSeleccionado: Viaje = {
    id: 1,
    clave: 'QRO-MAZ-0325',
    nombre: 'Mazatlán Premium: Todo Incluido',
    fechaPartida: '2025-03-15T08:00:00',
    fechaRegreso: '2025-03-22T20:00:00',
    ultimoDiaPago: '2025-02-28',
    anticipo: 4500,
    // Añadimos más detalles para mostrar
    descripcion: 'Viaje todo incluido a Mazatlán con hospedaje en hotel 5 estrellas, comidas ilimitadas y acceso a todas las instalaciones.',
    itinerario: 'Día 1: Llegada y check-in | Día 2: Tour por la ciudad | Día 3: Isla de la Piedra | Día 4: Día libre | Día 5: Avistamiento de ballenas | Día 6-7: Actividades recreativas',
    incluye: 'Hospedaje, alimentos, bebidas no alcohólicas, transporte local, tours incluidos',
    noIncluye: 'Bebidas alcohólicas, gastos personales, propinas',
    requisitos: 'Pasaporte vigente (para extranjeros), identificación oficial, pago del anticipo'
  };
  mostrarDetallesExtendidos = false;

  
  calcularDuracionViaje(): number {
    const inicio = new Date(this.viajeSeleccionado.fechaPartida);
    const fin = new Date(this.viajeSeleccionado.fechaRegreso);
    const diff = fin.getTime() - inicio.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  toggleDetallesExtendidos(): void {
    this.mostrarDetallesExtendidos = !this.mostrarDetallesExtendidos;
  }

  showViajeDetails = false;
  isNewClient = false;
  searchingClient = false;
  
  cliente: Cliente = {
    nombre: '',
    fechaNacimiento: new Date(),
    direccion: '',
    telefono: '',
    email: '',
    sexo: 'Masculino'
  };
  
  acompanantes: Acompanante[] = [];
  searchTerm = '';
  clientesEncontrados: Cliente[] = [];
  
  // Mock data de clientes
  mockClientes: Cliente[] = [
    {
      nombre: 'Juan Pérez',
      fechaNacimiento: new Date(1985, 5, 15),
      direccion: 'Calle Falsa 123',
      telefono: '5551234567',
      email: 'juan@example.com',
      sexo: 'Masculino'
    },
    {
      nombre: 'María García',
      fechaNacimiento: new Date(1990, 8, 22),
      direccion: 'Avenida Siempre Viva 456',
      telefono: '5557654321',
      email: 'maria@example.com',
      sexo: 'Femenino'
    }
  ];
  
  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
  
  buscarClientes(): void {
    this.searchingClient = true;
    if (this.searchTerm.trim() === '') {
      this.clientesEncontrados = [];
      return;
    }
    
    // Simulación de búsqueda con delay
    setTimeout(() => {
      this.clientesEncontrados = this.mockClientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.searchingClient = false;
    }, 500);
  }
  
  seleccionarCliente(cliente: Cliente): void {
    this.cliente = { ...cliente };
    this.isNewClient = false;
    this.clientesEncontrados = [];
    this.searchTerm = cliente.nombre;
  }
  
  toggleNewClient(): void {
    this.isNewClient = !this.isNewClient;
    if (!this.isNewClient) {
      this.searchTerm = '';
    } else {
      this.cliente = {
        nombre: '',
        fechaNacimiento: new Date(),
        direccion: '',
        telefono: '',
        email: '',
        sexo: 'Masculino'
      };
    }
  }
  
  agregarAcompanante(): void {
    this.acompanantes.push({ nombre: '', edad: 0 });
  }
  
  eliminarAcompanante(index: number): void {
    this.acompanantes.splice(index, 1);
  }
  
  toggleViajeDetails(): void {
    this.showViajeDetails = !this.showViajeDetails;
  }
  
  generarContrato(): void {
    console.log('Contrato generado con:', {
      viaje: this.viajeSeleccionado,
      cliente: this.cliente,
      acompanantes: this.acompanantes
    });
    alert('Contrato generado exitosamente (simulación)');
  }
}