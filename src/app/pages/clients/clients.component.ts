import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonAddComponent } from '../../components/button-add/button-add.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ActionsbuttonsComponent } from '../../components/actionsbuttons/actionsbuttons.component';

// Import our service and the interfaces we need
import {
  ClientService,
  Client,
  ClientResponse,
} from '../../services/client/client.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonAddComponent,
    FontAwesomeModule,
    ActionsbuttonsComponent,
  ],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit, OnDestroy {
  faUser = faUser;
  // Variables para edición
  editingClient: Client | null = null;
  isEditMode = false;

  viewingClient: Client | null = null;
isViewMode = false;

  // Instead of a signal with fixed data, now we have a signal that updates dynamically
  // This starts empty and gets populated by the service
  clients = signal<Client[]>([]);

  // Variables for managing UI state
  showModal = false;
  isLoading = false; // To show loading indicators
  error = signal<string | null>(null); // To show errors to users

  // CORREGIR en clients.component.ts
  newClient: Omit<Client, 'id_cliente'> & { usuario_creacion: string } = {
    nombre: '',
    fecha_nacimiento: '',
    direccion: '',
    numero_telefono: '',
    correo: '',
    sexo: '',
    activo: true,
    usuario_creacion: 'admin', // O el usuario actual del sistema
  };

  calculateAge(fechaNacimiento: string): number {
    if (!fechaNacimiento) return 0;
    const birth = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  }

  // To manage subscriptions and prevent memory leaks
  private subscriptions = new Subscription();

  // Inject the service through the constructor
  constructor(private clientService: ClientService) {
    console.log('ClientsComponent initialized - now using ClientService');
  }

  // OnInit runs when the component initializes
  ngOnInit(): void {
    this.loadClients();
    this.subscribeToChanges();
  }

  // OnDestroy runs when the component is destroyed
  ngOnDestroy(): void {
    // Important: unsubscribe to prevent memory leaks
    this.subscriptions.unsubscribe();
  }

  /**
   * Loads the initial list of clients from the service
   * This is the most important function because it replaces the signal with fixed data
   */
  private loadClients(): void {
    console.log('Loading clients from service...');
    this.isLoading = true;
    this.error.set(null);

    // Here's where we see the most important change
    // Instead of having fixed data, we ask the service for data
    const subscription = this.clientService.getClients().subscribe({
      next: (clients) => {
        console.log('Clients loaded successfully:', clients.length);
        this.clients.set(clients); // Update our signal with data from the service
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.error.set('Error loading client list. Please try again.');
        this.isLoading = false;
      },
    });

    this.subscriptions.add(subscription);
  }

  /**
   * Subscribes to real-time changes in the client list
   * This is useful if other components also modify clients
   */
  private subscribeToChanges(): void {
    const subscription = this.clientService.clients$.subscribe({
      next: (clients) => {
        // Only update if there are differences
        if (JSON.stringify(this.clients()) !== JSON.stringify(clients)) {
          console.log('Changes detected in client list');
          this.clients.set(clients);
        }
      },
    });

    this.subscriptions.add(subscription);
  }

openEditModal(client: Client): void {
  console.log('✏️ Opening edit modal for client:', client);
  
  // Crear una copia profunda del cliente para editar
  this.editingClient = { ...client };
  this.isEditMode = true;
  this.showModal = true;
  this.error.set(null);
}



openViewModal(client: Client): void {
  console.log('👁️ Opening view modal for client:', client);
  
  this.viewingClient = { ...client };
  this.isViewMode = true;
  this.showModal = true;
  this.error.set(null);
}


closeModal(): void {
  this.showModal = false;
  this.isEditMode = false;
  this.isViewMode = false;
  this.editingClient = null;
  this.viewingClient = null;
  this.resetForm();
}


  /**
   * Closes the modal and resets the form
   * This function stays the same
   */
  

  addClient(): void {
    // Validación frontend
    if (!this.validateForm()) {
      this.error.set('Por favor completa todos los campos obligatorios');
      return;
    }

    console.log('Enviando nuevo cliente al servicio:', this.newClient);
    this.isLoading = true;
    this.error.set(null);

    // Asegurar que activo tenga valor por defecto
    const clientToSend = {
      ...this.newClient,
      activo: this.newClient.activo !== false,
    };

    const subscription = this.clientService
      .createClient(clientToSend)
      .subscribe({
        next: (response: ClientResponse) => {
          if (response.success) {
            console.log('Cliente creado exitosamente:', response.data);
            this.closeModal();
            // Opcional: mostrar mensaje de éxito
            console.log('✅ Cliente agregado exitosamente');
          } else {
            console.error('Error del servicio:', response.message);
            this.error.set(response.message || 'Error creando cliente');
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error inesperado creando cliente:', error);
          this.error.set(
            'Error de conexión. Verifica que el backend esté ejecutándose.'
          );
          this.isLoading = false;
        },
      });

    this.subscriptions.add(subscription);
  }

  /**
   * Validates that the form has required fields
   * This function is new and separates validation logic
   */
  private validateForm(): boolean {
    return !!(
      this.newClient.nombre?.trim() &&
      this.newClient.fecha_nacimiento &&
      this.newClient.direccion?.trim() &&
      this.newClient.numero_telefono?.trim() &&
      this.newClient.sexo
    );
  }

  private resetForm(): void {
    this.newClient = {
      nombre: '',
      fecha_nacimiento: '',
      direccion: '',
      numero_telefono: '',
      correo: '',
      sexo: '', // Ensure type compatibility
      activo: true,
      usuario_creacion: 'admin', // Or the current user of the system
    };
    this.error.set(null);
  }

  /**
   * WE REMOVE the calcularEdad function from here because now the service handles that
   * This is an important improvement: business logic (calculating ages)
   * now lives in the service, not in the UI component
   */

  // Future functions you could add using the service:

  /**
   * Searches clients by name (to implement in the future)
   */
  searchClients(term: string): void {
    if (!term.trim()) {
      this.loadClients(); // If no term, load all
      return;
    }

    this.isLoading = true;
    const subscription = this.clientService.searchClients(term).subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.error.set('Search error');
        this.isLoading = false;
      },
    });

    this.subscriptions.add(subscription);
  }

  /**
   * Deletes a client (to implement in the future)
   */
  deleteClient(id: number): void {
    if (!confirm('Are you sure you want to delete this client?')) {
      return;
    }

    this.isLoading = true;
    const subscription = this.clientService.deleteClient(id).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Client deleted successfully');
          this.loadClients(); // Reload list
        } else {
          this.error.set(response.message || 'Error deleting client');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Delete error:', error);
        this.error.set('Error deleting client');
        this.isLoading = false;
      },
    });

    this.subscriptions.add(subscription);
  }

  //----------------------------------EDITAR UN USUARIO-------------------------------------------------------------------------


