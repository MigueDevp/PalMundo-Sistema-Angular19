import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';

// Interfaces that define the data contract - matching your exact structure
export interface Client {
  id?: number;
  nombre: string;
  fechaNacimiento: string;
  direccion: string;
  telefono: string;
  email: string;
  sexo: 'Masculino' | 'Femenino' | 'Otro';
  edad?: number; // Calculated automatically
}

export interface ClientResponse {
  success: boolean;
  data: Client | Client[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  // BehaviorSubject to maintain reactive state of clients
  private clientsSubject = new BehaviorSubject<Client[]>(this.getMockClients());
  
  // Public observable for components to subscribe to
  public clients$ = this.clientsSubject.asObservable();

  constructor() {
    console.log('ClientService initialized with mock data');
  }

  /**
   * Gets all clients
   * Now reads from the current state, including any additions or modifications
   * In the future, this will be an HTTP call to the backend
   */
  getClients(): Observable<Client[]> {
    console.log('Getting client list from current state...');
    
    // Instead of returning mock data, we return the current state
    // This ensures any changes (additions, updates, deletions) are reflected
    return this.clients$.pipe(
      delay(200), // Simulate network latency
      map(clients => clients.map(client => ({
        ...client,
        edad: this.calcularEdad(client.fechaNacimiento)
      })))
    );
  }

  /**
   * Searches clients by name
   * Useful for autocomplete in forms
   */
  searchClients(term: string): Observable<Client[]> {
    console.log(`Searching clients with term: "${term}"`);
    
    if (!term.trim()) {
      return of([]);
    }

    return this.clients$.pipe(
      map(clients => 
        clients
          .filter(client => 
            client.nombre.toLowerCase().includes(term.toLowerCase())
          )
          .map(client => ({
            ...client,
            edad: this.calcularEdad(client.fechaNacimiento)
          }))
      ),
      delay(300) // Simulate server search
    );
  }

  /**
   * Gets a specific client by ID
   */
  getClientById(id: number): Observable<Client | null> {
    console.log(`Looking for client with ID: ${id}`);
    
    return this.clients$.pipe(
      map(clients => {
        const client = clients.find(c => c.id === id);
        if (client) {
          return {
            ...client,
            edad: this.calcularEdad(client.fechaNacimiento)
          };
        }
        return null;
      }),
      delay(150)
    );
  }

  /**
   * Creates a new client
   */
  createClient(client: Omit<Client, 'id' | 'edad'>): Observable<ClientResponse> {
    console.log('Creating new client:', client);
    
    return new Observable(observer => {
      // Simulate server validation
      if (!this.validateClient(client)) {
        observer.next({
          success: false,
          data: client as Client,
          message: 'Invalid client data'
        });
        observer.complete();
        return;
      }

      // Simulate creation on "server"
      setTimeout(() => {
        const currentClients = this.clientsSubject.value;
        const newId = Math.max(...currentClients.map(c => c.id || 0)) + 1;
        
        const newClient: Client = {
          ...client,
          id: newId,
          edad: this.calcularEdad(client.fechaNacimiento)
        };

        // Update local state
        const updatedClients = [...currentClients, newClient];
        this.clientsSubject.next(updatedClients);

        observer.next({
          success: true,
          data: newClient,
          message: 'Client created successfully'
        });
        observer.complete();
      }, 500); // Simulate processing time
    });
  }

  /**
   * Updates an existing client
   */
  updateClient(id: number, updatedClient: Partial<Client>): Observable<ClientResponse> {
    console.log(`Updating client ID: ${id}`, updatedClient);
    
    return new Observable(observer => {
      const currentClients = this.clientsSubject.value;
      const clientIndex = currentClients.findIndex(c => c.id === id);
      
      if (clientIndex === -1) {
        observer.next({
          success: false,
          data: [] as Client[],
          message: 'Client not found'
        });
        observer.complete();
        return;
      }

      setTimeout(() => {
        const modifiedClient = {
          ...currentClients[clientIndex],
          ...updatedClient,
          edad: updatedClient.fechaNacimiento ? 
            this.calcularEdad(updatedClient.fechaNacimiento) : 
            currentClients[clientIndex].edad
        };

        const updatedClients = [...currentClients];
        updatedClients[clientIndex] = modifiedClient;
        this.clientsSubject.next(updatedClients);

        observer.next({
          success: true,
          data: modifiedClient,
          message: 'Client updated successfully'
        });
        observer.complete();
      }, 400);
    });
  }

  /**
   * Deletes a client
   */
  deleteClient(id: number): Observable<ClientResponse> {
    console.log(`Deleting client ID: ${id}`);
    
    return new Observable(observer => {
      setTimeout(() => {
        const currentClients = this.clientsSubject.value;
        const updatedClients = currentClients.filter(c => c.id !== id);
        
        if (updatedClients.length === currentClients.length) {
          observer.next({
            success: false,
            data: [] as Client[],
            message: 'Client not found'
          });
        } else {
          this.clientsSubject.next(updatedClients);
          observer.next({
            success: true,
            data: updatedClients,
            message: 'Client deleted successfully'
          });
        }
        observer.complete();
      }, 300);
    });
  }

  /**
   * Utility method to calculate age
   * This logic could eventually be moved to the backend
   */
  private calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }

