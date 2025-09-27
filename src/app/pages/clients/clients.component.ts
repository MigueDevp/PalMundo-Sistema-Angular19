import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonAddComponent } from '../../components/button-add/button-add.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ActionsbuttonsComponent } from '../../components/actionsbuttons/actionsbuttons.component';

// Import our service and the interfaces we need
import { ClientService, Client, ClientResponse } from '../../services/client/client.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonAddComponent, FontAwesomeModule, ActionsbuttonsComponent],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit, OnDestroy {
  faUser = faUser;

  // Instead of a signal with fixed data, now we have a signal that updates dynamically
  // This starts empty and gets populated by the service
  clients = signal<Client[]>([]);
  
  // Variables for managing UI state
  showModal = false;
  isLoading = false; // To show loading indicators
  error = signal<string | null>(null); // To show errors to users


// Y en tu componente:
newClient: Omit<Client, 'id'> = {
  nombre: '',
  fecha_nacimiento: '',
  direccion: '',
  numero_telefono: '',
  correo: '',
  sexo: 'F', // Ya no necesita type assertion
  activo: true, // Nuevo campo con valor por defecto
};


calculateAge(fechaNacimiento: string): number {
  if (!fechaNacimiento) return 0;
  const birth = new Date(fechaNacimiento);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
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
      }
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
      }
    });

    this.subscriptions.add(subscription);
  }

  /**
   * Opens the modal to add a client
   * This function stays practically the same
   */
  openAddModal(): void {
    this.showModal = true;
    this.error.set(null); // Clear previous errors
  }

  /**
   * Closes the modal and resets the form
   * This function stays the same
   */
  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  /**
   * Adds a new client - HERE'S WHERE WE SEE THE BIGGEST CHANGE
   * Instead of manipulating the signal directly, we ask the service to do the work
   */
  addClient(): void {
    // Basic frontend validation (the service will have its own validations)
    if (!this.validateForm()) {
      this.error.set('Please complete all required fields');
      return;
    }

    console.log('Sending new client to service:', this.newClient);
    this.isLoading = true;
    this.error.set(null);

    // Instead of manipulating the array directly, we use the service
    const subscription = this.clientService.createClient(this.newClient).subscribe({
      next: (response: ClientResponse) => {
        if (response.success) {
          console.log('Client created successfully:', response.data);
          
          // The service already updated its internal state, but we can force a reload
          // to be sure (in a real app, this wouldn't be necessary)
          this.loadClients();
          
          // Close modal and show success message
          this.closeModal();
          // Here you could add a success notification
          console.log('✅ Client added successfully');
          
        } else {
          // The service tells us something went wrong
          console.error('Service error:', response.message);
          this.error.set(response.message || 'Error creating client');
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Unexpected error creating client:', error);
        this.error.set('Unexpected error. Please try again.');
        this.isLoading = false;
      }
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

  /**
   * Resets the form to its initial state
   * Now properly typed to match the Client interface
   */
  private resetForm(): void {
    this.newClient = {
      nombre: '',
      fecha_nacimiento: '',
      direccion: '',
      numero_telefono: '',
      correo: '',
      sexo: 'M' // Ensure type compatibility
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
      }
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
      }
    });

    this.subscriptions.add(subscription);
  }

  
  }

 