/**
 * Actualiza un cliente existente
 */
updateClient(): void {
  if (!this.editingClient || !this.editingClient.id_cliente) {
    this.error.set('Cliente no válido para editar');
    return;
  }

  // Validación
  if (!this.validateEditForm()) {
    this.error.set('Por favor completa todos los campos obligatorios');
    return;
  }

  console.log('🔄 Actualizando cliente:', this.editingClient);
  this.isLoading = true;
  this.error.set(null);

  // Preparar datos para enviar (sin campos de sistema)
  const clientToUpdate = {
    nombre: this.editingClient.nombre,
    fecha_nacimiento: this.editingClient.fecha_nacimiento,
    direccion: this.editingClient.direccion,
    numero_telefono: this.editingClient.numero_telefono,
    correo: this.editingClient.correo,
    sexo: this.editingClient.sexo,
    activo: this.editingClient.activo
  };

  const subscription = this.clientService
    .updateClient(this.editingClient.id_cliente, clientToUpdate)
    .subscribe({
      next: (response: ClientResponse) => {
        if (response.success) {
          console.log('✅ Cliente actualizado exitosamente:', response.data);
          this.closeModal();
          this.loadClients(); // Recargar lista para asegurar consistencia
        } else {
          this.error.set(response.message || 'Error actualizando cliente');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error actualizando cliente:', error);
        this.error.set('Error: ' + error.message);
        this.isLoading = false;
      }
    });

  this.subscriptions.add(subscription);
}

/**
 * Valida el formulario de edición
 */
private validateEditForm(): boolean {
  if (!this.editingClient) return false;
  
  return !!(
    this.editingClient.nombre?.trim() &&
    this.editingClient.fecha_nacimiento &&
    this.editingClient.direccion?.trim() &&
    this.editingClient.numero_telefono?.trim() &&
    this.editingClient.sexo
  );
}














// En clients.component.ts - agregar getters para el formulario

get currentFormData() {
  return this.isEditMode ? this.editingClient! : this.newClient;
}

// O individualmente:
get currentNombre(): string {
  return this.isEditMode ? this.editingClient?.nombre || '' : this.newClient.nombre;
}

set currentNombre(value: string) {
  if (this.isEditMode && this.editingClient) {
    this.editingClient.nombre = value;
  } else {
    this.newClient.nombre = value;
  }
}

get currentFechaNacimiento(): string {
  return this.isEditMode ? this.editingClient?.fecha_nacimiento || '' : this.newClient.fecha_nacimiento;
}

set currentFechaNacimiento(value: string) {
  if (this.isEditMode && this.editingClient) {
    this.editingClient.fecha_nacimiento = value;
  } else {
    this.newClient.fecha_nacimiento = value;
  }
}

get currentDireccion(): string {
  return this.isEditMode ? this.editingClient?.direccion || '' : this.newClient.direccion;
}

set currentDireccion(value: string) {
  if (this.isEditMode && this.editingClient) {
    this.editingClient.direccion = value;
  } else {
    this.newClient.direccion = value;
  }
}

get currentTelefono(): string {
  return this.isEditMode ? this.editingClient?.numero_telefono || '' : this.newClient.numero_telefono;
}

set currentTelefono(value: string) {
  if (this.isEditMode && this.editingClient) {
    this.editingClient.numero_telefono = value;
  } else {
    this.newClient.numero_telefono = value;
  }
}

get currentCorreo(): string {
  return this.isEditMode ? this.editingClient?.correo || '' : this.newClient.correo;
}

set currentCorreo(value: string) {
  if (this.isEditMode && this.editingClient) {
    this.editingClient.correo = value;
  } else {
    this.newClient.correo = value;
  }
}

get currentSexo(): string {
  return this.isEditMode ? this.editingClient?.sexo || 'Masculino' : this.newClient.sexo;
}

set currentSexo(value: string) {
  if (this.isEditMode && this.editingClient) {
    this.editingClient.sexo = value;
  } else {
    this.newClient.sexo = value;
  }
}

openAddModal(): void {
  this.showModal = true;
  this.isEditMode = false;
  this.error.set(null);
  this.resetForm();
}
}