  /**
   * Basic client validation
   * These validations will eventually be done on the backend
   */
  private validateClient(client: Partial<Client>): boolean {
    return !!(
      client.nombre?.trim() &&
      client.fechaNacimiento &&
      client.direccion?.trim() &&
      client.telefono?.trim() &&
      client.sexo
    );
  }

  /**
   * Mock data - This function will be removed when we have the backend
   * Using exactly your existing data structure
   */
  private getMockClients(): Client[] {
    return [
      {
        id: 1,
        nombre: 'Ana López',
        fechaNacimiento: '1985-05-15',
        direccion: 'Calle Primavera 123, CDMX',
        telefono: '5512345678',
        email: 'ana@example.com',
        sexo: 'Femenino'
      },
      {
        id: 2,
        nombre: 'Carlos Ruiz',
        fechaNacimiento: '1990-08-22',
        direccion: 'Av. Reforma 456, Monterrey',
        telefono: '5512345679',
        email: 'carlos@example.com',
        sexo: 'Masculino'
      },
      {
        id: 3,
        nombre: 'María García',
        fechaNacimiento: '1988-03-10',
        direccion: 'Boulevard Los Ángeles 789, Guadalajara',
        telefono: '3312345678',
        email: 'maria@example.com',
        sexo: 'Femenino'
      },
      {
        id: 4,
        nombre: 'Juan Pérez',
        fechaNacimiento: '1992-11-30',
        direccion: 'Calle Central 456, Puebla',
        telefono: '2221234567',
        email: 'juan@example.com',
        sexo: 'Masculino'
      },
      {
        id: 5,
        nombre: 'Laura Martínez',
        fechaNacimiento: '1983-07-18',
        direccion: 'Av. Juárez 789, Tijuana',
        telefono: '6641234567',
        email: 'laura@example.com',
        sexo: 'Femenino'
      },
      {
        id: 6,
        nombre: 'Pedro Sánchez',
        fechaNacimiento: '1995-04-25',
        direccion: 'Calle Libertad 321, León',
        telefono: '4771234567',
        email: 'pedro@example.com',
        sexo: 'Masculino'
      },
      {
        id: 7,
        nombre: 'Sofía Ramírez',
        fechaNacimiento: '1987-09-12',
        direccion: 'Av. Hidalgo 654, Querétaro',
        telefono: '4421234567',
        email: 'sofia@example.com',
        sexo: 'Femenino'
      },
      {
        id: 8,
        nombre: 'Diego Herrera',
        fechaNacimiento: '1991-12-05',
        direccion: 'Calle Morelos 987, Mérida',
        telefono: '9991234567',
        email: 'diego@example.com',
        sexo: 'Masculino'
      }
    ];
  }

  // Method to simulate the future change to HTTP
  // When you implement the backend, you'll simply change the internal implementation
  private async sendHTTPRequest(endpoint: string, data?: any): Promise<any> {
    // FUTURE: Here you'll make real calls to your Node.js API
    // return this.http.post(`${this.apiUrl}/${endpoint}`, data).toPromise();
    
    // For now, we just simulate
    console.log(`[SIMULATED] HTTP POST to: ${endpoint}`, data);
    return Promise.resolve({ success: true, data });
  }
}