import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonAddComponent } from '../../components/button-add/button-add.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ActionsbuttonsComponent } from '../../components/actionsbuttons/actionsbuttons.component';

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
  editingClient: Client | null = null;
  isEditMode = false;

  viewingClient: Client | null = null;
  isViewMode = false;

  clients = signal<Client[]>([]);

  // Variables for managing UI state
  showModal = false;
  isLoading = false;
  error = signal<string | null>(null);

  newClient: Omit<Client, 'id_cliente'> & { usuario_creacion: string } = {
    nombre: '',
    fecha_nacimiento: '',
    direccion: '',
    numero_telefono: '',
    correo: '',
    sexo: '',
    activo: true,
    usuario_creacion: 'admin', // current user from my system :v
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

  private subscriptions = new Subscription();

  constructor(private clientService: ClientService) {
    console.log('ClientsComponent initialized - now using ClientService');
  }

  ngOnInit(): void {
    this.loadClients();
    this.subscribeToChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadClients(): void {
    // console.log('Loading clients from service...');
    this.isLoading = true;
    this.error.set(null);

    // Here's where we see the most important change
    // Instead of having fixed data, we ask the service for data
    const subscription = this.clientService.getClients().subscribe({
      next: (clients) => {
        // console.log('Clients loaded successfully:', clients.length);
        this.clients.set(clients); // Update our signal with data from the service
        this.isLoading = false;
      },
      error: (error) => {
        // console.error('Error loading clients:', error);
        this.error.set('Error loading client list. Please try again.');
        this.isLoading = false;
      },
    });

    this.subscriptions.add(subscription);
  }

  
  private subscribeToChanges(): void {
    const subscription = this.clientService.clients$.subscribe({
      next: (clients) => {
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

  addClient(): void {
    // Validation frontend
    if (!this.validateForm()) {
      this.error.set('Por favor completa todos los campos obligatorios');
      return;
    }

    //console.log('Enviando nuevo cliente al servicio:', this.newClient);
    this.isLoading = true;
    this.error.set(null);

    const clientToSend = {
      ...this.newClient,
      activo: this.newClient.activo !== false,
    };

    const subscription = this.clientService
      .createClient(clientToSend)
      .subscribe({
        next: (response: ClientResponse) => {
          if (response.success) {
            // console.log('Cliente creado exitosamente:', response.data);
            this.closeModal();
            //console.log('✅ Cliente agregado exitosamente');
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
      sexo: '',
      activo: true,
      usuario_creacion: 'admin', 
    };
    this.error.set(null);
  }

  searchClients(term: string): void {
    if (!term.trim()) {
      this.loadClients(); // 
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

  deleteClient(id: number): void {
    if (!confirm('Are you sure you want to delete this client?')) {
      return;
    }

    this.isLoading = true;
    const subscription = this.clientService.deleteClient(id).subscribe({
      next: (response) => {
        if (response.success) {
          //console.log('Client deleted successfully');
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

  updateClient(): void {
    if (!this.editingClient || !this.editingClient.id_cliente) {
      this.error.set('Cliente no válido para editar');
      return;
    }

    if (!this.validateEditForm()) {
      this.error.set('Por favor completa todos los campos obligatorios');
      return;
    }

    //console.log('🔄 Actualizando cliente:', this.editingClient);
    this.isLoading = true;
    this.error.set(null);

    const clientToUpdate = {
      nombre: this.editingClient.nombre,
      fecha_nacimiento: this.editingClient.fecha_nacimiento,
      direccion: this.editingClient.direccion,
      numero_telefono: this.editingClient.numero_telefono,
      correo: this.editingClient.correo,
      sexo: this.editingClient.sexo,
      activo: this.editingClient.activo,
    };

    const subscription = this.clientService
      .updateClient(this.editingClient.id_cliente, clientToUpdate)
      .subscribe({
        next: (response: ClientResponse) => {
          if (response.success) {
            console.log('✅ Cliente actualizado exitosamente:', response.data);
            this.closeModal();
            this.loadClients();
          } else {
            this.error.set(response.message || 'Error actualizando cliente');
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error actualizando cliente:', error);
          this.error.set('Error: ' + error.message);
          this.isLoading = false;
        },
      });

    this.subscriptions.add(subscription);
  }

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

  get currentFormData() {
    return this.isEditMode ? this.editingClient! : this.newClient;
  }

  get currentNombre(): string {
    return this.isEditMode
      ? this.editingClient?.nombre || ''
      : this.newClient.nombre;
  }

  set currentNombre(value: string) {
    if (this.isEditMode && this.editingClient) {
      this.editingClient.nombre = value;
    } else {
      this.newClient.nombre = value;
    }
  }

  get currentFechaNacimiento(): string {
    return this.isEditMode
      ? this.editingClient?.fecha_nacimiento || ''
      : this.newClient.fecha_nacimiento;
  }

  set currentFechaNacimiento(value: string) {
    if (this.isEditMode && this.editingClient) {
      this.editingClient.fecha_nacimiento = value;
    } else {
      this.newClient.fecha_nacimiento = value;
    }
  }

  get currentDireccion(): string {
    return this.isEditMode
      ? this.editingClient?.direccion || ''
      : this.newClient.direccion;
  }

  set currentDireccion(value: string) {
    if (this.isEditMode && this.editingClient) {
      this.editingClient.direccion = value;
    } else {
      this.newClient.direccion = value;
    }
  }

  get currentTelefono(): string {
    return this.isEditMode
      ? this.editingClient?.numero_telefono || ''
      : this.newClient.numero_telefono;
  }

  set currentTelefono(value: string) {
    if (this.isEditMode && this.editingClient) {
      this.editingClient.numero_telefono = value;
    } else {
      this.newClient.numero_telefono = value;
    }
  }

  get currentCorreo(): string {
    return this.isEditMode
      ? this.editingClient?.correo || ''
      : this.newClient.correo;
  }

  set currentCorreo(value: string) {
    if (this.isEditMode && this.editingClient) {
      this.editingClient.correo = value;
    } else {
      this.newClient.correo = value;
    }
  }

  get currentSexo(): string {
    return this.isEditMode
      ? this.editingClient?.sexo || 'Masculino'
      : this.newClient.sexo;
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
